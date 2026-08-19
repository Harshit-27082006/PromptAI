/**
 * SafeWalk AI - Safety Status Banner & Predictive Diagnostics Component
 */

window.SAFEWALK_SAFETY_BANNER = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;
  const [showDiagnostics, setShowDiagnostics] = React.useState(false);

  const risk = state.risk || { score: 10, status: "GREEN", statusLabel: "SAFE", factors: [] };
  const score = risk.score || 0;
  const status = risk.status || "GREEN";

  let bgGradient = "from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/40 text-emerald-300";
  let ringGlow = "shadow-[0_0_30px_rgba(16,185,129,0.25)] border-emerald-500/40";
  let badgeColor = "bg-emerald-500 text-slate-950";
  let progressColor = "bg-emerald-500";
  let IconComponent = Icons.ShieldCheck;

  if (status === "YELLOW") {
    bgGradient = "from-amber-950/80 via-slate-900 to-slate-950 border-amber-500/40 text-amber-300";
    ringGlow = "shadow-[0_0_30px_rgba(245,158,11,0.25)] border-amber-500/40";
    badgeColor = "bg-amber-400 text-slate-950";
    progressColor = "bg-amber-400";
    IconComponent = Icons.AlertTriangle;
  } else if (status === "RED") {
    bgGradient = "from-red-950/90 via-slate-900 to-slate-950 border-red-500/60 text-red-300";
    ringGlow = "shadow-[0_0_40px_rgba(239,68,68,0.4)] border-red-500/60";
    badgeColor = "bg-red-500 text-white animate-pulse";
    progressColor = "bg-red-500";
    IconComponent = Icons.AlertOctagon;
  }

  return h('div', {
    className: `w-full rounded-2xl border p-4 sm:p-5 bg-gradient-to-br ${bgGradient} ${ringGlow} transition-all duration-500 relative overflow-hidden`
  }, [
    // Background safety grid pattern
    h('div', {
      className: 'absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]'
    }),

    // Main Card Row
    h('div', { className: 'relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4' }, [
      // Left: Icon + Status Name + Description
      h('div', { className: 'flex items-center gap-3.5' }, [
        h('div', {
          className: `w-14 h-14 rounded-2xl flex items-center justify-center border ${ringGlow} bg-slate-900/90 shrink-0`
        }, [
          h(IconComponent, { className: 'w-8 h-8' })
        ]),
        h('div', null, [
          h('div', { className: 'flex items-center gap-2 flex-wrap' }, [
            h('span', { className: 'text-xl sm:text-2xl font-black tracking-tight text-white' }, risk.statusLabel),
            h('span', { className: `text-xs font-extrabold uppercase px-2 py-0.5 rounded-full ${badgeColor}` }, `${status} STATUS`)
          ]),
          h('p', { className: 'text-xs sm:text-sm text-slate-300 mt-0.5 leading-snug max-w-xl' }, risk.statusSublabel)
        ])
      ]),

      // Right: Risk Score Meter & Diagnostics Button
      h('div', { className: 'flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800' }, [
        // Score Gauge
        h('div', { className: 'text-right' }, [
          h('div', { className: 'text-[11px] uppercase tracking-wider text-slate-400 font-semibold' }, 'Journey Risk Score'),
          h('div', { className: 'flex items-baseline justify-end gap-1' }, [
            h('span', { className: 'text-3xl sm:text-4xl font-black text-white' }, score),
            h('span', { className: 'text-xs font-semibold text-slate-400' }, '/100')
          ])
        ]),

        // Progress Pill
        h('div', { className: 'w-20 sm:w-28 flex flex-col gap-1' }, [
          h('div', { className: 'w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700' }, [
            h('div', {
              className: `h-full rounded-full transition-all duration-700 ${progressColor}`,
              style: { width: `${score}%` }
            })
          ]),
          h('button', {
            onClick: () => setShowDiagnostics(!showDiagnostics),
            className: 'text-[11px] font-medium text-slate-300 hover:text-white flex items-center justify-end gap-1 transition'
          }, [
            h('span', null, showDiagnostics ? 'Hide AI Factors' : 'View AI Factors'),
            h(showDiagnostics ? Icons.ChevronUp : Icons.ChevronDown, { className: 'w-3 h-3' })
          ])
        ])
      ])
    ]),

    // Expandable Diagnostics Panel
    showDiagnostics && h('div', {
      className: 'mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2.5 animate-fadeIn'
    }, [
      ...(risk.factors || []).map((f, idx) => {
        let badgeBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
        if (f.level === "medium" || f.level === "low") badgeBg = "bg-amber-500/10 text-amber-300 border-amber-500/30";
        if (f.level === "high" || f.level === "critical") badgeBg = "bg-red-500/10 text-red-300 border-red-500/30 font-semibold";

        return h('div', {
          key: idx,
          className: 'bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2'
        }, [
          h('div', { className: 'flex flex-col' }, [
            h('span', { className: 'text-xs font-semibold text-slate-200' }, f.name),
            h('span', { className: 'text-[11px] text-slate-400' }, f.label)
          ]),
          h('span', { className: `text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badgeBg}` },
            f.score > 0 ? `+${f.score} pts` : `${f.score} pts`
          )
        ]);
      }),

      // Legal & Principle Disclaimer
      h('div', {
        className: 'md:col-span-2 text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/60 flex items-start gap-2 mt-1'
      }, [
        h(Icons.Info, { className: 'w-4 h-4 text-cyan-400 shrink-0 mt-0.5' }),
        h('span', null,
          'SafeWalk AI Disclaimer: The safety risk score is a real-time predictive journey-risk indicator based on contextual factors (route deviations, time, inactivity, community hazards, safe zones). It does not represent real-world crime prediction or police dispatch guarantee.'
        )
      ])
    ])
  ]);
};
