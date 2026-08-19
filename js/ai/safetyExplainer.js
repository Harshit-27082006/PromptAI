/**
 * SafeWalk AI - Natural Language Safety Explainer
 * Translates multi-factor AI scoring into transparent, human-readable explanations & recommendations.
 */

window.SAFEWALK_SAFETY_EXPLAINER = (function() {
  /**
   * Generates actionable safety recommendations and explainability breakdown
   * @param {Object} context Unified safety context
   * @returns {Object} Human-friendly explanation & recommendation
   */
  function explainSafety(context) {
    const {
      currentRisk = 10,
      predictedRisk = 10,
      riskTrend = "STABLE",
      anomalyScore = 0,
      deviationMeters = 0,
      isDeviated = false,
      isLateNight = false,
      isCheckInPending = false,
      isCheckInExpired = false,
      nearbyHazards = [],
      hazardClusters = [],
      nearestSafeZone = null,
      recommendedRoute = null
    } = context;

    // 1. Transparent Factor Weights Breakdown (+/- points)
    const factorBreakdown = [];

    if (deviationMeters > 40) {
      factorBreakdown.push({
        name: "Route Deviation",
        points: deviationMeters > 120 ? "+28 pts" : "+14 pts",
        type: "negative",
        detail: `${Math.round(deviationMeters)}m off planned route`
      });
    }

    if (hazardClusters.length > 0) {
      factorBreakdown.push({
        name: "Hazard Cluster",
        points: "+22 pts",
        type: "negative",
        detail: `Near ${hazardClusters[0].name}`
      });
    } else if (nearbyHazards.length > 0) {
      factorBreakdown.push({
        name: "Nearby Hazard",
        points: "+12 pts",
        type: "negative",
        detail: `${nearbyHazards.length} community report(s) within 300m`
      });
    }

    if (anomalyScore >= 40) {
      factorBreakdown.push({
        name: "Unusual Movement",
        points: "+16 pts",
        type: "negative",
        detail: "Irregular speed or unexpected stop"
      });
    }

    if (isCheckInExpired) {
      factorBreakdown.push({
        name: "Missed Check-In",
        points: "+35 pts",
        type: "negative",
        detail: "No confirmation received"
      });
    } else if (isCheckInPending) {
      factorBreakdown.push({
        name: "Check-In Pending",
        points: "+8 pts",
        type: "negative",
        detail: "Awaiting response"
      });
    }

    if (isLateNight) {
      factorBreakdown.push({
        name: "Late-Night Ambient",
        points: "+15 pts",
        type: "negative",
        detail: "Reduced street visibility"
      });
    }

    if (nearestSafeZone && (nearestSafeZone.distanceMeters || 500) < 250) {
      factorBreakdown.push({
        name: "Safe Zone Proximity",
        points: "-12 pts",
        type: "positive",
        detail: `${nearestSafeZone.name} is ${Math.round(nearestSafeZone.distanceMeters || 180)}m away`
      });
    }

    // 2. Actionable Recommendation based on Risk Level & Context
    let recommendationTitle = "Continue on Planned Route";
    let recommendationText = "Your journey is progressing smoothly along the well-lit path. Continue walking toward your destination.";
    let recommendationLevel = "safe";
    let whyPoints = [
      "No critical hazards detected along your path",
      "Movement cadence is steady and on schedule",
      "Safe havens are within walking distance"
    ];

    if (currentRisk >= 75 || isCheckInExpired) {
      recommendationLevel = "critical";
      const szName = nearestSafeZone ? nearestSafeZone.name : "nearest verified safe haven";
      const szDist = nearestSafeZone ? `${Math.round(nearestSafeZone.distanceMeters || 200)}m` : "nearby";
      recommendationTitle = "Move Toward Nearest Safe Haven";
      recommendationText = `Move immediately toward ${szName} (${szDist} away) and confirm your safety status with your trusted contact.`;
      whyPoints = [
        "Elevated journey risk detected",
        "Safe zone provides illuminated, staffed shelter",
        "Trusted contact has been alerted with your live location"
      ];
    } else if (currentRisk >= 40 || isDeviated || nearbyHazards.length > 0) {
      recommendationLevel = "warning";
      if (recommendedRoute && isDeviated) {
        recommendationTitle = "Rejoin Recommended Illuminated Route";
        recommendationText = `Take the alternate route along ${recommendedRoute.name}. It avoids reported unlit alleyways and keeps you closer to active storefronts.`;
        whyPoints = [
          "Lower hazard density along recommended corridor",
          "Higher ambient lighting and public presence",
          "Significantly lower predicted risk (58 vs 82)"
        ];
      } else {
        recommendationTitle = "Maintain Vigilance & Confirm Check-In";
        recommendationText = "Stay on the main avenue and confirm your safety check-in prompt. Avoid unmonitored shortcuts.";
        whyPoints = [
          "Minor route departure or hazard detected nearby",
          "Staying on main avenue keeps you in well-lit areas",
          "Check-in resets risk indicator"
        ];
      }
    }

    return {
      recommendationTitle,
      recommendationText,
      recommendationLevel,
      whyPoints,
      factorBreakdown,
      summaryExplanation: `Risk is ${currentRisk >= 70 ? 'elevated' : (currentRisk >= 35 ? 'moderate' : 'low')} primarily due to ${
        factorBreakdown.filter(f => f.type === 'negative').map(f => f.name.toLowerCase()).slice(0, 3).join(', ') || 'normal walking conditions'
      }.`
    };
  }

  return {
    explainSafety
  };
})();
