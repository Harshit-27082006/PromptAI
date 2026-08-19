/**
 * SafeWalk AI - Hands-Free & Emergency Shortcut Trigger
 * Provides practical browser-safe hands-free emergency activations:
 * 1. Hold Spacebar for 2 seconds (with visual circular hold progress)
 * 2. Keyboard shortcut (Shift + E or Ctrl + Shift + S)
 * 3. Optional Voice SOS command trigger with clear permission notice.
 */

window.SAFEWALK_HANDS_FREE = function(props) {
  const { state } = props;
  const Icons = window.SAFEWALK_ICONS;
  const h = React.createElement;

  const [holdProgress, setHoldProgress] = React.useState(0);
  const [isSpaceHeld, setIsSpaceHeld] = React.useState(false);
  const [isVoiceListening, setIsVoiceListening] = React.useState(false);
  const [voiceNotice, setVoiceNotice] = React.useState("");
  const holdIntervalRef = React.useRef(null);
  const recognitionRef = React.useRef(null);

  // Global Keyboard Shortcuts (Spacebar Hold & Shift+E)
  React.useEffect(() => {
    let spaceStartTime = null;

    const handleKeyDown = (e) => {
      // Ignore key events if focused in an input/textarea
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }

      // 1. Shift + E: Instant Silent SOS
      if (e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        window.SAFEWALK_STORE.activateCantTalkMode();
        return;
      }

      // 2. Spacebar Hold
      if (e.code === 'Space' && !e.repeat && !spaceStartTime) {
        e.preventDefault();
        spaceStartTime = Date.now();
        setIsSpaceHeld(true);

        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = setInterval(() => {
          if (!spaceStartTime) return;
          const elapsed = Date.now() - spaceStartTime;
          const pct = Math.min(100, (elapsed / 2000) * 100);
          setHoldProgress(pct);

          if (elapsed >= 2000) {
            clearInterval(holdIntervalRef.current);
            spaceStartTime = null;
            setIsSpaceHeld(false);
            setHoldProgress(0);
            window.SAFEWALK_STORE.startEmergencyCountdown("Emergency Triggered via 2-Second Spacebar Hold");
          }
        }, 50);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        spaceStartTime = null;
        setIsSpaceHeld(false);
        setHoldProgress(0);
        if (holdIntervalRef.current) {
          clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Voice Command Trigger
  const toggleVoiceTrigger = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice("Web Speech API not supported in this browser. Spacebar hold & keyboard shortcuts remain active.");
      setTimeout(() => setVoiceNotice(""), 4000);
      return;
    }

    if (isVoiceListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsVoiceListening(false);
      setVoiceNotice("");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsVoiceListening(true);
        setVoiceNotice("Listening for voice keywords: 'HELP', 'EMERGENCY', or 'SAFEWALK SOS'...");
      };

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          if (transcript.includes('help') || transcript.includes('emergency') || transcript.includes('sos') || transcript.includes('danger')) {
            recognition.stop();
            setIsVoiceListening(false);
            setVoiceNotice("🚨 Voice distress phrase recognized! Initiating emergency countdown...");
            window.SAFEWALK_STORE.startEmergencyCountdown("Emergency Triggered via Voice Recognition ('" + transcript.trim() + "')");
            return;
          }
        }
      };

      recognition.onerror = (event) => {
        setIsVoiceListening(false);
        setVoiceNotice(`Microphone permission notice: ${event.error}. Use Spacebar hold (2s) for instant activation.`);
        setTimeout(() => setVoiceNotice(""), 5000);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsVoiceListening(false);
      setVoiceNotice("Microphone permission required for voice trigger. Use Spacebar hold (2s).");
    }
  };

  return h('div', {
    className: 'bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3'
  }, [
    // Header
    h('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-800' }, [
      h('div', { className: 'flex items-center gap-2' }, [
        h(Icons.Zap, { className: 'w-4 h-4 text-purple-400' }),
        h('span', { className: 'text-xs font-bold text-white uppercase tracking-wider' }, 'Hands-Free & Rapid Emergency Controls')
      ]),
      h('span', { className: 'text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30' },
        'Rapid Access'
      )
    ]),

    // Controls Grid
    h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs' }, [
      // Spacebar Hold Trigger Card
      h('div', {
        className: `p-3 rounded-xl border transition ${
          isSpaceHeld
            ? 'bg-red-950/80 border-red-500 shadow-lg shadow-red-500/30'
            : 'bg-slate-950/80 border-slate-800'
        } space-y-2`
      }, [
        h('div', { className: 'flex items-center justify-between' }, [
          h('span', { className: 'font-semibold text-slate-200' }, 'Hold Spacebar (2s)'),
          h('kbd', { className: 'px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]' }, 'SPACE')
        ]),
        h('div', { className: 'w-full bg-slate-800 h-2 rounded-full overflow-hidden' }, [
          h('div', {
            className: 'h-full bg-gradient-to-r from-purple-500 to-red-500 transition-all duration-75',
            style: { width: `${holdProgress}%` }
          })
        ]),
        h('div', { className: 'text-[10px] text-slate-400' },
          isSpaceHeld ? `Holding Spacebar... ${Math.round(holdProgress)}%` : 'Press and hold Spacebar anywhere for 2s to trigger SOS.'
        )
      ]),

      // Voice / Silent Shortcut Card
      h('div', { className: 'bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between' }, [
        h('div', { className: 'flex items-center justify-between' }, [
          h('span', { className: 'font-semibold text-slate-200' }, 'Voice & Silent Shortcut'),
          h('kbd', { className: 'px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]' }, 'SHIFT + E')
        ]),
        h('button', {
          onClick: toggleVoiceTrigger,
          className: `w-full py-1.5 px-2.5 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
            isVoiceListening
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
          }`
        }, [
          h(Icons.Zap, { className: 'w-3.5 h-3.5' }),
          h('span', null, isVoiceListening ? 'Listening for "HELP"...' : 'Enable Voice Trigger ("HELP")')
        ])
      ])
    ]),

    // Voice Feedback Notice
    voiceNotice && h('div', {
      className: 'text-[11px] text-purple-200 bg-purple-950/60 p-2.5 rounded-xl border border-purple-500/30'
    }, voiceNotice)
  ]);
};
