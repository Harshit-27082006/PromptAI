/**
 * SafeWalk AI - Predictive Safety Risk Engine
 * Computes dynamic journey risk score (0-100) and provides transparent factor breakdowns.
 * Note: Clearly presented as a journey-risk indicator for decision support, not crime prediction.
 */

window.SAFEWALK_RISK_ENGINE = (function() {
  /**
   * Evaluates the time of day factor
   * @param {Date|string|number} timeOrHour - Current time or simulated hour (0-23)
   * @returns {Object} { score: number, label: string, isLateNight: boolean }
   */
  function evaluateTimeOfDay(timeOrHour) {
    let hour;
    if (typeof timeOrHour === 'number') {
      hour = timeOrHour;
    } else if (timeOrHour instanceof Date) {
      hour = timeOrHour.getHours();
    } else if (typeof timeOrHour === 'string' && timeOrHour.includes(':')) {
      hour = parseInt(timeOrHour.split(':')[0], 10);
    } else {
      hour = new Date().getHours();
    }

    // Late night hours: 22:00 (10 PM) to 05:00 (5 AM)
    if (hour >= 23 || hour < 4) {
      return {
        score: 25,
        label: `Deep Night (${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}) — Elevated journey vulnerability`,
        level: "high",
        isLateNight: true
      };
    } else if (hour >= 21 || hour === 4 || hour === 5) {
      return {
        score: 18,
        label: `Late Evening / Dawn (${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}) — Reduced visibility`,
        level: "medium",
        isLateNight: true
      };
    } else if (hour >= 18 && hour < 21) {
      return {
        score: 8,
        label: `Dusk / Evening (${hour % 12 || 12}:00 PM) — Moderate ambient lighting`,
        level: "low",
        isLateNight: false
      };
    } else {
      return {
        score: 2,
        label: `Daytime (${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}) — Standard visibility & activity`,
        level: "safe",
        isLateNight: false
      };
    }
  }

  /**
   * Evaluates route deviation factor
   * @param {number} deviationMeters - Distance in meters from planned route
   */
  function evaluateDeviation(deviationMeters) {
    if (deviationMeters <= 35) {
      return {
        score: 0,
        label: `On Planned Route (${Math.round(deviationMeters)}m)`,
        level: "safe",
        isDeviated: false
      };
    } else if (deviationMeters <= 80) {
      return {
        score: 12,
        label: `Minor Route Deviation (${Math.round(deviationMeters)}m off-path)`,
        level: "low",
        isDeviated: true
      };
    } else if (deviationMeters <= 160) {
      return {
        score: 24,
        label: `Significant Route Deviation (${Math.round(deviationMeters)}m off-path)`,
        level: "medium",
        isDeviated: true
      };
    } else {
      return {
        score: 35,
        label: `Critical Route Deviation (${Math.round(deviationMeters)}m off-path into unmonitored area)`,
        level: "high",
        isDeviated: true
      };
    }
  }

  /**
   * Evaluates stopping / inactivity factor
   */
  function evaluateInactivity(stationarySeconds, isDeviated) {
    if (stationarySeconds < 45) {
      return { score: 0, label: "Active continuous movement", level: "safe" };
    } else if (stationarySeconds < 120) {
      const pts = isDeviated ? 15 : 6;
      return {
        score: pts,
        label: `Stationary for ${Math.round(stationarySeconds)}s${isDeviated ? ' while off-route' : ''}`,
        level: isDeviated ? "medium" : "low"
      };
    } else {
      const pts = isDeviated ? 25 : 16;
      return {
        score: pts,
        label: `Prolonged stationary stop (${Math.round(stationarySeconds / 60)} mins)${isDeviated ? ' in unexpected location' : ''}`,
        level: "high"
      };
    }
  }

  /**
   * Evaluates missed check-in status
   */
  function evaluateCheckInStatus(checkInState) {
    // checkInState: { isPending: boolean, isExpired: boolean, secondsOverdue: number, lastCheckInTime: Date }
    if (!checkInState) return { score: 0, label: "Check-in cadence regular", level: "safe" };

    if (checkInState.isExpired) {
      return {
        score: 45,
        label: `Missed Check-In Alert! No user response after prompt countdown`,
        level: "critical",
        isExpired: true
      };
    } else if (checkInState.isPending) {
      return {
        score: 15,
        label: `Smart Check-In Pending: Awaiting user confirmation`,
        level: "medium",
        isPending: true
      };
    } else {
      return {
        score: -5,
        label: `Recently Verified Safe (Check-in confirmed)`,
        level: "safe"
      };
    }
  }

  /**
   * Evaluates community hazard proximity
   */
  function evaluateHazards(nearbyHazards) {
    if (!nearbyHazards || nearbyHazards.length === 0) {
      return { score: 0, label: "No active hazard reports within 300m", level: "safe", count: 0 };
    }

    let hazardScore = 0;
    let highCount = 0;
    const names = [];

    nearbyHazards.forEach(h => {
      if (h.isInsideRadius || h.distanceMeters < 150) {
        if (h.severity === "High") {
          hazardScore += 18;
          highCount++;
        } else if (h.severity === "Medium") {
          hazardScore += 10;
        } else {
          hazardScore += 5;
        }
        names.push(`${h.category} (${Math.round(h.distanceMeters)}m)`);
      } else {
        hazardScore += 4;
      }
    });

    const finalScore = Math.min(25, hazardScore);
    return {
      score: finalScore,
      label: `${nearbyHazards.length} nearby community report(s): ${names.slice(0, 2).join(', ')}`,
      level: highCount > 0 ? "high" : "medium",
      count: nearbyHazards.length,
      details: names
    };
  }

  /**
   * Evaluates safe zone proximity (Police, Hospital, 24/7 store)
   */
  function evaluateSafeZones(nearestSafeZones) {
    if (!nearestSafeZones || nearestSafeZones.length === 0) {
      return { score: 10, label: "Isolated area (>1.5 km from verified safe zones)", level: "medium" };
    }

    const closest = nearestSafeZones[0];
    if (closest.distanceMeters < 200) {
      return {
        score: -12,
        label: `Safe Zone Proximity: 1-2 min walk to ${closest.name} (${Math.round(closest.distanceMeters)}m)`,
        level: "safe",
        closest
      };
    } else if (closest.distanceMeters < 500) {
      return {
        score: -6,
        label: `Safe Zone Nearby: ${closest.name} (${Math.round(closest.distanceMeters)}m)`,
        level: "safe",
        closest
      };
    } else if (closest.distanceMeters > 1200) {
      return {
        score: 12,
        label: `Limited Safe Havens: Nearest safe zone is ${Math.round(closest.distanceMeters)}m away`,
        level: "medium",
        closest
      };
    } else {
      return {
        score: 0,
        label: `Nearest safe zone: ${closest.name} (${Math.round(closest.distanceMeters)}m)`,
        level: "neutral",
        closest
      };
    }
  }

  /**
   * Evaluates ETA overrun (elapsed vs expected)
   */
  function evaluateETAOverrun(elapsedMinutes, expectedMinutes) {
    if (!expectedMinutes || elapsedMinutes <= expectedMinutes) {
      return { score: 0, label: "Journey progressing on schedule", level: "safe" };
    }

    const overrunRatio = (elapsedMinutes - expectedMinutes) / expectedMinutes;
    if (overrunRatio > 0.6) {
      return {
        score: 20,
        label: `Major Journey Delay: Overdue by ${Math.round(elapsedMinutes - expectedMinutes)} mins`,
        level: "high"
      };
    } else if (overrunRatio > 0.25) {
      return {
        score: 10,
        label: `Moderate Delay: +${Math.round(elapsedMinutes - expectedMinutes)} mins past estimated arrival`,
        level: "medium"
      };
    } else {
      return {
        score: 3,
        label: `Slight Delay (+${Math.round(elapsedMinutes - expectedMinutes)} mins)`,
        level: "low"
      };
    }
  }

  /**
   * Master Risk Calculation Function
   * @param {Object} params
   * @returns {Object} Comprehensive risk report
   */
  function calculateSafetyRisk(params) {
    const {
      timeOfDay = new Date(),
      deviationMeters = 0,
      stationarySeconds = 0,
      checkInState = null,
      nearbyHazards = [],
      nearestSafeZones = [],
      elapsedMinutes = 0,
      expectedDurationMinutes = 15,
      isEmergencyMode = false,
      isCantTalkMode = false
    } = params;

    // 1. Direct Emergency Overrides
    if (isEmergencyMode || isCantTalkMode) {
      return {
        score: 95,
        status: "RED",
        statusLabel: "POTENTIAL DANGER",
        statusSublabel: isCantTalkMode ? "Silent SOS / Emergency Mode Active" : "Emergency Alert Dispatched",
        accentColor: "red",
        factors: [
          { name: "Emergency Dispatch", score: 95, label: "User triggered Emergency Assistance", level: "critical" }
        ],
        summary: "Emergency assistance protocol initiated. Trusted contact notified and safe zones mapped.",
        disclaimer: "SafeWalk AI Risk Indicator: Predictive safety net & decision support system."
      };
    }

    // 2. Compute individual factor contributions
    const timeFactor = evaluateTimeOfDay(timeOfDay);
    const deviationFactor = evaluateDeviation(deviationMeters);
    const inactivityFactor = evaluateInactivity(stationarySeconds, deviationFactor.isDeviated);
    const checkInFactor = evaluateCheckInStatus(checkInState);
    const hazardFactor = evaluateHazards(nearbyHazards);
    const safeZoneFactor = evaluateSafeZones(nearestSafeZones);
    const etaFactor = evaluateETAOverrun(elapsedMinutes, expectedDurationMinutes);

    // Baseline minimum pedestrian movement
    let totalScore = 5;
    totalScore += timeFactor.score;
    totalScore += deviationFactor.score;
    totalScore += inactivityFactor.score;
    totalScore += checkInFactor.score;
    totalScore += hazardFactor.score;
    totalScore += safeZoneFactor.score;
    totalScore += etaFactor.score;

    // Clamp score to [0, 100]
    totalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

    // Status Classification
    let status = "GREEN";
    let statusLabel = "SAFE";
    let statusSublabel = "Low-risk journey. Route and timings normal.";
    let accentColor = "emerald";

    if (totalScore >= 70 || checkInFactor.isExpired) {
      status = "RED";
      statusLabel = "POTENTIAL DANGER";
      statusSublabel = "High risk detected. Immediate check-in or safety escalation required.";
      accentColor = "red";
    } else if (totalScore >= 35 || deviationFactor.isDeviated || hazardFactor.score >= 15) {
      status = "YELLOW";
      statusLabel = "ATTENTION";
      statusSublabel = "Unusual conditions or route deviation detected. Monitoring closely.";
      accentColor = "amber";
    }

    const factors = [
      { name: "Time of Travel", score: timeFactor.score, label: timeFactor.label, level: timeFactor.level },
      { name: "Route Adherence", score: deviationFactor.score, label: deviationFactor.label, level: deviationFactor.level },
      { name: "Movement Pattern", score: inactivityFactor.score, label: inactivityFactor.label, level: inactivityFactor.level },
      { name: "Smart Check-In", score: checkInFactor.score, label: checkInFactor.label, level: checkInFactor.level },
      { name: "Community Hazards", score: hazardFactor.score, label: hazardFactor.label, level: hazardFactor.level },
      { name: "Safe Zone Proximity", score: safeZoneFactor.score, label: safeZoneFactor.label, level: safeZoneFactor.level },
      { name: "Journey Schedule", score: etaFactor.score, label: etaFactor.label, level: etaFactor.level }
    ];

    return {
      score: totalScore,
      status,
      statusLabel,
      statusSublabel,
      accentColor,
      factors,
      isLateNight: timeFactor.isLateNight,
      isDeviated: deviationFactor.isDeviated,
      isExpiredCheckIn: checkInFactor.isExpired,
      summary: `${statusLabel}: Risk score ${totalScore}/100. ${statusSublabel}`,
      disclaimer: "SafeWalk AI Risk Indicator: Predictive safety net & decision support system. Does not represent statistical crime prediction."
    };
  }

  return {
    calculateSafetyRisk,
    evaluateTimeOfDay,
    evaluateDeviation,
    evaluateInactivity,
    evaluateCheckInStatus,
    evaluateHazards,
    evaluateSafeZones,
    evaluateETAOverrun
  };
})();
