/**
 * SafeWalk AI - Smart Alert Prioritizer
 * Classifies emergency events by severity (LOW, MEDIUM, HIGH, CRITICAL) using multi-factor AI scoring.
 */

window.SAFEWALK_ALERT_PRIORITIZER = (function() {
  /**
   * Evaluates priority level and recommended response for emergency events
   * @param {Object} alertContext
   * @returns {Object} Alert assessment report
   */
  function evaluateAlertPriority(alertContext) {
    const {
      currentRisk = 10,
      predictedRisk = 10,
      riskTrend = "STABLE",
      anomalyScore = 0,
      isCheckInExpired = false,
      deviationMeters = 0,
      isCantTalkMode = false,
      isEmergencyMode = false,
      hazardClusterTrend = "LOW",
      nearestSafeZone = null,
      userName = "User"
    } = alertContext;

    let priorityScore = 0;
    const factors = [];

    // 1. Emergency SOS Mode Type
    if (isCantTalkMode) {
      priorityScore += 50;
      factors.push("Silent 'I Can't Talk' emergency mode active");
    } else if (isEmergencyMode) {
      priorityScore += 35;
      factors.push("Emergency SOS triggered by user");
    }

    // 2. Risk Score & Trend
    if (currentRisk >= 75 || predictedRisk >= 85) {
      priorityScore += 30;
      factors.push(`Elevated risk score (${currentRisk}/100, predicted ${predictedRisk})`);
    } else if (currentRisk >= 40) {
      priorityScore += 15;
    }

    if (riskTrend === "RAPIDLY_INCREASING") {
      priorityScore += 20;
      factors.push("Risk rapidly accelerating");
    }

    // 3. Behavior Anomaly
    if (anomalyScore >= 65) {
      priorityScore += 25;
      factors.push(`Severe behavioral anomaly detected (${anomalyScore}/100)`);
    } else if (anomalyScore >= 35) {
      priorityScore += 10;
    }

    // 4. Missed Check-In
    if (isCheckInExpired) {
      priorityScore += 25;
      factors.push("Unresponsive to safety check-in prompt");
    }

    // 5. Route Deviation
    if (deviationMeters > 150) {
      priorityScore += 20;
      factors.push(`Critical route departure (${Math.round(deviationMeters)}m off-path)`);
    } else if (deviationMeters > 50) {
      priorityScore += 10;
    }

    // 6. Hazard Cluster Proximity
    if (hazardClusterTrend === "HIGH") {
      priorityScore += 15;
      factors.push("Located inside active high-risk hazard cluster");
    }

    // Determine Classification
    let priority = "LOW";
    let priorityBadge = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    let pulseAnim = "";

    if (priorityScore >= 70 || isCantTalkMode || (isEmergencyMode && isCheckInExpired)) {
      priority = "CRITICAL";
      priorityBadge = "bg-red-500 text-white animate-pulse border-red-400";
      pulseAnim = "animate-ping";
    } else if (priorityScore >= 45 || isEmergencyMode) {
      priority = "HIGH";
      priorityBadge = "bg-red-500/20 text-red-300 border-red-500/40";
    } else if (priorityScore >= 25 || isCheckInExpired) {
      priority = "MEDIUM";
      priorityBadge = "bg-amber-500/20 text-amber-300 border-amber-500/40";
    }

    // Generate Contextual AI Reason Summary
    let aiReasonSummary = `${userName}'s journey telemetry is within normal bounds.`;
    if (factors.length > 0) {
      aiReasonSummary = `${factors.slice(0, 3).join(', ')}.`;
    }

    // Generate Recommended Contact Action
    let recommendedAction = "Maintain standard background journey monitoring.";
    const safeZoneName = nearestSafeZone ? nearestSafeZone.name : "nearest safe haven";
    const safeZoneDist = nearestSafeZone ? `${Math.round(nearestSafeZone.distanceMeters || 200)}m` : "nearby";

    if (priority === "CRITICAL") {
      recommendedAction = `Attempt direct telephone contact with ${userName} immediately and guide them towards ${safeZoneName} (${safeZoneDist} away). Prepare to request local security dispatch if unreachable.`;
    } else if (priority === "HIGH") {
      recommendedAction = `Review live GPS location. Send a check-in ping or call ${userName} to confirm they are heading back toward the planned route.`;
    } else if (priority === "MEDIUM") {
      recommendedAction = `Monitor active location map stream. A check-in has been prompted to verify safe progress.`;
    }

    return {
      priorityScore: Math.min(100, priorityScore),
      priority,
      priorityBadge,
      pulseAnim,
      factors,
      aiReasonSummary,
      recommendedAction,
      isEscalated: priority === "CRITICAL" || priority === "HIGH"
    };
  }

  return {
    evaluateAlertPriority
  };
})();
