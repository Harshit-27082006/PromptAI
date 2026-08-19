/**
 * SafeWalk AI - Journey Planner & Start Journey Modal/Form
 */

window.SAFEWALK_JOURNEY_PLANNER = function(props) {
  const { state, onStartJourney } = props;
  const Icons = window.SAFEWALK_ICONS;
  const initialData = window.SAFEWALK_INITIAL_DATA || {};
  const h = React.createElement;

  const [selectedRouteId, setSelectedRouteId] = React.useState(
    initialData.presetRoutes && initialData.presetRoutes.length > 0 ? initialData.presetRoutes[0].id : ""
  );
  const [startName, setStartName] = React.useState(
    initialData.presetRoutes && initialData.presetRoutes.length > 0 ? initialData.presetRoutes[0].startName : ""
  );
  const [destName, setDestName] = React.useState(
    initialData.presetRoutes && initialData.presetRoutes.length > 0 ? initialData.presetRoutes[0].destName : ""
  );
  const [expectedDuration, setExpectedDuration] = React.useState(
    initialData.presetRoutes && initialData.presetRoutes.length > 0 ? initialData.presetRoutes[0].expectedDurationMinutes : 18
  );
  const [trustedName, setTrustedName] = React.useState(state.user.trustedContact.name || "Priya Sharma");
  const [trustedPhone, setTrustedPhone] = React.useState(state.user.trustedContact.phone || "+1 (555) 987-6543");
  const [trustedRelation, setTrustedRelation] = React.useState(state.user.trustedContact.relation || "Sister");
  const [isGPSLive, setIsGPSLive] = React.useState(false);
  const [simulatedHour, setSimulatedHour] = React.useState(23); // Default 11 PM for hackathon evaluation

  const handleRouteChange = (e) => {
    const rId = e.target.value;
    setSelectedRouteId(rId);
    const found = (initialData.presetRoutes || []).find(r => r.id === rId);
    if (found) {
      setStartName(found.startName);
      setDestName(found.destName);
      setExpectedDuration(found.expectedDurationMinutes);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const route = (initialData.presetRoutes || []).find(r => r.id === selectedRouteId) || initialData.presetRoutes[0];

    // Update user contact
    window.SAFEWALK_STORE.updateState(s => ({
      ...s,
      user: {
        ...s.user,
        trustedContact: {
          ...s.user.trustedContact,
          name: trustedName,
          phone: trustedPhone,
          relation: trustedRelation
        }
      },
      journey: {
        ...s.journey,
        simulatedHour: parseInt(simulatedHour, 10)
      }
    }));

    window.SAFEWALK_STORE.startJourney({
      route,
      startName,
      destName,
      expectedDurationMinutes: parseInt(expectedDuration, 10),
      isGPSLive
    });
  };

  return h('div', {
    className: 'w-full max-w-xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-2xl backdrop-blur-md'
  }, [
    // Header
    h('div', { className: 'flex items-center gap-3 pb-4 border-b border-slate-800' }, [
      h('div', { className: 'w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center' }, [
        h(Icons.Navigation, { className: 'w-5 h-5' })
      ]),
      h('div', null, [
        h('h2', { className: 'text-lg font-bold text-white' }, 'Start a Safe Journey'),
        h('p', { className: 'text-xs text-slate-400' }, 'Configure your route, trusted contacts, and predictive monitoring.')
      ])
    ]),

    // Form
    h('form', { onSubmit: handleSubmit, className: 'mt-5 space-y-4' }, [
      // Preset Selector
      h('div', null, [
        h('label', { className: 'block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5' }, 'Select Preset Demo Route'),
        h('select', {
          value: selectedRouteId,
          onChange: handleRouteChange,
          className: 'w-full bg-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm border border-slate-700 focus:outline-none focus:border-emerald-500'
        }, [
          ...(initialData.presetRoutes || []).map(r =>
            h('option', { key: r.id, value: r.id }, `${r.name} (${r.expectedDurationMinutes} min)`)
          )
        ])
      ]),

      // Start & Destination Inputs
      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }, [
        h('div', null, [
          h('label', { className: 'block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1' }, 'Start Location'),
          h('div', { className: 'relative' }, [
            h('input', {
              type: 'text',
              value: startName,
              onChange: (e) => setStartName(e.target.value),
              required: true,
              className: 'w-full bg-slate-800 text-white rounded-xl pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-emerald-500'
            }),
            h(Icons.MapPin, { className: 'w-4 h-4 text-emerald-400 absolute left-3 top-2.5' })
          ])
        ]),
        h('div', null, [
          h('label', { className: 'block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1' }, 'Destination'),
          h('div', { className: 'relative' }, [
            h('input', {
              type: 'text',
              value: destName,
              onChange: (e) => setDestName(e.target.value),
              required: true,
              className: 'w-full bg-slate-800 text-white rounded-xl pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-emerald-500'
            }),
            h(Icons.Flag || Icons.MapPin, { className: 'w-4 h-4 text-cyan-400 absolute left-3 top-2.5' })
          ])
        ])
      ]),

      // Expected Duration & Time of Day
      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }, [
        h('div', null, [
          h('label', { className: 'block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1' }, 'Expected Walking Time'),
          h('div', { className: 'relative' }, [
            h('input', {
              type: 'number',
              min: '1',
              max: '120',
              value: expectedDuration,
              onChange: (e) => setExpectedDuration(e.target.value),
              className: 'w-full bg-slate-800 text-white rounded-xl pl-9 pr-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-emerald-500'
            }),
            h(Icons.Clock, { className: 'w-4 h-4 text-slate-400 absolute left-3 top-2.5' })
          ])
        ]),
        h('div', null, [
          h('label', { className: 'block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1' }, 'Simulated Time of Travel'),
          h('select', {
            value: simulatedHour,
            onChange: (e) => setSimulatedHour(e.target.value),
            className: 'w-full bg-slate-800 text-white rounded-xl px-3 py-2 text-sm border border-slate-700 focus:outline-none focus:border-emerald-500'
          }, [
            h('option', { value: 23 }, '11:00 PM (Night Walk — High Vigilance)'),
            h('option', { value: 2 }, '02:00 AM (Late Night — Elevated Risk)'),
            h('option', { value: 19 }, '07:00 PM (Dusk / Evening Walk)'),
            h('option', { value: 14 }, '02:00 PM (Daytime Walk)')
          ])
        ])
      ]),

      // Trusted Contact Section
      h('div', { className: 'bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3' }, [
        h('div', { className: 'flex items-center justify-between' }, [
          h('div', { className: 'flex items-center gap-2' }, [
            h(Icons.Users, { className: 'w-4 h-4 text-indigo-400' }),
            h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, 'Emergency Trusted Contact')
          ]),
          h('span', { className: 'text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20' }, 'Syncs to Live Dashboard')
        ]),

        h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-2' }, [
          h('input', {
            type: 'text',
            placeholder: 'Name (e.g. Priya)',
            value: trustedName,
            onChange: (e) => setTrustedName(e.target.value),
            required: true,
            className: 'bg-slate-800 text-white rounded-lg px-2.5 py-1.5 text-xs border border-slate-700 focus:outline-none focus:border-indigo-500'
          }),
          h('input', {
            type: 'text',
            placeholder: 'Relation (e.g. Sister)',
            value: trustedRelation,
            onChange: (e) => setTrustedRelation(e.target.value),
            className: 'bg-slate-800 text-white rounded-lg px-2.5 py-1.5 text-xs border border-slate-700 focus:outline-none focus:border-indigo-500'
          }),
          h('input', {
            type: 'text',
            placeholder: 'Phone (+1...)',
            value: trustedPhone,
            onChange: (e) => setTrustedPhone(e.target.value),
            className: 'bg-slate-800 text-white rounded-lg px-2.5 py-1.5 text-xs border border-slate-700 focus:outline-none focus:border-indigo-500'
          })
        ])
      ]),

      // Mode Switch: Simulation vs Real Geolocation
      h('div', { className: 'flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700/60' }, [
        h('div', { className: 'flex items-center gap-2' }, [
          h(Icons.Compass, { className: 'w-4 h-4 text-emerald-400' }),
          h('div', null, [
            h('span', { className: 'text-xs font-semibold text-slate-200 block' }, 'Demo Simulation Mode'),
            h('span', { className: 'text-[10px] text-slate-400' }, 'Allows interactive testing without physical walking')
          ])
        ]),
        h('label', { className: 'relative inline-flex items-center cursor-pointer' }, [
          h('input', {
            type: 'checkbox',
            checked: !isGPSLive,
            onChange: (e) => setIsGPSLive(!e.target.checked),
            className: 'sr-only peer'
          }),
          h('div', {
            className: 'w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600'
          })
        ])
      ]),

      // Submit Button
      h('button', {
        type: 'submit',
        className: 'w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition'
      }, [
        h(Icons.ShieldCheck, { className: 'w-5 h-5' }),
        h('span', null, 'Start Safe Journey')
      ])
    ])
  ]);
};
