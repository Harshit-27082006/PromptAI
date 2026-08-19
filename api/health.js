module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    status: "ok",
    service: "SafeWalk AI",
    version: "2.0",
    theme: "Safety Net",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
  });
};
