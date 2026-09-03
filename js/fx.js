// =====================================================
// HATCHBOUND — Visual FX Engine
// Ambient particle field, ripples, screen transitions.
// Everything animates on transform/opacity only so it
// stays at 60fps on phones.
// =====================================================

const FX = (() => {
  let canvas, ctx, particles = [], raf = null, W = 0, H = 0;
  let theme = { a: '#b45cff', b: '#22e0ff', c: '#ff4fd8' };
  let reduced = false;

  // Per-screen color moods — the whole app shifts hue as you navigate
  const SCREEN_THEMES = {
    title:            { a: '#ffc531', b: '#ff8324', c: '#ff3b6b' },
    'choose-category':{ a: '#b45cff', b: '#22e0ff', c: '#ff4fd8' },
    'choose-creature':{ a: '#22e0ff', b: '#4d6bff', c: '#b45cff' },
    'name-creature':  { a: '#ffc531', b: '#b45cff', c: '#22e0ff' },
    incubation:       { a: '#ffc531', b: '#ff8324', c: '#ff4fd8' },
    hatching:         { a: '#ffc531', b: '#2fe89a', c: '#22e0ff' },
    home:             { a: '#b45cff', b: '#22e0ff', c: '#2fe89a' },
    train:            { a: '#b4ff3d', b: '#2fe89a', c: '#22e0ff' },
    campaign:         { a: '#ff8324', b: '#ff3b6b', c: '#b45cff' },
    'battle-prep':    { a: '#ff3b6b', b: '#ff8324', c: '#ffc531' },
    battle:           { a: '#ff3b6b', b: '#4d6bff', c: '#ff8324' },
    'battle-result':  { a: '#ffc531', b: '#2fe89a', c: '#22e0ff' },
    profile:          { a: '#4d6bff', b: '#b45cff', c: '#ff4fd8' },
    collection:       { a: '#22e0ff', b: '#b4ff3d', c: '#ffc531' },
    gear:             { a: '#b45cff', b: '#ff4fd8', c: '#4d6bff' }
  };

  function hexToRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function resize() {
    if (!canvas) return;
    // Render at half resolution and let CSS scale it up — the orbs are soft
    // gradients so the upscale reads as extra blur, at a quarter of the cost.
    const scale = 0.5;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.ceil(W * scale);
    canvas.height = Math.ceil(H * scale);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function makeParticles() {
    // Fewer on small screens; these are big soft orbs, not dust
    const count = W < 500 ? 16 : 26;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 30 + Math.random() * 90,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      k: Math.random(),                 // which theme color
      a: 0.05 + Math.random() * 0.10,   // alpha
      p: Math.random() * Math.PI * 2    // pulse phase
    }));
  }

  let lastFrame = 0;
  function draw(t) {
    raf = requestAnimationFrame(draw);
    if (!ctx) return;
    if (t - lastFrame < 33) return; // ~30fps is plenty for slow drift
    lastFrame = t;
    ctx.clearRect(0, 0, W, H);
    const cols = [theme.a, theme.b, theme.c];
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -p.r) p.x = W + p.r;
      if (p.x > W + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = H + p.r;
      if (p.y > H + p.r) p.y = -p.r;

      const pulse = 0.75 + 0.25 * Math.sin(t / 1600 + p.p);
      const [r, g, b] = hexToRgb(cols[Math.floor(p.k * cols.length) % cols.length]);
      const rad = p.r * pulse;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
      grd.addColorStop(0, `rgba(${r},${g},${b},${p.a * pulse})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return {
    init() {
      reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      canvas = document.getElementById('fx-bg');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      resize();
      makeParticles();
      window.addEventListener('resize', () => { resize(); makeParticles(); });
      // Pause the loop when the tab is hidden — saves battery
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
        else if (!raf && !reduced) raf = requestAnimationFrame(draw);
      });
      if (!reduced) raf = requestAnimationFrame(draw);
    },

    // Shift the ambient mood when the screen changes
    setTheme(screenId) {
      const t = SCREEN_THEMES[screenId];
      if (t) theme = t;
    },

    // Tap ripple from a click position
    ripple(e, el) {
      if (reduced || !el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top;
      const d = Math.max(rect.width, rect.height) * 2;
      const r = document.createElement('span');
      r.className = 'fx-ripple';
      r.style.cssText = `left:${x}px;top:${y}px;width:${d}px;height:${d}px`;
      el.appendChild(r);
      setTimeout(() => r.remove(), 650);
    },

    // Radial particle burst at an element (used on rewards/hits)
    burst(el, color, count) {
      if (reduced || !el) return;
      const host = el.closest('.screen') || document.body;
      const rect = el.getBoundingClientRect();
      const hostRect = host.getBoundingClientRect();
      const cx = rect.left - hostRect.left + rect.width / 2;
      const cy = rect.top - hostRect.top + rect.height / 2;
      for (let i = 0; i < (count || 14); i++) {
        const b = document.createElement('i');
        b.className = 'fx-burst-dot';
        const ang = (Math.PI * 2 * i) / (count || 14) + Math.random() * 0.4;
        const dist = 40 + Math.random() * 70;
        b.style.left = cx + 'px';
        b.style.top = cy + 'px';
        b.style.background = color || '#ffc531';
        b.style.setProperty('--bx', Math.cos(ang) * dist + 'px');
        b.style.setProperty('--by', Math.sin(ang) * dist + 'px');
        b.style.animationDelay = (Math.random() * 0.1) + 's';
        host.appendChild(b);
        setTimeout(() => b.remove(), 900);
      }
    },

    // Whole-screen shake for impacts
    shake(intensity) {
      if (reduced) return;
      const app = document.getElementById('app');
      if (!app) return;
      app.style.setProperty('--shake-amp', (intensity || 6) + 'px');
      app.classList.remove('fx-shake');
      void app.offsetWidth;
      app.classList.add('fx-shake');
      setTimeout(() => app.classList.remove('fx-shake'), 420);
    },

    // Full-screen color flash
    flash(color, ms) {
      if (reduced) return;
      const f = document.createElement('div');
      f.className = 'fx-flash';
      f.style.background = color || 'rgba(255,255,255,0.55)';
      f.style.animationDuration = (ms || 500) + 'ms';
      document.body.appendChild(f);
      setTimeout(() => f.remove(), ms || 500);
    }
  };
})();

// Global tap ripples on every interactive control
document.addEventListener('pointerdown', e => {
  const el = e.target.closest(
    '.btn-primary, .btn-secondary, .care-btn, .cat-card, .incu-game-card, ' +
    '.train-game-card, .cz-node, .btn-battle, .btn-profile, .btn-gear, ' +
    '.btn-collection, .campaign-banner, .gear-btn, .btn-hatch-now, .stance-btn'
  );
  if (el) FX.ripple(e, el);
}, { passive: true });
