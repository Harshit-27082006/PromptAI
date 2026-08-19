/**
 * SafeWalk AI - Main Root Application Component
 * Enhanced with Phase 2 AI Safety Intelligence Layer.
 */

window.SAFEWALK_APP = function() {
  const [state, setState] = React.useState(window.SAFEWALK_STORE.getState());
  const h = React.createElement;

  React.useEffect(() => {
    const unsubscribe = window.SAFEWALK_STORE.subscribe(newState => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Periodic Journey Ticking & Check-in countdowns
  React.useEffect(() => {
    const interval = setInterval(() => {
      const current = window.SAFEWALK_STORE.getState();
      if (!current.journey.isActive || current.journey.isPaused || current.journey.isCompleted) return;

      window.SAFEWALK_STORE.updateState(s => {
        const nextElapsed = s.journey.elapsedSeconds + 1;
        let nextCheckInCountdown = s.checkIn.nextCheckInCountdown - 1;

        // Trigger Smart Check-In when counter reaches 0
        if (nextCheckInCountdown <= 0 && !s.checkIn.isModalOpen && !s.emergency.isEmergencyDispatched && !s.emergency.isCountdownActive) {
          setTimeout(() => {
            window.SAFEWALK_STORE.promptCheckIn();
          }, 0);
          nextCheckInCountdown = s.checkIn.checkInIntervalSeconds;
        }

        return {
          ...s,
          journey: {
            ...s.journey,
            elapsedSeconds: nextElapsed
          },
          checkIn: {
            ...s.checkIn,
            nextCheckInCountdown: Math.max(0, nextCheckInCountdown)
          }
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectView = (view) => {
    window.SAFEWALK_STORE.updateState(s => ({ ...s, activeView: view }));
  };

  const handleToggleMute = () => {
    if (window.SAFEWALK_AUDIO_ENGINE) {
      const muted = window.SAFEWALK_AUDIO_ENGINE.toggleMute();
      window.SAFEWALK_STORE.updateState(s => ({ ...s, soundMuted: muted }));
    }
  };

  return h('div', { className: 'min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950' }, [
    // Global Top Navbar
    h(window.SAFEWALK_NAVBAR, {
      state,
      onSelectView: handleSelectView,
      onToggleMute: handleToggleMute
    }),

    // Main App Container
    h('main', { className: 'flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 space-y-5' }, [
      // 1. Always visible top safety banner
      h(window.SAFEWALK_SAFETY_BANNER, { state }),

      // 2. View Switching Content
      state.activeView === 'trusted_dashboard'
        ? h(window.SAFEWALK_TRUSTED_DASHBOARD, { state })
        : state.activeView === 'demo_tour'
        ? h('div', { className: 'space-y-5' }, [
            h(window.SAFEWALK_DEMO_TOOLBAR, { state, onSelectView: handleSelectView }),
            h(window.SAFEWALK_AI_PANEL, { state }),
            h('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-5' }, [
              h('div', { className: 'lg:col-span-2 space-y-4' }, [
                h(window.SAFEWALK_MAP, { state })
              ]),
              h('div', { className: 'space-y-4' }, [
                state.journey.isActive && h(window.SAFEWALK_ACTIVE_JOURNEY, { state }),
                h(window.SAFEWALK_SAFE_ZONES_PANEL, { state })
              ])
            ])
          ])
        : state.emergency.isCantTalkMode
        ? h(window.SAFEWALK_CANT_TALK_VIEW, {
            state,
            onResolve: () => window.SAFEWALK_STORE.resolveAlert("User confirmed safe status")
          })
        : !state.journey.isActive
        ? h('div', { className: 'space-y-5' }, [
            h('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-start' }, [
              h(window.SAFEWALK_JOURNEY_PLANNER, { state }),
              h('div', { className: 'space-y-4' }, [
                h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl' }, [
                  h('div', { className: 'text-xs font-bold text-slate-300 uppercase tracking-wider mb-2' }, 'Preview Area Safe Havens & AI Routes'),
                  h(window.SAFEWALK_MAP, { state })
                ]),
                h(window.SAFEWALK_SAFE_ZONES_PANEL, { state })
              ])
            ]),
            h(window.SAFEWALK_AI_PANEL, { state })
          ])
        : h('div', { className: 'space-y-5' }, [
            // Phase 2 AI Safety Intelligence Dashboard
            h(window.SAFEWALK_AI_PANEL, { state }),

            h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-5' }, [
              // Left Column: Active Walk Telemetry & Actions (5 cols on lg)
              h('div', { className: 'lg:col-span-5 space-y-4' }, [
                h(window.SAFEWALK_ACTIVE_JOURNEY, { state }),
                h(window.SAFEWALK_SAFE_ZONES_PANEL, { state })
              ]),

              // Right Column: Interactive Map & Community Hazards (7 cols on lg)
              h('div', { className: 'lg:col-span-7 space-y-4' }, [
                h(window.SAFEWALK_MAP, { state }),
                h(window.SAFEWALK_COMMUNITY_HAZARDS, { state })
              ])
            ])
          ]),

      // 3. Global Floating Demo Bar (Quick Access at bottom right)
      state.activeView !== 'demo_tour' && h('div', {
        className: 'fixed bottom-4 right-4 z-30'
      }, [
        h('button', {
          onClick: () => handleSelectView('demo_tour'),
          className: 'px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-2xl shadow-amber-600/50 border border-amber-400 flex items-center gap-2 transition transform hover:scale-105'
        }, [
          h(window.SAFEWALK_ICONS.Zap, { className: 'w-4 h-4 text-amber-200' }),
          h('span', null, '⚡ Hackathon Demo Suite')
        ])
      ])
    ]),

    // Global Interactive Modals
    h(window.SAFEWALK_SMART_CHECKIN_MODAL, { state }),
    h(window.SAFEWALK_EMERGENCY_COUNTDOWN, { state }),

    // Footer
    h('footer', { className: 'border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-400' }, [
      h('div', { className: 'flex items-center justify-center gap-2 flex-wrap' }, [
        h('span', { className: 'font-semibold text-slate-300' }, 'SafeWalk AI v2.0'),
        h('span', null, '•'),
        h('span', null, 'PromptWar Hackathon ("Safety Net" Theme)'),
        h('span', null, '•'),
        h('span', { className: 'text-slate-400' }, 'AI Predictive Safety Intelligence')
      ])
    ])
  ]);
};
