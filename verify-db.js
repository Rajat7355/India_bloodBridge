// verify-db.js
// Automated verification script for India BloodBridge business rules

// 1. Mock LocalStorage in Node environment
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = val.toString(); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { for (let k in store) delete store[k]; }
};

// 2. Import Database Service
import { dbService } from './src/services/db.js';

// Simple Test Runner Assertion helper
const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${message}`);
};

async function runTests() {
  console.log('----------------------------------------------------');
  console.log('🧪 Running India BloodBridge Automated Tests...');
  console.log('----------------------------------------------------\n');

  // Test 1: Initial Database Seeding
  const stats = dbService.getAdminStats();
  assert(stats.totalDonors === 4, 'Should initialize with 4 seed donors.');
  assert(stats.totalOrgs === 3, 'Should initialize with 3 seed organizations.');
  assert(stats.verifiedOrgs === 2, 'Should have 2 verified organizations.');
  assert(stats.pendingOrgs === 1, 'Should have 1 pending organization (Lifeline).');

  // Test 2: Admin approves pending Organization
  const pending = dbService.getPendingOrganizations();
  assert(pending.length === 1 && pending[0].id === 'org-lifeline', 'Lifeline NGO should be pending review.');
  
  dbService.verifyOrganization('org-lifeline', true);
  const updatedStats = dbService.getAdminStats();
  assert(updatedStats.pendingOrgs === 0, 'Should have 0 pending organizations after approval.');
  assert(updatedStats.verifiedOrgs === 3, 'Should have 3 verified organizations after approval.');

  // Test 3: Verified Organization creates a new Camp
  const camp = dbService.createCamp(
    'org-lifeline',
    'Manyata Tech Park Drive',
    '2026-07-20',
    '09:30 AM - 03:30 PM',
    'Manyata Tech Park, Gate 2, Bengaluru',
    'Bengaluru',
    13.0451,
    77.6266,
    ['O+', 'A+']
  );
  assert(camp.status === 'active', 'Created camp should be active.');
  assert(camp.orgName === 'Lifeline NGO', 'Created camp should display hosting organization name.');

  // Test 4: Donor Registration with Referral Code
  // Let's create a new donor who was referred by Amit Patel (code: AMIT889)
  const referrerBefore = dbService.getUser('donor-amit');
  const initialReferrerPoints = referrerBefore.points; // Amit starts with 15 points

  const newDonor = dbService.registerDonor(
    'Vikas Kumar',
    'vikas@gmail.com',
    'password123',
    '+91 99999 77777',
    'O+',
    'Bengaluru',
    'AMIT889'
  );
  
  assert(newDonor.referredBy === 'AMIT889', 'New donor Vikas should be registered as referred by AMIT889.');
  assert(newDonor.points === 0, 'New donor Vikas should start with 0 points.');

  // Check referral history
  const amitChain = dbService.getReferralChain('donor-amit');
  const vikasRefRecord = amitChain.find(r => r.referredId === newDonor.id);
  assert(vikasRefRecord !== undefined, 'Referral list should include Vikas.');
  assert(vikasRefRecord.status === 'pending', 'Vikas referral status should be pending before donation.');

  // Test 5: Donor registers for Camp
  dbService.registerForCamp(newDonor.id, camp.id);
  const updatedCamp = dbService.getCamps().find(c => c.id === camp.id);
  assert(updatedCamp.registeredDonors.some(d => d.donorId === newDonor.id), 'Vikas should be registered for Manyata Tech Park Drive.');

  // Test 6: Confirm Donation (Points + Referral rewards + Certificate ID generation)
  const donationResult = dbService.confirmDonation(camp.id, newDonor.id);
  assert(donationResult.certId.startsWith('IBB-'), 'Should generate a valid certificate ID prefix.');
  
  // Verify Vikas points (should receive +5 points)
  const vikasAfter = dbService.getUser(newDonor.id);
  assert(vikasAfter.points === 5, 'Vikas should earn 5 points for completed donation.');
  assert(vikasAfter.lastDonationDate !== null, 'Vikas last donation date should be updated.');

  // Verify Referrer points (Amit Patel should receive +2 points referral bonus)
  const referrerAfter = dbService.getUser('donor-amit');
  assert(referrerAfter.points === initialReferrerPoints + 2, 'Referrer Amit should earn 2 referral bonus points.');

  // Check referral record updated to completed
  const amitChainAfter = dbService.getReferralChain('donor-amit');
  const vikasRefAfter = amitChainAfter.find(r => r.referredId === newDonor.id);
  assert(vikasRefAfter.status === 'completed', 'Vikas referral status should update to completed.');

  // Test 7: Enforce 3-Month Lockout Gap
  // Vikas tries to register for another camp. It should fail due to 3-month gap constraint
  const anotherCamp = dbService.getCamps().find(c => c.id === 'camp-1'); // camp-1 is summer drive
  
  try {
    dbService.registerForCamp(newDonor.id, anotherCamp.id);
    assert(false, 'Should have blocked Vikas from registering for another camp within 3 months.');
  } catch (err) {
    assert(err.message.includes('Medically required gap'), 'Should trigger lockout exception: ' + err.message);
  }

  // Test 8: Prioritized Emergency Matchmaking
  // Let's create an emergency request for O+ in Delhi
  const req = dbService.postEmergencyRequest(
    'donor-rahul',
    'O+',
    'Max Hospital, Delhi',
    'Delhi',
    28.6139,
    77.2090,
    'Critical',
    2,
    '+91 12345 67890',
    'Need urgent O+ units',
    false
  );

  // Get matching donors.
  // Compatible with O+ are O+ and O-.
  // In Delhi:
  // - Amit Patel: O+, eligible, 17 points (earned 2 from referral)
  // - Rahul Sen: B+, doesn't match blood type
  // - Vikas: Bengaluru, doesn't match location
  // - Ananya: O-, Mumbai, doesn't match location
  // So Amit Patel should be the matching donor. Let's register a new O- donor in Delhi to test points sorting
  const lowDonor = dbService.registerDonor('Delhi Donor Low', 'low@gmail.com', 'password', '1', 'O-', 'Delhi');
  // Keep them with 0 points and eligible (no donation) to test prioritization rank

  // Now query matches for O+ in Delhi
  const matches = dbService.getMatchingDonors('O+', 'Delhi');
  assert(matches.length === 2, 'Should find 2 matching donors (Amit and Delhi Donor Low).');
  assert(matches[0].id === 'donor-amit', 'Amit (17 pts) should be ranked first.');
  assert(matches[1].name === 'Delhi Donor Low', 'Delhi Donor Low (5 pts) should be ranked second.');

  console.log('\n----------------------------------------------------');
  console.log('🎉 SUCCESS: All core business logic checks passed!');
  console.log('----------------------------------------------------');
}

runTests();
