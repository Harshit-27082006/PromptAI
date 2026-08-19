/**
 * SafeWalk AI - Web Audio Synthesizer & Voice Guidance Engine
 * Uses native Web Audio API (no external sound files required) and Web Speech API.
 */

window.SAFEWALK_AUDIO_ENGINE = (function() {
  let audioCtx = null;
  let sirenOscillator = null;
  let sirenGain = null;
  let sirenInterval = null;
  let isMuted = false;
  let voiceEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /**
   * Plays a gentle check-in prompt chime
   */
  function playCheckInChime() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5

      osc2.frequency.setValueAtTime(880, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.38); // D6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.2);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  /**
   * Plays a single countdown tick beep
   */
  function playCountdownTick(pitch = 800) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn("Audio tick error:", e);
    }
  }

  /**
   * Plays a distinct warning tone (YELLOW status transition)
   */
  function playWarningTone() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn("Warning tone error:", e);
    }
  }

  /**
   * Starts emergency pulsating siren sound
   */
  function startEmergencySiren() {
    if (isMuted || sirenOscillator) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      sirenOscillator = ctx.createOscillator();
      sirenGain = ctx.createGain();

      sirenOscillator.type = 'sawtooth';
      sirenGain.gain.setValueAtTime(0.2, ctx.currentTime);

      sirenOscillator.connect(sirenGain);
      sirenGain.connect(ctx.destination);

      sirenOscillator.start();

      let high = false;
      sirenInterval = setInterval(() => {
        if (!audioCtx || !sirenOscillator) return;
        const targetFreq = high ? 960 : 640;
        try {
          sirenOscillator.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
        } catch (err) {}
        high = !high;
      }, 350);
    } catch (e) {
      console.warn("Emergency siren error:", e);
    }
  }

  /**
   * Stops emergency siren sound
   */
  function stopEmergencySiren() {
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
    if (sirenOscillator) {
      try {
        sirenOscillator.stop();
        sirenOscillator.disconnect();
      } catch (e) {}
      sirenOscillator = null;
    }
    if (sirenGain) {
      try {
        sirenGain.disconnect();
      } catch (e) {}
      sirenGain = null;
    }
  }

  /**
   * Uses Web Speech Synthesis for clear safety voice guidance
   */
  function speakVoiceGuidance(text) {
    if (isMuted || !voiceEnabled) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
      stopEmergencySiren();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
    return isMuted;
  }

  function setVoiceEnabled(enabled) {
    voiceEnabled = enabled;
  }

  return {
    playCheckInChime,
    playCountdownTick,
    playWarningTone,
    startEmergencySiren,
    stopEmergencySiren,
    speakVoiceGuidance,
    toggleMute,
    setVoiceEnabled,
    isMuted: () => isMuted,
    isVoiceEnabled: () => voiceEnabled
  };
})();
