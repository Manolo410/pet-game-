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

  // Filtered noise burst — the "tech impact" layer under hits
  function noiseBurst(dur = 0.18, vol = 0.22, freq = 900, q = 1.2, delay = 0) {
    if (muted) return;
    try {
      const a = ac();
      if (!a) return;
      const len = Math.floor(a.sampleRate * dur);
      const buf = a.createBuffer(1, len, a.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = a.createBufferSource();
      src.buffer = buf;
      const filter = a.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = q;
      const g = a.createGain();
      const t = a.currentTime + delay;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter); filter.connect(g); g.connect(a.destination);
      src.start(t);
    } catch { /* audio unavailable */ }
  }

  // Pitch-swept zap — sci-fi laser feel for attacks
  function zap(from, to, dur = 0.16, vol = 0.12, type = 'sawtooth', delay = 0) {
    if (muted) return;
    try {
      const a = ac();
      if (!a) return;
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      const t = a.currentTime + delay;
      o.frequency.setValueAtTime(from, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(a.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch { /* audio unavailable */ }
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
    evolve() { [330, 392, 494, 587, 784, 1047].forEach((f, i) => tone(f, 0.26, 'triangle', 0.16, i * 0.11)); },

    // ---- Battle sounds ----
    battleStart() {
      zap(120, 480, 0.3, 0.1, 'sawtooth');
      [220, 277, 330].forEach((f, i) => tone(f, 0.16, 'square', 0.08, 0.1 + i * 0.1));
    },
    // Attack launch: element-flavored sci-fi zap
    attack(element) {
      const flavors = {
        fire:     () => { zap(600, 150, 0.2, 0.12); noiseBurst(0.18, 0.14, 1400, 0.8, 0.04); },
        water:    () => { zap(300, 700, 0.22, 0.1, 'sine'); noiseBurst(0.2, 0.1, 500, 0.6, 0.05); },
        wind:     () => { noiseBurst(0.3, 0.14, 2200, 0.5); zap(800, 1400, 0.18, 0.06, 'sine', 0.05); },
        stone:    () => { zap(200, 60, 0.22, 0.14); noiseBurst(0.2, 0.18, 300, 0.8, 0.05); },
        venom:    () => { zap(900, 300, 0.25, 0.1, 'square'); zap(1100, 400, 0.2, 0.07, 'square', 0.08); },
        mystic:   () => { tone(880, 0.18, 'sine', 0.1); tone(1320, 0.22, 'sine', 0.08, 0.07); zap(400, 1600, 0.25, 0.06, 'triangle', 0.05); },
        shadow:   () => { zap(400, 80, 0.3, 0.12, 'sawtooth'); tone(110, 0.28, 'sine', 0.12, 0.06); },
        beast:    () => { zap(350, 120, 0.16, 0.14); noiseBurst(0.14, 0.16, 800, 1, 0.03); },
        electric: () => { zap(1800, 400, 0.1, 0.12, 'square'); zap(1400, 300, 0.1, 0.1, 'square', 0.07); noiseBurst(0.12, 0.12, 3000, 2, 0.03); }
      };
      (flavors[element] || flavors.beast)();
    },
    // Damage lands: heavier for super effective
    impact(elemMult = 1) {
      if (elemMult >= 1.25) {
        noiseBurst(0.3, 0.3, 500, 0.7);
        zap(300, 50, 0.3, 0.18, 'sawtooth');
        tone(1200, 0.1, 'square', 0.1, 0.02);
      } else if (elemMult <= 0.8) {
        noiseBurst(0.1, 0.1, 700, 1);
      } else {
        noiseBurst(0.18, 0.2, 600, 0.8);
        zap(220, 70, 0.16, 0.12, 'square', 0.02);
      }
    },
    evadeSwish() { noiseBurst(0.22, 0.08, 2600, 0.5); },
    powerUp()    { zap(200, 900, 0.3, 0.1, 'triangle'); tone(1047, 0.14, 'sine', 0.08, 0.22); },
    debuff()     { zap(700, 180, 0.3, 0.1, 'triangle'); },
    victoryTheme() {
      // Rising fanfare: G C E G(hi) — hold — E G C(hi2)
      const seq = [[392,0],[523,0.14],[659,0.28],[784,0.42],[784,0.66],[659,0.84],[784,0.98],[1047,1.12]];
      seq.forEach(([f, d]) => tone(f, 0.26, 'triangle', 0.16, d));
      seq.forEach(([f, d]) => tone(f / 2, 0.26, 'sine', 0.1, d)); // octave-down layer
      tone(1319, 0.5, 'triangle', 0.14, 1.32);
      tone(1568, 0.7, 'triangle', 0.12, 1.5);
    },
    defeatTheme() {
      [392, 370, 330, 262].forEach((f, i) => tone(f, 0.4, 'triangle', 0.12, i * 0.3));
      tone(131, 0.9, 'sine', 0.12, 0.9);
    }
  };
})();
