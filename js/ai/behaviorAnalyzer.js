/**
 * SafeWalk AI - Behavior Anomaly Detector
 * Analyzes kinematic movement patterns, sudden stops, backtracking, and route adherence.
 * Note: Clearly framed as a heuristic behavior-anomaly indicator, not a definitive threat assertion.
 */

window.SAFEWALK_BEHAVIOR_ANALYZER = (function() {
  /**
   * Evaluates movement history to detect behavioral anomalies
   * @param {Object} movementContext
   * @returns {Object} Behavior analysis output
   */
  function analyzeBehavior(movementContext) {
    const {
      historyTrail = [],
      currentSpeedMps = 1.3,
      stationarySeconds = 0,
      deviationMeters = 0,
      isDeviated = false,
      isCheckInExpired = false,
      isCheckInPending = false,
      recentEvents = []
    } = movementContext;

    let anomalyScore = 5;
    const anomaliesDetected = [];

    // 1. Sudden Stop / Inactivity Analysis
    if (stationarySeconds > 120 && isDeviated) {
      anomalyScore += 45;
      anomaliesDetected.push(`Prolonged stationary stop (${Math.round(stationarySeconds)}s) in unmonitored deviated area`);
    } else if (stationarySeconds > 60) {
      anomalyScore += isDeviated ? 30 : 12;
      anomaliesDetected.push(`Stationary stop for ${Math.round(stationarySeconds)}s`);
    }

    // 2. Off-Route Departure Magnitude
    if (deviationMeters > 150) {
      anomalyScore += 35;
      anomaliesDetected.push(`Major off-route deviation (${Math.round(deviationMeters)}m from planned path)`);
    } else if (deviationMeters > 50) {
      anomalyScore += 18;
      anomaliesDetected.push(`Route departure (${Math.round(deviationMeters)}m off-path)`);
    }

    // 3. Backtracking & Direction Reversal Detection
    let isBacktracking = false;
    if (historyTrail.length >= 4) {
      const pLatest = historyTrail[historyTrail.length - 1];
      const pPrev1 = historyTrail[historyTrail.length - 2];
      const pPrev3 = historyTrail[historyTrail.length - 4];

      if (window.SAFEWALK_ROUTE_UTILS) {
        const distToOlder = window.SAFEWALK_ROUTE_UTILS.calculateDistanceMeters(pLatest, pPrev3);
        const distStep1 = window.SAFEWALK_ROUTE_UTILS.calculateDistanceMeters(pLatest, pPrev1);
        if (distToOlder < 10 && distStep1 > 5) {
          isBacktracking = true;
          anomalyScore += 24;
          anomaliesDetected.push("Backtracking / reverse movement direction detected");
        }
      }
    }

    // 4. Missed Check-In Correlation
    if (isCheckInExpired) {
      anomalyScore += 35;
      anomaliesDetected.push("Unresponsive to safety check-in prompt");
    } else if (isCheckInPending) {
      anomalyScore += 10;
    }

    // Clamp score [0, 100]
    anomalyScore = Math.max(0, Math.min(100, Math.round(anomalyScore)));

    // Classify Status
    let behaviorStatus = "NORMAL";
    let statusLabel = "Normal Walking Movement";
    let statusColor = "emerald";

    if (anomalyScore >= 70) {
      behaviorStatus = "HIGHLY_UNUSUAL";
      statusLabel = "Highly Unusual Behavior Pattern";
      statusColor = "red";
    } else if (anomalyScore >= 35) {
      behaviorStatus = "UNUSUAL";
      statusLabel = "Unusual Movement Detected";
      statusColor = "amber";
    }

    // Generate Natural Language Explanation
    let explanation = "Movement pattern conforms to expected walking progression.";
    if (anomaliesDetected.length > 0) {
      explanation = `Movement pattern is classified as ${behaviorStatus.toLowerCase().replace('_', ' ')} because ${anomaliesDetected.slice(0, 2).join(' and ')}.`;
    }

    return {
      anomalyScore,
      behaviorStatus,
      statusLabel,
      statusColor,
      isBacktracking,
      isStationary: stationarySeconds > 45,
      anomaliesDetected,
      explanation,
      shouldTriggerCheckIn: anomalyScore >= 40 && !isCheckInPending && !isCheckInExpired
    };
  }

  return {
    analyzeBehavior
  };
})();
