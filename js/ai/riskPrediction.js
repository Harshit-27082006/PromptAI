/**
 * SafeWalk AI - Risk Prediction Engine
 * Predicts future safety risk trajectory (2m, 5m, 10m windows) and trend direction.
 * Presented as a predictive journey-risk indicator for decision support.
 */

window.SAFEWALK_RISK_PREDICTOR = (function() {
  /**
   * Evaluates predictive trajectory of safety risk based on current context
   * @param {Object} context Unified safety context
   * @returns {Object} Risk prediction model output
   */
  function predictRisk(context) {
    const {
      currentRisk = 10,
      previousRisk = 10,
      deviationMeters = 0,
      isDeviated = false,
      stationarySeconds = 0,
      isLateNight = false,
      nearbyHazards = [],
      hazardClusters = [],
      nearestSafeZoneDistance = 500,
      isCheckInPending = false,
      isCheckInExpired = false,
      behaviorAnomalyScore = 0,
      movementSpeedMps = 1.3,
      isBacktracking = false
    } = context;

    let delta2m = 0;
    let delta5m = 0;
    let delta10m = 0;
    const drivingFactors = [];

    // 1. Deviation Trajectory Impact
    if (deviationMeters > 120) {
      delta2m += 8;
      delta5m += 18;
      delta10m += 28;
      drivingFactors.push("Continuing off-route into unmonitored street segment (+18 pts)");
    } else if (deviationMeters > 40) {
      delta2m += 4;
      delta5m += 10;
      delta10m += 16;
      drivingFactors.push("Gradual path departure (+10 pts)");
    } else if (deviationMeters <= 15) {
      delta2m -= 2;
      delta5m -= 5;
      delta10m -= 8;
    }

    // 2. Approaching Hazard Clusters
    if (hazardClusters.length > 0) {
      const highestCluster = hazardClusters[0];
      if (highestCluster.trend === "HIGH" || highestCluster.score > 60) {
        delta2m += 10;
        delta5m += 22;
        delta10m += 30;
        drivingFactors.push(`Trajectory heading toward emerging hazard cluster (${highestCluster.name}) (+22 pts)`);
      } else {
        delta2m += 5;
        delta5m += 12;
        delta10m += 18;
        drivingFactors.push("Proximity to active community hazard reports (+12 pts)");
      }
    } else if (nearbyHazards.length > 0) {
      delta2m += 3;
      delta5m += 8;
      delta10m += 12;
      drivingFactors.push("Approaching reported community hazard (+8 pts)");
    }

    // 3. Movement / Inactivity / Backtracking
    if (isBacktracking) {
      delta2m += 6;
      delta5m += 14;
      delta10m += 20;
      drivingFactors.push("Backtracking / irregular reversal pattern (+14 pts)");
    }
    if (stationarySeconds > 60 && isDeviated) {
      delta2m += 8;
      delta5m += 16;
      delta10m += 24;
      drivingFactors.push("Prolonged stop in deviated location (+16 pts)");
    }

    // 4. Pending or Missed Check-in
    if (isCheckInExpired) {
      delta2m += 15;
      delta5m += 25;
      delta10m += 35;
      drivingFactors.push("Unanswered check-in prompt auto-escalation (+25 pts)");
    } else if (isCheckInPending) {
      delta2m += 5;
      delta5m += 10;
      delta10m += 15;
      drivingFactors.push("Awaiting safety confirmation response (+10 pts)");
    }

    // 5. Late Night Ambient Lighting Multiplier
    if (isLateNight && (delta5m > 0 || isDeviated)) {
      delta2m = Math.round(delta2m * 1.25);
      delta5m = Math.round(delta5m * 1.3);
      delta10m = Math.round(delta10m * 1.35);
      drivingFactors.push("Late-night reduced street visibility amplification (+30% multiplier)");
    }

    // 6. Safe Zone Proximity Reassurance
    if (nearestSafeZoneDistance < 200 && !isDeviated) {
      delta2m -= 4;
      delta5m -= 10;
      delta10m -= 15;
    }

    // Calculate future scores clamped to [0, 100]
    const predictedRisk2Min = Math.max(0, Math.min(100, Math.round(currentRisk + delta2m)));
    const predictedRisk5Min = Math.max(0, Math.min(100, Math.round(currentRisk + delta5m)));
    const predictedRisk10Min = Math.max(0, Math.min(100, Math.round(currentRisk + delta10m)));
    const predictedRisk = predictedRisk5Min; // standard 5-minute prediction horizon

    // Determine Risk Trend
    const diff = predictedRisk - currentRisk;
    let riskTrend = "STABLE";
    let trendLabel = "Stable";
    let trendColor = "emerald";

    if (diff >= 20 || (currentRisk > 65 && diff >= 8)) {
      riskTrend = "RAPIDLY_INCREASING";
      trendLabel = "Rapidly Increasing (High Alert)";
      trendColor = "red";
    } else if (diff >= 6) {
      riskTrend = "INCREASING";
      trendLabel = "Increasing Trend";
      trendColor = "amber";
    } else if (diff <= -6) {
      riskTrend = "DECREASING";
      trendLabel = "Decreasing (Stabilizing)";
      trendColor = "emerald";
    }

    // Generate Natural Language Rationale
    let rationale = "";
    if (riskTrend === "RAPIDLY_INCREASING" || riskTrend === "INCREASING") {
      rationale = `Risk is predicted to rise from ${currentRisk} to ${predictedRisk} in the next 5 minutes because ${
        drivingFactors.length > 0 ? drivingFactors[0].toLowerCase().replace(/\(\+.*?\)/, '') : 'current off-route pattern continues'
      }.`;
    } else if (riskTrend === "DECREASING") {
      rationale = `Risk is stabilizing from ${currentRisk} to ${predictedRisk} as the journey moves closer to well-lit verified corridors.`;
    } else {
      rationale = `Risk is projected to remain steady around ${predictedRisk} over the next 5–10 minutes under steady movement.`;
    }

    return {
      currentRisk,
      predictedRisk,
      predictedRisk2Min,
      predictedRisk5Min,
      predictedRisk10Min,
      riskTrend,
      trendLabel,
      trendColor,
      predictionWindow: "next 5 minutes",
      confidenceScore: 0.88,
      drivingFactors: drivingFactors.slice(0, 3),
      rationale,
      disclaimer: "SafeWalk AI Risk Prediction is an algorithmic decision-support tool. It does not predict crimes or guarantee real-world outcomes."
    };
  }

  return {
    predictRisk
  };
})();
