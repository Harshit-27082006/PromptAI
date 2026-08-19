module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const reason = body.reason || "User unresponsive during critical risk state";
    const priority = body.priority || "CRITICAL";
    const location = body.location || { lat: 37.7794, lng: -122.4240 };

    return res.status(200).json({
      success: true,
      escalation: "simulated",
      priority,
      reason,
      location,
      trustedContactNotified: true,
      simulatedDispatch: {
        unit: "Campus Safety & Rapid Escort Unit #4",
        nearestSafeHaven: "Central Police Precinct #1 (850 Bryant St)",
        etaMinutes: 2,
        status: "En-Route (Simulated Demo)"
      },
      disclaimer: "SafeWalk AI simulated escalation event for hackathon evaluation. No actual 911 / carrier SMS dispatched.",
      timestamp: new Date().toISOString()
    });
  }

  res.status(405).json({ error: "Method Not Allowed" });
};
