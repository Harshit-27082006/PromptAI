/**
 * SafeWalk AI - AI Safety Intelligence Dashboard Panel
 * Presents predictive risk trajectory, behavior anomalies, hazard clusters,
 * route comparisons, and explainable AI recommendations.
 */

window.SAFEWALK_AI_PANEL = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const [showHowDecided, setShowHowDecided] = React.useState(false);
  const [showRouteAdvisor, setShowRouteAdvisor] = React.useState(false);

  const ai = state.aiIntelligence || (
    window.SAFEWALK_SAFETY_INTELLIGENCE
      ? window.SAFEWALK_SAFETY_INTELLIGENCE.analyzeSafety(state)
      : null
  );

  if (!ai) return null;

  const { prediction, behavior, hazards, routeAdvisor, explanation } = ai;

  // Trend Badge styling
  let trendIcon = Icons.ArrowRight;
  let trendBadgeColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (prediction.riskTrend === "RAPIDLY_INCREASING") {
    trendBadgeColor = "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse";
    trendIcon = Icons.Zap;
  } else if (prediction.riskTrend === "INCREASING") {
    trendBadgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
    trendIcon = Icons.ArrowRight;
  }

  // Behavior Badge styling
  let behaviorBadge = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (behavior.behaviorStatus === "HIGHLY_UNUSUAL") {
    behaviorBadge = "bg-red-500/20 text-red-300 border-red-500/40 font-bold";
  } else if (behavior.behaviorStatus === "UNUSUAL") {
    behaviorBadge = "bg-amber-500/20 text-amber-300 border-amber-500/40";
  }

  // Apply Recommended Route
  const handleAdoptRecommendedRoute = (route) => {
    if (!route) return;
    window.SAFEWALK_STORE.updateState(s => ({
      ...s,
      journey: {
        ...s.journey,
        waypoints: route.waypoints,
        destCoords: route.waypoints[route.waypoints.length - 1],
        isDeviated: false,
        deviationMeters: 0
      }
    }));
    window.SAFEWALK_STORE.addLog("AI Recommended Route Adopted", `Switched to ${route.name} (Safety Score: ${route.safetyScore}/100)`, "journey");
  };

  return h('div', {
    className: 'bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-5 relative overflow-hidden'
  }, [
    // Background AI ambient glow
    h('div', {
      className: 'absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none'
    }),

    // Header Row
    h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 relative z-10' }, [
      h('div', { className: 'flex items-center gap-3' }, [
        h('div', { className: 'w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30' }, [
          h(Icons.Zap, { className: 'w-5 h-5' })
        ]),
        h('div', null, [
          h('div', { className: 'flex items-center gap-2' }, [
            h('h3', { className: 'text-base font-black text-white tracking-wide uppercase' }, 'AI Safety Intelligence Layer'),
            h('span', { className: 'text-[10px] uppercase font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full' }, 'Predictive v2.0')
          ]),
          h('p', { className: 'text-xs text-slate-400' }, 'Contextual neural reasoning & trajectory forecasting')
        ])
      ]),

      h('div', { className: 'flex items-center gap-2 self-start sm:self-auto' }, [
        h('button', {
          onClick: () => setShowRouteAdvisor(!showRouteAdvisor),
          className: `px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
            showRouteAdvisor
              ? 'bg-cyan-600 text-white border-cyan-400 shadow'
              : 'bg-slate-800 text-cyan-400 border-slate-700 hover:bg-slate-750'
          }`
        }, [
          h(Icons.Compass, { className: 'w-3.5 h-3.5' }),
          h('span', null, showRouteAdvisor ? 'Hide Route Advisor' : 'Route Advisor (3 Options)')
        ])
      ])
    ]),

    // 1. Core Metrics Grid (Current Risk, Predicted Risk, Behavior, Hazard Cluster)
    h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10' }, [
      // Current vs Predicted Risk
      h('div', { className: 'bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400 tracking-wider' }, 'Current Risk'),
        h('div', { className: 'flex items-baseline gap-1' }, [
          h('span', { className: 'text-2xl font-black text-white' }, prediction.currentRisk),
          h('span', { className: 'text-xs text-slate-400' }, '/100')
        ]),
        h('div', { className: 'text-[11px] text-slate-400 font-medium pt-0.5' }, 'Real-time score')
      ]),

      // Predicted Risk (Next 5 Mins)
      h('div', { className: 'bg-slate-950/80 p-3.5 rounded-2xl border border-indigo-500/30 space-y-1 relative' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-indigo-400 tracking-wider' }, 'Predicted Risk (5m)'),
        h('div', { className: 'flex items-baseline gap-1' }, [
          h('span', { className: 'text-2xl font-black text-indigo-300' }, prediction.predictedRisk),
          h('span', { className: 'text-xs text-slate-400' }, '/100')
        ]),
        h('div', { className: `text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border inline-flex items-center gap-1 ${trendBadgeColor}` }, [
          h(trendIcon, { className: 'w-3 h-3' }),
          h('span', null, prediction.trendLabel)
        ])
      ]),

      // Behavior Status
      h('div', { className: 'bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400 tracking-wider' }, 'Behavior Kinematics'),
        h('div', { className: 'flex items-baseline gap-1' }, [
          h('span', { className: 'text-2xl font-black text-white' }, behavior.anomalyScore),
          h('span', { className: 'text-xs text-slate-400' }, 'anomaly pts')
        ]),
        h('div', { className: `text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border inline-block ${behaviorBadge}` },
          behavior.behaviorStatus.replace('_', ' ')
        )
      ]),

      // Hazard Cluster & Safe Zone
      h('div', { className: 'bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1' }, [
        h('div', { className: 'text-[10px] uppercase font-bold text-slate-400 tracking-wider' }, 'Hazard Cluster'),
        h('div', { className: 'text-sm font-extrabold text-white truncate' },
          hazards.activeClusterCount > 0 ? hazards.nearestCluster?.name || 'Cluster Near' : 'Zero Clusters'
        ),
        h('div', { className: 'text-[11px] text-slate-400' },
          `Nearest Safe Zone: ${ai.context.nearestSafeZone ? Math.round(ai.context.nearestSafeZone.distanceMeters || 180) + 'm' : 'Nearby'}`
        )
      ])
    ]),

    // 2. Trajectory Prediction Narrative Banner
    prediction.rationale && h('div', {
      className: 'bg-indigo-950/50 border border-indigo-500/30 p-3.5 rounded-2xl text-xs text-indigo-200 flex items-start gap-2.5 relative z-10'
    }, [
      h(Icons.Zap, { className: 'w-4 h-4 text-cyan-400 shrink-0 mt-0.5' }),
      h('div', { className: 'space-y-0.5' }, [
        h('span', { className: 'font-bold text-white uppercase text-[11px] block' }, 'Predictive Risk Trajectory:'),
        h('p', { className: 'leading-relaxed' }, prediction.rationale)
      ])
    ]),

    // 3. Actionable AI Recommendation Box (Prompt Requirement #8 & #9)
    h('div', {
      className: `p-4 sm:p-5 rounded-2xl border ${
        explanation.recommendationLevel === 'critical'
          ? 'bg-red-950/60 border-red-500/40 text-red-200'
          : (explanation.recommendationLevel === 'warning'
              ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
              : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200')
      } space-y-3 relative z-10`
    }, [
      h('div', { className: 'flex items-center justify-between' }, [
        h('div', { className: 'flex items-center gap-2' }, [
          h(Icons.ShieldCheck, { className: 'w-4 h-4 text-white' }),
          h('span', { className: 'text-xs font-black uppercase tracking-wider text-white' }, 'AI Safety Recommendation')
        ]),
        h('span', { className: 'text-[10px] font-bold uppercase bg-white/10 px-2 py-0.5 rounded-full text-white' },
          explanation.recommendationTitle
        ])
      ]),

      h('p', { className: 'text-sm font-semibold text-white leading-relaxed' },
        `“${explanation.recommendationText}”`
      ),

      // "Why this recommendation?" Section (Prompt Requirement #9)
      h('div', { className: 'pt-2 border-t border-white/10 space-y-1.5' }, [
        h('div', { className: 'text-[11px] font-bold text-slate-300 uppercase tracking-wide' }, 'Why this recommendation?'),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-2' }, [
          ...explanation.whyPoints.map((pt, idx) =>
            h('div', { key: idx, className: 'bg-black/30 p-2 rounded-xl text-xs text-slate-200 flex items-center gap-1.5' }, [
              h('span', { className: 'text-emerald-400 font-bold' }, '•'),
              h('span', null, pt)
            ])
          )
        ])
      ])
    ]),

    // 4. Route Advisor (3 Candidate Routes) Expansion
    showRouteAdvisor && h('div', {
      className: 'bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn relative z-10'
    }, [
      h('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-800' }, [
        h('div', { className: 'flex items-center gap-2' }, [
          h(Icons.Compass, { className: 'w-4 h-4 text-cyan-400' }),
          h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, 'AI Candidate Route Comparison')
        ]),
        h('span', { className: 'text-[11px] text-slate-400' }, 'Safety Score > Shortest Distance')
      ]),

      h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-3' }, [
        ...(routeAdvisor.allCandidateRoutes || []).map((r, idx) => {
          const isRec = r.isRecommended;
          return h('div', {
            key: r.id || idx,
            className: `p-3.5 rounded-2xl border transition flex flex-col justify-between gap-3 ${
              isRec
                ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-800'
            }`
          }, [
            h('div', { className: 'space-y-1.5' }, [
              h('div', { className: 'flex items-center justify-between' }, [
                h('span', { className: `text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isRec ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }` }, r.tag || `Route ${idx + 1}`),
                h('span', { className: 'text-xs font-bold text-emerald-400' }, `Score: ${r.safetyScore}/100`)
              ]),
              h('div', { className: 'text-sm font-bold text-white' }, r.name),
              h('div', { className: 'text-xs text-slate-300 flex items-center gap-2' }, [
                h('span', null, r.formattedDistance),
                h('span', null, '•'),
                h('span', null, `~${r.walkingDurationMins} min walk`)
              ]),
              h('div', { className: 'text-[11px] text-slate-400' }, [
                h('span', { className: r.hazardCount > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400' },
                  `${r.hazardCount} Hazard(s) reported`
                ),
                h('span', null, ` • ${r.safeZonesNearRoute} Safe Zones near path`)
              ])
            ]),

            h('button', {
              onClick: () => handleAdoptRecommendedRoute(r),
              className: `w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isRec
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`
            }, [
              h(Icons.Check, { className: 'w-3.5 h-3.5' }),
              h('span', null, isRec ? 'Adopt Recommended Route' : 'Select This Route')
            ])
          ]);
        })
      ]),

      h('div', { className: 'text-xs text-cyan-200 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/20' },
        routeAdvisor.rationale
      )
    ]),

    // 5. "How did AI decide?" Transparent Factor Weights (Prompt Requirement #12)
    h('div', { className: 'pt-1 relative z-10' }, [
      h('button', {
        onClick: () => setShowHowDecided(!showHowDecided),
        className: 'w-full py-2 px-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between transition'
      }, [
        h('div', { className: 'flex items-center gap-2' }, [
          h(Icons.Info, { className: 'w-3.5 h-3.5 text-indigo-400' }),
          h('span', null, 'How did AI decide? (Explainable Factor Weights)')
        ]),
        h(showHowDecided ? Icons.ChevronUp : Icons.ChevronDown, { className: 'w-4 h-4 text-slate-400' })
      ]),

      showHowDecided && h('div', {
        className: 'mt-2.5 p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2 animate-fadeIn'
      }, [
        h('div', { className: 'text-[11px] font-bold text-slate-400 uppercase tracking-wider' }, 'Mathematical Factor Impact on Predicted Risk'),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' }, [
          ...explanation.factorBreakdown.map((f, i) =>
            h('div', {
              key: i,
              className: 'p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs'
            }, [
              h('div', null, [
                h('div', { className: 'font-semibold text-slate-200' }, f.name),
                h('div', { className: 'text-[10px] text-slate-400' }, f.detail)
              ]),
              h('span', { className: `font-mono font-bold px-2 py-0.5 rounded ${
                f.type === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-300'
              }` }, f.points)
            ])
          )
        ])
      ])
    ]),

    // 6. Safety Principles & Ethical Disclaimer (Prompt Requirement #19)
    h('div', {
      className: 'text-[10px] text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/60 flex items-start gap-2 relative z-10'
    }, [
      h(Icons.Shield, { className: 'w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5' }),
      h('span', null,
        'AI Safety Intelligence provides journey-risk decision support based on contextual kinematics and spatial data. It does not predict crimes, identify criminals, or guarantee absolute safety.'
      )
    ])
  ]);
};
