/**
 * SafeWalk AI - Top Navigation Bar
 * Enhanced with Institutional / Campus Mode and Online/Offline Resilience Indicator.
 */

window.SAFEWALK_NAVBAR = function(props) {
  const { state, onSelectView, onToggleMute } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const [isOnline, setIsOnline] = React.useState(
    window.SAFEWALK_API_CLIENT ? window.SAFEWALK_API_CLIENT.isOnline() : true
  );

  React.useEffect(() => {
    if (window.SAFEWALK_API_CLIENT) {
      const unsub = window.SAFEWALK_API_CLIENT.subscribeConnectivity(status => {
        setIsOnline(status);
      });
      return unsub;
    }
  }, []);

  const isEmergency = state.emergency.isEmergencyDispatched;
  const isMuted = window.SAFEWALK_AUDIO_ENGINE ? window.SAFEWALK_AUDIO_ENGINE.isMuted() : false;

  const statusBadge = () => {
    const s = state.risk.status;
    let bg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    let dot = "bg-emerald-400";
    let icon = "🟢";
    if (s === "YELLOW") {
      bg = "bg-amber-500/20 text-amber-300 border-amber-500/30";
      dot = "bg-amber-400";
      icon = "🟡";
    } else if (s === "RED") {
      bg = "bg-red-500/20 text-red-300 border-red-500/30 animate-pulse";
      dot = "bg-red-500";
      icon = "🔴";
    }

    return h('div', {
      className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${bg}`,
      role: 'status',
      'aria-label': `Safety Status: ${state.risk.statusLabel}`
    }, [
      h('span', { key: 'icon', className: 'text-[10px]' }, icon),
      h('span', { key: 'text' }, state.risk.statusLabel)
    ]);
  };

  return h('header', { className: 'w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40' }, [
    // Top emergency ticker if emergency active
    isEmergency && h('div', {
      key: 'emergency_ticker',
      role: 'alert',
      'aria-live': 'assertive',
      className: 'bg-red-600 text-white px-4 py-1.5 text-xs sm:text-sm font-bold flex items-center justify-between animate-pulse'
    }, [
      h('div', { className: 'flex items-center gap-2' }, [
        h(Icons.ShieldAlert, { className: 'w-4 h-4' }),
        h('span', null, `🚨 EMERGENCY ALERT BROADCAST ACTIVE — Trusted Contact ${state.user.trustedContact.name} Notified`)
      ]),
      h('button', {
        onClick: () => onSelectView('trusted_dashboard'),
        className: 'bg-white text-red-700 px-2.5 py-0.5 rounded text-xs font-bold hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-white'
      }, 'View Dashboard →')
    ]),

    // Main Header Row
    h('div', { key: 'main_bar', className: 'max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3' }, [
      // Logo & Brand
      h('div', {
        className: 'flex items-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-xl p-1',
        onClick: () => onSelectView('walker'),
        tabIndex: 0,
        role: 'button',
        'aria-label': 'SafeWalk AI Home'
      }, [
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
      h('nav', { className: 'flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 flex-wrap gap-1', role: 'tablist' }, [
        h('button', {
          onClick: () => onSelectView('walker'),
          role: 'tab',
          'aria-selected': state.activeView === 'walker',
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
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
          role: 'tab',
          'aria-selected': state.activeView === 'trusted_dashboard',
          className: `relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
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
          onClick: () => onSelectView('institutional'),
          role: 'tab',
          'aria-selected': state.activeView === 'institutional',
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
            state.activeView === 'institutional'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`
        }, [
          h(Icons.Shield, { className: 'w-3.5 h-3.5' }),
          h('span', null, '🏛️ Campus / Ops')
        ]),

        h('button', {
          onClick: () => onSelectView('demo_tour'),
          role: 'tab',
          'aria-selected': state.activeView === 'demo_tour',
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
            state.activeView === 'demo_tour'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`
        }, [
          h(Icons.Zap, { className: 'w-3.5 h-3.5' }),
          h('span', null, 'Demo Suite')
        ])
      ]),

      // Status Pill, Connectivity Indicator & Sound Control
      h('div', { className: 'flex items-center gap-2.5 flex-wrap' }, [
        // Connectivity Status Pill
        h('div', {
          title: isOnline ? "Connected to backend safety network" : "Operating in local offline resilience mode (events queued locally)",
          className: `flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold border ${
            isOnline
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
          }`
        }, [
          h('span', { className: `w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}` }),
          h('span', null, isOnline ? 'ONLINE' : 'OFFLINE (LOCAL MODE)')
        ]),

        statusBadge(),

        h('button', {
          onClick: onToggleMute,
          title: isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback",
          'aria-label': isMuted ? "Unmute Audio" : "Mute Audio",
          className: 'p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400'
        }, [
          isMuted ? h(Icons.VolumeX, { className: 'w-4 h-4 text-red-400' }) : h(Icons.Volume2, { className: 'w-4 h-4 text-emerald-400' })
        ])
      ])
    ])
  ]);
};
