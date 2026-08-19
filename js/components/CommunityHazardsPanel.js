/**
 * SafeWalk AI - Community Hazard Reporting & Monitoring Component
 */

window.SAFEWALK_COMMUNITY_HAZARDS = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const initialData = window.SAFEWALK_INITIAL_DATA || {};
  const h = React.createElement;

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [category, setCategory] = React.useState('broken_light');
  const [severity, setSeverity] = React.useState('High');
  const [description, setDescription] = React.useState('');

  const categories = initialData.hazardCategories || [
    { key: "broken_light", label: "Broken streetlight", defaultSeverity: "High" },
    { key: "isolated_area", label: "Isolated area", defaultSeverity: "Medium" },
    { key: "unsafe_crossing", label: "Unsafe crossing", defaultSeverity: "Medium" },
    { key: "suspicious_activity", label: "Suspicious activity", defaultSeverity: "High" },
    { key: "road_hazard", label: "Road hazard / Obstruction", defaultSeverity: "Low" },
    { key: "harassment_report", label: "Harassment report", defaultSeverity: "High" },
    { key: "other", label: "Other safety concern", defaultSeverity: "Low" }
  ];

  const currentCoords = state.journey.currentCoords || [37.7752, -122.4245];

  const nearbyHazards = window.SAFEWALK_ROUTE_UTILS
    ? window.SAFEWALK_ROUTE_UTILS.findNearbyHazards(currentCoords, state.hazards, 800)
    : state.hazards || [];

  const handleCategorySelect = (catKey) => {
    setCategory(catKey);
    const found = categories.find(c => c.key === catKey);
    if (found && found.defaultSeverity) {
      setSeverity(found.defaultSeverity);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const catObj = categories.find(c => c.key === category) || categories[0];

    window.SAFEWALK_STORE.reportHazard({
      category: catObj.label,
      categoryKey: catObj.key,
      severity,
      description: description || `Reported ${catObj.label.toLowerCase()} in the area.`,
      coords: [...currentCoords]
    });

    setDescription('');
    setIsModalOpen(false);
  };

  return h('div', { className: 'bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4' }, [
    // Header
    h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800' }, [
      h('div', { className: 'flex items-center gap-2.5' }, [
        h('div', { className: 'w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center' }, [
          h(Icons.AlertTriangle, { className: 'w-4 h-4' })
        ]),
        h('div', null, [
          h('h3', { className: 'text-sm font-bold text-white uppercase tracking-wider' }, 'Community Safety Hazards'),
          h('p', { className: 'text-xs text-slate-400' }, 'Crowdsourced safety advisories influencing journey risk scoring.')
        ])
      ]),

      h('button', {
        onClick: () => setIsModalOpen(true),
        className: 'px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-600/20 flex items-center gap-1.5 transition self-start sm:self-auto'
      }, [
        h(Icons.Plus, { className: 'w-4 h-4' }),
        h('span', null, 'Report Safety Hazard')
      ])
    ]),

    // Hazards List
    h('div', { className: 'space-y-2.5 max-h-[300px] overflow-y-auto pr-1' }, [
      nearbyHazards.length === 0 && h('div', { className: 'text-center py-6 text-slate-500 text-xs' }, 'No hazards reported near your current location.'),

      ...nearbyHazards.map(hz => {
        let badgeBg = "bg-amber-500/20 text-amber-300 border-amber-500/30";
        if (hz.severity === "High") badgeBg = "bg-red-500/20 text-red-300 border-red-500/30";
        if (hz.severity === "Low") badgeBg = "bg-slate-700/40 text-slate-300 border-slate-600";

        return h('div', {
          key: hz.id,
          className: 'bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition space-y-1'
        }, [
          h('div', { className: 'flex items-center justify-between gap-2' }, [
            h('div', { className: 'flex items-center gap-2' }, [
              h('span', { className: 'text-xs font-bold text-white' }, hz.category),
              h('span', { className: `text-[10px] uppercase font-bold px-2 py-0.2 rounded-full border ${badgeBg}` }, hz.severity)
            ]),
            h('span', { className: 'text-xs font-bold text-red-400' }, hz.formattedDistance || 'Nearby')
          ]),
          h('p', { className: 'text-xs text-slate-300' }, hz.description),
          h('div', { className: 'flex items-center justify-between text-[10px] text-slate-500 pt-1' }, [
            h('span', null, `Reported by: ${hz.reportedBy}`),
            h('span', null, new Date(hz.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
          ])
        ]);
      })
    ]),

    // Community Report Modal
    isModalOpen && h('div', {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn'
    }, [
      h('div', {
        className: 'w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4'
      }, [
        h('div', { className: 'flex items-center justify-between pb-3 border-b border-slate-800' }, [
          h('div', { className: 'flex items-center gap-2' }, [
            h(Icons.AlertTriangle, { className: 'w-5 h-5 text-red-400' }),
            h('h3', { className: 'text-base font-bold text-white' }, 'Report a Safety Concern')
          ]),
          h('button', {
            onClick: () => setIsModalOpen(false),
            className: 'text-slate-400 hover:text-white p-1 rounded-lg'
          }, [
            h(Icons.XCircle, { className: 'w-5 h-5' })
          ])
        ]),

        h('form', { onSubmit: handleSubmit, className: 'space-y-4' }, [
          // Category selector
          h('div', null, [
            h('label', { className: 'block text-xs font-semibold text-slate-300 uppercase mb-1.5' }, 'Hazard Category'),
            h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 gap-2' }, [
              ...categories.map(c =>
                h('button', {
                  type: 'button',
                  key: c.key,
                  onClick: () => handleCategorySelect(c.key),
                  className: `p-2 rounded-xl text-xs font-semibold border transition text-left ${
                    category === c.key
                      ? 'bg-red-600/20 border-red-500 text-red-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`
                }, c.label)
              )
            ])
          ]),

          // Severity
          h('div', null, [
            h('label', { className: 'block text-xs font-semibold text-slate-300 uppercase mb-1' }, 'Severity Level'),
            h('div', { className: 'flex gap-2' }, [
              ['Low', 'bg-slate-700 text-slate-200'],
              ['Medium', 'bg-amber-600 text-white'],
              ['High', 'bg-red-600 text-white']
            ].map(([lvl, col]) =>
              h('button', {
                type: 'button',
                key: lvl,
                onClick: () => setSeverity(lvl),
                className: `flex-1 py-1.5 rounded-lg text-xs font-bold transition border ${
                  severity === lvl ? `${col} border-white/40 shadow` : 'bg-slate-800 text-slate-400 border-slate-700'
                }`
              }, lvl)
            ))
          ]),

          // Description
          h('div', null, [
            h('label', { className: 'block text-xs font-semibold text-slate-300 uppercase mb-1' }, 'Description & Context'),
            h('textarea', {
              value: description,
              onChange: (e) => setDescription(e.target.value),
              placeholder: 'Describe the safety condition (e.g. 3 streetlights out, dark alleyway, aggressive dogs)...',
              rows: 3,
              required: true,
              className: 'w-full bg-slate-800 text-white rounded-xl p-3 text-xs border border-slate-700 focus:outline-none focus:border-red-500'
            })
          ]),

          // Location note
          h('div', { className: 'bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2' }, [
            h(Icons.MapPin, { className: 'w-4 h-4 text-red-400 shrink-0' }),
            h('span', null, `Pinning report at current GPS coordinates (${currentCoords[0].toFixed(4)}, ${currentCoords[1].toFixed(4)})`)
          ]),

          // Submit
          h('div', { className: 'flex gap-2 pt-2' }, [
            h('button', {
              type: 'button',
              onClick: () => setIsModalOpen(false),
              className: 'flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold'
            }, 'Cancel'),
            h('button', {
              type: 'submit',
              className: 'flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30'
            }, 'Submit Report')
          ])
        ])
      ])
    ])
  ]);
};
