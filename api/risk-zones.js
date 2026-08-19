const riskZones = [
  {
    id: "rz_001",
    name: "5th St Alleyway Corridor",
    category: "poor_lighting",
    categoryLabel: "Poor Lighting",
    riskLevel: "high",
    reports: 14,
    coords: [37.7794, -122.4240],
    radiusMeters: 180,
    description: "Multiple reported broken streetlights; zero illumination past 9 PM.",
    updatedAt: new Date().toISOString()
  },
  {
    id: "rz_002",
    name: "Industrial Dock Loading Sector",
    category: "suspicious_activity",
    categoryLabel: "Suspicious Activity",
    riskLevel: "critical",
    reports: 19,
    coords: [37.7808, -122.4258],
    radiusMeters: 220,
    description: "Frequent loitering and aggressive behavior near abandoned dock.",
    updatedAt: new Date().toISOString()
  },
  {
    id: "rz_003",
    name: "North Ave Construction Bypass",
    category: "road_obstruction",
    categoryLabel: "Road Obstruction",
    riskLevel: "moderate",
    reports: 8,
    coords: [37.7818, -122.4255],
    radiusMeters: 150,
    description: "Sidewalk blocked by scaffolding forcing pedestrians into narrow lane.",
    updatedAt: new Date().toISOString()
  },
  {
    id: "rz_004",
    name: "Transit Underpass Crossing",
    category: "unsafe_road",
    categoryLabel: "Unsafe Crossing",
    riskLevel: "moderate",
    reports: 6,
    coords: [37.7765, -122.4205],
    radiusMeters: 120,
    description: "Rapid turning traffic with malfunctioning pedestrian signal.",
    updatedAt: new Date().toISOString()
  },
  {
    id: "rz_005",
    name: "Civic Plaza Transit Hub",
    category: "crowded_area",
    categoryLabel: "Crowded Transit Area",
    riskLevel: "low",
    reports: 22,
    coords: [37.7798, -122.4138],
    radiusMeters: 250,
    description: "High foot-traffic corridor; well-patrolled by transit security.",
    updatedAt: new Date().toISOString()
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const newZone = {
      id: "rz_" + Date.now(),
      name: body.name || "Community Safety Report Area",
      category: body.category || "poor_lighting",
      categoryLabel: body.categoryLabel || "Community Report",
      riskLevel: body.riskLevel || "moderate",
      reports: 1,
      coords: body.coords || [37.779, -122.424],
      radiusMeters: 140,
      description: body.description || "Community reported hazard",
      updatedAt: new Date().toISOString()
    };
    riskZones.unshift(newZone);
    return res.status(200).json({ success: true, riskZone: newZone });
  }

  res.status(200).json({
    success: true,
    count: riskZones.length,
    zones: riskZones
  });
};
