/**
 * SafeWalk AI - Safe Zones Panel Component
 * Displays nearby verified safety havens with distance, hours, and contact hotline.
 */

window.SAFEWALK_SAFE_ZONES_PANEL = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const currentCoords = state.journey.currentCoords || [37.7752, -122.4245];

  const enrichedZones = window.SAFEWALK_ROUTE_UTILS
    ? window.SAFEWALK_ROUTE_UTILS.findNearestSafeZones(currentCoords, state.safeZones, 20)
    : state.safeZones || [];

  const filteredZones = enrichedZones.filter(sz => {
    const matchesCategory = activeCategory === 'all' || sz.category === activeCategory;
    const matchesSearch = !searchQuery ||
      sz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sz.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { key: 'all', label: 'All Havens' },
    { key: 'police', label: 'Police' },
    { key: 'hospital', label: 'Hospitals / ER' },
    { key: 'store', label: '24/7 Stores' },
    { key: 'transit', label: 'Transit' },
    { key: 'security', label: 'Campus Security' }
  ];

  return h('div', { className: 'bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4' }, [
    // Header
    h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800' }, [
      h('div', { className: 'flex items-center gap-2.5' }, [
        h('div', { className: 'w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center' }, [
          h(Icons.Shield, { className: 'w-4 h-4' })
        ]),
        h('div', null, [
          h('h3', { className: 'text-sm font-bold text-white uppercase tracking-wider' }, 'Nearby Safe Havens & Resources'),
          h('p', { className: 'text-xs text-slate-400' }, 'Verified 24/7 accessible locations with security or staff.')
        ])
      ]),
      h('span', { className: 'text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/30' },
        `${filteredZones.length} Safe Havens Mapped`
      )
    ]),

    // Category Filter Chips
    h('div', { className: 'flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar' }, [
      ...categories.map(c =>
        h('button', {
          key: c.key,
          onClick: () => setActiveCategory(c.key),
          className: `px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeCategory === c.key
              ? 'bg-blue-600 text-white font-bold shadow'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`
        }, c.label)
      )
    ]),

    // Safe Zones List
    h('div', { className: 'space-y-2.5 max-h-[360px] overflow-y-auto pr-1' }, [
      filteredZones.length === 0 && h('div', { className: 'text-center py-6 text-slate-500 text-xs' }, 'No safe zones match your filter.'),

      ...filteredZones.map(sz => {
        let badgeColor = "bg-blue-500/20 text-blue-300 border-blue-500/30";
        if (sz.category === "hospital") badgeColor = "bg-red-500/20 text-red-300 border-red-500/30";
        if (sz.category === "store") badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
        if (sz.category === "transit") badgeColor = "bg-purple-500/20 text-purple-300 border-purple-500/30";

        return h('div', {
          key: sz.id,
          className: 'bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3'
        }, [
          h('div', { className: 'space-y-1 min-w-0' }, [
            h('div', { className: 'flex items-center gap-2 flex-wrap' }, [
              h('span', { className: 'text-xs font-bold text-white truncate' }, sz.name),
              h('span', { className: `text-[10px] px-2 py-0.5 rounded-full border ${badgeColor}` }, sz.categoryLabel)
            ]),
            h('div', { className: 'text-[11px] text-slate-400 flex items-center gap-2' }, [
              h('span', null, sz.address),
              h('span', null, '•'),
              h('span', { className: 'text-emerald-400 font-semibold' }, sz.hours)
            ]),
            sz.features && h('div', { className: 'flex items-center gap-1.5 flex-wrap pt-0.5' }, [
              ...sz.features.slice(0, 3).map((feat, i) =>
                h('span', { key: i, className: 'text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded' }, `✓ ${feat}`)
              )
            ])
          ]),

          h('div', { className: 'flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60' }, [
            h('div', { className: 'text-right' }, [
              h('div', { className: 'text-xs font-bold text-blue-400' }, sz.formattedDistance || 'Nearby'),
              h('div', { className: 'text-[10px] text-slate-400' }, `~${sz.walkTimeMin || 2} min walk`)
            ]),
            h('a', {
              href: `tel:${sz.phone}`,
              className: 'px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700'
            }, [
              h(Icons.Phone, { className: 'w-3 h-3 text-emerald-400' }),
              h('span', null, 'Call')
            ])
          ])
        ]);
      })
    ])
  ]);
};
