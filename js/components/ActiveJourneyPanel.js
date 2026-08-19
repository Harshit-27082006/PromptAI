/**
 * SafeWalk AI - Active Journey Control & Safety Actions Panel
 */

window.SAFEWALK_ACTIVE_JOURNEY = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const j = state.journey;
  const risk = state.risk;

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const elapsedStr = formatTime(j.elapsedSeconds);
  const remainingMins = Math.max(1, Math.round(j.remainingDistanceMeters / 80)); // ~80m/min walking

  const handleManualCheckIn = () => {
    window.SAFEWALK_STORE.promptCheckIn();
  };

  const handleSOS = () => {
    window.SAFEWALK_STORE.startEmergencyCountdown("Emergency SOS button pressed by user");
  };

  const handleCantTalk = () => {
    window.SAFEWALK_STORE.activateCantTalkMode();
  };

  const handleRecalculate = () => {
    // Recalculates route with current position as new waypoint
    window.SAFEWALK_STORE.updateState(s => {
      const current = s.journey.currentCoords;
      const dest = s.journey.destCoords;
      const newWaypoints = [current, [ (current[0]+dest[0])/2, (current[1]+dest[1])/2 ], dest];
      return {
        ...s,
        journey: {
          ...s.journey,
          waypoints: newWaypoints,
          isDeviated: false,
          deviationMeters: 0
        }
      };
    });
    window.SAFEWALK_STORE.addLog("Route Recalculated", "Planned path updated to align with current position.", "journey");
  };

  const handleEndJourney = () => {
    window.SAFEWALK_STORE.completeJourney();
  };

  return h('div', { className: 'w-full space-y-4' }, [
    // 1. Route Deviation Warning Banner (if off route)
    j.isDeviated && h('div', {
      className: 'bg-amber-950/80 border border-amber-500/50 rounded-2xl p-4 text-amber-200 shadow-xl backdrop-blur-md animate-bounce-subtle'
    }, [
      h('div', { className: 'flex items-start gap-3' }, [
        h('div', { className: 'w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0' }, [
          h(Icons.AlertTriangle, { className: 'w-5 h-5' })
        ]),
        h('div', { className: 'flex-1' }, [
          h('div', { className: 'flex items-center gap-2' }, [
            h('span', { className: 'font-bold text-white text-sm' }, 'Route Deviation Detected'),
            h('span', { className: 'text-[10px] uppercase font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded' },
              `${Math.round(j.deviationMeters)}m Off Path`
            )
          ]),
          h('p', { className: 'text-xs text-amber-300 mt-1 leading-relaxed' },
            '“You appear to have moved away from your planned route.” Please confirm your status or adjust route.'
          ),

          // Actions
          h('div', { className: 'flex flex-wrap gap-2 mt-3' }, [
            h('button', {
              onClick: () => window.SAFEWALK_STORE.respondCheckIn('safe'),
              className: 'px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow'
            }, [
              h(Icons.Check, { className: 'w-3.5 h-3.5' }),
              h('span', null, "I'm Safe (Continue)")
            ]),
            h('button', {
              onClick: handleRecalculate,
              className: 'px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5'
            }, [
              h(Icons.RefreshCw, { className: 'w-3.5 h-3.5' }),
              h('span', null, 'Recalculate Route')
            ]),
            h('button', {
              onClick: () => handleSOS(),
              className: 'px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow'
            }, [
              h(Icons.ShieldAlert, { className: 'w-3.5 h-3.5' }),
              h('span', null, 'Need Help')
            ])
          ])
        ])
      ])
    ]),

    // 2. Main Live Journey Dashboard Card
    h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4' }, [
      // Top Row: Origin -> Destination
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800' }, [
        h('div', { className: 'flex items-center gap-2.5 min-w-0' }, [
          h('div', { className: 'w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0' }, [
            h(Icons.Navigation, { className: 'w-4 h-4' })
          ]),
          h('div', { className: 'min-w-0' }, [
            h('div', { className: 'text-[11px] uppercase tracking-wider text-slate-400 font-semibold' }, 'Destination'),
            h('div', { className: 'text-sm font-bold text-white truncate' }, j.destName)
          ])
        ]),

        h('div', { className: 'flex items-center gap-4 text-xs shrink-0' }, [
          h('div', { className: 'text-right' }, [
            h('div', { className: 'text-[10px] uppercase text-slate-400' }, 'Elapsed Timer'),
            h('div', { className: 'font-mono text-sm font-bold text-white' }, elapsedStr)
          ]),
          h('div', { className: 'text-right' }, [
            h('div', { className: 'text-[10px] uppercase text-slate-400' }, 'Est. Arrival'),
            h('div', { className: 'font-mono text-sm font-bold text-emerald-400' }, `~${remainingMins} min`)
          ])
        ])
      ]),

      // Progress Bar
      h('div', { className: 'space-y-1.5' }, [
        h('div', { className: 'flex justify-between text-xs font-semibold text-slate-300' }, [
          h('span', null, `Journey Progress (${j.progressPct}%)`),
          h('span', { className: 'text-slate-400' }, `${Math.round(j.remainingDistanceMeters)}m remaining`)
        ]),
        h('div', { className: 'w-full bg-slate-800 h-2 rounded-full overflow-hidden' }, [
          h('div', {
            className: 'h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 rounded-full',
            style: { width: `${Math.max(5, j.progressPct)}%` }
          })
        ])
      ]),

      // Stats Grid: Distance, Check-ins, Trusted Contact Status
      h('div', { className: 'grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center' }, [
        h('div', { className: 'bg-slate-950/60 p-2 rounded-xl border border-slate-800/60' }, [
          h('div', { className: 'text-[10px] uppercase text-slate-400' }, 'Total Check-Ins'),
          h('div', { className: 'text-sm font-bold text-white mt-0.5' }, `${state.checkIn.totalCheckInsDone} verified`)
        ]),
        h('div', { className: 'bg-slate-950/60 p-2 rounded-xl border border-slate-800/60' }, [
          h('div', { className: 'text-[10px] uppercase text-slate-400' }, 'Trusted Monitor'),
          h('div', { className: 'text-sm font-bold text-indigo-400 truncate mt-0.5' }, state.user.trustedContact.name.split(' ')[0])
        ]),
        h('div', { className: 'bg-slate-950/60 p-2 rounded-xl border border-slate-800/60' }, [
          h('div', { className: 'text-[10px] uppercase text-slate-400' }, 'Next Check-In'),
          h('div', { className: 'text-sm font-bold text-emerald-400 font-mono mt-0.5' }, `${state.checkIn.nextCheckInCountdown}s`)
        ])
      ]),

      // 3. High-Priority Action Buttons
      h('div', { className: 'space-y-2.5 pt-2' }, [
        // "I CAN'T TALK" BIG SINGLE-TAP BUTTON (Prompt Requirement #5)
        h('button', {
          onClick: handleCantTalk,
          className: 'w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-xl shadow-purple-900/40 border border-purple-500/40 flex items-center justify-center gap-3 transition transform active:scale-[0.98]'
        }, [
          h('div', { className: 'w-7 h-7 rounded-full bg-white/20 flex items-center justify-center' }, [
            h(Icons.EyeOff, { className: 'w-4 h-4 text-white' })
          ]),
          h('span', null, "🤫 I CAN'T TALK (SILENT SOS)")
        ]),

        // Two-Column Grid: Manual Check-In & Emergency SOS
        h('div', { className: 'grid grid-cols-2 gap-2.5' }, [
          h('button', {
            onClick: handleManualCheckIn,
            className: 'py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition'
          }, [
            h(Icons.ShieldCheck, { className: 'w-4 h-4' }),
            h('span', null, "I'm Safe Check-In")
          ]),
          h('button', {
            onClick: handleSOS,
            className: 'py-3 px-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition'
          }, [
            h(Icons.ShieldAlert, { className: 'w-4 h-4' }),
            h('span', null, "Emergency SOS")
          ])
        ]),

        // Safe Completion Button
        h('button', {
          onClick: handleEndJourney,
          className: 'w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition'
        }, [
          h(Icons.CheckCircle2, { className: 'w-3.5 h-3.5 text-emerald-400' }),
          h('span', null, 'Arrived Safely / Complete Journey')
        ])
      ])
    ])
  ]);
};
