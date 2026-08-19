module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const status = body.status || "safe";
    const sessionId = body.sessionId || "session_default";

    return res.status(200).json({
      success: true,
      sessionId,
      status,
      action: status === "safe" ? "RESET_TIMER" : "TRIGGER_ESCALATION",
      nextCheckInIntervalSeconds: 60,
      timestamp: new Date().toISOString(),
      message: status === "safe" ? "Check-in verified: user confirmed safe status." : "Emergency assistance requested via check-in."
    });
  }

  res.status(405).json({ error: "Method Not Allowed" });
};
