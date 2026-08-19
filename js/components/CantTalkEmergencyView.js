/**
 * SafeWalk AI - "I Can't Talk" Emergency Mode View
 * Single-tap zero-typing stealth emergency response interface.
 */

window.SAFEWALK_CANT_TALK_VIEW = function(props) {
  const { state, onResolve } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const j = state.journey;
  const contact = state.user.trustedContact;
  const coords = j.currentCoords || [37.7752, -122.4245];

  const nearestSafeZones = window.SAFEWALK_ROUTE_UTILS
    ? window.SAFEWALK_ROUTE_UTILS.findNearestSafeZones(coords, state.safeZones, 3)
    : (state.safeZones || []).slice(0, 3);

  const closestZone = nearestSafeZones[0];

  const quickUpdates = [
    "I am walking toward the nearest safe haven",
    "Someone is following me closely",
    "I have entered a well-lit public building",
    "Requesting police / security escort to my GPS"
  ];

  return h('div', {
    className: 'w-full max-w-2xl mx-auto space-y-4 animate-fadeIn'
  }, [
    // 1. Silent SOS Status Alert Card
    h('div', {
      className: 'bg-red-950/90 border-2 border-red-500 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(239,68,68,0.4)] text-white relative overflow-hidden'
    }, [
      h('div', { className: 'flex items-center justify-between gap-3 pb-3 border-b border-red-800' }, [
        h('div', { className: 'flex items-center gap-2.5' }, [
          h('div', { className: 'w-3 h-3 rounded-full bg-red-500 animate-ping' }),
          h('span', { className: 'text-xs uppercase font-extrabold tracking-wider bg-red-600 px-2.5 py-0.5 rounded-full' },
            'SILENT SOS ACTIVE'
          )
        ]),
        h('span', { className: 'text-xs text-red-300 font-mono' }, new Date().toLocaleTimeString())
      ]),

      h('div', { className: 'mt-4 space-y-2' }, [
        h('h2', { className: 'text-xl sm:text-2xl font-black text-white' }, "“I Can't Talk” Mode Engaged"),
        h('p', { className: 'text-xs sm:text-sm text-red-200 leading-relaxed' },
          `Silent distress signal broadcast to ${contact.name} (${contact.relation}, ${contact.phone}). Your continuous GPS coordinates are being transmitted live without requiring any voice or typing.`
        )
      ]),

      // Live Captured Coordinates Card
      h('div', { className: 'bg-black/60 p-3 rounded-xl border border-red-500/30 mt-4 flex items-center justify-between' }, [
        h('div', { className: 'flex items-center gap-2 text-xs' }, [
          h(Icons.MapPin, { className: 'w-4 h-4 text-red-400 shrink-0' }),
          h('div', null, [
            h('span', { className: 'text-slate-400 block text-[10px] uppercase font-semibold' }, 'Live Broadcasted Coordinates'),
            h('span', { className: 'font-mono font-bold text-white' }, `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`)
          ])
        ]),
        h('span', { className: 'text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-500/40' },
          '● LIVE SYNCED'
        )
      ])
    ]),

    // 2. Nearest Safe Haven Escape Guide
    closestZone && h('div', {
      className: 'bg-slate-900 border border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3'
    }, [
      h('div', { className: 'flex items-center justify-between' }, [
        h('div', { className: 'flex items-center gap-2' }, [
          h(Icons.Shield, { className: 'w-5 h-5 text-blue-400' }),
          h('span', { className: 'text-sm font-bold text-white uppercase tracking-wider' }, 'Nearest Verified Safe Zone')
        ]),
        h('span', { className: 'text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30' },
          `~${closestZone.walkTimeMin || 2} min walk (${closestZone.formattedDistance || '180m'})`
        )
      ]),

      h('div', { className: 'bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-3' }, [
        h('div', null, [
          h('div', { className: 'text-xs font-bold text-blue-300 uppercase' }, closestZone.categoryLabel),
          h('div', { className: 'text-base font-extrabold text-white mt-0.5' }, closestZone.name),
          h('div', { className: 'text-xs text-slate-400 mt-0.5' }, closestZone.address),
          h('div', { className: 'text-[11px] text-emerald-400 font-semibold mt-1' }, `✓ ${closestZone.hours} • Staffed & Lit`)
        ]),
        h('a', {
          href: `tel:${closestZone.phone}`,
          className: 'p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition shrink-0 flex items-center justify-center'
        }, [
          h(Icons.Phone, { className: 'w-4 h-4' })
        ])
      ])
    ]),

    // 3. 1-Tap Canned Silent Status Updates (Zero Typing)
    h('div', {
      className: 'bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3'
    }, [
      h('div', { className: 'flex items-center gap-2' }, [
        h(Icons.Zap, { className: 'w-4 h-4 text-purple-400' }),
        h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, '1-Tap Silent Status Updates (Zero Typing)')
      ]),
      h('p', { className: 'text-xs text-slate-400' }, 'Tap any update below to silently transmit it to your trusted contact dashboard:'),

      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1' }, [
        ...quickUpdates.map((msg, idx) =>
          h('button', {
            key: idx,
            onClick: () => window.SAFEWALK_STORE.sendSilentQuickUpdate(msg),
            className: 'text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-purple-500/50 text-xs font-medium transition active:scale-[0.98] flex items-center justify-between gap-2'
          }, [
            h('span', null, msg),
            h(Icons.Send, { className: 'w-3.5 h-3.5 text-purple-400 shrink-0' })
          ])
        )
      ])
    ]),

    // 4. Emergency Action Controls
    h('div', { className: 'space-y-2.5 pt-2' }, [
      h('button', {
        onClick: onResolve,
        className: 'w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition'
      }, [
        h(Icons.CheckCircle2, { className: 'w-5 h-5' }),
        h('span', null, "I Am Now Safe (Resolve Emergency)")
      ])
    ])
  ]);
};
