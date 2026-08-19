/**
 * SafeWalk AI - 5-Second Emergency Cancellation Countdown Modal
 */

window.SAFEWALK_EMERGENCY_COUNTDOWN = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const [count, setCount] = React.useState(5);

  React.useEffect(() => {
    if (!state.emergency.isCountdownActive) return;

    setCount(5);

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.SAFEWALK_STORE.triggerEmergency(state.emergency.pendingReason || "Emergency Assistance Triggered");
          return 0;
        }
        if (window.SAFEWALK_AUDIO_ENGINE) {
          window.SAFEWALK_AUDIO_ENGINE.playCountdownTick(850 + (5 - prev) * 50);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.emergency.isCountdownActive]);

  if (!state.emergency.isCountdownActive) return null;

  const contact = state.user.trustedContact;

  return h('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-lg animate-fadeIn'
  }, [
    h('div', {
      className: 'w-full max-w-md bg-slate-900 border-4 border-red-500 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(239,68,68,0.5)] text-center relative overflow-hidden'
    }, [
      // Pulsing siren badge
      h('div', { className: 'flex justify-center mb-4' }, [
        h('div', {
          className: 'w-20 h-20 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center text-red-500 animate-ping'
        }, [
          h(Icons.ShieldAlert, { className: 'w-10 h-10' })
        ])
      ]),

      // Giant Counter
      h('div', { className: 'my-3' }, [
        h('div', { className: 'text-6xl sm:text-7xl font-black text-red-500 font-mono tracking-tighter' }, count),
        h('h3', { className: 'text-xl font-black text-white mt-1' }, 'EMERGENCY ALERT DISPATCHING'),
        h('p', { className: 'text-xs text-red-200 mt-1 max-w-xs mx-auto' },
          `Broadcasting live GPS location & route details to ${contact.name} (${contact.relation}).`
        )
      ]),

      // Cancellation Notice
      h('div', { className: 'bg-slate-950 p-3 rounded-xl border border-red-500/30 my-4 text-xs text-slate-300' }, [
        h('div', { className: 'font-semibold text-white' }, `Reason: ${state.emergency.pendingReason || 'SOS Trigger'}`),
        h('div', { className: 'text-[11px] text-slate-400 mt-0.5' }, `Destination: ${state.journey.destName}`)
      ]),

      // Buttons
      h('div', { className: 'space-y-2.5' }, [
        // BIG CANCEL BUTTON
        h('button', {
          onClick: () => window.SAFEWALK_STORE.cancelEmergencyCountdown(),
          className: 'w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/40 flex items-center justify-center gap-2 transition active:scale-95'
        }, [
          h(Icons.XCircle, { className: 'w-5 h-5' }),
          h('span', null, "CANCEL (Accidentally Pressed)")
        ]),

        // INSTANT DISPATCH BUTTON
        h('button', {
          onClick: () => window.SAFEWALK_STORE.triggerEmergency(state.emergency.pendingReason || "Emergency SOS Triggered"),
          className: 'w-full py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wide transition'
        }, 'Dispatch Alert Immediately (Skip 5s) →')
      ])
    ])
  ]);
};
