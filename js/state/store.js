/**
 * SafeWalk AI - Central Reactive State Store & Cross-Tab Event Bus
 * Synchronizes state between Walker view and Trusted Contact Dashboard via BroadcastChannel.
 * Enhanced with Phase 2 AI Safety Intelligence Layer.
 */

window.SAFEWALK_STORE = (function() {
  const STORAGE_KEY = "safewalk_ai_v2_state";
  const BROADCAST_CHANNEL_NAME = "safewalk_live_bus";
  let channel = null;

  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    }
  } catch (e) {
    console.warn("BroadcastChannel not supported in this browser context:", e);
  }

  const listeners = new Set();

  function getDefaultState() {
    const initialData = window.SAFEWALK_INITIAL_DATA || {};
    const defaultRoute = initialData.presetRoutes ? initialData.presetRoutes[0] : null;

    return {
      activeView: "walker", // "walker" | "trusted_dashboard" | "demo_tour"
      user: initialData.defaultUser || {
        name: "Rahul Sharma",
        phone: "+1 (555) 234-8901",
        trustedContact: {
          name: "Priya Sharma",
          relation: "Sister",
          phone: "+1 (555) 987-6543",
          email: "priya.sharma@example.com"
        }
      },
      journey: {
        id: null,
        isActive: false,
        isPaused: false,
        isCompleted: false,
        routeId: defaultRoute ? defaultRoute.id : null,
        startName: defaultRoute ? defaultRoute.startName : "University West Gate",
        destName: defaultRoute ? defaultRoute.destName : "North Park Apartments",
        startCoords: defaultRoute ? defaultRoute.startCoords : [37.7752, -122.4245],
        destCoords: defaultRoute ? defaultRoute.destCoords : [37.7845, -122.4150],
        waypoints: defaultRoute ? defaultRoute.waypoints : [],
        currentCoords: defaultRoute ? defaultRoute.startCoords : [37.7752, -122.4245],
        currentWaypointIndex: 0,
        historyTrail: [],
        startTime: null,
        expectedDurationMinutes: defaultRoute ? defaultRoute.expectedDurationMinutes : 18,
        elapsedSeconds: 0,
        distanceCoveredMeters: 0,
        remainingDistanceMeters: 0,
        progressPct: 0,
        isDeviated: false,
        deviationMeters: 0,
        stationarySeconds: 0,
        isGPSLive: false,
        isSimulationMode: true,
        simulationSpeed: 1, // 1x, 2x, 5x
        simulatedHour: 23 // 11 PM night walk default for testing predictive engine
      },
      risk: {
        score: 12,
        status: "GREEN",
        statusLabel: "SAFE",
        statusSublabel: "Low-risk journey. Route and timings normal.",
        accentColor: "emerald",
        factors: [],
        summary: "SAFE: Risk score 12/100."
      },
      aiIntelligence: null,
      checkIn: {
        isModalOpen: false,
        countdownSeconds: 25,
        maxCountdownSeconds: 25,
        lastCheckInTime: null,
        totalCheckInsDone: 0,
        checkInIntervalSeconds: 60, // periodic interval in demo
        nextCheckInCountdown: 60,
        isPending: false,
        isExpired: false
      },
      emergency: {
        isCountdownActive: false,
        countdownSeconds: 5,
        isEmergencyDispatched: false,
        isCantTalkMode: false,
        activeAlert: null,
        alertHistory: []
      },
      safeZones: initialData.safeZones || [],
      hazards: initialData.initialHazards || [],
      auditLog: [
        {
          id: "log_init",
          timestamp: new Date().toISOString(),
          type: "system",
          title: "SafeWalk AI v2.0 Initialized",
          details: "AI Safety Intelligence layer active with predictive modeling and behavior analytics."
        }
      ],
      soundMuted: false,
      voiceEnabled: true,
      demoScenarioRunning: null
    };
  }

  let state = loadPersistedState() || getDefaultState();

  function loadPersistedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.warn("Error loading persisted state:", e);
    }
    return null;
  }

  function persistState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Error persisting state:", e);
    }
  }

  function broadcast(type, payload) {
    persistState();
    if (channel) {
      try {
        channel.postMessage({ type, payload, timestamp: Date.now() });
      } catch (e) {
        console.warn("Broadcast error:", e);
      }
    }
  }

  if (channel) {
    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === "STATE_SYNC") {
        state = payload;
        notifyListeners();
      } else if (type === "EMERGENCY_TRIGGERED") {
        state.emergency.isEmergencyDispatched = true;
        state.emergency.activeAlert = payload;
        state.emergency.alertHistory.unshift(payload);
        state.risk.status = "RED";
        state.risk.score = 95;
        notifyListeners();
      } else if (type === "ALERT_RESOLVED") {
        if (state.emergency.activeAlert) {
          state.emergency.activeAlert.status = "RESOLVED";
        }
        state.emergency.isEmergencyDispatched = false;
        notifyListeners();
      }
    };
  }

  // Cross-tab fallback via storage events
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        state = JSON.parse(event.newValue);
        notifyListeners();
      } catch (e) {}
    }
  });

  function notifyListeners() {
    listeners.forEach(cb => {
      try {
        cb(state);
      } catch (err) {
        console.error("State listener error:", err);
      }
    });
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
  }

  function getState() {
    return state;
  }

  function updateState(updater) {
    if (typeof updater === 'function') {
      state = updater(state);
    } else {
      state = { ...state, ...updater };
    }
    recalculateRisk();
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();
  }

  function addLog(title, details, type = "info") {
    const newLog = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      type,
      title,
      details
    };
    state.auditLog.unshift(newLog);
    if (state.auditLog.length > 50) {
      state.auditLog.pop();
    }
  }

  function recalculateRisk() {
    if (!window.SAFEWALK_RISK_ENGINE || !window.SAFEWALK_ROUTE_UTILS) return;

    const j = state.journey;
    if (!j.isActive) return;

    const nearbyHazards = window.SAFEWALK_ROUTE_UTILS.findNearbyHazards(j.currentCoords, state.hazards, 300);
    const nearestSafeZones = window.SAFEWALK_ROUTE_UTILS.findNearestSafeZones(j.currentCoords, state.safeZones, 3);

    const checkInState = {
      isPending: state.checkIn.isPending,
      isExpired: state.checkIn.isExpired,
      lastCheckInTime: state.checkIn.lastCheckInTime
    };

    const previousStatus = state.risk.status;

    const newRisk = window.SAFEWALK_RISK_ENGINE.calculateSafetyRisk({
      timeOfDay: j.simulatedHour !== null ? j.simulatedHour : new Date(),
      deviationMeters: j.deviationMeters || 0,
      stationarySeconds: j.stationarySeconds || 0,
      checkInState,
      nearbyHazards,
      nearestSafeZones,
      elapsedMinutes: Math.floor(j.elapsedSeconds / 60),
      expectedDurationMinutes: j.expectedDurationMinutes || 15,
      isEmergencyMode: state.emergency.isEmergencyDispatched,
      isCantTalkMode: state.emergency.isCantTalkMode
    });

    state.risk = newRisk;

    // Run Phase 2 AI Safety Intelligence Layer
    if (window.SAFEWALK_SAFETY_INTELLIGENCE) {
      state.aiIntelligence = window.SAFEWALK_SAFETY_INTELLIGENCE.analyzeSafety(state);
    }

    // Trigger audio cues if status escalates
    if (window.SAFEWALK_AUDIO_ENGINE) {
      if (newRisk.status === "RED" && previousStatus !== "RED") {
        window.SAFEWALK_AUDIO_ENGINE.startEmergencySiren();
        window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance("Warning. Potential danger detected. Safety status escalated to red.");
      } else if (newRisk.status === "YELLOW" && previousStatus === "GREEN") {
        window.SAFEWALK_AUDIO_ENGINE.playWarningTone();
        window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance("Attention. Route deviation or hazard proximity detected.");
      } else if (newRisk.status === "GREEN" && previousStatus !== "GREEN") {
        window.SAFEWALK_AUDIO_ENGINE.stopEmergencySiren();
      }
    }
  }

  // Action methods
  function startJourney(params = {}) {
    const initialData = window.SAFEWALK_INITIAL_DATA || {};
    const route = params.route || initialData.presetRoutes[0];

    state.journey = {
      ...state.journey,
      id: "journey_" + Date.now(),
      isActive: true,
      isPaused: false,
      isCompleted: false,
      routeId: route.id,
      startName: params.startName || route.startName,
      destName: params.destName || route.destName,
      startCoords: route.startCoords,
      destCoords: route.destCoords,
      waypoints: route.waypoints,
      currentCoords: [...route.startCoords],
      currentWaypointIndex: 0,
      historyTrail: [[...route.startCoords]],
      startTime: new Date().toISOString(),
      expectedDurationMinutes: params.expectedDurationMinutes || route.expectedDurationMinutes,
      elapsedSeconds: 0,
      distanceCoveredMeters: 0,
      remainingDistanceMeters: window.SAFEWALK_ROUTE_UTILS.calculateTotalRouteDistance(route.waypoints),
      progressPct: 0,
      isDeviated: false,
      deviationMeters: 0,
      stationarySeconds: 0,
      isGPSLive: !!params.isGPSLive,
      isSimulationMode: !params.isGPSLive
    };

    state.checkIn = {
      ...state.checkIn,
      isModalOpen: false,
      countdownSeconds: 25,
      lastCheckInTime: new Date().toISOString(),
      totalCheckInsDone: 0,
      nextCheckInCountdown: 45,
      isPending: false,
      isExpired: false
    };

    state.emergency = {
      ...state.emergency,
      isCountdownActive: false,
      countdownSeconds: 5,
      isEmergencyDispatched: false,
      isCantTalkMode: false,
      activeAlert: null
    };

    addLog("Safety Journey Started", `Heading to ${state.journey.destName}. AI Safety Intelligence monitoring active.`, "journey");
    recalculateRisk();
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();

    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance(`SafeWalk AI activated. Monitoring journey to ${state.journey.destName}.`);
    }
  }

  function updateCurrentLocation(coords) {
    if (!state.journey.isActive) return;

    const j = state.journey;
    const prevCoords = j.currentCoords;
    j.currentCoords = coords;
    j.historyTrail.push(coords);

    // Calculate deviation
    const deviation = window.SAFEWALK_ROUTE_UTILS.calculateRouteDeviation(coords, j.waypoints);
    j.deviationMeters = deviation;
    j.isDeviated = deviation > 45;

    // Movement / stationary check
    const stepDist = window.SAFEWALK_ROUTE_UTILS.calculateDistanceMeters(prevCoords, coords);
    if (stepDist < 2) {
      j.stationarySeconds += 2;
    } else {
      j.stationarySeconds = 0;
    }

    // Progress
    j.progressPct = window.SAFEWALK_ROUTE_UTILS.calculateJourneyProgress(coords, j.waypoints);
    j.remainingDistanceMeters = window.SAFEWALK_ROUTE_UTILS.calculateDistanceMeters(coords, j.destCoords);

    if (j.remainingDistanceMeters < 25 && !j.isCompleted) {
      completeJourney();
      return;
    }

    recalculateRisk();
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();
  }

  function promptCheckIn() {
    state.checkIn.isModalOpen = true;
    state.checkIn.countdownSeconds = state.checkIn.maxCountdownSeconds;
    state.checkIn.isPending = true;
    state.checkIn.isExpired = false;

    addLog("Smart Check-In Requested", "App prompted: 'Are you okay?'", "checkin");
    recalculateRisk();
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();

    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.playCheckInChime();
      window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance("Are you okay? Please confirm your safety check-in.");
    }
  }

  function respondCheckIn(response) {
    // response: "safe" | "help" | "cant_talk"
    state.checkIn.isModalOpen = false;
    state.checkIn.isPending = false;

    if (response === "safe") {
      state.checkIn.lastCheckInTime = new Date().toISOString();
      state.checkIn.totalCheckInsDone += 1;
      state.checkIn.nextCheckInCountdown = state.checkIn.checkInIntervalSeconds;
      state.checkIn.isExpired = false;

      addLog("Check-In Confirmed: Safe", `User confirmed safety. Next check-in in ${Math.round(state.checkIn.checkInIntervalSeconds)}s.`, "checkin");
      recalculateRisk();
      persistState();
      broadcast("STATE_SYNC", state);
      notifyListeners();

      if (window.SAFEWALK_AUDIO_ENGINE) {
        window.SAFEWALK_AUDIO_ENGINE.playCheckInChime();
      }
    } else if (response === "help") {
      addLog("Check-In Response: Need Help", "User requested immediate emergency assistance.", "emergency");
      triggerEmergency("User requested help via Smart Check-In");
    } else if (response === "cant_talk") {
      activateCantTalkMode();
    }
  }

  function expireCheckInTimeout() {
    state.checkIn.isExpired = true;
    state.checkIn.isModalOpen = false;
    state.checkIn.isPending = false;

    addLog("Smart Check-In Expired", "No response received within timeout window. Initiating emergency escalation.", "emergency");
    startEmergencyCountdown("Missed safety check-in during active journey");
  }

  function startEmergencyCountdown(reason = "Emergency SOS Triggered") {
    state.emergency.isCountdownActive = true;
    state.emergency.countdownSeconds = 5;
    state.emergency.pendingReason = reason;

    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();

    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.playCountdownTick(900);
      window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance("Emergency countdown initiated. 5 seconds to cancel.");
    }
  }

  function cancelEmergencyCountdown() {
    state.emergency.isCountdownActive = false;
    state.emergency.countdownSeconds = 5;
    state.emergency.pendingReason = null;
    state.checkIn.isExpired = false;

    addLog("Emergency Alert Cancelled", "Countdown cancelled by user. Safe status restored.", "info");
    recalculateRisk();
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();

    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.stopEmergencySiren();
    }
  }

  function triggerEmergency(reason = "Emergency Assistance Triggered") {
    state.emergency.isCountdownActive = false;
    state.emergency.isEmergencyDispatched = true;

    // Run AI alert assessment
    let aiAssessment = null;
    if (window.SAFEWALK_SAFETY_INTELLIGENCE) {
      const fullAi = window.SAFEWALK_SAFETY_INTELLIGENCE.analyzeSafety(state);
      aiAssessment = fullAi.alertAssessment;
    }

    const j = state.journey;
    const alertEvent = {
      id: "alert_" + Date.now(),
      journeyId: j.id,
      userName: state.user.name,
      userPhone: state.user.phone,
      contactName: state.user.trustedContact.name,
      contactPhone: state.user.trustedContact.phone,
      timestamp: new Date().toISOString(),
      reason,
      location: {
        coords: [...j.currentCoords],
        address: `${j.currentCoords[0].toFixed(5)}, ${j.currentCoords[1].toFixed(5)}`,
        nearestLandmark: j.isDeviated ? "Off-Route (Near Alleyway)" : "En-route to " + j.destName
      },
      destination: j.destName,
      elapsedMinutes: Math.floor(j.elapsedSeconds / 60),
      riskScore: 95,
      status: "ACTIVE",
      aiAssessment,
      timeline: [
        { time: new Date().toISOString(), text: `Emergency Alert Created: ${reason}` }
      ]
    };

    state.emergency.activeAlert = alertEvent;
    state.emergency.alertHistory.unshift(alertEvent);

    addLog("🚨 EMERGENCY ALERT DISPATCHED", `Dispatched AI-prioritized alert to ${state.user.trustedContact.name}. Priority: ${aiAssessment?.priority || 'CRITICAL'}`, "emergency");
    recalculateRisk();
    persistState();
    broadcast("EMERGENCY_TRIGGERED", alertEvent);
    notifyListeners();

    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.startEmergencySiren();
      window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance(`Emergency alert dispatched to ${state.user.trustedContact.name}. Sharing live GPS location.`);
    }
  }

  function activateCantTalkMode() {
    state.emergency.isCantTalkMode = true;
    state.emergency.isEmergencyDispatched = true;

    let aiAssessment = null;
    if (window.SAFEWALK_SAFETY_INTELLIGENCE) {
      const fullAi = window.SAFEWALK_SAFETY_INTELLIGENCE.analyzeSafety(state);
      aiAssessment = fullAi.alertAssessment;
    }

    const j = state.journey;
    const alertEvent = {
      id: "alert_silent_" + Date.now(),
      journeyId: j.id,
      userName: state.user.name,
      userPhone: state.user.phone,
      contactName: state.user.trustedContact.name,
      contactPhone: state.user.trustedContact.phone,
      timestamp: new Date().toISOString(),
      reason: "SILENT SOS: User activated 'I Can't Talk' Emergency Mode",
      location: {
        coords: [...j.currentCoords],
        address: `${j.currentCoords[0].toFixed(5)}, ${j.currentCoords[1].toFixed(5)}`,
        nearestLandmark: "Silent distress signal captured"
      },
      destination: j.destName,
      elapsedMinutes: Math.floor(j.elapsedSeconds / 60),
      riskScore: 98,
      status: "ACTIVE_SILENT",
      aiAssessment,
      timeline: [
        { time: new Date().toISOString(), text: "I Can't Talk Silent SOS Initiated" }
      ]
    };

    state.emergency.activeAlert = alertEvent;
    state.emergency.alertHistory.unshift(alertEvent);

    addLog("🚨 SILENT SOS: 'I Can't Talk' Activated", "Zero-typing emergency mode active. Safe zones mapped.", "emergency");
    recalculateRisk();
    persistState();
    broadcast("EMERGENCY_TRIGGERED", alertEvent);
    notifyListeners();
  }

  function sendSilentQuickUpdate(msg) {
    if (!state.emergency.activeAlert) return;
    const entry = {
      time: new Date().toISOString(),
      text: `User silent update: "${msg}"`
    };
    state.emergency.activeAlert.timeline.unshift(entry);
    addLog("Silent Update Sent", msg, "emergency");
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();
  }

  function resolveAlert(resolutionNotes = "Marked resolved by trusted contact") {
    if (state.emergency.activeAlert) {
      state.emergency.activeAlert.status = "RESOLVED";
      state.emergency.activeAlert.timeline.unshift({
        time: new Date().toISOString(),
        text: `Alert Resolved: ${resolutionNotes}`
      });
    }
    state.emergency.isEmergencyDispatched = false;
    state.emergency.isCantTalkMode = false;
    state.checkIn.isExpired = false;

    addLog("Alert Resolved", resolutionNotes, "info");
    recalculateRisk();
    persistState();
    broadcast("ALERT_RESOLVED", { resolutionNotes });
    notifyListeners();

    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.stopEmergencySiren();
    }
  }

  function completeJourney() {
    state.journey.isActive = false;
    state.journey.isCompleted = true;
    state.journey.progressPct = 100;

    addLog("Journey Successfully Completed", `Arrived safely at ${state.journey.destName}.`, "journey");
    state.risk = {
      score: 5,
      status: "GREEN",
      statusLabel: "SAFE",
      statusSublabel: "Journey complete. You have arrived safely at your destination.",
      accentColor: "emerald",
      factors: [],
      summary: "Completed safely."
    };
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();

    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.playCheckInChime();
      window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance("You have arrived safely at your destination. SafeWalk journey completed.");
    }
  }

  function reportHazard(hazardData) {
    const newHazard = {
      id: "hz_" + Date.now(),
      category: hazardData.category || "Other safety concern",
      categoryKey: hazardData.categoryKey || "other",
      severity: hazardData.severity || "Medium",
      description: hazardData.description || "Reported community hazard",
      coords: hazardData.coords || [...state.journey.currentCoords],
      timestamp: new Date().toISOString(),
      reportedBy: "Community Reporter (" + state.user.name + ")",
      upvotes: 1,
      radiusMeters: hazardData.severity === "High" ? 200 : 120
    };

    state.hazards.unshift(newHazard);
    addLog("Community Hazard Reported", `${newHazard.category} (${newHazard.severity}) added to live safety map.`, "hazard");
    recalculateRisk();
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();

    return newHazard;
  }

  function resetAll() {
    state = getDefaultState();
    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.stopEmergencySiren();
    }
    persistState();
    broadcast("STATE_SYNC", state);
    notifyListeners();
  }

  return {
    getState,
    updateState,
    subscribe,
    startJourney,
    updateCurrentLocation,
    promptCheckIn,
    respondCheckIn,
    expireCheckInTimeout,
    startEmergencyCountdown,
    cancelEmergencyCountdown,
    triggerEmergency,
    activateCantTalkMode,
    sendSilentQuickUpdate,
    resolveAlert,
    completeJourney,
    reportHazard,
    recalculateRisk,
    addLog,
    resetAll
  };
})();
