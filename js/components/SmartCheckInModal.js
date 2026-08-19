/**
 * SafeWalk AI - Smart Check-In Modal Component
 * Displays "Are you okay?" prompt with 3 options and auto-escalation countdown timer.
 */

window.SAFEWALK_SMART_CHECKIN_MODAL = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const [timeLeft, setTimeLeft] = React.useState(state.checkIn.countdownSeconds || 25);

  React.useEffect(() => {
    if (!state.checkIn.isModalOpen) return;

    setTimeLeft(state.checkIn.countdownSeconds || 25);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.SAFEWALK_STORE.expireCheckInTimeout();
          return 0;
        }
        // Play soft tick during last 5 seconds of prompt
        if (prev <= 6 && window.SAFEWALK_AUDIO_ENGINE) {
          window.SAFEWALK_AUDIO_ENGINE.playCountdownTick(600);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.checkIn.isModalOpen]);

  if (!state.checkIn.isModalOpen) return null;

  const progressPercent = (timeLeft / (state.checkIn.maxCountdownSeconds || 25)) * 100;

  return h('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn'
  }, [
    h('div', {
      className: 'w-full max-w-md bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden animate-scaleUp'
    }, [
      // Top Glowing Pulse
      h('div', { className: 'flex justify-center mb-4' }, [
        h('div', {
          className: 'w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse'
        }, [
          h(Icons.ShieldCheck, { className: 'w-8 h-8' })
        ])
      ]),

      // Title & Subtitle
      h('div', { className: 'text-center space-y-1.5' }, [
        h('h3', { className: 'text-2xl font-black tracking-tight text-white' }, 'Are you okay?'),
        h('p', { className: 'text-xs text-slate-300' },
          'SafeWalk AI periodic safety check-in. Please select your status below.'
        )
      ]),

      // Countdown Bar
      h('div', { className: 'my-5 space-y-1.5' }, [
        h('div', { className: 'flex justify-between text-xs font-semibold' }, [
          h('span', { className: 'text-slate-400' }, 'Auto-escalation in:'),
          h('span', { className: `font-mono ${timeLeft <= 5 ? 'text-red-400 animate-ping' : 'text-emerald-400 font-bold'}` },
            `${timeLeft}s`
          )
        ]),
        h('div', { className: 'w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700' }, [
          h('div', {
            className: `h-full rounded-full transition-all duration-1000 ${
              timeLeft <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`,
            style: { width: `${progressPercent}%` }
          })
        ])
      ]),

      // The 3 Required Options
      h('div', { className: 'space-y-3' }, [
        // 1. I'm Safe
        h('button', {
          onClick: () => window.SAFEWALK_STORE.respondCheckIn('safe'),
          className: 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm tracking-wide uppercase shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition active:scale-[0.98]'
        }, [
          h(Icons.CheckCircle2, { className: 'w-5 h-5' }),
          h('span', null, "I'm Safe (All Good)")
        ]),

        // 2. Need Help
        h('button', {
          onClick: () => window.SAFEWALK_STORE.respondCheckIn('help'),
          className: 'w-full py-3 px-4 rounded-2xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm tracking-wide uppercase shadow-lg shadow-red-600/30 flex items-center justify-center gap-2.5 transition active:scale-[0.98]'
        }, [
          h(Icons.ShieldAlert, { className: 'w-5 h-5' }),
          h('span', null, 'Need Help (Emergency)')
        ]),

        // 3. Can't Respond (Silent Mode)
        h('button', {
          onClick: () => window.SAFEWALK_STORE.respondCheckIn('cant_talk'),
          className: 'w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition'
        }, [
          h(Icons.EyeOff, { className: 'w-4 h-4 text-purple-400' }),
          h('span', null, "Can't Respond (Switch to Silent SOS)")
        ])
      ]),

      // Footer note
      h('p', { className: 'text-[11px] text-center text-slate-500 mt-4' },
        'If you do not respond, SafeWalk will automatically alert your trusted contact.'
      )
    ])
  ]);
};
