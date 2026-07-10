// src/services/db.js

const DB_KEY = 'india_bloodbridge_db';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Standard coordinate presets for simulated Indian cities
const CITY_COORDS = {
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 }
};

// Initial Seed Data
const initialData = {
  users: [
    // Admin
    {
      id: 'admin-1',
      name: 'Dr. Rajeev Sharma',
      email: 'admin@bloodbridge.in',
      password: 'password123',
      role: 'admin'
    },
    // Organizations
    {
      id: 'org-redcross',
      name: 'Indian Red Cross Society',
      email: 'delhi@redcross.org',
      password: 'password123',
      role: 'org',
      address: 'Red Cross Road, New Delhi',
      contact: '+91 11 2371 6441',
      certificateUrl: 'red_cross_reg.pdf',
      isVerified: true
    },
    {
      id: 'org-fortis',
      name: 'Fortis Hospital Blood Bank',
      email: 'info@fortishealth.com',
      password: 'password123',
      role: 'org',
      address: 'Sector 62, Noida, UP',
      contact: '+91 120 4300222',
      certificateUrl: 'fortis_license.pdf',
      isVerified: true
    },
    {
      id: 'org-lifeline',
      name: 'Lifeline NGO',
      email: 'contact@lifelinengo.org',
      password: 'password123',
      role: 'org',
      address: 'Indiranagar, Bengaluru',
      contact: '+91 80 4567 8901',
      certificateUrl: 'lifeline_ngo_cert.pdf',
      isVerified: false // Pending verification for testing
    },
    // Donors
    {
      id: 'donor-amit',
      name: 'Amit Patel',
      email: 'amit@gmail.com',
      password: 'password123',
      role: 'donor',
      bloodGroup: 'O+',
      contact: '+91 98765 43210',
      points: 15,
      referralCode: 'AMIT889',
      referredBy: null,
      city: 'Delhi',
      lastDonationDate: '2026-03-15' // Eligible (since it's more than 3 months before July 2026)
    },
    {
      id: 'donor-priya',
      name: 'Priya Nair',
      email: 'priya@gmail.com',
      password: 'password123',
      role: 'donor',
      bloodGroup: 'A-',
      contact: '+91 87654 32109',
      points: 25, // Can redeem blood units
      referralCode: 'PRIYA102',
      referredBy: 'AMIT889', // Referred by Amit
      city: 'Bengaluru',
      lastDonationDate: '2026-06-01' // INELIGIBLE (within 3 months of July 2026)
    },
    {
      id: 'donor-rahul',
      name: 'Rahul Sen',
      email: 'rahul@gmail.com',
      password: 'password123',
      role: 'donor',
      bloodGroup: 'B+',
      contact: '+91 76543 21098',
      points: 5,
      referralCode: 'RAHUL776',
      referredBy: 'AMIT889', // Referred by Amit
      city: 'Delhi',
      lastDonationDate: null // Never donated yet
    },
    {
      id: 'donor-ananya',
      name: 'Ananya Rao',
      email: 'ananya@gmail.com',
      password: 'password123',
      role: 'donor',
      bloodGroup: 'O-',
      contact: '+91 99999 88888',
      points: 0,
      referralCode: 'ANAN404',
      referredBy: null,
      city: 'Mumbai',
      lastDonationDate: null
    }
  ],
  camps: [
    {
      id: 'camp-1',
      title: 'Mega Summer Donation Drive',
      orgId: 'org-redcross',
      orgName: 'Indian Red Cross Society',
      date: '2026-07-15',
      time: '09:00 AM - 04:00 PM',
      locationName: 'Connaught Place, New Delhi',
      city: 'Delhi',
      coordinates: { lat: 28.6304, lng: 77.2177 },
      bloodGroupsNeeded: ['O+', 'O-', 'A+', 'B+'],
      status: 'active',
      registeredDonors: [
        {
          donorId: 'donor-amit',
          donorName: 'Amit Patel',
          bloodGroup: 'O+',
          registeredAt: '2026-07-09',
          status: 'registered'
        },
        {
          donorId: 'donor-rahul',
          donorName: 'Rahul Sen',
          bloodGroup: 'B+',
          registeredAt: '2026-07-10',
          status: 'registered'
        }
      ]
    },
    {
      id: 'camp-2',
      title: 'Emergency Blood Camp (O- & A-)',
      orgId: 'org-fortis',
      orgName: 'Fortis Hospital Blood Bank',
      date: '2026-07-12',
      time: '10:00 AM - 06:00 PM',
      locationName: 'Sector 62 Main Crossing, Noida',
      city: 'Delhi',
      coordinates: { lat: 28.6273, lng: 77.3725 },
      bloodGroupsNeeded: ['O-', 'A-', 'B-', 'AB-'],
      status: 'active',
      registeredDonors: []
    },
    {
      id: 'camp-3',
      title: 'Bengaluru Tech Park Drive',
      orgId: 'org-lifeline', // Lifeline (unverified, but has a draft camp)
      orgName: 'Lifeline NGO',
      date: '2026-07-20',
      time: '09:30 AM - 03:30 PM',
      locationName: 'Manyata Tech Park, Gate 2, Bengaluru',
      city: 'Bengaluru',
      coordinates: { lat: 13.0451, lng: 77.6266 },
      bloodGroupsNeeded: ['A+', 'B+', 'AB+', 'O+'],
      status: 'active',
      registeredDonors: []
    }
  ],
  emergencyRequests: [
    {
      id: 'req-1',
      requestedBy: 'donor-rahul',
      requestorName: 'Rahul Sen',
      bloodGroup: 'O-',
      locationName: 'Max Super Speciality Hospital, Saket, Delhi',
      city: 'Delhi',
      coordinates: { lat: 28.5273, lng: 77.2104 },
      urgency: 'Critical',
      unitsNeeded: 2,
      contact: '+91 76543 21098',
      description: 'Accident emergency. Requires immediate negative blood transfusion.',
      createdAt: '2026-07-09T14:30:00Z',
      redeemedPriority: false,
      status: 'open'
    },
    {
      id: 'req-2',
      requestedBy: 'donor-priya',
      requestorName: 'Priya Nair',
      bloodGroup: 'A-',
      locationName: 'Apollo Hospitals, Bannerghatta Road, Bengaluru',
      city: 'Bengaluru',
      coordinates: { lat: 12.8959, lng: 77.5996 },
      urgency: 'Medium',
      unitsNeeded: 1,
      contact: '+91 87654 32109',
      description: 'Scheduled surgery support.',
      createdAt: '2026-07-10T10:00:00Z',
      redeemedPriority: true, // Prioritized using points!
      status: 'open'
    }
  ],
  certificates: [
    {
      id: 'IBB-20260315-AMIT',
      donorId: 'donor-amit',
      donorName: 'Amit Patel',
      campId: 'camp-past-1',
      campTitle: 'Spring Donor Festival',
      orgId: 'org-redcross',
      orgName: 'Indian Red Cross Society',
      date: '2026-03-15',
      units: 1
    }
  ],
  referralHistory: [
    {
      referrerId: 'donor-amit',
      referredId: 'donor-priya',
      referredName: 'Priya Nair',
      status: 'completed', // Priya already donated, so Amit got points
      awardedAt: '2026-06-01'
    },
    {
      referrerId: 'donor-amit',
      referredId: 'donor-rahul',
      referredName: 'Rahul Sen',
      status: 'pending', // Rahul has not donated yet
      awardedAt: null
    }
  ],
  activityLogs: [
    { text: 'Platform initialized with seed data.', time: '2026-07-10T00:00:00Z' },
    { text: 'Donor Priya Nair signed up using referral code AMIT889.', time: '2026-06-01T09:15:00Z' },
    { text: 'Priya Nair completed donation at Spring Donor Festival, earning Amit Patel 2 referral points.', time: '2026-06-01T12:00:00Z' }
  ]
};

// Database Initialization
const getDB = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const saveDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// Main Exported Services
export const dbService = {
  // --- AUTH SERVICES ---
  login: (email, password) => {
    const db = getDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    return user;
  },

  registerDonor: (name, email, password, contact, bloodGroup, city, referralCode = '') => {
    const db = getDB();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }

    const donorId = 'donor-' + generateId();
    const cleanReferral = referralCode.trim().toUpperCase();
    let referredBy = null;
    let referrerUser = null;

    if (cleanReferral) {
      referrerUser = db.users.find(u => u.role === 'donor' && u.referralCode === cleanReferral);
      if (!referrerUser) {
        throw new Error('Invalid referral code');
      }
      referredBy = cleanReferral;
    }

    const uniqueCode = name.substring(0, 4).toUpperCase() + Math.floor(100 + Math.random() * 900);

    const newUser = {
      id: donorId,
      name,
      email,
      password,
      role: 'donor',
      bloodGroup,
      contact,
      points: 0,
      referralCode: uniqueCode,
      referredBy,
      city,
      lastDonationDate: null
    };

    db.users.push(newUser);

    if (referrerUser) {
      db.referralHistory.push({
        referrerId: referrerUser.id,
        referredId: donorId,
        referredName: name,
        status: 'pending',
        awardedAt: null
      });
      // Add log
      db.activityLogs.unshift({
        text: `New donor ${name} signed up using referral code ${cleanReferral}.`,
        time: new Date().toISOString()
      });
    } else {
      db.activityLogs.unshift({
        text: `New donor ${name} signed up.`,
        time: new Date().toISOString()
      });
    }

    saveDB(db);
    return newUser;
  },

  registerOrg: (name, email, password, contact, address, docName) => {
    const db = getDB();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }

    const orgId = 'org-' + generateId();
    const newOrg = {
      id: orgId,
      name,
      email,
      password,
      role: 'org',
      contact,
      address,
      certificateUrl: docName || 'uploaded_license.pdf',
      isVerified: false
    };

    db.users.push(newOrg);
    db.activityLogs.unshift({
      text: `Organization ${name} registered. Awaiting Admin verification.`,
      time: new Date().toISOString()
    });

    saveDB(db);
    return newOrg;
  },

  getUser: (id) => {
    return getDB().users.find(u => u.id === id);
  },

  // --- CAMP MANAGEMENT ---
  createCamp: (orgId, title, date, time, locationName, cityName, lat, lng, bloodGroupsNeeded) => {
    const db = getDB();
    const org = db.users.find(u => u.id === orgId);
    if (!org) throw new Error('Organization not found');
    if (!org.isVerified) throw new Error('Only verified organizations can create camps');

    const campId = 'camp-' + generateId();
    const newCamp = {
      id: campId,
      title,
      orgId,
      orgName: org.name,
      date,
      time,
      locationName,
      city: cityName,
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      bloodGroupsNeeded: Array.isArray(bloodGroupsNeeded) ? bloodGroupsNeeded : [bloodGroupsNeeded],
      status: 'active',
      registeredDonors: []
    };

    db.camps.push(newCamp);
    db.activityLogs.unshift({
      text: `Camp "${title}" created by ${org.name} in ${cityName}.`,
      time: new Date().toISOString()
    });

    saveDB(db);
    return newCamp;
  },

  editCamp: (campId, title, date, time, locationName, cityName, lat, lng, bloodGroupsNeeded) => {
    const db = getDB();
    const camp = db.camps.find(c => c.id === campId);
    if (!camp) throw new Error('Camp not found');

    camp.title = title;
    camp.date = date;
    camp.time = time;
    camp.locationName = locationName;
    camp.city = cityName;
    camp.coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
    camp.bloodGroupsNeeded = bloodGroupsNeeded;

    db.activityLogs.unshift({
      text: `Camp "${title}" was updated.`,
      time: new Date().toISOString()
    });

    saveDB(db);
    return camp;
  },

  closeCamp: (campId) => {
    const db = getDB();
    const camp = db.camps.find(c => c.id === campId);
    if (!camp) throw new Error('Camp not found');

    camp.status = 'closed';
    db.activityLogs.unshift({
      text: `Camp "${camp.title}" was marked as closed.`,
      time: new Date().toISOString()
    });

    saveDB(db);
    return camp;
  },

  getCamps: () => {
    return getDB().camps;
  },

  // --- LOCATION AND DISCOVERY ---
  getCityCoords: (city) => {
    return CITY_COORDS[city] || CITY_COORDS['Delhi'];
  },

  registerForCamp: (donorId, campId) => {
    const db = getDB();
    const donor = db.users.find(u => u.id === donorId);
    const camp = db.camps.find(c => c.id === campId);

    if (!donor) throw new Error('Donor not found');
    if (!camp) throw new Error('Camp not found');
    if (camp.status !== 'active') throw new Error('Camp is no longer active');

    // 1. Check if donor is already registered
    if (camp.registeredDonors.some(d => d.donorId === donorId)) {
      throw new Error('You are already registered for this camp');
    }

    // 2. Enforce 3-month medical waiting period
    if (donor.lastDonationDate) {
      const lastDon = new Date(donor.lastDonationDate);
      const nextEligible = new Date(lastDon);
      nextEligible.setMonth(nextEligible.getMonth() + 3);

      const today = new Date();
      if (today < nextEligible) {
        const dateStr = nextEligible.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        throw new Error(`Medically required gap: You cannot donate again until ${dateStr}.`);
      }
    }

    camp.registeredDonors.push({
      donorId: donor.id,
      donorName: donor.name,
      bloodGroup: donor.bloodGroup,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'registered'
    });

    db.activityLogs.unshift({
      text: `Donor ${donor.name} registered for camp "${camp.title}".`,
      time: new Date().toISOString()
    });

    saveDB(db);
    return camp;
  },

  // --- DONATION FLOW & CONFIRMATION ---
  confirmDonation: (campId, donorId) => {
    const db = getDB();
    const camp = db.camps.find(c => c.id === campId);
    if (!camp) throw new Error('Camp not found');

    const registration = camp.registeredDonors.find(r => r.donorId === donorId);
    if (!registration) throw new Error('Donor is not registered for this camp');
    if (registration.status === 'donated') throw new Error('Donation already confirmed');

    const donor = db.users.find(u => u.id === donorId);
    if (!donor) throw new Error('Donor not found');

    // Check one unit lock logic just in case
    const donationDate = new Date().toISOString().split('T')[0];

    // Create Certificate ID
    const certId = `IBB-${donationDate.replace(/-/g, '')}-${donor.name.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update registration state
    registration.status = 'donated';
    registration.donationDate = donationDate;
    registration.certificateId = certId;

    // Update donor record
    donor.lastDonationDate = donationDate;
    donor.points = (donor.points || 0) + 5; // +5 points for donation

    // Save Certificate
    const newCert = {
      id: certId,
      donorId: donor.id,
      donorName: donor.name,
      campId: camp.id,
      campTitle: camp.title,
      orgId: camp.orgId,
      orgName: camp.orgName,
      date: donationDate,
      units: 1 // System enforces exactly 1 unit
    };
    db.certificates.push(newCert);

    db.activityLogs.unshift({
      text: `Donation confirmed for ${donor.name} (1 unit) at "${camp.title}". Generated certificate: ${certId}.`,
      time: new Date().toISOString()
    });

    // Check Referral Chain Award
    if (donor.referredBy) {
      // Find referral record that is still pending
      const referral = db.referralHistory.find(
        r => r.referredId === donor.id && r.status === 'pending'
      );

      if (referral) {
        // Find referrer and award them 2 points
        const referrer = db.users.find(u => u.role === 'donor' && u.referralCode === donor.referredBy);
        if (referrer) {
          referrer.points = (referrer.points || 0) + 2;
          referral.status = 'completed';
          referral.awardedAt = donationDate;

          db.activityLogs.unshift({
            text: `Referral referral bonus: Referrer ${referrer.name} awarded +2 points for donation by referred user ${donor.name}.`,
            time: new Date().toISOString()
          });
        }
      }
    }

    saveDB(db);
    return { registration, certId };
  },

  getCertificate: (certId) => {
    return getDB().certificates.find(c => c.id === certId);
  },

  getCertificatesForDonor: (donorId) => {
    return getDB().certificates.filter(c => c.donorId === donorId);
  },

  // --- REFERRAL FLOWS ---
  getReferralChain: (donorId) => {
    const db = getDB();
    const donor = db.users.find(u => u.id === donorId);
    if (!donor) return [];
    
    // Find all referral lines where this donor is the referrer
    return db.referralHistory.filter(r => r.referrerId === donorId);
  },

  // --- EMERGENCY REQUEST HUB ---
  postEmergencyRequest: (requestorId, bloodGroup, locationName, cityName, lat, lng, urgency, unitsNeeded, contact, description, redeemPoints = false) => {
    const db = getDB();
    const requestor = db.users.find(u => u.id === requestorId);
    if (!requestor) throw new Error('User not found');

    if (redeemPoints) {
      if ((requestor.points || 0) < 20) {
        throw new Error('Insufficient points. You need 20 points to redeem a priority unit.');
      }
      requestor.points -= 20;
    }

    const reqId = 'req-' + generateId();
    const newRequest = {
      id: reqId,
      requestedBy: requestorId,
      requestorName: requestor.name,
      bloodGroup,
      locationName,
      city: cityName,
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      urgency,
      unitsNeeded: parseInt(unitsNeeded),
      contact,
      description,
      createdAt: new Date().toISOString(),
      redeemedPriority: redeemPoints,
      status: 'open'
    };

    db.emergencyRequests.push(newRequest);
    db.activityLogs.unshift({
      text: `Emergency blood request posted for ${bloodGroup} at ${locationName} (${urgency}).${redeemPoints ? ' [Redeemed 20 points for priority]' : ''}`,
      time: new Date().toISOString()
    });

    saveDB(db);
    return newRequest;
  },

  getEmergencyRequests: () => {
    return getDB().emergencyRequests;
  },

  // Prioritize matching donors
  getMatchingDonors: (bloodGroup, cityName) => {
    const db = getDB();
    
    // Blood compatibility list
    const compatibility = {
      'O-': ['O-'],
      'O+': ['O-', 'O+'],
      'A-': ['O-', 'A-'],
      'A+': ['O-', 'O+', 'A-', 'A+'],
      'B-': ['O-', 'B-'],
      'B+': ['O-', 'O+', 'B-', 'B+'],
      'AB-': ['O-', 'A-', 'B-', 'AB-'],
      'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    };

    const compatibleDonors = compatibility[bloodGroup] || [bloodGroup];

    return db.users
      .filter(u => u.role === 'donor')
      .filter(u => compatibleDonors.includes(u.bloodGroup))
      .filter(u => u.city === cityName)
      .filter(u => {
        if (!u.lastDonationDate) return true;
        const lastDon = new Date(u.lastDonationDate);
        const eligible = new Date(lastDon);
        eligible.setMonth(eligible.getMonth() + 3);
        return new Date() >= eligible;
      })
      .sort((a, b) => (b.points || 0) - (a.points || 0)); // Prioritized by points descending!
  },

  // --- ADMIN PORTAL ---
  getAdminStats: () => {
    const db = getDB();
    const donors = db.users.filter(u => u.role === 'donor');
    const orgs = db.users.filter(u => u.role === 'org');
    
    return {
      totalDonors: donors.length,
      totalOrgs: orgs.length,
      verifiedOrgs: orgs.filter(o => o.isVerified).length,
      pendingOrgs: orgs.filter(o => !o.isVerified).length,
      totalUnitsDonated: db.certificates.length,
      activeEmergencies: db.emergencyRequests.filter(r => r.status === 'open').length
    };
  },

  getPendingOrganizations: () => {
    return getDB().users.filter(u => u.role === 'org' && !u.isVerified);
  },

  verifyOrganization: (orgId, verify = true) => {
    const db = getDB();
    const org = db.users.find(u => u.id === orgId);
    if (!org) throw new Error('Organization not found');

    org.isVerified = verify;
    db.activityLogs.unshift({
      text: `Organization ${org.name} was ${verify ? 'verified' : 'rejected'} by Administrator.`,
      time: new Date().toISOString()
    });

    saveDB(db);
    return org;
  },

  getActivityLogs: () => {
    return getDB().activityLogs;
  }
};
