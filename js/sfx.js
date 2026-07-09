// =====================================================
// HATCHBOUND: BEAST ARENA — Sound Effects (WebAudio synth)
// =====================================================
// All sounds are synthesized — no audio files needed.

const SFX = (() => {
  let ctx = null;
  let muted = localStorage.getItem('hatchbound_muted') === '1';

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur = 0.15, type = 'sine', vol = 0.14, delay = 0) {
    if (muted) return;
    try {
      const a = ac();
      if (!a) return;
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      o.frequency.value = freq;
      const t = a.currentTime + delay;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(a.destination);
      o.start(t);
      o.stop(t + dur + 0.05);
    } catch { /* audio unavailable — stay silent */ }
  }

  return {
    isMuted: () => muted,
    toggleMute() {
      muted = !muted;
      localStorage.setItem('hatchbound_muted', muted ? '1' : '0');
      return muted;
    },
    // Simon Says notes: C4 E4 G4 C5 (indexes match button order red/blue/green/yellow)
    note(i, dur = 0.3) { tone([261.6, 329.6, 392.0, 523.3][i] || 440, dur, 'triangle', 0.18); },
    tap()    { tone(440, 0.07, 'sine', 0.1); },
    poke()   { tone(520 + Math.random() * 240, 0.1, 'sine', 0.12); },
    thump()  { tone(90, 0.12, 'sine', 0.28); },
    good()   { tone(523, 0.12, 'triangle', 0.15); tone(659, 0.16, 'triangle', 0.15, 0.09); },
    bad()    { tone(220, 0.2, 'sawtooth', 0.1); tone(175, 0.26, 'sawtooth', 0.09, 0.12); },
    coin()   { tone(880, 0.08, 'square', 0.07); tone(1175, 0.14, 'square', 0.07, 0.06); },
    heart()  { tone(660, 0.1, 'sine', 0.12); tone(880, 0.15, 'sine', 0.12, 0.08); },
    munch()  { tone(180, 0.06, 'square', 0.1); tone(150, 0.06, 'square', 0.1, 0.09); tone(200, 0.06, 'square', 0.1, 0.18); },
    splash() { tone(700, 0.2, 'sine', 0.08); tone(900, 0.25, 'sine', 0.06, 0.08); },
    pop()    { tone(720, 0.06, 'square', 0.1); },
    block()  { tone(300, 0.07, 'square', 0.12); tone(520, 0.06, 'square', 0.1, 0.05); },
    hatch()  { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.24, 'triangle', 0.16, i * 0.12)); },
    levelup(){ [392, 523, 659, 784].forEach((f, i) => tone(f, 0.18, 'triangle', 0.14, i * 0.09)); },
    evolve() { [330, 392, 494, 587, 784, 1047].forEach((f, i) => tone(f, 0.26, 'triangle', 0.16, i * 0.11)); }
  };
})();
