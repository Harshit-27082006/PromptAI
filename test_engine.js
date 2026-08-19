/**
 * SafeWalk AI - Comprehensive Automated Test Suite
 * Validates Phase 1, Phase 2 AI Intelligence, and Phase 3 Backend/API Resilience.
 */

// Mock browser objects for node execution
global.window = {};
global.localStorage = (function() {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

require('./js/data/initialData.js');
require('./js/engine/routeUtils.js');
require('./js/engine/riskEngine.js');
require('./js/engine/apiClient.js');
require('./js/ai/riskPrediction.js');
require('./js/ai/routeAdvisor.js');
require('./js/ai/behaviorAnalyzer.js');
require('./js/ai/hazardIntelligence.js');
require('./js/ai/alertPrioritizer.js');
require('./js/ai/safetyExplainer.js');
require('./js/ai/safetyIntelligence.js');

const healthHandler = require('./api/health.js');
const statusHandler = require('./api/safety/status.js');
const eventHandler = require('./api/safety/event.js');
const checkInHandler = require('./api/safety/check-in.js');
const escalateHandler = require('./api/safety/escalate.js');
const riskZonesHandler = require('./api/risk-zones.js');

const initialData = global.window.SAFEWALK_INITIAL_DATA;
const routeUtils = global.window.SAFEWALK_ROUTE_UTILS;
const riskEngine = global.window.SAFEWALK_RISK_ENGINE;
const apiClient = global.window.SAFEWALK_API_CLIENT;
const riskPredictor = global.window.SAFEWALK_RISK_PREDICTOR;
const routeAdvisor = global.window.SAFEWALK_ROUTE_ADVISOR;
const behaviorAnalyzer = global.window.SAFEWALK_BEHAVIOR_ANALYZER;
const hazardIntelligence = global.window.SAFEWALK_HAZARD_INTELLIGENCE;
const alertPrioritizer = global.window.SAFEWALK_ALERT_PRIORITIZER;
const safetyExplainer = global.window.SAFEWALK_SAFETY_EXPLAINER;
const safetyIntelligence = global.window.SAFEWALK_SAFETY_INTELLIGENCE;

console.log("==================================================");
console.log("🛡️ RUNNING AUTOMATED SAFEWALK AI v2.0 TEST SUITE");
console.log("==================================================");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(` ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(` ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

// ----------------------------------------------------
// 1. Phase 1 Geodesic & Baseline Risk Engine Tests
// ----------------------------------------------------
const p1 = [37.7752, -122.4245];
const p2 = [37.7845, -122.4150];
const dist = routeUtils.calculateDistanceMeters(p1, p2);
assert(dist > 1200 && dist < 1600, `Haversine distance between Campus and Apartments is ~1.3km (${Math.round(dist)}m)`);

const waypoints = initialData.presetRoutes[0].waypoints;
const dev1 = routeUtils.calculateRouteDeviation(waypoints[2], waypoints);
assert(dev1 < 1, `On-route waypoint deviation is ~0m (${dev1.toFixed(2)}m)`);

const offRoutePoint = initialData.presetRoutes[0].deviationWaypoints[2];
const dev2 = routeUtils.calculateRouteDeviation(offRoutePoint, waypoints);
assert(dev2 > 100, `Off-route deviation correctly detected (>100m) (${Math.round(dev2)}m)`);

const safeResult = riskEngine.calculateSafetyRisk({
  timeOfDay: 14,
  deviationMeters: 5,
  checkInState: { isPending: false, isExpired: false },
  nearestSafeZones: [{ distanceMeters: 150, name: "Police Precinct" }]
});
assert(safeResult.status === "GREEN", `Phase 1 daytime status is GREEN (${safeResult.status}, score: ${safeResult.score})`);

// ----------------------------------------------------
// 2. Phase 2 AI Risk Prediction Engine Tests
// ----------------------------------------------------
const predInput = {
  currentRisk: 38,
  previousRisk: 30,
  deviationMeters: 90,
  isDeviated: true,
  isLateNight: true,
  nearbyHazards: [{ severity: "High", isInsideRadius: true, category: "Broken streetlight" }]
};
const predResult = riskPredictor.predictRisk(predInput);
assert(predResult.predictedRisk > predResult.currentRisk, `AI predicts rising risk when off-route at night (${predResult.currentRisk} → ${predResult.predictedRisk})`);
assert(predResult.riskTrend === "INCREASING" || predResult.riskTrend === "RAPIDLY_INCREASING", `AI Trend classified as INCREASING/RAPIDLY_INCREASING (${predResult.riskTrend})`);
assert(predResult.predictionWindow === "next 5 minutes", `Prediction window is defined (${predResult.predictionWindow})`);
assert(predResult.rationale.length > 20, `Natural language rationale generated: "${predResult.rationale.substring(0, 50)}..."`);

// ----------------------------------------------------
// 3. Phase 2 AI Route Advisor Tests
// ----------------------------------------------------
const candidateRouteTest = routeAdvisor.evaluateRouteOptions(
  { startCoords: p1, destCoords: p2 },
  initialData.initialHazards,
  initialData.safeZones,
  true // night
);
assert(candidateRouteTest.allCandidateRoutes.length === 3, `Route Advisor generates 3 candidate routes (${candidateRouteTest.allCandidateRoutes.length} generated)`);
assert(candidateRouteTest.recommendedRoute.isRecommended === true, `Safest route is marked as recommended (${candidateRouteTest.recommendedRoute.name})`);
assert(candidateRouteTest.recommendedRoute.safetyScore >= 70, `Recommended route has high safety score (${candidateRouteTest.recommendedRoute.safetyScore}/100)`);
assert(candidateRouteTest.rationale.includes("AI recommends"), `Route Advisor generates explainable rationale`);

// ----------------------------------------------------
// 4. Phase 2 AI Behavior Anomaly Detector Tests
// ----------------------------------------------------
const normalBehavior = behaviorAnalyzer.analyzeBehavior({
  stationarySeconds: 10,
  deviationMeters: 10,
  isDeviated: false
});
assert(normalBehavior.behaviorStatus === "NORMAL" && normalBehavior.anomalyScore <= 30, `Steady walking is NORMAL (Anomaly score: ${normalBehavior.anomalyScore})`);

const anomalousBehavior = behaviorAnalyzer.analyzeBehavior({
  stationarySeconds: 110,
  deviationMeters: 160,
  isDeviated: true,
  historyTrail: [p1, [37.776, -122.42], [37.778, -122.42], [37.776, -122.42]] // backtrack
});
assert(anomalousBehavior.behaviorStatus === "HIGHLY_UNUSUAL" || anomalousBehavior.behaviorStatus === "UNUSUAL", `Sudden stop + deviation + backtrack is UNUSUAL/HIGHLY_UNUSUAL (${anomalousBehavior.behaviorStatus})`);
assert(anomalousBehavior.anomalyScore >= 60, `Anomaly score is elevated (Score: ${anomalousBehavior.anomalyScore}/100)`);
assert(anomalousBehavior.anomaliesDetected.length >= 2, `Specific anomalies identified (${anomalousBehavior.anomaliesDetected.length} detected)`);

// ----------------------------------------------------
// 5. Phase 2 AI Hazard Intelligence & Cluster Detector Tests
// ----------------------------------------------------
const clusteredHazards = [
  { id: "h1", category: "Broken streetlight", severity: "High", coords: [37.779, -122.424], radiusMeters: 150 },
  { id: "h2", category: "Broken streetlight", severity: "High", coords: [37.7792, -122.4242], radiusMeters: 150 },
  { id: "h3", category: "Harassment report", severity: "High", coords: [37.7794, -122.4239], radiusMeters: 150 }
];
const clusterResult = hazardIntelligence.analyzeHazards(clusteredHazards, [37.779, -122.424]);
assert(clusterResult.activeClusterCount >= 1, `Spatial clustering detects Emerging Risk Area (${clusterResult.activeClusterCount} cluster(s))`);
assert(clusterResult.hazardTrend === "HIGH" || clusterResult.hazardTrend === "DEVELOPING", `Hazard trend elevated (${clusterResult.hazardTrend})`);
assert(clusterResult.clusters[0].reportCount === 3, `Cluster correctly groups 3 reports (${clusterResult.clusters[0].reportCount} grouped)`);

// ----------------------------------------------------
// 6. Phase 2 AI Smart Alert Prioritizer Tests
// ----------------------------------------------------
const criticalAlertInput = {
  currentRisk: 88,
  predictedRisk: 95,
  riskTrend: "RAPIDLY_INCREASING",
  anomalyScore: 82,
  isCantTalkMode: true,
  deviationMeters: 180,
  userName: "Rahul Sharma",
  nearestSafeZone: { name: "Central Police Precinct #1", distanceMeters: 180 }
};
const alertPrioritization = alertPrioritizer.evaluateAlertPriority(criticalAlertInput);
assert(alertPrioritization.priority === "CRITICAL", `Silent SOS + High Risk + Deviation is CRITICAL (Actual: ${alertPrioritization.priority})`);
assert(alertPrioritization.recommendedAction.includes("Central Police Precinct"), `Action recommends nearest safe haven: "${alertPrioritization.recommendedAction.substring(0, 60)}..."`);

// ----------------------------------------------------
// 7. Phase 2 AI Safety Explainer Tests
// ----------------------------------------------------
const explanationResult = safetyExplainer.explainSafety({
  currentRisk: 68,
  predictedRisk: 82,
  deviationMeters: 140,
  isLateNight: true,
  nearbyHazards: [{ category: "Broken streetlight" }],
  nearestSafeZone: { name: "7-Eleven 24/7", distanceMeters: 220 }
});
assert(explanationResult.factorBreakdown.length >= 3, `Factor weights breakdown generated (${explanationResult.factorBreakdown.length} factors)`);
assert(explanationResult.whyPoints.length >= 2, `"Why this recommendation?" points populated (${explanationResult.whyPoints.length} points)`);

// ----------------------------------------------------
// 8. Phase 2 Unified Safety Intelligence Integration Test
// ----------------------------------------------------
const mockState = {
  journey: {
    isActive: true,
    startCoords: p1,
    destCoords: p2,
    currentCoords: [37.7785, -122.4210],
    waypoints,
    historyTrail: [p1, [37.7785, -122.4210]],
    simulatedHour: 23,
    deviationMeters: 80,
    isDeviated: true,
    stationarySeconds: 30
  },
  risk: { score: 48, status: "YELLOW" },
  hazards: initialData.initialHazards,
  safeZones: initialData.safeZones,
  checkIn: { isPending: false, isExpired: false },
  emergency: { isEmergencyDispatched: false, isCantTalkMode: false },
  user: initialData.defaultUser
};

const fullAIReport = safetyIntelligence.analyzeSafety(mockState);
assert(fullAIReport !== null && fullAIReport.prediction !== undefined, `Full AI report produced by LocalSafetyAIProvider`);
assert(fullAIReport.routeAdvisor.recommendedRoute !== null, `AI Route Advisor synthesized`);
assert(fullAIReport.behavior.behaviorStatus !== undefined, `Behavior kinematics synthesized`);
assert(fullAIReport.hazards.clusters !== undefined, `Hazard clusters synthesized`);

// ----------------------------------------------------
// 9. Phase 3 Serverless API Handlers Tests
// ----------------------------------------------------
function mockReqRes(method = "GET", body = null) {
  const headers = {};
  let statusCode = 200;
  let jsonBody = null;

  const res = {
    setHeader: (k, v) => { headers[k] = v; },
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      jsonBody = data;
      return res;
    },
    end: () => res
  };

  const req = { method, body };
  return { req, res, getStatus: () => statusCode, getBody: () => jsonBody };
}

// Test /api/health
const hTest = mockReqRes("GET");
healthHandler(hTest.req, hTest.res);
assert(hTest.getStatus() === 200 && hTest.getBody().status === "ok", `GET /api/health returns status ok`);

// Test /api/safety/status
const sTest = mockReqRes("GET");
statusHandler(sTest.req, sTest.res);
assert(sTest.getStatus() === 200 && sTest.getBody().status === "monitoring", `GET /api/safety/status returns monitoring status`);

// Test /api/safety/event
const eTest = mockReqRes("POST", { eventType: "route_deviation", riskLevel: "warning" });
eventHandler(eTest.req, eTest.res);
assert(eTest.getStatus() === 200 && eTest.getBody().success === true, `POST /api/safety/event records telemetry`);

// Test /api/safety/check-in
const cTest = mockReqRes("POST", { sessionId: "test_1", status: "safe" });
checkInHandler(cTest.req, cTest.res);
assert(cTest.getStatus() === 200 && cTest.getBody().action === "RESET_TIMER", `POST /api/safety/check-in resets timer on safe confirmation`);

// Test /api/safety/escalate
const escTest = mockReqRes("POST", { reason: "User unresponsive", priority: "CRITICAL" });
escalateHandler(escTest.req, escTest.res);
assert(escTest.getStatus() === 200 && escTest.getBody().escalation === "simulated", `POST /api/safety/escalate creates simulated escalation`);

// Test /api/risk-zones
const rzTest = mockReqRes("GET");
riskZonesHandler(rzTest.req, rzTest.res);
assert(rzTest.getStatus() === 200 && rzTest.getBody().zones.length >= 4, `GET /api/risk-zones returns community risk zones (${rzTest.getBody().zones.length} zones)`);

console.log("==================================================");
console.log(`🎯 ALL AI & BACKEND TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log("==================================================");

if (testsFailed > 0) process.exit(1);
