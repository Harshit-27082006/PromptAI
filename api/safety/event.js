const recentEvents = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: recentEvents.length,
      events: recentEvents.slice(0, 20)
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const newEvent = {
      id: "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      eventType: body.eventType || "telemetry_update",
      riskLevel: body.riskLevel || "low",
      riskScore: body.riskScore || 10,
      location: body.location || { lat: 37.7752, lng: -122.4245 },
      details: body.details || "Journey telemetry received",
      timestamp: body.timestamp || new Date().toISOString(),
      processedBy: "SafeWalk AI Backend"
    };

    recentEvents.unshift(newEvent);
    if (recentEvents.length > 50) recentEvents.pop();

    return res.status(200).json({
      success: true,
      message: "Safety telemetry event recorded",
      event: newEvent
    });
  }

  res.status(405).json({ error: "Method Not Allowed" });
};
