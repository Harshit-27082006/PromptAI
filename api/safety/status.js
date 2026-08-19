// In-memory session state for serverless execution
let currentSessionStatus = {
  status: "monitoring",
  riskLevel: "low",
  riskScore: 12,
  activeWalkers: 1,
  activeCampusWalkers: 24,
  lastCheckIn: new Date().toISOString(),
  connectivity: "online",
  serverTimestamp: new Date().toISOString()
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    currentSessionStatus = {
      ...currentSessionStatus,
      status: body.status || currentSessionStatus.status,
      riskLevel: body.riskLevel || currentSessionStatus.riskLevel,
      riskScore: typeof body.riskScore === 'number' ? body.riskScore : currentSessionStatus.riskScore,
      lastCheckIn: body.lastCheckIn || new Date().toISOString(),
      serverTimestamp: new Date().toISOString()
    };
    return res.status(200).json({
      success: true,
      message: "Safety status updated",
      session: currentSessionStatus
    });
  }

  // GET
  res.status(200).json({
    ...currentSessionStatus,
    serverTimestamp: new Date().toISOString()
  });
};
