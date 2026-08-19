/**
 * SafeWalk AI - Institutional & Campus Safety Operations Dashboard
 * Demonstrates scalable institutional safety network monitoring for Universities,
 * Corporate Campuses, and Residential Communities (RWA).
 */

window.SAFEWALK_INSTITUTIONAL_DASHBOARD = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const [institutionType, setInstitutionType] = React.useState('university');
  const [dispatchNotice, setDispatchNotice] = React.useState(null);

  const institutionConfigs = {
    university: {
      title: "University Campus Police & Safety Operations Center",
      subtitle: "Blue Light Station Network & Safe Walk Escort Dispatch",
      activeWalkers: 34,
      activeJourneys: 9,
      blueLightStations: 18,
      avgResponseMin: "1.4",
      escortUnits: ["Patrol Delta #1 (North Gate)", "Patrol Alpha #2 (Library)", "Patrol Echo #4 (Dorms)"],
      corridors: "University Ave Safe Corridor (Illuminated 24/7)"
    },
    corporate: {
      title: "Innovation Tech Park Security Command Hub",
      subtitle: "24/7 Employee Night Transit & Facility Security",
      activeWalkers: 19,
      activeJourneys: 4,
      blueLightStations: 12,
      avgResponseMin: "2.1",
      escortUnits: ["Tech Park Security Mobile #1", "Building C Lobby Patrol"],
      corridors: "Metro Connector Skybridge & Tech Blvd"
    },
    community: {
      title: "Residential Community Safe Watch Network",
      subtitle: "Neighborhood Watch & Volunteer Escort Coordination",
      activeWalkers: 42,
      activeJourneys: 7,
      blueLightStations: 8,
      avgResponseMin: "3.2",
      escortUnits: ["Community Volunteer Sector 4", "North Park Gatehouse Guard"],
      corridors: "Elmwood Green Main Pedestrian Path"
    }
  };

  const currentConfig = institutionConfigs[institutionType] || institutionConfigs.university;
  const isEmergency = state.emergency.isEmergencyDispatched;
  const activeAlert = state.emergency.activeAlert;

  const handleSimulateCampusDispatch = (unitName) => {
    const coords = state.journey.currentCoords || [37.7752, -122.4245];
    const notice = `Dispatched ${unitName} to GPS coordinates (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}). ETA: ~2 minutes. (Demo Simulation)`;
    setDispatchNotice(notice);
    window.SAFEWALK_STORE.addLog("Campus Escort Dispatched", notice, "emergency");
  };

  return h('div', { className: 'w-full max-w-6xl mx-auto space-y-5 animate-fadeIn' }, [
    // Top Bar: Institution Selector & Live Operations Title
    h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4' }, [
      h('div', { className: 'flex items-center gap-3' }, [
        h('div', { className: 'w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center' }, [
          h(Icons.Shield, { className: 'w-6 h-6' })
        ]),
        h('div', null, [
          h('div', { className: 'flex items-center gap-2 flex-wrap' }, [
            h('h2', { className: 'text-lg font-bold text-white' }, currentConfig.title),
            h('span', { className: 'text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full' }, 'Institutional Mode')
          ]),
          h('p', { className: 'text-xs text-slate-400' }, currentConfig.subtitle)
        ])
      ]),

      // Institution Switcher Chips
      h('div', { className: 'flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto' }, [
        [
          ['university', '🎓 University Campus'],
          ['corporate', '🏢 Tech Park'],
          ['community', '🏡 Residential RWA']
        ].map(([key, label]) =>
          h('button', {
            key,
            onClick: () => { setInstitutionType(key); setDispatchNotice(null); },
            className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              institutionType === key
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }, label)
        )
      ])
    ]),

    // Metrics Overview Grid (Active users, active sessions, risk zones, escalations, response time)
    h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3' }, [
      h('div', { className: 'bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center space-y-0.5' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400' }, 'Active Walkers'),
        h('div', { className: 'text-2xl font-black text-white' }, currentConfig.activeWalkers),
        h('div', { className: 'text-[10px] text-emerald-400' }, '● Live Connected')
      ]),
      h('div', { className: 'bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center space-y-0.5' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400' }, 'Active Journeys'),
        h('div', { className: 'text-2xl font-black text-cyan-400 font-mono' }, currentConfig.activeJourneys),
        h('div', { className: 'text-[10px] text-slate-400' }, 'In-Transit')
      ]),
      h('div', { className: 'bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center space-y-0.5' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400' }, 'Active Alerts'),
        h('div', { className: `text-2xl font-black ${isEmergency ? 'text-red-500 animate-pulse' : 'text-slate-300'}` },
          isEmergency ? '1 ACTIVE' : '0'
        ),
        h('div', { className: 'text-[10px] text-slate-400' }, isEmergency ? 'Requires Escort' : 'All Clear')
      ]),
      h('div', { className: 'bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center space-y-0.5' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400' }, 'Blue Light Kiosks'),
        h('div', { className: 'text-2xl font-black text-blue-400' }, currentConfig.blueLightStations),
        h('div', { className: 'text-[10px] text-blue-300' }, '100% Operational')
      ]),
      h('div', { className: 'bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center space-y-0.5' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400' }, 'Hazard Zones'),
        h('div', { className: 'text-2xl font-black text-amber-400' }, state.hazards.length),
        h('div', { className: 'text-[10px] text-slate-400' }, 'Crowdsourced')
      ]),
      h('div', { className: 'bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center space-y-0.5' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400' }, 'Avg Response'),
        h('div', { className: 'text-2xl font-black text-emerald-400 font-mono' }, `${currentConfig.avgResponseMin}m`),
        h('div', { className: 'text-[10px] text-slate-400' }, 'Rapid Dispatch')
      ])
    ]),

    // Emergency Incident Escalation Card (If Active Emergency in campus network)
    isEmergency && h('div', {
      className: 'bg-red-950/90 border-2 border-red-500 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(239,68,68,0.4)] text-white space-y-4'
    }, [
      h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-800' }, [
        h('div', { className: 'flex items-center gap-2' }, [
          h('span', { className: 'w-3 h-3 rounded-full bg-red-500 animate-ping' }),
          h('span', { className: 'text-xs uppercase font-black tracking-wider bg-red-600 px-3 py-0.5 rounded-full' }, 'ACTIVE CAMPUS INCIDENT ESCALATION'),
          h('span', { className: 'text-xs text-red-200 font-mono' }, 'Incident #' + (activeAlert?.id || 'alert_001'))
        ]),
        h('span', { className: 'text-xs font-bold text-red-300' }, 'Priority: CRITICAL')
      ]),

      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm' }, [
        h('div', { className: 'space-y-1.5' }, [
          h('div', null, [
            h('span', { className: 'text-red-300 font-bold' }, 'Student / Walker: '),
            h('span', { className: 'text-white font-extrabold' }, state.user.name)
          ]),
          h('div', null, [
            h('span', { className: 'text-red-300 font-bold' }, 'Incident Reason: '),
            h('span', { className: 'text-white font-bold' }, activeAlert ? activeAlert.reason : 'Emergency SOS Triggered')
          ]),
          h('div', null, [
            h('span', { className: 'text-red-300 font-bold' }, 'Live GPS: '),
            h('span', { className: 'font-mono text-emerald-400 font-bold' },
              `${(state.journey.currentCoords || [37.7752, -122.4245])[0].toFixed(5)}, ${(state.journey.currentCoords || [37.7752, -122.4245])[1].toFixed(5)}`
            )
          ])
        ]),

        // Rapid Dispatch Buttons
        h('div', { className: 'space-y-2' }, [
          h('div', { className: 'text-xs font-bold text-red-200 uppercase tracking-wider' }, '1-Click Rapid Patrol Dispatch:'),
          h('div', { className: 'grid grid-cols-1 gap-2' }, [
            ...currentConfig.escortUnits.map((unit, idx) =>
              h('button', {
                key: idx,
                onClick: () => handleSimulateCampusDispatch(unit),
                className: 'py-2 px-3 rounded-xl bg-red-700/80 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-between transition'
              }, [
                h('span', null, `🚨 Dispatch ${unit}`),
                h('span', { className: 'text-[10px] bg-black/30 px-2 py-0.5 rounded' }, 'ETA 2 min')
              ])
            )
          ])
        ])
      ]),

      dispatchNotice && h('div', {
        className: 'p-3 bg-black/60 rounded-xl border border-red-500/40 text-xs text-emerald-400 font-mono flex items-center gap-2'
      }, [
        h(Icons.Check, { className: 'w-4 h-4' }),
        h('span', null, dispatchNotice)
      ])
    ]),

    // Grid: Campus Map Stream & Escort Operations
    h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-5' }, [
      // Left: Map Stream (8 cols)
      h('div', { className: 'lg:col-span-8 space-y-4' }, [
        h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3' }, [
          h('div', { className: 'flex items-center justify-between' }, [
            h('div', { className: 'flex items-center gap-2' }, [
              h(Icons.Shield, { className: 'w-4 h-4 text-cyan-400' }),
              h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, 'Campus Safe Corridor & Live Telemetry Map')
            ]),
            h('span', { className: 'text-[11px] text-emerald-400 font-semibold' }, currentConfig.corridors)
          ]),
          h(window.SAFEWALK_MAP, { state })
        ])
      ]),

      // Right: Campus Safety Resources & Active Escort Units (4 cols)
      h('div', { className: 'lg:col-span-4 space-y-4' }, [
        // Patrol Units Card
        h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3' }, [
          h('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-800' }, [
            h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, 'Active Escort Units'),
            h('span', { className: 'text-[10px] text-cyan-400 font-semibold' }, 'On-Duty')
          ]),
          h('div', { className: 'space-y-2' }, [
            ...currentConfig.escortUnits.map((u, i) =>
              h('div', { key: i, className: 'bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs' }, [
                h('div', { className: 'flex items-center gap-2' }, [
                  h('span', { className: 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' }),
                  h('span', { className: 'font-semibold text-slate-200' }, u)
                ]),
                h('span', { className: 'text-[10px] text-slate-400 font-mono' }, 'Standby')
              ])
            )
          ])
        ]),

        // Campus Blue Light System Card
        h('div', { className: 'bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-2.5' }, [
          h('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-800' }, [
            h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, 'Blue Light Emergency Posts'),
            h('span', { className: 'text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30' }, '18 Active')
          ]),
          h('p', { className: 'text-xs text-slate-300 leading-relaxed' },
            'Direct one-button speakerphone emergency kiosks located every 150m along illuminated student pedestrian routes.'
          ),
          h('div', { className: 'pt-1 text-[11px] text-cyan-300 font-medium' },
            '✓ Integrated with SafeWalk AI auto-escalation receiver.'
          )
        ])
      ])
    ])
  ]);
};
