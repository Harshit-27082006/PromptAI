/**
 * SafeWalk AI - Robust Error Boundary & Fail-Safe Component
 * Ensures a React render error or API failure NEVER results in a blank screen.
 */

class SafeWalkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SafeWalk Error Boundary caught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleEmergencySOS = () => {
    if (window.SAFEWALK_STORE) {
      window.SAFEWALK_STORE.activateCantTalkMode();
    }
  };

  render() {
    if (this.state.hasError) {
      const h = React.createElement;
      return h('div', {
        className: 'min-h-screen bg-slate-950 text-white flex items-center justify-center p-4'
      }, [
        h('div', {
          className: 'max-w-lg w-full bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-center'
        }, [
          h('div', {
            className: 'w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto'
          }, [
            h('span', { className: 'text-3xl' }, '🛡️')
          ]),

          h('h2', { className: 'text-xl font-bold text-white' }, 'SafeWalk AI Safety Core Active'),
          h('p', { className: 'text-xs text-slate-300 leading-relaxed' },
            'A user-interface component encountered an error, but your local safety monitoring and emergency protocols remain intact.'
          ),

          h('div', { className: 'space-y-2 pt-2' }, [
            h('button', {
              onClick: this.handleEmergencySOS,
              className: 'w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-600/40 transition'
            }, '🚨 Trigger Emergency SOS'),

            h('button', {
              onClick: this.handleReload,
              className: 'w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition'
            }, 'Reload Interface')
          ]),

          h('details', { className: 'text-left text-[10px] text-slate-500 bg-slate-950 p-2.5 rounded-xl border border-slate-800' }, [
            h('summary', { className: 'cursor-pointer text-slate-400 font-mono' }, 'Technical Error Details'),
            h('pre', { className: 'mt-2 whitespace-pre-wrap font-mono' },
              this.state.error && this.state.error.toString()
            )
          ])
        ])
      ]);
    }

    return this.props.children;
  }
}

window.SAFEWALK_ERROR_BOUNDARY = SafeWalkErrorBoundary;
