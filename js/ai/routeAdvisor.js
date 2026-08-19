/**
 * SafeWalk AI - Risk-Aware Route Advisor
 * Compares candidate routes and recommends the safest path prioritizing well-lit, verified corridors.
 */

window.SAFEWALK_ROUTE_ADVISOR = (function() {
  /**
   * Evaluates a route and computes its safety score (0-100, where 100 is safest)
   * Formula: routeSafetyScore = Base (100) - distanceCost - hazardCost - isolationCost + safeZoneBenefit - timeOfDayPenalty
   */
  function scoreRoute(route, allHazards, allSafeZones, isLateNight = false) {
    const routeUtils = window.SAFEWALK_ROUTE_UTILS;
    const waypoints = route.waypoints || [];
    const totalDistMeters = routeUtils ? routeUtils.calculateTotalRouteDistance(waypoints) : 1200;
    const walkingMins = routeUtils ? routeUtils.calculateWalkingDurationMinutes(totalDistMeters) : 15;

    // 1. Hazard Cost: checks hazards along route polyline
    let hazardCount = 0;
    let highSeverityCount = 0;
    let hazardPenalty = 0;

    (allHazards || []).forEach(h => {
      const dev = routeUtils ? routeUtils.calculateRouteDeviation(h.coords, waypoints) : 300;
      if (dev <= (h.radiusMeters || 150)) {
        hazardCount++;
        if (h.severity === "High") {
          highSeverityCount++;
          hazardPenalty += 28;
        } else if (h.severity === "Medium") {
          hazardPenalty += 16;
        } else {
          hazardPenalty += 8;
        }
      }
    });

    // 2. Safe Zone Benefit: checks proximity of safe zones to route
    let safeZonesNearRoute = 0;
    let safeZoneBonus = 0;
    (allSafeZones || []).forEach(sz => {
      const dev = routeUtils ? routeUtils.calculateRouteDeviation(sz.coords, waypoints) : 500;
      if (dev <= 250) {
        safeZonesNearRoute++;
        safeZoneBonus += (sz.category === "police" || sz.category === "hospital" ? 12 : 8);
      }
    });
    safeZoneBonus = Math.min(28, safeZoneBonus);

    // 3. Isolation Cost (if route is far from safe zones)
    let isolationCost = safeZonesNearRoute === 0 ? 18 : (safeZonesNearRoute === 1 ? 6 : 0);

    // 4. Distance / Exposure Cost (longer walk = longer exposure to fatigue / isolation)
    const distanceCost = Math.min(25, Math.round((totalDistMeters / 1000) * 12));

    // 5. Time of Day Multiplier
    const timeOfDayPenalty = isLateNight ? (hazardPenalty > 0 ? 14 : (safeZonesNearRoute >= 2 ? 0 : 6)) : 0;

    // Total safety score (higher is safer)
    let safetyScore = 100 - hazardPenalty - isolationCost - distanceCost + safeZoneBonus - timeOfDayPenalty;
    safetyScore = Math.max(10, Math.min(98, Math.round(safetyScore)));

    return {
      ...route,
      distanceMeters: totalDistMeters,
      formattedDistance: routeUtils ? routeUtils.formatDistance(totalDistMeters) : `${(totalDistMeters/1000).toFixed(1)} km`,
      walkingDurationMins: walkingMins,
      hazardCount,
      highSeverityCount,
      safeZonesNearRoute,
      safetyScore,
      safetyLevel: safetyScore >= 75 ? "HIGH" : (safetyScore >= 55 ? "MEDIUM" : "LOW"),
      lightingRating: route.lightingRating || (safetyScore >= 75 ? "Well-Lit & Monitored" : "Partially Lit / Dim")
    };
  }

  /**
   * Generates and evaluates candidate routes for a given journey
   */
  function evaluateRouteOptions(activeJourney, allHazards, allSafeZones, isLateNight = false) {
    const start = activeJourney.startCoords || [37.7752, -122.4245];
    const dest = activeJourney.destCoords || [37.7845, -122.4150];

    // Build 3 candidate routes (Shortest direct, AI Recommended well-lit, Alternative wide avenue)
    const candidateA = {
      id: "candidate_shortest",
      name: "Direct Alley Shortcut",
      tag: "Shortest",
      description: "Direct pedestrian shortcut via 5th St back alleys. Shorter distance but passes near unlit segments.",
      lightingRating: "Dimly Lit / Alleyway",
      waypoints: [
        start,
        [37.7770, -122.4225],
        [37.7794, -122.4240], // Near broken light hazard
        [37.7820, -122.4190],
        dest
      ]
    };

    const candidateB = {
      id: "candidate_recommended",
      name: "Commercial Avenue & Safe Haven Corridor",
      tag: "AI Recommended",
      description: "Well-illuminated commercial avenue passing 7-Eleven Safe Hub and Police Precinct #1. Continuous safe haven proximity.",
      lightingRating: "High Floodlights / Active CCTV",
      waypoints: [
        start,
        [37.7768, -122.4215],
        [37.7788, -122.4180], // Passes 24/7 store
        [37.7812, -122.4165], // Passes Safe Haven
        [37.7834, -122.4155],
        dest
      ]
    };

    const candidateC = {
      id: "candidate_alternative",
      name: "Boulevard Perimeter Walk",
      tag: "Alternative",
      description: "Wide multi-lane boulevard with active vehicle traffic and wide sidewalks. Longest distance (1.9 km).",
      lightingRating: "Well-Lit Traffic Corridor",
      waypoints: [
        start,
        [37.7730, -122.4200],
        [37.7750, -122.4120],
        [37.7790, -122.4080],
        [37.7830, -122.4100],
        dest
      ]
    };

    const scoredA = scoreRoute(candidateA, allHazards, allSafeZones, isLateNight);
    const scoredB = scoreRoute(candidateB, allHazards, allSafeZones, isLateNight);
    const scoredC = scoreRoute(candidateC, allHazards, allSafeZones, isLateNight);

    // Rank routes by safety score
    const routes = [scoredB, scoredC, scoredA].sort((a, b) => b.safetyScore - a.safetyScore);

    // Mark top route as recommended
    const recommended = { ...routes[0], isRecommended: true };
    const allCandidateRoutes = [
      recommended,
      ...routes.slice(1).map(r => ({ ...r, isRecommended: false }))
    ];

    const rationale = `AI recommends ${recommended.name} because it achieves a Safety Score of ${recommended.safetyScore}/100 with ${recommended.hazardCount} hazards and continuous proximity to ${recommended.safeZonesNearRoute} verified safe havens. It prioritizes illuminated paths over minimal distance.`;

    return {
      recommendedRoute: recommended,
      allCandidateRoutes,
      rationale,
      decisionFactors: [
        `Lower hazard density (${recommended.hazardCount} hazards vs ${scoredA.hazardCount} on shortcut)`,
        `Closer proximity to verified 24/7 safe havens (${recommended.safeZonesNearRoute} nearby)`,
        `High illumination rating (${recommended.lightingRating})`
      ]
    };
  }

  return {
    scoreRoute,
    evaluateRouteOptions
  };
})();
