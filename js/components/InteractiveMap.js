/**
 * SafeWalk AI - Interactive Safety Map Component (Leaflet Integration)
 * Enhanced with Phase 2 AI Intelligence: AI Recommended Safer Route and Emerging Hazard Clusters.
 */

window.SAFEWALK_MAP = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const mapContainerRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const layersRef = React.useRef({
    userMarker: null,
    plannedRoute: null,
    historyTrail: null,
    safeZonesGroup: null,
    hazardsGroup: null,
    aiRouteLayer: null,
    aiRouteMarker: null,
    hazardClustersGroup: null
  });

  const [showSafeZones, setShowSafeZones] = React.useState(true);
  const [showHazards, setShowHazards] = React.useState(true);
  const [showAIRoute, setShowAIRoute] = React.useState(true);

  // Initialize Map
  React.useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    if (typeof L === 'undefined') {
      console.warn("Leaflet library not yet loaded.");
      return;
    }

    const startCoords = state.journey.currentCoords || [37.7752, -122.4245];

    const map = L.map(mapContainerRef.current, {
      center: startCoords,
      zoom: 15,
      zoomControl: false
    });

    // Dark Matter tile layer for high contrast night walking safety theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Layer groups
    layersRef.current.safeZonesGroup = L.layerGroup().addTo(map);
    layersRef.current.hazardsGroup = L.layerGroup().addTo(map);
    layersRef.current.hazardClustersGroup = L.layerGroup().addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Planned Route Polyline
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof L === 'undefined') return;

    const waypoints = state.journey.waypoints || [];
    if (layersRef.current.plannedRoute) {
      map.removeLayer(layersRef.current.plannedRoute);
      layersRef.current.plannedRoute = null;
    }

    if (waypoints.length > 1) {
      layersRef.current.plannedRoute = L.polyline(waypoints, {
        color: '#06B6D4',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }
  }, [state.journey.waypoints]);

  // Update AI Recommended Route Polyline
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof L === 'undefined') return;

    if (layersRef.current.aiRouteLayer) {
      map.removeLayer(layersRef.current.aiRouteLayer);
      layersRef.current.aiRouteLayer = null;
    }
    if (layersRef.current.aiRouteMarker) {
      map.removeLayer(layersRef.current.aiRouteMarker);
      layersRef.current.aiRouteMarker = null;
    }

    if (!showAIRoute) return;

    const ai = state.aiIntelligence;
    const rec = ai?.routeAdvisor?.recommendedRoute;

    if (rec && rec.waypoints && rec.waypoints.length > 1) {
      layersRef.current.aiRouteLayer = L.polyline(rec.waypoints, {
        color: '#10B981',
        weight: 4,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Add midpoint AI badge marker
      const midPoint = rec.waypoints[Math.floor(rec.waypoints.length / 2)];
      const aiBadgeIcon = L.divIcon({
        className: 'ai-badge-icon',
        html: `
          <div style="background: #059669; color: white; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: 800; border: 1.5px solid white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); white-space: nowrap; display: flex; align-items: center; gap: 3px;">
            <span>🤖 AI Safer Route</span>
          </div>
        `,
        iconSize: [110, 20],
        iconAnchor: [55, 10]
      });

      layersRef.current.aiRouteMarker = L.marker(midPoint, { icon: aiBadgeIcon }).addTo(map);
      layersRef.current.aiRouteMarker.bindPopup(`
        <div style="color: #111827; font-family: sans-serif;">
          <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase;">AI Recommended Route</div>
          <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">${rec.name}</div>
          <div style="font-size: 11px; color: #4B5563; margin-top: 2px;">Safety Score: <b>${rec.safetyScore}/100</b> • ${rec.hazardCount} hazards</div>
          <div style="font-size: 10px; color: #059669; margin-top: 4px;">✓ Well-lit safe haven corridor</div>
        </div>
      `);
    }
  }, [state.aiIntelligence, showAIRoute]);

  // Update History Trail
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof L === 'undefined') return;

    const trail = state.journey.historyTrail || [];
    if (layersRef.current.historyTrail) {
      map.removeLayer(layersRef.current.historyTrail);
      layersRef.current.historyTrail = null;
    }

    if (trail.length > 1) {
      const trailColor = state.risk.status === 'RED' ? '#EF4444' : (state.risk.status === 'YELLOW' ? '#F59E0B' : '#10B981');
      layersRef.current.historyTrail = L.polyline(trail, {
        color: trailColor,
        weight: 4,
        opacity: 0.9,
        lineCap: 'round'
      }).addTo(map);
    }
  }, [state.journey.historyTrail, state.risk.status]);

  // Update User Marker & Safety Radar Pulse
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof L === 'undefined') return;

    const coords = state.journey.currentCoords;
    if (!coords) return;

    const status = state.risk.status;
    let pulseColor = "rgba(16, 185, 129, 0.4)";
    let coreColor = "#10B981";
    if (status === "YELLOW") {
      pulseColor = "rgba(245, 158, 11, 0.4)";
      coreColor = "#F59E0B";
    } else if (status === "RED") {
      pulseColor = "rgba(239, 68, 68, 0.6)";
      coreColor = "#EF4444";
    }

    const customIcon = L.divIcon({
      className: 'user-marker-icon',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div class="radar-wave" style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${pulseColor}; border: 2px solid ${coreColor};"></div>
          <div style="position: relative; width: 18px; height: 18px; border-radius: 50%; background: ${coreColor}; border: 3px solid #FFFFFF; box-shadow: 0 0 12px ${coreColor};"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    if (layersRef.current.userMarker) {
      layersRef.current.userMarker.setLatLng(coords);
      layersRef.current.userMarker.setIcon(customIcon);
    } else {
      layersRef.current.userMarker = L.marker(coords, { icon: customIcon, zIndexOffset: 1000 }).addTo(map);
      layersRef.current.userMarker.bindPopup(`
        <div style="font-size: 13px; font-weight: bold; color: #111827;">${state.user.name} (Live Position)</div>
        <div style="font-size: 11px; color: #4B5563; margin-top: 2px;">Status: <b>${state.risk.statusLabel}</b></div>
      `);
    }
  }, [state.journey.currentCoords, state.risk.status]);

  // Update Safe Zones Markers
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersRef.current.safeZonesGroup || typeof L === 'undefined') return;

    layersRef.current.safeZonesGroup.clearLayers();
    if (!showSafeZones) return;

    const safeZones = state.safeZones || [];
    safeZones.forEach(sz => {
      let iconColor = "#2563EB"; // Blue for police
      let emoji = "🛡️";
      if (sz.category === "hospital") { iconColor = "#DC2626"; emoji = "🏥"; }
      if (sz.category === "store") { iconColor = "#D97706"; emoji = "🏪"; }
      if (sz.category === "transit") { iconColor = "#7C3AED"; emoji = "🚇"; }
      if (sz.category === "fire") { iconColor = "#EA580C"; emoji = "🚒"; }

      const szIcon = L.divIcon({
        className: 'safe-zone-marker',
        html: `
          <div style="background: ${iconColor}; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            ${emoji}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(sz.coords, { icon: szIcon });
      marker.bindPopup(`
        <div style="color: #111827; font-family: sans-serif;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${iconColor};">${sz.categoryLabel} &bull; ${sz.hours}</div>
          <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">${sz.name}</div>
          <div style="font-size: 11px; color: #4B5563; margin-top: 2px;">${sz.address}</div>
          <div style="font-size: 11px; color: #1F2937; margin-top: 4px;"><b>Phone:</b> ${sz.phone}</div>
          <div style="margin-top: 6px; font-size: 10px; color: #059669; font-weight: bold;">✓ Verified Safe Point</div>
        </div>
      `);
      layersRef.current.safeZonesGroup.addLayer(marker);
    });
  }, [state.safeZones, showSafeZones]);

  // Update Hazards & AI Hazard Clusters
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersRef.current.hazardsGroup || !layersRef.current.hazardClustersGroup || typeof L === 'undefined') return;

    layersRef.current.hazardsGroup.clearLayers();
    layersRef.current.hazardClustersGroup.clearLayers();

    if (!showHazards) return;

    const hazards = state.hazards || [];
    hazards.forEach(h => {
      const hazardIcon = L.divIcon({
        className: 'hazard-marker',
        html: `
          <div style="background: #EF4444; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            ⚠️
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker(h.coords, { icon: hazardIcon });
      marker.bindPopup(`
        <div style="color: #111827; font-family: sans-serif;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #DC2626;">Community Hazard &bull; ${h.severity} Severity</div>
          <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">${h.category}</div>
          <div style="font-size: 11px; color: #4B5563; margin-top: 3px;">${h.description}</div>
          <div style="font-size: 10px; color: #9CA3AF; margin-top: 4px;">Reported: ${new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      `);

      const circle = L.circle(h.coords, {
        radius: h.radiusMeters || 120,
        color: '#EF4444',
        weight: 1,
        fillColor: '#EF4444',
        fillOpacity: 0.15,
        dashArray: '4, 4'
      });

      layersRef.current.hazardsGroup.addLayer(marker);
      layersRef.current.hazardsGroup.addLayer(circle);
    });

    // Render AI Hazard Clusters (Emerging Risk Areas)
    const ai = state.aiIntelligence;
    const clusters = ai?.hazards?.clusters || [];
    clusters.forEach(c => {
      const clusterCircle = L.circle(c.centroid, {
        radius: c.radiusMeters,
        color: c.trend === 'HIGH' ? '#DC2626' : '#D97706',
        weight: 2,
        fillColor: c.trend === 'HIGH' ? '#DC2626' : '#D97706',
        fillOpacity: 0.22,
        dashArray: '6, 6'
      });

      clusterCircle.bindPopup(`
        <div style="color: #111827; font-family: sans-serif;">
          <div style="font-size: 10px; font-weight: 800; color: #DC2626; text-transform: uppercase;">⚠️ AI Detected Emerging Risk Area</div>
          <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">${c.name}</div>
          <div style="font-size: 11px; color: #4B5563; margin-top: 3px;">Cluster Density: <b>${c.reportCount} reports</b> • Score: <b>${c.score}/100</b></div>
          <div style="font-size: 10px; color: #DC2626; margin-top: 4px; font-weight: 600;">AI Action: Alternate path advised</div>
        </div>
      `);

      layersRef.current.hazardClustersGroup.addLayer(clusterCircle);
    });
  }, [state.hazards, state.aiIntelligence, showHazards]);

  // Recenter Map Handler
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(state.journey.currentCoords, 16, { animate: true });
  };

  const handleFitRoute = () => {
    if (!mapInstanceRef.current) return;
    const waypoints = state.journey.waypoints || [];
    if (waypoints.length > 1) {
      const bounds = L.latLngBounds(waypoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return h('div', { className: 'relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950' }, [
    // Map Canvas Container
    h('div', { ref: mapContainerRef, className: 'w-full h-full' }),

    // Floating Map Controls (Top Left)
    h('div', { className: 'absolute top-3 left-3 z-[400] flex flex-wrap gap-2' }, [
      h('button', {
        onClick: () => setShowAIRoute(!showAIRoute),
        className: `px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1.5 shadow ${
          showAIRoute
            ? 'bg-emerald-600/90 text-white border-emerald-400'
            : 'bg-slate-900/80 text-slate-400 border-slate-700'
        }`
      }, [
        h(Icons.Zap, { className: 'w-3.5 h-3.5' }),
        h('span', null, 'AI Safer Route')
      ]),
      h('button', {
        onClick: () => setShowSafeZones(!showSafeZones),
        className: `px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1.5 shadow ${
          showSafeZones
            ? 'bg-blue-600/90 text-white border-blue-400'
            : 'bg-slate-900/80 text-slate-400 border-slate-700'
        }`
      }, [
        h(Icons.Shield, { className: 'w-3.5 h-3.5' }),
        h('span', null, 'Safe Zones')
      ]),
      h('button', {
        onClick: () => setShowHazards(!showHazards),
        className: `px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1.5 shadow ${
          showHazards
            ? 'bg-red-600/90 text-white border-red-400'
            : 'bg-slate-900/80 text-slate-400 border-slate-700'
        }`
      }, [
        h(Icons.AlertTriangle, { className: 'w-3.5 h-3.5' }),
        h('span', null, 'Hazards & Clusters')
      ])
    ]),

    // Floating Recenter / Fit Controls (Top Right)
    h('div', { className: 'absolute top-3 right-3 z-[400] flex flex-col gap-2' }, [
      h('button', {
        onClick: handleRecenter,
        title: "Center on My Location",
        className: 'p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-slate-700 shadow-lg backdrop-blur-md transition'
      }, [
        h(Icons.Navigation, { className: 'w-4 h-4' })
      ]),
      h('button', {
        onClick: handleFitRoute,
        title: "Fit Entire Route",
        className: 'p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-slate-700 shadow-lg backdrop-blur-md transition'
      }, [
        h(Icons.Compass, { className: 'w-4 h-4' })
      ])
    ]),

    // Bottom Map Legend / Status Pill
    h('div', { className: 'absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 flex items-center gap-3 shadow-lg flex-wrap' }, [
      h('div', { className: 'flex items-center gap-1' }, [
        h('span', { className: 'w-2 h-2 rounded-full bg-emerald-400' }),
        h('span', null, 'You')
      ]),
      h('div', { className: 'flex items-center gap-1' }, [
        h('span', { className: 'w-2.5 h-1 bg-cyan-400 rounded-sm' }),
        h('span', null, 'Planned Route')
      ]),
      h('div', { className: 'flex items-center gap-1' }, [
        h('span', { className: 'w-2.5 h-1 bg-emerald-500 rounded-sm' }),
        h('span', null, 'AI Safer Route')
      ]),
      h('div', { className: 'flex items-center gap-1' }, [
        h('span', { className: 'w-2 h-2 bg-blue-500 rounded-sm' }),
        h('span', null, 'Safe Zones')
      ]),
      h('div', { className: 'flex items-center gap-1' }, [
        h('span', { className: 'w-2 h-2 bg-red-500 rounded-full' }),
        h('span', null, 'Hazard / Cluster')
      ])
    ])
  ]);
};
