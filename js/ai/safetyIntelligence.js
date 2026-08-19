/**
 * SafeWalk AI - Unified Safety Intelligence Layer & Provider Abstraction
 * Coordinates predictive risk modeling, behavior anomaly detection, hazard clustering,
 * route recommendation, and smart alert prioritization.
 */

window.SAFEWALK_SAFETY_INTELLIGENCE = (function() {
  /**
   * LocalSafetyAIProvider: Default robust implementation that requires zero API keys.
   * Fully deterministic, explainable, and context-aware.
   */
  class LocalSafetyAIProvider {
    constructor() {
      this.name = "SafeWalk Local Neural Heuristic AI Engine (v2.0)";
    }

    /**
     * Synthesizes all intelligence sub-modules for the current journey state
     * @param {Object} rawState App state
     * @returns {Object} Full AI intelligence report
     */
    analyzeSafety(rawState) {
      const j = rawState.journey || {};
      const hazards = rawState.hazards || [];
      const safeZones = rawState.safeZones || [];
      const currentCoords = j.currentCoords || [37.7752, -122.4245];
      const isLateNight = (j.simulatedHour !== null && j.simulatedHour !== undefined)
        ? (j.simulatedHour >= 22 || j.simulatedHour < 5)
        : (new Date().getHours() >= 22 || new Date().getHours() < 5);

      const routeUtils = window.SAFEWALK_ROUTE_UTILS;
      const nearbyHazards = routeUtils ? routeUtils.findNearbyHazards(currentCoords, hazards, 350) : [];
      const nearestSafeZones = routeUtils ? routeUtils.findNearestSafeZones(currentCoords, safeZones, 5) : [];
      const nearestSafeZone = nearestSafeZones.length > 0 ? nearestSafeZones[0] : null;

      // 1. Hazard Intelligence & Clustering
      const hazardIntel = window.SAFEWALK_HAZARD_INTELLIGENCE
        ? window.SAFEWALK_HAZARD_INTELLIGENCE.analyzeHazards(hazards, currentCoords)
        : { hazardClusterScore: 0, hazardTrend: "LOW", clusters: [], explanation: "" };

      // 2. Behavior Anomaly Detection
      const behaviorIntel = window.SAFEWALK_BEHAVIOR_ANALYZER
        ? window.SAFEWALK_BEHAVIOR_ANALYZER.analyzeBehavior({
            historyTrail: j.historyTrail || [],
            stationarySeconds: j.stationarySeconds || 0,
            deviationMeters: j.deviationMeters || 0,
            isDeviated: j.isDeviated || false,
            isCheckInExpired: rawState.checkIn?.isExpired || false,
            isCheckInPending: rawState.checkIn?.isPending || false
          })
        : { anomalyScore: 10, behaviorStatus: "NORMAL", explanation: "" };

      // 3. Build Unified Context Object
      const unifiedContext = {
        timeOfDay: j.simulatedHour !== null ? j.simulatedHour : new Date(),
        isLateNight,
        journeyProgress: j.progressPct || 0,
        currentLocation: currentCoords,
        routeDeviation: j.deviationMeters || 0,
        deviationMeters: j.deviationMeters || 0,
        isDeviated: j.isDeviated || false,
        movementSpeed: 1.3,
        inactivityDuration: j.stationarySeconds || 0,
        stationarySeconds: j.stationarySeconds || 0,
        nearbyHazards,
        hazardClusters: hazardIntel.clusters,
        hazardClusterTrend: hazardIntel.hazardTrend,
        nearestSafeZone,
        nearestSafeZones,
        nearestSafeZoneDistance: nearestSafeZone ? nearestSafeZone.distanceMeters : 500,
        missedCheckIn: rawState.checkIn?.isExpired || false,
        isCheckInExpired: rawState.checkIn?.isExpired || false,
        isCheckInPending: rawState.checkIn?.isPending || false,
        currentRisk: rawState.risk?.score || 10,
        previousRisk: rawState.risk?.previousScore || 10,
        anomalyScore: behaviorIntel.anomalyScore,
        behaviorAnomalyScore: behaviorIntel.anomalyScore,
        behaviorStatus: behaviorIntel.behaviorStatus,
        isCantTalkMode: rawState.emergency?.isCantTalkMode || false,
        isEmergencyMode: rawState.emergency?.isEmergencyDispatched || false,
        userName: rawState.user?.name || "Rahul Sharma"
      };

      // 4. Predictive Risk Modeling
      const prediction = window.SAFEWALK_RISK_PREDICTOR
        ? window.SAFEWALK_RISK_PREDICTOR.predictRisk(unifiedContext)
        : { currentRisk: unifiedContext.currentRisk, predictedRisk: unifiedContext.currentRisk + 5, riskTrend: "STABLE" };

      unifiedContext.predictedRisk = prediction.predictedRisk;
      unifiedContext.riskTrend = prediction.riskTrend;

      // 5. Route Recommendation
      const routeAdvise = window.SAFEWALK_ROUTE_ADVISOR
        ? window.SAFEWALK_ROUTE_ADVISOR.evaluateRouteOptions(j, hazards, safeZones, isLateNight)
        : { recommendedRoute: null, allCandidateRoutes: [], rationale: "" };

      unifiedContext.recommendedRoute = routeAdvise.recommendedRoute;

      // 6. Alert Prioritization
      const alertAssessment = window.SAFEWALK_ALERT_PRIORITIZER
        ? window.SAFEWALK_ALERT_PRIORITIZER.evaluateAlertPriority(unifiedContext)
        : { priority: "LOW", aiReasonSummary: "", recommendedAction: "" };

      // 7. Human-Friendly Explanation & Actionable Recommendation
      const explanation = window.SAFEWALK_SAFETY_EXPLAINER
        ? window.SAFEWALK_SAFETY_EXPLAINER.explainSafety(unifiedContext)
        : { recommendationTitle: "Continue", recommendationText: "", whyPoints: [], factorBreakdown: [] };

      return {
        timestamp: new Date().toISOString(),
        provider: this.name,
        context: unifiedContext,
        prediction,
        behavior: behaviorIntel,
        hazards: hazardIntel,
        routeAdvisor: routeAdvise,
        alertAssessment,
        explanation
      };
    }
  }

  const activeProvider = new LocalSafetyAIProvider();

  return {
    getProvider: () => activeProvider,
    analyzeSafety: (state) => activeProvider.analyzeSafety(state)
  };
})();
