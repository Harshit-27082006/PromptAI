/**
 * SafeWalk AI - Hackathon Demo Controller & Guided Scenario Engine
 * Extended with Phase 2 AI Intelligence Scenarios (Scenarios 6 - 10).
 */

window.SAFEWALK_DEMO_TOOLBAR = function(props) {
  const { state, onSelectView } = props;
  const Icons = window.SAFEWALK_ICONS;
  const initialData = window.SAFEWALK_INITIAL_DATA || {};
  const h = React.createElement;

  const [activeScenario, setActiveScenario] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [guidedTourStep, setGuidedTourStep] = React.useState(0);
  const timerRef = React.useRef(null);

  const defaultRoute = (initialData.presetRoutes || [])[0];

  // Phase 1 Scenarios
  const runScenario1_Normal = () => {
    stopAutoPlay();
    setActiveScenario("scenario_1");
    window.SAFEWALK_STORE.startJourney({
      route: defaultRoute,
      expectedDurationMinutes: 18,
      isGPSLive: false
    });
    window.SAFEWALK_STORE.updateState(s => ({
      ...s,
      journey: {
        ...s.journey,
        simulatedHour: 15
      }
    }));
    window.SAFEWALK_STORE.addLog("Scenario 1 Started", "Simulating regular daytime walk. Expected status: GREEN.", "info");
    startWalkingSimulation(defaultRoute.waypoints);
  };

  const runScenario2_Deviation = () => {
    stopAutoPlay();
    setActiveScenario("scenario_2");
    window.SAFEWALK_STORE.startJourney({
      route: defaultRoute,
      expectedDurationMinutes: 18,
      isGPSLive: false
    });
    const devCoords = defaultRoute.deviationWaypoints[1];
    window.SAFEWALK_STORE.updateState(s => ({
      ...s,
      journey: {
        ...s.journey,
        simulatedHour: 23,
        currentCoords: devCoords,
        historyTrail: [...defaultRoute.waypoints.slice(0, 3), devCoords]
      }
    }));
    window.SAFEWALK_STORE.updateCurrentLocation(devCoords);
    window.SAFEWALK_STORE.addLog("Scenario 2 Started", "Walker turned off-path into unlit alleyway. Expected status: YELLOW.", "info");
  };

  const runScenario3_MissedCheckIn = () => {
    stopAutoPlay();
    setActiveScenario("scenario_3");
    runScenario2_Deviation();
    setTimeout(() => {
      window.SAFEWALK_STORE.promptCheckIn();
      window.SAFEWALK_STORE.addLog("Scenario 3 Escalation", "Prompting Smart Check-In. Simulating missed response.", "checkin");
      setTimeout(() => {
        if (window.SAFEWALK_STORE.getState().checkIn.isPending) {
          window.SAFEWALK_STORE.expireCheckInTimeout();
        }
      }, 4000);
    }, 1200);
  };

  const runScenario4_CantTalkSOS = () => {
    stopAutoPlay();
    setActiveScenario("scenario_4");
    if (!state.journey.isActive) {
      window.SAFEWALK_STORE.startJourney({ route: defaultRoute, isGPSLive: false });
    }
    window.SAFEWALK_STORE.activateCantTalkMode();
  };

  const runScenario5_HazardInjection = () => {
    const coords = state.journey.currentCoords || defaultRoute.startCoords;
    const offsetCoords = [coords[0] + 0.0005, coords[1] + 0.0005];
    window.SAFEWALK_STORE.reportHazard({
      category: "Suspicious activity",
      categoryKey: "suspicious_activity",
      severity: "High",
      description: "Aggressive individuals loitering near unlit underpass.",
      coords: offsetCoords
    });
  };

  // Phase 2 AI Intelligence Scenarios
  // SCENARIO 6: "AI Predicts Rising Risk"
  const runScenario6_AIPredictsRisingRisk = () => {
    stopAutoPlay();
    setActiveScenario("scenario_6");
    window.SAFEWALK_STORE.startJourney({
      route: defaultRoute,
      expectedDurationMinutes: 18,
      isGPSLive: false
    });
    // Moderate deviation + late night -> current risk ~38, predicted ~71
    const devCoords = defaultRoute.deviationWaypoints[1];
    window.SAFEWALK_STORE.updateState(s => ({
      ...s,
      journey: {
        ...s.journey,
        simulatedHour: 23,
        currentCoords: devCoords,
        historyTrail: [...defaultRoute.waypoints.slice(0, 2), devCoords]
      }
    }));
    window.SAFEWALK_STORE.updateCurrentLocation(devCoords);
    window.SAFEWALK_STORE.addLog("Scenario 6: AI Prediction", "AI neural model forecasts rising risk trajectory (38 → 71 in next 5 min).", "info");
    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance("AI Safety Warning: Risk is predicted to increase if current off-route trajectory continues.");
    }
  };

  // SCENARIO 7: "AI Safer Route Recommendation"
  const runScenario7_AIRouteAdvisor = () => {
    stopAutoPlay();
    setActiveScenario("scenario_7");
    if (!state.journey.isActive) {
      window.SAFEWALK_STORE.startJourney({ route: defaultRoute, isGPSLive: false });
    }
    window.SAFEWALK_STORE.addLog("Scenario 7: Route Advisor", "Evaluated 3 candidate paths. Recommending Route B (High Safety Score 86/100).", "journey");
    if (window.SAFEWALK_AUDIO_ENGINE) {
      window.SAFEWALK_AUDIO_ENGINE.speakVoiceGuidance("AI recommends alternate commercial avenue with verified safe havens.");
    }
  };

  // SCENARIO 8: "Behavior Anomaly"
  const runScenario8_BehaviorAnomaly = () => {
    stopAutoPlay();
    setActiveScenario("scenario_8");
    window.SAFEWALK_STORE.startJourney({
      route: defaultRoute,
      isGPSLive: false
    });
    // Simulate sudden stop + backtracking
    const trail = [
      defaultRoute.waypoints[0],
      defaultRoute.waypoints[1],
      defaultRoute.waypoints[2],
      defaultRoute.waypoints[1] // backtrack
    ];
    window.SAFEWALK_STORE.updateState(s => ({
      ...s,
      journey: {
        ...s.journey,
        historyTrail: trail,
        currentCoords: defaultRoute.waypoints[1],
        stationarySeconds: 95,
        simulatedHour: 23
      }
    }));
    window.SAFEWALK_STORE.recalculateRisk();
    window.SAFEWALK_STORE.addLog("Scenario 8: Behavior Anomaly", "Stationary for 95s + backtracking detected. Anomaly Score: 82. Triggering check-in.", "emergency");
    setTimeout(() => {
      window.SAFEWALK_STORE.promptCheckIn();
    }, 800);
  };

  // SCENARIO 9: "Emerging Community Risk"
  const runScenario9_HazardCluster = () => {
    stopAutoPlay();
    setActiveScenario("scenario_9");
    const center = defaultRoute.waypoints[2];

    // Inject cluster of 3 hazards
    const h1 = {
      category: "Broken streetlight",
      categoryKey: "broken_light",
      severity: "High",
      description: "Pitch black street lights out along corridor.",
      coords: [center[0] + 0.0003, center[1] - 0.0002]
    };
    const h2 = {
      category: "Broken streetlight",
      categoryKey: "broken_light",
      severity: "High",
      description: "Non-functional illumination at corner intersection.",
      coords: [center[0] + 0.0005, center[1] - 0.0004]
    };
    const h3 = {
      category: "Harassment report",
      categoryKey: "harassment_report",
      severity: "High",
      description: "Aggressive individuals shouting at passersby.",
      coords: [center[0] + 0.0004, center[1] - 0.0003]
    };

    window.SAFEWALK_STORE.reportHazard(h1);
    window.SAFEWALK_STORE.reportHazard(h2);
    window.SAFEWALK_STORE.reportHazard(h3);

    window.SAFEWALK_STORE.addLog("Scenario 9: Hazard Cluster", "AI detected Emerging Risk Area cluster (3 high-severity reports within 250m).", "hazard");
  };

  // SCENARIO 10: "Smart Emergency Prioritization"
  const runScenario10_SmartAlertPriority = () => {
    stopAutoPlay();
    setActiveScenario("scenario_10");
    runScenario2_Deviation();
    setTimeout(() => {
      window.SAFEWALK_STORE.activateCantTalkMode();
      window.SAFEWALK_STORE.addLog("Scenario 10: Smart Alert", "AI classified incident as CRITICAL (Silent SOS + Route Deviation + High Risk).", "emergency");
    }, 1000);
  };

  // Full 2-Minute Guided Auto Tour
  const runFullGuidedDemo = () => {
    stopAutoPlay();
    setActiveScenario("guided_tour");
    setGuidedTourStep(1);

    // Step 1: Start Normal Journey (GREEN)
    runScenario1_Normal();

    // Step 2: In 5s, Deviate into dark alley (YELLOW & AI Predicts rising risk)
    setTimeout(() => {
      setGuidedTourStep(2);
      runScenario6_AIPredictsRisingRisk();
    }, 5000);

    // Step 3: In 10s, Behavior Anomaly & Check-in
    setTimeout(() => {
      setGuidedTourStep(3);
      window.SAFEWALK_STORE.promptCheckIn();
    }, 10000);

    // Step 4: In 14s, Check-in expires -> Emergency Countdown (RED)
    setTimeout(() => {
      setGuidedTourStep(4);
      window.SAFEWALK_STORE.expireCheckInTimeout();
    }, 14000);

    // Step 5: In 20s, CRITICAL Alert dispatched to Trusted Contact Dashboard
    setTimeout(() => {
      setGuidedTourStep(5);
    }, 20000);
  };

  const startWalkingSimulation = (pts) => {
    if (timerRef.current) clearInterval(timerRef.current);
    let idx = 0;
    setIsPlaying(true);

    timerRef.current = setInterval(() => {
      idx = (idx + 1) % pts.length;
      setStepIndex(idx);
      window.SAFEWALK_STORE.updateCurrentLocation(pts[idx]);
      window.SAFEWALK_STORE.updateState(s => ({
        ...s,
        journey: {
          ...s.journey,
          elapsedSeconds: s.journey.elapsedSeconds + 15
        }
      }));
    }, 1500);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    const pts = defaultRoute.waypoints;
    const next = (stepIndex + 1) % pts.length;
    setStepIndex(next);
    window.SAFEWALK_STORE.updateCurrentLocation(pts[next]);
  };

  const handleStepBack = () => {
    const pts = defaultRoute.waypoints;
    const prev = (stepIndex - 1 + pts.length) % pts.length;
    setStepIndex(prev);
    window.SAFEWALK_STORE.updateCurrentLocation(pts[prev]);
  };

  return h('div', { className: 'w-full max-w-6xl mx-auto space-y-4 animate-fadeIn' }, [
    // Top Bar: Demo Suite Info & Reset
    h('div', { className: 'bg-slate-900/90 rounded-2xl border border-amber-500/40 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
      h('div', { className: 'flex items-center gap-3' }, [
        h('div', { className: 'w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30' }, [
          h(Icons.Zap, { className: 'w-5 h-5' })
        ]),
        h('div', null, [
          h('div', { className: 'flex items-center gap-2' }, [
            h('h2', { className: 'text-base sm:text-lg font-black text-white' }, 'Hackathon Demo Suite & AI Scenario Engine'),
            h('span', { className: 'text-[10px] uppercase font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full' }, 'Judge Panel')
          ]),
          h('p', { className: 'text-xs text-slate-400' },
            'Execute 1-click test scenarios to evaluate how the predictive AI risk engine, route advisor, and behavior anomaly models respond in real time.'
          )
        ])
      ]),

      h('button', {
        onClick: () => {
          stopAutoPlay();
          window.SAFEWALK_STORE.resetAll();
          setActiveScenario(null);
          setGuidedTourStep(0);
        },
        className: 'px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto'
      }, [
        h(Icons.RefreshCw, { className: 'w-3.5 h-3.5' }),
        h('span', null, 'Reset Demo State')
      ])
    ]),

    // Phase 2 AI Intelligence Scenarios Section
    h('div', { className: 'space-y-2' }, [
      h('div', { className: 'flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-wider' }, [
        h(Icons.Zap, { className: 'w-4 h-4 text-cyan-400' }),
        h('span', null, 'Phase 2 AI Intelligence Scenarios (Scenarios 6 – 10)')
      ]),

      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' }, [
        // Scenario 6: AI Predicts Rising Risk
        h('button', {
          onClick: runScenario6_AIPredictsRisingRisk,
          className: `p-3.5 rounded-2xl border text-left transition ${
            activeScenario === 'scenario_6'
              ? 'bg-indigo-950/90 border-indigo-400 shadow-lg shadow-indigo-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50'
          }`
        }, [
          h('div', { className: 'flex items-center justify-between' }, [
            h('span', { className: 'text-xs font-extrabold text-indigo-400 uppercase tracking-wider' }, '🔮 Scenario 6'),
            h('span', { className: 'text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/30 font-bold' }, 'AI Prediction')
          ]),
          h('div', { className: 'text-sm font-bold text-white mt-1' }, 'AI Predicts Rising Risk'),
          h('p', { className: 'text-[11px] text-slate-400 mt-1 leading-snug' },
            'Trajectory analysis forecasts risk increase (38 → 71 in next 5 mins) before danger occurs.'
          )
        ]),

        // Scenario 7: AI Safer Route Recommendation
        h('button', {
          onClick: runScenario7_AIRouteAdvisor,
          className: `p-3.5 rounded-2xl border text-left transition ${
            activeScenario === 'scenario_7'
              ? 'bg-cyan-950/90 border-cyan-400 shadow-lg shadow-cyan-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50'
          }`
        }, [
          h('div', { className: 'flex items-center justify-between' }, [
            h('span', { className: 'text-xs font-extrabold text-cyan-400 uppercase tracking-wider' }, '🗺️ Scenario 7'),
            h('span', { className: 'text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30 font-bold' }, 'Route Advisor')
          ]),
          h('div', { className: 'text-sm font-bold text-white mt-1' }, 'AI Safer Route Advisor'),
          h('p', { className: 'text-[11px] text-slate-400 mt-1 leading-snug' },
            'Evaluates 3 candidate routes and recommends Route B (High Safety Score 86/100).'
          )
        ]),

        // Scenario 8: Behavior Anomaly
        h('button', {
          onClick: runScenario8_BehaviorAnomaly,
          className: `p-3.5 rounded-2xl border text-left transition ${
            activeScenario === 'scenario_8'
              ? 'bg-amber-950/90 border-amber-400 shadow-lg shadow-amber-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50'
          }`
        }, [
          h('div', { className: 'flex items-center justify-between' }, [
            h('span', { className: 'text-xs font-extrabold text-amber-400 uppercase tracking-wider' }, '🛑 Scenario 8'),
            h('span', { className: 'text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 font-bold' }, 'Behavior AI')
          ]),
          h('div', { className: 'text-sm font-bold text-white mt-1' }, 'Behavior Anomaly Detection'),
          h('p', { className: 'text-[11px] text-slate-400 mt-1 leading-snug' },
            'Detects sudden stop for 90s + backtracking. Anomaly Score jumps to 82.'
          )
        ]),

        // Scenario 9: Emerging Community Risk
        h('button', {
          onClick: runScenario9_HazardCluster,
          className: `p-3.5 rounded-2xl border text-left transition ${
            activeScenario === 'scenario_9'
              ? 'bg-red-950/90 border-red-400 shadow-lg shadow-red-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-red-500/50'
          }`
        }, [
          h('div', { className: 'flex items-center justify-between' }, [
            h('span', { className: 'text-xs font-extrabold text-red-400 uppercase tracking-wider' }, '⚠️ Scenario 9'),
            h('span', { className: 'text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded border border-red-500/30 font-bold' }, 'Cluster AI')
          ]),
          h('div', { className: 'text-sm font-bold text-white mt-1' }, 'Emerging Community Risk'),
          h('p', { className: 'text-[11px] text-slate-400 mt-1 leading-snug' },
            'Detects high-density hazard cluster within 250m -> "Emerging Risk Area" on map.'
          )
        ]),

        // Scenario 10: Smart Emergency Prioritization
        h('button', {
          onClick: runScenario10_SmartAlertPriority,
          className: `p-3.5 rounded-2xl border text-left transition ${
            activeScenario === 'scenario_10'
              ? 'bg-red-950/90 border-red-500 shadow-lg shadow-red-600/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-red-500/50'
          }`
        }, [
          h('div', { className: 'flex items-center justify-between' }, [
            h('span', { className: 'text-xs font-extrabold text-red-400 uppercase tracking-wider' }, '🚨 Scenario 10'),
            h('span', { className: 'text-[10px] bg-red-600 text-white px-2 py-0.2 rounded-full font-black animate-pulse' }, 'CRITICAL ALERT')
          ]),
          h('div', { className: 'text-sm font-bold text-white mt-1' }, 'Smart Alert Prioritization'),
          h('p', { className: 'text-[11px] text-slate-400 mt-1 leading-snug' },
            'Classifies alert as CRITICAL with enriched AI assessment dispatched to Trusted Contact.'
          )
        ]),

        // 🎬 2-Minute Full Guided Demo
        h('button', {
          onClick: runFullGuidedDemo,
          className: 'p-3.5 rounded-2xl border bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-indigo-500 text-left transition shadow-lg shadow-indigo-500/20'
        }, [
          h('div', { className: 'flex items-center justify-between' }, [
            h('span', { className: 'text-xs font-extrabold text-indigo-300 uppercase tracking-wider' }, '🎬 Full AI Story'),
            h('span', { className: 'text-[10px] bg-indigo-500 text-white font-bold px-2 py-0.2 rounded-full' }, 'Judge Tour')
          ]),
          h('div', { className: 'text-sm font-bold text-white mt-1' }, '2-Min Automated Demo Flow'),
          h('p', { className: 'text-[11px] text-indigo-200 mt-1 leading-snug' },
            'Narrated judge walkthrough demonstrating prediction, anomaly detection, and SOS.'
          )
        ])
      ])
    ]),

    // Phase 1 Baseline Scenarios (Collapsible/Grouped)
    h('div', { className: 'space-y-2 pt-2 border-t border-slate-800' }, [
      h('div', { className: 'text-xs font-bold text-slate-400 uppercase tracking-wider' }, 'Phase 1 Baseline Scenarios (Scenarios 1 – 5)'),
      h('div', { className: 'grid grid-cols-2 sm:grid-cols-5 gap-2' }, [
        h('button', {
          onClick: runScenario1_Normal,
          className: 'p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-left'
        }, [
          h('div', { className: 'font-bold text-emerald-400' }, '🟢 Scen. 1: Safe Walk'),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Normal progression')
        ]),
        h('button', {
          onClick: runScenario2_Deviation,
          className: 'p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-left'
        }, [
          h('div', { className: 'font-bold text-amber-400' }, '🟡 Scen. 2: Deviation'),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Off-route detour')
        ]),
        h('button', {
          onClick: runScenario3_MissedCheckIn,
          className: 'p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-left'
        }, [
          h('div', { className: 'font-bold text-red-400' }, '🔴 Scen. 3: Timeout'),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Auto-escalation')
        ]),
        h('button', {
          onClick: runScenario4_CantTalkSOS,
          className: 'p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-left'
        }, [
          h('div', { className: 'font-bold text-purple-400' }, '🤫 Scen. 4: Silent SOS'),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'I Can\'t Talk')
        ]),
        h('button', {
          onClick: runScenario5_HazardInjection,
          className: 'p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-left'
        }, [
          h('div', { className: 'font-bold text-amber-400' }, '⚠️ Scen. 5: Hazard'),
          h('div', { className: 'text-[10px] text-slate-500 mt-0.5' }, 'Report pin')
        ])
      ])
    ]),

    // Guided Tour Progress Banner (if active)
    guidedTourStep > 0 && h('div', {
      className: 'bg-indigo-950/90 border-2 border-indigo-500 p-4 rounded-2xl text-white shadow-xl flex items-center justify-between'
    }, [
      h('div', { className: 'flex items-center gap-3' }, [
        h('div', { className: 'w-8 h-8 rounded-full bg-indigo-600 font-bold flex items-center justify-center text-xs' },
          `${guidedTourStep}/5`
        ),
        h('div', null, [
          h('div', { className: 'text-xs font-bold text-indigo-300 uppercase' }, 'Guided Demo Narrative Progress'),
          h('div', { className: 'text-sm font-extrabold text-white mt-0.5' },
            guidedTourStep === 1 ? "1. Normal walk initiated (GREEN status)." :
            guidedTourStep === 2 ? "2. AI forecasts rising risk trajectory (YELLOW status & trend)." :
            guidedTourStep === 3 ? "3. Behavioral Anomaly detected -> Proactive Smart Check-In requested." :
            guidedTourStep === 4 ? "4. Timeout expired -> 5s Emergency Countdown (RED status)." :
            "5. CRITICAL Alert broadcasted to Trusted Contact Dashboard!"
          )
        ])
      ]),
      h('button', {
        onClick: () => onSelectView('trusted_dashboard'),
        className: 'px-3 py-1.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-slate-100 transition shrink-0'
      }, 'Switch to Dashboard →')
    ]),

    // Manual Step Simulation & Speed Controls
    h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-wrap items-center justify-between gap-3' }, [
      h('div', { className: 'flex items-center gap-2' }, [
        h('span', { className: 'text-xs font-bold text-slate-300 uppercase' }, 'Manual GPS Step Control:'),
        h('button', {
          onClick: handleStepBack,
          className: 'px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition'
        }, '◀ Step Back'),
        h('button', {
          onClick: handleStepForward,
          className: 'px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition'
        }, 'Step Forward ▶'),
        h('button', {
          onClick: isPlaying ? stopAutoPlay : () => startWalkingSimulation(defaultRoute.waypoints),
          className: `px-3 py-1 rounded-lg text-xs font-bold transition ${
            isPlaying ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
          }`
        }, isPlaying ? 'Pause Walk' : 'Auto-Play Walk')
      ]),

      h('div', { className: 'flex items-center gap-2 text-xs' }, [
        h('span', { className: 'text-slate-400' }, 'Time of Day:'),
        h('select', {
          value: state.journey.simulatedHour || 23,
          onChange: (e) => {
            const hVal = parseInt(e.target.value, 10);
            window.SAFEWALK_STORE.updateState(s => ({
              ...s,
              journey: { ...s.journey, simulatedHour: hVal }
            }));
          },
          className: 'bg-slate-800 text-white rounded-lg px-2 py-1 border border-slate-700 text-xs'
        }, [
          h('option', { value: 14 }, '2:00 PM (Day)'),
          h('option', { value: 20 }, '8:00 PM (Dusk)'),
          h('option', { value: 23 }, '11:00 PM (Night)'),
          h('option', { value: 2 }, '2:00 AM (Deep Night)')
        ])
      ])
    ])
  ]);
};
