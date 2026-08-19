/**
 * SafeWalk AI - Top Navigation Bar
 */

window.SAFEWALK_NAVBAR = function(props) {
  const { state, onSelectView, onToggleMute } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const isEmergency = state.emergency.isEmergencyDispatched;
  const isMuted = window.SAFEWALK_AUDIO_ENGINE ? window.SAFEWALK_AUDIO_ENGINE.isMuted() : false;

  const statusBadge = () => {
    const s = state.risk.status;
    let bg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    let dot = "bg-emerald-400";
    if (s === "YELLOW") {
      bg = "bg-amber-500/20 text-amber-300 border-amber-500/30";
      dot = "bg-amber-400";
    } else if (s === "RED") {
      bg = "bg-red-500/20 text-red-300 border-red-500/30 animate-pulse";
      dot = "bg-red-500";
    }

    return h('div', {
      className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg}`
    }, [
      h('span', { key: 'dot', className: `w-2 h-2 rounded-full ${dot}` }),
      h('span', { key: 'text' }, state.risk.statusLabel)
    ]);
  };

  return h('header', { className: 'w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40' }, [
    // Top emergency ticker if emergency active
    isEmergency && h('div', {
      key: 'emergency_ticker',
      className: 'bg-red-600 text-white px-4 py-1.5 text-xs sm:text-sm font-bold flex items-center justify-between animate-pulse'
    }, [
      h('div', { className: 'flex items-center gap-2' }, [
        h(Icons.ShieldAlert, { className: 'w-4 h-4' }),
        h('span', null, `EMERGENCY ALERT BROADCAST ACTIVE — Trusted Contact ${state.user.trustedContact.name} Notified`)
      ]),
      h('button', {
        onClick: () => onSelectView('trusted_dashboard'),
        className: 'bg-white text-red-700 px-2.5 py-0.5 rounded text-xs font-bold hover:bg-slate-100 transition'
      }, 'View Dashboard →')
    ]),

    // Main Header Row
    h('div', { key: 'main_bar', className: 'max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3' }, [
      // Logo & Brand
      h('div', { className: 'flex items-center gap-3 cursor-pointer', onClick: () => onSelectView('walker') }, [
        h('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white' }, [
          h(Icons.Shield, { className: 'w-6 h-6' })
        ]),
        h('div', null, [
          h('div', { className: 'flex items-center gap-2' }, [
            h('span', { className: 'text-lg font-extrabold tracking-tight text-white' }, 'SafeWalk AI'),
            h('span', { className: 'text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded' }, 'Safety Net')
          ]),
          h('p', { className: 'text-xs text-slate-400 hidden sm:block' }, 'Predictive Personal Safety Companion')
        ])
      ]),

      // View Navigation Switcher
      h('div', { className: 'flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60' }, [
        h('button', {
          onClick: () => onSelectView('walker'),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            state.activeView === 'walker'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`
        }, [
          h(Icons.Navigation, { className: 'w-3.5 h-3.5' }),
          h('span', null, 'Walker View')
        ]),

        h('button', {
          onClick: () => onSelectView('trusted_dashboard'),
          className: `relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            state.activeView === 'trusted_dashboard'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`
        }, [
          h(Icons.Users, { className: 'w-3.5 h-3.5' }),
          h('span', null, 'Trusted Contact'),
          isEmergency && h('span', {
            className: 'absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping'
          })
        ]),

        h('button', {
          onClick: () => onSelectView('demo_tour'),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            state.activeView === 'demo_tour'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`
        }, [
          h(Icons.Zap, { className: 'w-3.5 h-3.5' }),
          h('span', null, 'Demo Suite')
        ])
      ]),

      // Status Pill & Sound Control
      h('div', { className: 'flex items-center gap-2.5' }, [
        statusBadge(),
        h('button', {
          onClick: onToggleMute,
          title: isMuted ? "Unmute Audio" : "Mute Audio",
          className: 'p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700/60'
        }, [
          isMuted ? h(Icons.VolumeX, { className: 'w-4 h-4 text-red-400' }) : h(Icons.Volume2, { className: 'w-4 h-4 text-emerald-400' })
        ])
      ])
    ])
  ]);
};
