/**
 * SafeWalk AI - Curated Initial Dataset
 * Provides initial preset routes, verified safe zones, and community hazards.
 */

window.SAFEWALK_INITIAL_DATA = {
  defaultUser: {
    id: "user_rahul_01",
    name: "Rahul Sharma",
    phone: "+1 (555) 234-8901",
    trustedContact: {
      name: "Priya Sharma",
      relation: "Sister",
      phone: "+1 (555) 987-6543",
      email: "priya.sharma@example.com",
      notifyVia: ["Dashboard Alert", "Simulated SMS", "Voice Ping"]
    }
  },

  presetRoutes: [
    {
      id: "route_campus_apartments",
      name: "University Campus to North Park Apartments",
      description: "Standard 1.4 km pedestrian route along University Ave and 4th Street",
      startName: "University Library West Gate",
      destName: "North Park Apartments (Building B)",
      expectedDurationMinutes: 18,
      startCoords: [37.7752, -122.4245],
      destCoords: [37.7845, -122.4150],
      waypoints: [
        [37.7752, -122.4245], // Campus gate
        [37.7768, -122.4230], // University Ave & 8th
        [37.7785, -122.4210], // Central Green Walkway
        [37.7802, -122.4190], // Market & 6th Crossing (Well lit)
        [37.7820, -122.4172], // North Ave Commercial Strip
        [37.7834, -122.4160], // 4th Street Corner
        [37.7845, -122.4150]  // North Park Apartments
      ],
      deviationWaypoints: [
        [37.7785, -122.4210],
        [37.7792, -122.4242], // Turns left into dark narrow alley
        [37.7808, -122.4258], // 240m away from planned route (Isolated area)
        [37.7822, -122.4265]  // Deep off-route
      ]
    },
    {
      id: "route_metro_downtown",
      name: "Metro Transit Center to Elmwood Residences",
      description: "1.8 km walk connecting Central Station to residential district",
      startName: "Central Metro Station - Exit 3",
      destName: "Elmwood Green Condos",
      expectedDurationMinutes: 22,
      startCoords: [37.7890, -122.4080],
      destCoords: [37.7995, -122.3990],
      waypoints: [
        [37.7890, -122.4080],
        [37.7915, -122.4060],
        [37.7940, -122.4040],
        [37.7965, -122.4015],
        [37.7995, -122.3990]
      ],
      deviationWaypoints: [
        [37.7915, -122.4060],
        [37.7918, -122.4120],
        [37.7930, -122.4145]
      ]
    },
    {
      id: "route_techpark_hospital",
      name: "Innovation Tech Park to St. Jude Plaza",
      description: "1.1 km brisk walk through well-lit medical & tech corridor",
      startName: "Innovation Park Tower A",
      destName: "St. Jude Medical Center Plaza",
      expectedDurationMinutes: 14,
      startCoords: [37.7710, -122.4120],
      destCoords: [37.7780, -122.4050],
      waypoints: [
        [37.7710, -122.4120],
        [37.7730, -122.4100],
        [37.7755, -122.4075],
        [37.7780, -122.4050]
      ],
      deviationWaypoints: [
        [37.7730, -122.4100],
        [37.7715, -122.4070],
        [37.7700, -122.4045]
      ]
    }
  ],

  safeZones: [
    {
      id: "sz_police_central",
      name: "Central Police Precinct #1",
      category: "police",
      categoryLabel: "Police Station",
      address: "850 Bryant St",
      coords: [37.7758, -122.4042],
      hours: "Open 24/7",
      phone: "+1 (555) 553-0123",
      features: ["24/7 Front Desk", "Armed Officers", "Emergency CCTV Hub", "Safe Waiting Area"],
      verified: true
    },
    {
      id: "sz_hospital_stjude",
      name: "St. Jude Memorial Hospital Emergency Dept",
      category: "hospital",
      categoryLabel: "Hospital / ER",
      address: "1001 Potrero Ave",
      coords: [37.7795, -122.4095],
      hours: "Open 24/7",
      phone: "+1 (555) 206-8000",
      features: ["24/7 Trauma Care", "Security Guarded Entrance", "Well-Lit Lobby", "Emergency Phones"],
      verified: true
    },
    {
      id: "sz_metro_transit",
      name: "Civic Center Metro & Transit Security",
      category: "transit",
      categoryLabel: "Transit Hub",
      address: "1150 Market St",
      coords: [37.7798, -122.4138],
      hours: "Open 24/7 (Security)",
      phone: "+1 (555) 464-6000",
      features: ["Transit Police Post", "Emergency Help Kiosks", "Constant Crowd / Staff", "Emergency Turnstiles"],
      verified: true
    },
    {
      id: "sz_campus_security",
      name: "University Campus Police & Safe Haven",
      category: "security",
      categoryLabel: "Campus Security",
      address: "500 Parnassus Ave",
      coords: [37.7745, -122.4230],
      hours: "Open 24/7",
      phone: "+1 (555) 476-1414",
      features: ["Safe Walk Escort Dispatch", "Blue Light Station", "24/7 Dispatcher"],
      verified: true
    },
    {
      id: "sz_convenience_7eleven",
      name: "7-Eleven 24/7 Safe Hub (Store #419)",
      category: "store",
      categoryLabel: "24/7 Store",
      address: "527 6th St",
      coords: [37.7812, -122.4182],
      hours: "Open 24/7",
      phone: "+1 (555) 861-4190",
      features: ["Staffed 24/7", "Exterior Floodlights", "Public Phone", "Active Surveillance"],
      verified: true
    },
    {
      id: "sz_pharmacy_walgreens",
      name: "Walgreens 24-Hour Pharmacy & Well-Lit Haven",
      category: "store",
      categoryLabel: "24/7 Pharmacy",
      address: "498 Castro St",
      coords: [37.7838, -122.4168],
      hours: "Open 24/7",
      phone: "+1 (555) 861-3136",
      features: ["24/7 Pharmacist on Duty", "Security Personnel", "High Visibility"],
      verified: true
    },
    {
      id: "sz_fire_station",
      name: "Municipal Fire Station #8 (Safe Haven)",
      category: "fire",
      categoryLabel: "Fire Station",
      address: "36 Bluxome St",
      coords: [37.7770, -122.4180],
      hours: "Open 24/7",
      phone: "+1 (555) 558-3200",
      features: ["Emergency Medical First Responders", "24/7 Staffed Facility"],
      verified: true
    }
  ],

  initialHazards: [
    {
      id: "hz_001",
      category: "Broken streetlight",
      categoryKey: "broken_light",
      severity: "High",
      description: "Multiple non-functional streetlights along the 5th St alleyway; path is completely pitch black after 9 PM.",
      coords: [37.7794, -122.4240],
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      reportedBy: "Community Member (Sarah T.)",
      upvotes: 7,
      radiusMeters: 180
    },
    {
      id: "hz_002",
      category: "Isolated area",
      categoryKey: "isolated_area",
      severity: "Medium",
      description: "Construction scaffolding blocking standard sidewalk, forces pedestrians into narrow unmonitored service lane.",
      coords: [37.7818, -122.4255],
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      reportedBy: "Community Member (Alex M.)",
      upvotes: 4,
      radiusMeters: 150
    },
    {
      id: "hz_003",
      category: "Suspicious activity",
      categoryKey: "suspicious_activity",
      severity: "High",
      description: "Aggressive individuals loitering near the abandoned warehouse loading dock. Approach with caution or detour.",
      coords: [37.7805, -122.4260],
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      reportedBy: "Verified Student (Marcus K.)",
      upvotes: 12,
      radiusMeters: 200
    },
    {
      id: "hz_004",
      category: "Unsafe crossing",
      categoryKey: "unsafe_crossing",
      severity: "Low",
      description: "Pedestrian push button not responding, vehicles turning rapidly without signal clearance.",
      coords: [37.7765, -122.4205],
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      reportedBy: "Local Resident",
      upvotes: 3,
      radiusMeters: 100
    }
  ],

  hazardCategories: [
    { key: "broken_light", label: "Broken streetlight", icon: "LightbulbOff", defaultSeverity: "High" },
    { key: "isolated_area", label: "Isolated area", icon: "MapPinOff", defaultSeverity: "Medium" },
    { key: "unsafe_crossing", label: "Unsafe crossing", icon: "AlertTriangle", defaultSeverity: "Medium" },
    { key: "suspicious_activity", label: "Suspicious activity", icon: "EyeOff", defaultSeverity: "High" },
    { key: "road_hazard", label: "Road hazard / Obstruction", icon: "Cone", defaultSeverity: "Low" },
    { key: "harassment_report", label: "Harassment report", icon: "ShieldAlert", defaultSeverity: "High" },
    { key: "other", label: "Other safety concern", icon: "HelpCircle", defaultSeverity: "Low" }
  ]
};
