// src/services/db.js

export const dbService = {
  // --- AUTH SERVICES ---
  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid email or password');
    }
    return await res.json();
  },

  registerDonor: async (name, email, password, contact, bloodGroup, city, referralCode = '') => {
    const res = await fetch('/api/auth/register/donor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, contact, bloodGroup, city, referralCode })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return await res.json();
  },

  registerOrg: async (name, email, password, contact, address, docName) => {
    const res = await fetch('/api/auth/register/org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, contact, address, docName })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return await res.json();
  },

  getUser: async (id) => {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'User not found');
    }
    return await res.json();
  },

  // --- CAMP MANAGEMENT ---
  createCamp: async (orgId, title, date, time, locationName, cityName, lat, lng, bloodGroupsNeeded) => {
    const res = await fetch('/api/camps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, title, date, time, locationName, cityName, lat, lng, bloodGroupsNeeded })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create camp');
    }
    return await res.json();
  },

  editCamp: async (campId, title, date, time, locationName, cityName, lat, lng, bloodGroupsNeeded) => {
    const res = await fetch(`/api/camps/${campId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date, time, locationName, cityName, lat, lng, bloodGroupsNeeded })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to edit camp');
    }
    return await res.json();
  },

  closeCamp: async (campId) => {
    const res = await fetch(`/api/camps/${campId}/close`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to close camp');
    }
    return await res.json();
  },

  getCamps: async () => {
    const res = await fetch('/api/camps');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch camps');
    }
    return await res.json();
  },

  // --- LOCATION AND DISCOVERY (Static metadata - Keep synchronous) ---
  getCityCoords: (city) => {
    const CITY_COORDS = {
      'Delhi': { lat: 28.6139, lng: 77.2090 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Bengaluru': { lat: 12.9716, lng: 77.5946 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 }
    };
    return CITY_COORDS[city] || CITY_COORDS['Delhi'];
  },

  registerForCamp: async (donorId, campId) => {
    const res = await fetch(`/api/camps/${campId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donorId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return await res.json();
  },

  // --- DONATION FLOW & CONFIRMATION ---
  confirmDonation: async (campId, donorId) => {
    const res = await fetch(`/api/camps/${campId}/confirm-donation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donorId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to confirm donation');
    }
    return await res.json();
  },

  getCertificate: async (certId) => {
    const res = await fetch(`/api/certificates/${certId}`);
    if (!res.ok) {
      return null;
    }
    return await res.json();
  },

  getCertificatesForDonor: async (donorId) => {
    const res = await fetch(`/api/certificates/donor/${donorId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch certificates');
    }
    return await res.json();
  },

  // --- REFERRAL FLOWS ---
  getReferralChain: async (donorId) => {
    const res = await fetch(`/api/referrals/${donorId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch referrals');
    }
    return await res.json();
  },

  // --- EMERGENCY REQUEST HUB ---
  postEmergencyRequest: async (requestorId, bloodGroup, locationName, cityName, lat, lng, urgency, unitsNeeded, contact, description, redeemPoints = false) => {
    const res = await fetch('/api/emergency-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestorId, bloodGroup, locationName, cityName, lat, lng, urgency, unitsNeeded, contact, description, redeemPoints })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to post emergency request');
    }
    return await res.json();
  },

  getEmergencyRequests: async () => {
    const res = await fetch('/api/emergency-requests');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch emergency requests');
    }
    return await res.json();
  },

  // Prioritize matching donors
  getMatchingDonors: async (bloodGroup, cityName) => {
    const res = await fetch(`/api/emergency-requests/matching-donors?bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(cityName)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch matching donors');
    }
    return await res.json();
  },

  // --- ADMIN PORTAL ---
  getAdminStats: async () => {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch admin stats');
    }
    return await res.json();
  },

  getPendingOrganizations: async () => {
    const res = await fetch('/api/admin/pending-orgs');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch pending organizations');
    }
    return await res.json();
  },

  verifyOrganization: async (orgId, verify = true) => {
    const res = await fetch(`/api/admin/verify-org/${orgId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verify })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to verify organization');
    }
    return await res.json();
  },

  getActivityLogs: async () => {
    const res = await fetch('/api/admin/logs');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch activity logs');
    }
    return await res.json();
  }
};
