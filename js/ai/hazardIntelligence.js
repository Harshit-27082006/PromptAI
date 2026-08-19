/**
 * SafeWalk AI - Community Hazard Intelligence & Cluster Detector
 * Detects spatial and temporal hazard clusters ("Emerging Risk Areas") from community reports.
 */

window.SAFEWALK_HAZARD_INTELLIGENCE = (function() {
  /**
   * Identifies spatial clusters from community reports
   */
  function analyzeHazards(hazards, userCoords) {
    const routeUtils = window.SAFEWALK_ROUTE_UTILS;
    const allHazards = hazards || [];

    if (allHazards.length === 0) {
      return {
        hazardClusterScore: 0,
        hazardTrend: "LOW",
        trendLabel: "Low Hazard Density",
        trendColor: "emerald",
        clusters: [],
        activeClusterCount: 0,
        explanation: "No active hazard clusters detected in this sector."
      };
    }

    // Spatial clustering algorithm: cluster within 280m radius
    const visited = new Set();
    const clusters = [];

    for (let i = 0; i < allHazards.length; i++) {
      if (visited.has(allHazards[i].id)) continue;

      const current = allHazards[i];
      const members = [current];
      visited.add(current.id);

      for (let j = i + 1; j < allHazards.length; j++) {
        const candidate = allHazards[j];
        if (visited.has(candidate.id)) continue;

        const dist = routeUtils ? routeUtils.calculateDistanceMeters(current.coords, candidate.coords) : 500;
        if (dist <= 300) {
          members.push(candidate);
          visited.add(candidate.id);
        }
      }

      // If 2 or more reports are closely clustered, or 1 high severity report with high radius
      if (members.length >= 2 || (members.length === 1 && members[0].severity === "High")) {
        let totalLat = 0, totalLng = 0;
        let highCount = 0;
        let score = 0;
        const categories = {};

        members.forEach(m => {
          totalLat += m.coords[0];
          totalLng += m.coords[1];
          categories[m.category] = (categories[m.category] || 0) + 1;
          if (m.severity === "High") {
            highCount++;
            score += 35;
          } else if (m.severity === "Medium") {
            score += 20;
          } else {
            score += 10;
          }
        });

        const centroid = [totalLat / members.length, totalLng / members.length];
        const distToUser = (userCoords && routeUtils) ? routeUtils.calculateDistanceMeters(userCoords, centroid) : 999;
        const clusterScore = Math.min(100, Math.round(score + (members.length >= 3 ? 20 : 0)));

        let trend = "LOW";
        let trendLabel = "Minor Cluster";
        if (clusterScore >= 65 || highCount >= 2) {
          trend = "HIGH";
          trendLabel = "High-Risk Emerging Area";
        } else if (clusterScore >= 35 || members.length >= 2) {
          trend = "DEVELOPING";
          trendLabel = "Developing Risk Cluster";
        }

        const catSummary = Object.entries(categories).map(([k, v]) => `${v} ${k.toLowerCase()}`).join(', ');

        clusters.push({
          id: "cluster_" + i,
          name: members.length >= 2 ? `Emerging Risk Area (${catSummary})` : `${members[0].category} Zone`,
          centroid,
          radiusMeters: Math.max(160, members.length * 90),
          score: clusterScore,
          trend,
          trendLabel,
          highSeverityCount: highCount,
          reportCount: members.length,
          contributingReports: members,
          distanceToUser: distToUser,
          formattedDistance: routeUtils ? routeUtils.formatDistance(distToUser) : `${Math.round(distToUser)}m`,
          isNearUser: distToUser <= 350,
          explanation: `Cluster of ${members.length} community report(s) (${catSummary}) located ${Math.round(distToUser)}m from your position.`
        });
      }
    }

    // Sort clusters by proximity to user
    clusters.sort((a, b) => a.distanceToUser - b.distanceToUser);

    // Global hazard cluster score
    const nearestCluster = clusters.length > 0 ? clusters[0] : null;
    let globalClusterScore = 0;
    let globalTrend = "LOW";
    let globalTrendLabel = "Low Hazard Density";
    let globalTrendColor = "emerald";

    if (nearestCluster && nearestCluster.isNearUser) {
      globalClusterScore = nearestCluster.score;
      globalTrend = nearestCluster.trend;
      globalTrendLabel = nearestCluster.trendLabel;
      globalTrendColor = globalTrend === "HIGH" ? "red" : (globalTrend === "DEVELOPING" ? "amber" : "emerald");
    }

    const explanation = nearestCluster && nearestCluster.isNearUser
      ? `AI detected an emerging safety concern: ${nearestCluster.explanation}`
      : "Community hazard density along your corridor is within normal baseline.";

    return {
      hazardClusterScore: globalClusterScore,
      hazardTrend: globalTrend,
      trendLabel: globalTrendLabel,
      trendColor: globalTrendColor,
      clusters,
      activeClusterCount: clusters.length,
      nearestCluster,
      explanation
    };
  }

  return {
    analyzeHazards
  };
})();
