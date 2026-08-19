/**
 * SafeWalk AI - Geodesic & Routing Utilities
 * Provides precise distance calculations, route deviation math, and spatial queries.
 */

window.SAFEWALK_ROUTE_UTILS = (function() {
  const EARTH_RADIUS_METERS = 6371000; // Earth radius in meters

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function toDegrees(radians) {
    return radians * (180 / Math.PI);
  }

  /**
   * Calculates geodesic distance between two [lat, lng] points using Haversine formula
   * @param {Array<number>} p1 [lat, lng]
   * @param {Array<number>} p2 [lat, lng]
   * @returns {number} Distance in meters
   */
  function calculateDistanceMeters(p1, p2) {
    if (!p1 || !p2 || p1.length < 2 || p2.length < 2) return 0;
    const [lat1, lon1] = p1;
    const [lat2, lon2] = p2;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_METERS * c;
  }

  /**
   * Formats distance into friendly string (m or km)
   */
  function formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  }

  /**
   * Calculates minimum perpendicular distance from a point P to a line segment AB
   * @param {Array<number>} p [lat, lng]
   * @param {Array<number>} a [lat, lng]
   * @param {Array<number>} b [lat, lng]
   * @returns {number} Minimum distance in meters
   */
  function distanceToSegment(p, a, b) {
    // Project point onto segment using flat earth approximation for small distances
    const dAB = calculateDistanceMeters(a, b);
    if (dAB === 0) return calculateDistanceMeters(p, a);

    const dAP = calculateDistanceMeters(a, p);
    const dBP = calculateDistanceMeters(b, p);

    // Vector dot product approximation
    const latMean = toRadians((a[0] + b[0] + p[0]) / 3);
    const kx = Math.cos(latMean) * 111320;
    const ky = 110540;

    const ax = a[1] * kx, ay = a[0] * ky;
    const bx = b[1] * kx, by = b[0] * ky;
    const px = p[1] * kx, py = p[0] * ky;

    const abx = bx - ax, aby = by - ay;
    const apx = px - ax, apy = py - ay;

    const segLenSq = abx * abx + aby * aby;
    if (segLenSq === 0) return dAP;

    let t = (apx * abx + apy * aby) / segLenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = ax + t * abx;
    const projY = ay + t * aby;

    const dx = px - projX;
    const dy = py - projY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculates minimum distance from current position to a polyline route
   * @param {Array<number>} currentCoords [lat, lng]
   * @param {Array<Array<number>>} waypoints Array of [lat, lng]
   * @returns {number} Minimum deviation distance in meters
   */
  function calculateRouteDeviation(currentCoords, waypoints) {
    if (!waypoints || waypoints.length === 0) return 0;
    if (waypoints.length === 1) return calculateDistanceMeters(currentCoords, waypoints[0]);

    let minDistance = Infinity;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const segDist = distanceToSegment(currentCoords, waypoints[i], waypoints[i + 1]);
      if (segDist < minDistance) {
        minDistance = segDist;
      }
    }
    return minDistance;
  }

  /**
   * Calculates total route length
   */
  function calculateTotalRouteDistance(waypoints) {
    if (!waypoints || waypoints.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      total += calculateDistanceMeters(waypoints[i], waypoints[i + 1]);
    }
    return total;
  }

  /**
   * Calculates walking ETA in minutes based on distance and average speed (1.3 m/s)
   */
  function calculateWalkingDurationMinutes(distanceMeters, speedMps = 1.3) {
    const seconds = distanceMeters / speedMps;
    return Math.ceil(seconds / 60);
  }

  /**
   * Finds nearest safe zones to given coordinates, sorted by distance
   */
  function findNearestSafeZones(currentCoords, safeZones, limit = 5) {
    if (!currentCoords || !safeZones) return [];

    const enriched = safeZones.map(sz => {
      const dist = calculateDistanceMeters(currentCoords, sz.coords);
      const walkTimeMin = calculateWalkingDurationMinutes(dist);
      return {
        ...sz,
        distanceMeters: dist,
        formattedDistance: formatDistance(dist),
        walkTimeMin
      };
    });

    enriched.sort((a, b) => a.distanceMeters - b.distanceMeters);
    return enriched.slice(0, limit);
  }

  /**
   * Finds community hazards within proximity threshold (e.g. 300m)
   */
  function findNearbyHazards(currentCoords, hazards, radiusMeters = 300) {
    if (!currentCoords || !hazards) return [];

    return hazards
      .map(h => {
        const dist = calculateDistanceMeters(currentCoords, h.coords);
        return {
          ...h,
          distanceMeters: dist,
          formattedDistance: formatDistance(dist),
          isInsideRadius: dist <= (h.radiusMeters || radiusMeters)
        };
      })
      .filter(h => h.distanceMeters <= (radiusMeters * 1.5))
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  /**
   * Calculates journey completion percentage (0 - 100%)
   */
  function calculateJourneyProgress(currentCoords, waypoints) {
    if (!waypoints || waypoints.length < 2) return 0;
    const totalDist = calculateTotalRouteDistance(waypoints);
    const startPoint = waypoints[0];
    const destPoint = waypoints[waypoints.length - 1];

    const distToDest = calculateDistanceMeters(currentCoords, destPoint);
    if (distToDest <= 30) return 100;

    const distFromStart = calculateDistanceMeters(currentCoords, startPoint);
    const progress = (distFromStart / (distFromStart + distToDest)) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
  }

  return {
    calculateDistanceMeters,
    formatDistance,
    distanceToSegment,
    calculateRouteDeviation,
    calculateTotalRouteDistance,
    calculateWalkingDurationMinutes,
    findNearestSafeZones,
    findNearbyHazards,
    calculateJourneyProgress
  };
})();
