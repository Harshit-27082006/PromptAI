/**
 * SafeWalk AI - Trusted Contact Dashboard
 * Live monitoring console for emergency contacts (Priya Sharma) with real-time AI incident escalation.
 * Enhanced with Phase 2 AI Alert Prioritization & Context Assessment.
 */

window.SAFEWALK_TRUSTED_DASHBOARD = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const [callModal, setCallModal] = React.useState(false);
  const [escortModal, setEscortModal] = React.useState(false);

  const j = state.journey;
  const risk = state.risk;
  const isEmergency = state.emergency.isEmergencyDispatched;
  const activeAlert = state.emergency.activeAlert;
  const contact = state.user.trustedContact;
  const coords = j.currentCoords || [37.7752, -122.4245];

  const ai = state.aiIntelligence || (
    window.SAFEWALK_SAFETY_INTELLIGENCE
      ? window.SAFEWALK_SAFETY_INTELLIGENCE.analyzeSafety(state)
      : null
  );

  const alertAssessment = activeAlert?.aiAssessment || ai?.alertAssessment || {
    priority: isEmergency ? "CRITICAL" : "LOW",
    priorityBadge: isEmergency ? "bg-red-500 text-white" : "bg-emerald-500/20 text-emerald-300",
    aiReasonSummary: isEmergency ? "Emergency distress signal active" : "Normal journey telemetry",
    recommendedAction: isEmergency ? "Attempt immediate contact and dispatch safety escort if unreachable." : "Continue monitoring."
  };

  const handleResolveAlert = () => {
    window.SAFEWALK_STORE.resolveAlert("Contact acknowledged and confirmed user is safe.");
  };

  const handleSimulateCall = () => {
    setCallModal(true);
    window.SAFEWALK_STORE.addLog("Call Attempted", `Trusted Contact ${contact.name} dialed ${state.user.name}.`, "emergency");
  };

  const handleSimulateEscort = () => {
    setEscortModal(true);
    window.SAFEWALK_STORE.addLog("Escort Requested", `Dispatched safety escort request to nearest precinct for GPS: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`, "emergency");
  };

  return h('div', { className: 'w-full max-w-6xl mx-auto space-y-5 animate-fadeIn' }, [
    // Top Bar: Contact Info & Monitoring Active Badge
    h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
      h('div', { className: 'flex items-center gap-3' }, [
        h('div', { className: 'w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center' }, [
          h(Icons.Users, { className: 'w-6 h-6' })
        ]),
        h('div', null, [
          h('div', { className: 'flex items-center gap-2' }, [
            h('h2', { className: 'text-lg font-bold text-white' }, `Trusted Contact Console: ${contact.name}`),
            h('span', { className: 'text-[11px] font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30' },
              contact.relation
            )
          ]),
          h('p', { className: 'text-xs text-slate-400' },
            `Actively monitoring journey for ${state.user.name} (${state.user.phone})`
          )
        ])
      ]),

      h('div', { className: 'flex items-center gap-3 self-start sm:self-auto' }, [
        h('div', { className: 'flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs' }, [
          h('span', { className: `w-2.5 h-2.5 rounded-full ${j.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}` }),
          h('span', { className: 'text-slate-300 font-medium' }, j.isActive ? 'Live Journey Stream Active' : 'No Active Journey')
        ]),
        h('button', {
          onClick: () => window.open(window.location.href, '_blank'),
          className: 'px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition hidden sm:flex items-center gap-1.5'
        }, [
          h(Icons.Radio || Icons.Zap, { className: 'w-3.5 h-3.5 text-cyan-400' }),
          h('span', null, 'Open Split Tab')
        ])
      ])
    ]),

    // 🚨 PROMINENT EMERGENCY BANNER (If Active Alert) with AI Assessment
    isEmergency && h('div', {
      className: 'bg-red-950/95 border-2 border-red-500 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(239,68,68,0.5)] text-white relative overflow-hidden siren-active space-y-4'
    }, [
      h('div', { className: 'flex flex-col md:flex-row md:items-start justify-between gap-5' }, [
        // Left Column: Alert Header & Details
        h('div', { className: 'space-y-3 flex-1' }, [
          h('div', { className: 'flex items-center gap-2.5 flex-wrap' }, [
            h('span', { className: 'w-3 h-3 rounded-full bg-red-500 animate-ping' }),
            h('span', { className: 'text-xs uppercase font-black tracking-widest bg-red-600 px-3 py-0.5 rounded-full shadow' },
              '🚨 SAFETY ALERT'
            ),
            h('span', { className: `text-xs uppercase font-black px-2.5 py-0.5 rounded-full border ${alertAssessment.priorityBadge || 'bg-red-500 text-white'}` },
              `AI Priority: ${alertAssessment.priority || 'CRITICAL'}`
            ),
            h('span', { className: 'text-xs text-red-200 font-mono' },
              activeAlert ? new Date(activeAlert.timestamp).toLocaleTimeString() : 'Now'
            )
          ]),

          h('h3', { className: 'text-2xl sm:text-3xl font-black text-white tracking-tight' },
            `${state.user.name}'s journey requires immediate attention.`
          ),

          h('div', { className: 'bg-black/50 p-4 rounded-2xl border border-red-500/30 space-y-2 text-xs sm:text-sm' }, [
            h('div', { className: 'flex items-start gap-2' }, [
              h('span', { className: 'text-red-300 font-bold w-28 shrink-0' }, 'Alert Reason:'),
              h('span', { className: 'font-extrabold text-white' }, activeAlert ? activeAlert.reason : 'Emergency SOS Triggered')
            ]),
            h('div', { className: 'flex items-start gap-2' }, [
              h('span', { className: 'text-red-300 font-bold w-28 shrink-0' }, 'Last Known GPS:'),
              h('span', { className: 'font-mono text-emerald-400 font-bold' }, `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)} (${activeAlert?.location?.nearestLandmark || 'En-route'})`)
            ]),
            h('div', { className: 'flex items-start gap-2' }, [
              h('span', { className: 'text-red-300 font-bold w-28 shrink-0' }, 'Destination:'),
              h('span', { className: 'text-slate-200' }, j.destName)
            ]),
            h('div', { className: 'flex items-start gap-2' }, [
              h('span', { className: 'text-red-300 font-bold w-28 shrink-0' }, 'Last Response:'),
              h('span', { className: 'text-slate-200' }, state.checkIn.lastCheckInTime ? new Date(state.checkIn.lastCheckInTime).toLocaleTimeString() : 'Journey start')
            ])
          ])
        ]),

        // Right Column: Emergency Actions
        h('div', { className: 'flex flex-col gap-2.5 sm:w-64 shrink-0 justify-center' }, [
          h('button', {
            onClick: handleSimulateCall,
            className: 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95'
          }, [
            h(Icons.PhoneCall, { className: 'w-4 h-4' }),
            h('span', null, `Call ${state.user.name}`)
          ]),

          h('button', {
            onClick: handleSimulateEscort,
            className: 'w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95'
          }, [
            h(Icons.Shield, { className: 'w-4 h-4' }),
            h('span', null, 'Dispatch Safe Escort')
          ]),

          h('button', {
            onClick: handleResolveAlert,
            className: 'w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition'
          }, 'Mark Alert Acknowledged / Resolved')
        ])
      ]),

      // 🧠 Phase 2 AI Alert Assessment Details Box
      h('div', {
        className: 'bg-black/60 p-4 rounded-2xl border border-indigo-500/40 space-y-2'
      }, [
        h('div', { className: 'flex items-center gap-2 text-xs font-black text-indigo-300 uppercase tracking-wider' }, [
          h(Icons.Zap, { className: 'w-4 h-4 text-cyan-400' }),
          h('span', null, 'AI Intelligent Incident Assessment')
        ]),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1' }, [
          h('div', { className: 'bg-slate-900/80 p-2.5 rounded-xl border border-slate-800' }, [
            h('div', { className: 'text-[10px] uppercase text-slate-400 font-semibold' }, 'Risk Acceleration'),
            h('div', { className: 'text-sm font-extrabold text-red-300 mt-0.5' },
              `${risk.score} → Pred ${ai?.prediction?.predictedRisk || 95} (${ai?.prediction?.riskTrend || 'RAPIDLY_INCREASING'})`
            )
          ]),
          h('div', { className: 'bg-slate-900/80 p-2.5 rounded-xl border border-slate-800' }, [
            h('div', { className: 'text-[10px] uppercase text-slate-400 font-semibold' }, 'Behavior Kinematics'),
            h('div', { className: 'text-sm font-extrabold text-amber-300 mt-0.5' },
              ai?.behavior?.statusLabel || 'Highly Unusual'
            )
          ]),
          h('div', { className: 'bg-slate-900/80 p-2.5 rounded-xl border border-slate-800' }, [
            h('div', { className: 'text-[10px] uppercase text-slate-400 font-semibold' }, 'Nearest Safe Haven'),
            h('div', { className: 'text-sm font-extrabold text-emerald-400 mt-0.5' },
              `${ai?.context?.nearestSafeZone?.name || 'Safe Zone'} (${Math.round(ai?.context?.nearestSafeZone?.distanceMeters || 180)}m)`
            )
          ])
        ]),
        h('div', { className: 'text-xs text-slate-200 pt-1' }, [
          h('span', { className: 'font-bold text-indigo-300' }, 'AI Recommended Contact Action: '),
          h('span', null, alertAssessment.recommendedAction)
        ])
      ])
    ]),

    // Grid: Map & Journey Telemetry
    h('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-5' }, [
      // Left: Map (2 cols on lg)
      h('div', { className: 'lg:col-span-2 space-y-4' }, [
        h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3' }, [
          h('div', { className: 'flex items-center justify-between' }, [
            h('div', { className: 'flex items-center gap-2' }, [
              h(Icons.MapPin, { className: 'w-4 h-4 text-emerald-400' }),
              h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, "Live Journey Map Stream")
            ]),
            h('span', { className: 'text-[11px] font-semibold text-slate-400' }, `Heading: ${j.destName}`)
          ]),
          h(window.SAFEWALK_MAP, { state })
        ])
      ]),

      // Right: Live Journey Telemetry & Timeline
      h('div', { className: 'space-y-4' }, [
        // AI Safety Status & Risk Score Card
        h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3' }, [
          h('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-800' }, [
            h('span', { className: 'text-xs font-bold text-slate-300 uppercase tracking-wider' }, 'Current Safety Status'),
            h('span', { className: `text-xs font-black px-2 py-0.5 rounded-full ${
              risk.status === 'RED' ? 'bg-red-500 text-white' : (risk.status === 'YELLOW' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-slate-950')
            }` }, risk.statusLabel)
          ]),

          h('div', { className: 'flex items-center justify-between' }, [
            h('div', null, [
              h('div', { className: 'text-2xl font-black text-white' }, `${risk.score}/100`),
              h('div', { className: 'text-[11px] text-slate-400' }, `Predicted 5m: ${ai?.prediction?.predictedRisk || risk.score}/100`)
            ]),
            h('div', { className: 'text-right' }, [
              h('div', { className: 'text-sm font-bold text-emerald-400 font-mono' }, `${j.progressPct}%`),
              h('div', { className: 'text-[11px] text-slate-400' }, 'Progress Completed')
            ])
          ]),

          // Progress Bar
          h('div', { className: 'w-full bg-slate-800 h-2 rounded-full overflow-hidden' }, [
            h('div', {
              className: 'h-full bg-emerald-500 transition-all duration-500 rounded-full',
              style: { width: `${j.progressPct}%` }
            })
          ]),

          // Deviation / Check-in summary
          h('div', { className: 'grid grid-cols-2 gap-2 text-center text-xs pt-1' }, [
            h('div', { className: 'bg-slate-950 p-2 rounded-xl border border-slate-800' }, [
              h('div', { className: 'text-[10px] text-slate-400 uppercase' }, 'Off-Route'),
              h('div', { className: `font-bold ${j.isDeviated ? 'text-amber-400' : 'text-slate-200'}` }, `${Math.round(j.deviationMeters)}m`)
            ]),
            h('div', { className: 'bg-slate-950 p-2 rounded-xl border border-slate-800' }, [
              h('div', { className: 'text-[10px] text-slate-400 uppercase' }, 'Check-Ins'),
              h('div', { className: 'font-bold text-emerald-400' }, `${state.checkIn.totalCheckInsDone} confirmed`)
            ])
          ])
        ]),

        // Event Audit Log & Timeline
        h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3' }, [
          h('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-800' }, [
            h('div', { className: 'flex items-center gap-2' }, [
              h(Icons.Activity || Icons.Clock, { className: 'w-4 h-4 text-indigo-400' }),
              h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, 'Journey Event Log')
            ]),
            h('span', { className: 'text-[10px] text-slate-400' }, `${state.auditLog.length} events`)
          ]),

          h('div', { className: 'space-y-2 max-h-[260px] overflow-y-auto pr-1' }, [
            ...state.auditLog.slice(0, 8).map(log => {
              let dot = "bg-slate-500";
              if (log.type === "emergency") dot = "bg-red-500 animate-ping";
              if (log.type === "checkin") dot = "bg-emerald-500";
              if (log.type === "hazard") dot = "bg-amber-500";

              return h('div', {
                key: log.id,
                className: 'bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-xs space-y-0.5'
              }, [
                h('div', { className: 'flex items-center justify-between' }, [
                  h('div', { className: 'flex items-center gap-1.5 font-bold text-slate-200' }, [
                    h('span', { className: `w-2 h-2 rounded-full ${dot}` }),
                    h('span', null, log.title)
                  ]),
                  h('span', { className: 'text-[10px] text-slate-500 font-mono' },
                    new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  )
                ]),
                h('p', { className: 'text-[11px] text-slate-400 pl-3.5' }, log.details)
              ]);
            })
          ])
        ])
      ])
    ]),

    // Simulated Call Modal
    callModal && h('div', {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn'
    }, [
      h('div', { className: 'bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl' }, [
        h('div', { className: 'w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-pulse' }, [
          h(Icons.PhoneCall, { className: 'w-8 h-8' })
        ]),
        h('h3', { className: 'text-lg font-bold text-white' }, `Simulated Call to ${state.user.name}`),
        h('p', { className: 'text-xs text-slate-300' }, `Connecting voice call to ${state.user.phone}...`),
        h('div', { className: 'p-3 bg-slate-950 rounded-xl text-xs text-slate-400 font-mono' }, 'Status: Ringing (Demo Simulation)'),
        h('button', {
          onClick: () => setCallModal(false),
          className: 'w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase transition'
        }, 'End Simulated Call')
      ])
    ]),

    // Simulated Escort Modal
    escortModal && h('div', {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn'
    }, [
      h('div', { className: 'bg-slate-900 border border-blue-500 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl' }, [
        h('div', { className: 'w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 text-blue-400 flex items-center justify-center mx-auto' }, [
          h(Icons.Shield, { className: 'w-8 h-8' })
        ]),
        h('h3', { className: 'text-lg font-bold text-white' }, 'Simulated Safety Escort Dispatch'),
        h('p', { className: 'text-xs text-slate-300' }, `Alert transmitted to Central Security & Patrol unit near GPS ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}.`),
        h('div', { className: 'p-3 bg-slate-950 rounded-xl text-xs text-emerald-400 font-mono' }, 'Dispatch Status: En Route (Demo Simulation)'),
        h('button', {
          onClick: () => setEscortModal(false),
          className: 'w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase transition'
        }, 'Close Dispatch Window')
      ])
    ])
  ]);
};
