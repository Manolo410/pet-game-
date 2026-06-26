// =====================================================
// HATCHBOUND: BEAST ARENA  — Core Game Engine v1.0
// =====================================================

// ---- Speed multiplier: 1 = real time, 60 = 1min = 1hr ----
const DEV_SPEED = 60;
const INCUBATION_DURATION_MS = (24 * 60 * 60 * 1000) / DEV_SPEED; // 24 mins in dev
const CARE_WINDOW_INTERVAL   = INCUBATION_DURATION_MS / 5;

// ---- Global Game State ----
let G = {
  screen: 'title',
  selectedCategory: null,
  selectedCreature: null,
  incubation: null,
  creature: null,
  selectedMoves: [],
  stance: 'balanced',
  selectedItem: null,
  opponent: null,
  battleResult: null,
  coins: 100,
  collection: [],
  inventory: ['basic_meat','basic_meat','sweet_fruit','bandage','focus_berry'],
  notifications: [],
  careActionCooldown: {}
};

// ---- Creature Template ----
function createCreature(id, name) {
  const def = CREATURES[id];
  return {
    id,
    name,
    level: 1,
    xp: 0,
    stage: 'baby',
    personality: def.personality,
    hunger: 80,
    hygiene: 80,
    happiness: 80,
    energy: 80,
    hp: def.baseStats.maxHp,
    maxHp: def.baseStats.maxHp,
    trainingCount: 0,
    battleCount: 0,
    affectionCount: 0,
    recoveryEvents: 0,
    bondLevel: 0,
    nightSessions: 0,
    evolutionPath: null,
    equippedMoves: def.moves.slice(0, 3),
    equippedGear: { weapon: null, armor: null, trinket: null },
    gearInventory: [],
    colorTint: 0,
    createdAt: Date.now(),
    lastCareTime: Date.now(),
    incubationStats: { warmth:0, comfort:0, energy:0, stability:0, bond:0 }
  };
}

// ---- Ensure creature has all required fields (for old saves) ----
function ensureCreatureFields(c) {
  if (!c) return c;
  if (!c.equippedGear)   c.equippedGear   = { weapon: null, armor: null, trinket: null };
  if (!c.gearInventory)  c.gearInventory  = [];
  if (c.colorTint === undefined) c.colorTint = 0;
  return c;
}

// ---- Save / Load ----
function saveGame() {
  const data = {
    version: GV,
    coins: G.coins,
    creature: G.creature,
    collection: G.collection,
    inventory: G.inventory,
    incubation: G.incubation
  };
  localStorage.setItem('hatchbound_save', JSON.stringify(data));
}

function loadGame() {
  try {
    const raw = localStorage.getItem('hatchbound_save');
    if (!raw) return false;
    const data = JSON.parse(raw);
    G.coins = data.coins || 100;
    G.creature = ensureCreatureFields(data.creature || null);
    G.collection = data.collection || [];
    G.inventory = data.inventory || ['basic_meat','bandage'];
    G.incubation = data.incubation || null;
    return true;
  } catch { return false; }
}

// ---- XP & Level Up ----
function grantXP(amount) {
  if (!G.creature) return;
  G.creature.xp += amount;
  let leveled = false;
  while (G.creature.level < 100 && G.creature.xp >= xpForLevel(G.creature.level + 1)) {
    G.creature.xp -= xpForLevel(G.creature.level + 1);
    G.creature.level++;
    leveled = true;
    const def = CREATURES[G.creature.id];
    G.creature.maxHp = Math.floor(def.baseStats.maxHp * (1 + (G.creature.level - 1) * 0.03));
    G.creature.hp = Math.min(G.creature.hp + 20, G.creature.maxHp);
    const newStage = stageFromLevel(G.creature.level);
    if (newStage.id !== G.creature.stage) {
      G.creature.stage = newStage.id;
      G.notifications.push({ type:'evolve', stage: newStage });
    }
  }
  if (leveled) saveGame();
  return leveled;
}

// ---- Determine evolution path ----
function determineEvolutionPath(creature) {
  const c = creature;
  const scores = {
    warrior:  c.trainingCount * 2,
    guardian: c.affectionCount * 2,
    aggressive: c.battleCount * 2,
    shadow:   c.nightSessions * 3,
    survivor: c.recoveryEvents * 4,
    bonded:   c.bondLevel * 3
  };
  scores.healthy = (c.hunger + c.hygiene + c.happiness + c.energy) / 4;
  const best = Object.entries(scores).sort((a,b) => b[1]-a[1])[0];
  return best[0];
}

// ---- Care Actions ----
function careAction(action) {
  if (!G.creature) return;
  const now = Date.now();
  const cooldown = 8000;
  if (G.careActionCooldown[action] && now - G.careActionCooldown[action] < cooldown) {
    showToast('⏳ Wait a moment before doing that again!');
    return false;
  }
  G.careActionCooldown[action] = now;

  const c = G.creature;

  switch(action) {
    case 'feed':
      if (c.hunger >= 100) { showToast('🦁 Not hungry right now!'); return false; }
      c.hunger = Math.min(100, c.hunger + 25);
      c.happiness = Math.min(100, c.happiness + 5);
      c.affectionCount++;
      grantXP(8);
      showToast('🍖 Nom nom! Hunger restored!');
      break;
    case 'bathe':
      if (c.hygiene >= 100) { showToast('✨ Already squeaky clean!'); return false; }
      c.hygiene = Math.min(100, c.hygiene + 30);
      c.happiness = Math.min(100, c.happiness + 5);
      c.affectionCount++;
      grantXP(6);
      showToast('🚿 Fresh and clean!');
      break;
    case 'train':
      if (c.energy < 20) { showToast('😴 Too tired to train!'); return false; }
      c.energy = Math.max(0, c.energy - 15);
      c.trainingCount++;
      c.happiness = Math.min(100, c.happiness + 3);
      grantXP(15);
      showToast('💪 Training complete! XP gained!');
      break;
    case 'bond':
      c.happiness = Math.min(100, c.happiness + 20);
      c.bondLevel = Math.min(100, c.bondLevel + 2);
      c.affectionCount++;
      grantXP(10);
      showToast('💗 Your bond grows stronger!');
      break;
    case 'play':
      if (c.energy < 10) { showToast('😴 Too tired to play!'); return false; }
      c.happiness = Math.min(100, c.happiness + 15);
      c.energy = Math.max(0, c.energy - 10);
      c.hunger = Math.max(0, c.hunger - 5);
      c.affectionCount++;
      grantXP(8);
      showToast('🎮 Playtime! Pure joy!');
      break;
    case 'sleep':
      c.energy = Math.min(100, c.energy + 40);
      const isNight = new Date().getHours() >= 20 || new Date().getHours() < 6;
      if (isNight) { c.nightSessions++; showToast('🌙 Night rest! Bonus stat gain!'); }
      else { showToast('💤 Taking a nap...'); }
      grantXP(5);
      break;
  }

  c.lastCareTime = Date.now();
  drainStats();
  saveGame();
  return true;
}

// ---- Stat decay over time ----
function drainStats() {
  if (!G.creature) return;
  const c = G.creature;
  const elapsed = (Date.now() - (c.lastCareTime || Date.now())) / 1000 / 60; // minutes
  const rate = 2 * (elapsed / 10);
  c.hunger    = Math.max(0, c.hunger    - rate);
  c.hygiene   = Math.max(0, c.hygiene   - rate * 0.8);
  c.happiness = Math.max(0, c.happiness - rate * 0.6);
  c.energy    = Math.max(0, c.energy    - rate * 0.5);
  if (c.hunger < 20) c.recoveryEvents++;
}

// ---- Incubation ----
function startIncubation(creatureId, creatureName) {
  G.incubation = {
    creatureId,
    creatureName,
    startTime: Date.now(),
    endTime: Date.now() + INCUBATION_DURATION_MS,
    stats: { warmth: 0, comfort: 0, energy: 0, stability: 0, bond: 0 },
    careActions: [],
    careWindows: Array(5).fill(false)
  };
  saveGame();
}

function incubationProgress() {
  if (!G.incubation) return 0;
  const elapsed = Date.now() - G.incubation.startTime;
  return Math.min(1, elapsed / INCUBATION_DURATION_MS);
}

function incubationCare(statId) {
  if (!G.incubation) return;
  const stat = G.incubation.stats;
  const maxVal = 100;
  stat[statId] = Math.min(maxVal, (stat[statId] || 0) + 20);

  // Mark which care window we're in
  const progress = incubationProgress();
  const windowIndex = Math.floor(progress * 5);
  if (windowIndex < 5) G.incubation.careWindows[windowIndex] = true;

  G.incubation.careActions.push({ stat: statId, time: Date.now() });
  saveGame();
}

function calculateIncubationBonus(stats) {
  const bonuses = [];
  const total = Object.values(stats).reduce((a,b) => a+b, 0);
  if (stats.warmth >= 80) bonuses.push({ name:'Tough Shell', effect:'+10% defense' });
  if (stats.comfort >= 80) bonuses.push({ name:'Gentle Soul', effect:'+Loyalty personality' });
  if (stats.energy >= 80) bonuses.push({ name:'Swift Wings', effect:'+10% speed' });
  if (stats.stability >= 80) bonuses.push({ name:'Mutation Seed', effect:'Rare trait chance' });
  if (stats.bond >= 80) bonuses.push({ name:'Heart Bond', effect:'Special passive ability' });
  if (total >= 400) bonuses.push({ name:'Perfect Care', effect:'Rare evolution available!' });
  return bonuses;
}

function hatchEgg() {
  if (!G.incubation) return;
  const bonuses = calculateIncubationBonus(G.incubation.stats);
  G.creature = createCreature(G.incubation.creatureId, G.incubation.creatureName);
  G.creature.incubationBonuses = bonuses;
  G.creature.incubationStats = { ...G.incubation.stats };
  G.collection.push(G.incubation.creatureId);
  G.incubation = null;
  saveGame();
  return bonuses;
}

// ---- Screen Router ----
function showScreen(id, data = {}) {
  G.screen = id;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + id);
  if (target) {
    target.classList.add('active');
    const fn = SCREENS[id];
    if (fn) fn(data);
  }
}

function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- Screen Handlers ----
const SCREENS = {

  title() {
    const hasSave = !!localStorage.getItem('hatchbound_save');
    const cont = document.getElementById('btn-continue');
    if (cont) cont.style.display = hasSave ? 'block' : 'none';
    startParticles();
  },

  'choose-category'() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.style.setProperty('--cat-color', cat.color);
      card.innerHTML = `
        <div class="cat-icon">${cat.icon}</div>
        <div class="cat-name">${cat.name}</div>
        <div class="cat-desc">${cat.desc}</div>
        <div class="cat-element">
          <span class="elem-badge" style="background:${ELEMENTS[cat.element].glow}">
            ${ELEMENTS[cat.element].icon} ${ELEMENTS[cat.element].name}
          </span>
        </div>
      `;
      card.addEventListener('click', () => {
        G.selectedCategory = cat.id;
        showScreen('choose-creature');
      });
      grid.appendChild(card);
    });
  },

  'choose-creature'() {
    const grid = document.getElementById('creature-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const creatures = Object.values(CREATURES).filter(c => c.category === G.selectedCategory);
    creatures.forEach(c => {
      const elem = ELEMENTS[c.element];
      const card = document.createElement('div');
      card.className = 'creature-select-card';
      card.style.setProperty('--creature-color', c.color);
      card.style.setProperty('--creature-glow', c.glow);
      card.innerHTML = `
        <div class="csc-sprite" style="filter:drop-shadow(0 0 18px ${c.glow})">
          ${getSpriteHTML(c.id, 'baby', 90)}
        </div>
        <div class="csc-name">${c.name}</div>
        <div class="csc-title">${c.title}</div>
        <div class="csc-role">${c.role}</div>
        <div class="csc-elem">
          <span class="elem-badge" style="background:${elem.glow};">${elem.icon} ${elem.name}</span>
        </div>
        <div class="csc-stats">
          ${statBar('HP',  c.baseStats.maxHp, 150)}
          ${statBar('ATK', c.baseStats.atk,   120)}
          ${statBar('DEF', c.baseStats.def,   120)}
          ${statBar('SPD', c.baseStats.spd,   130)}
        </div>
        <div class="csc-desc">${c.desc}</div>
        <button class="btn-primary btn-choose-creature" data-id="${c.id}">
          Choose ${c.name}
        </button>
      `;
      grid.appendChild(card);
    });

    grid.addEventListener('click', e => {
      const btn = e.target.closest('.btn-choose-creature');
      if (btn) {
        G.selectedCreature = btn.dataset.id;
        showScreen('name-creature');
      }
    });
  },

  'name-creature'() {
    const def = CREATURES[G.selectedCreature];
    if (!def) return;
    const preview = document.getElementById('name-creature-preview');
    const input   = document.getElementById('creature-name-input');
    if (preview) {
      preview.innerHTML = `
        <div class="creature-preview-sprite" style="filter:drop-shadow(0 0 20px ${def.glow})">
          ${getSpriteHTML(G.selectedCreature, 'baby', 130)}
        </div>
        <div class="preview-type">${def.title}</div>
      `;
    }
    if (input) {
      input.value = def.name;
      input.placeholder = `Name your ${def.name}...`;
    }
  },

  incubation() {
    if (!G.incubation) return;
    renderIncubation();
    G._incuTimer = setInterval(() => {
      if (G.screen !== 'incubation') { clearInterval(G._incuTimer); return; }
      renderIncubation();
      if (incubationProgress() >= 1) {
        clearInterval(G._incuTimer);
        showScreen('hatching');
      }
    }, 1000);
  },

  hatching() {
    const bonuses = hatchEgg();
    const def = CREATURES[G.creature.id];
    const container = document.getElementById('hatch-container');
    if (container) {
      container.innerHTML = `
        <div class="hatch-egg" id="hatch-egg-anim">🥚</div>
        <div class="hatch-creature hidden" id="hatch-creature-reveal">
          <div class="hatch-sprite" style="filter:drop-shadow(0 0 30px ${def.glow})">
            ${getSpriteHTML(G.creature.id, 'baby', 150)}
          </div>
          <div class="hatch-name">${G.creature.name}</div>
          <div class="hatch-subtitle">A ${def.stages.baby.name} hatched!</div>
        </div>
        <div class="hatch-bonuses hidden" id="hatch-bonuses">
          ${bonuses.length ? '<div class="bonus-title">✨ Incubation Bonuses!</div>' : ''}
          ${bonuses.map(b => `<div class="bonus-item">🎁 <b>${b.name}</b> — ${b.effect}</div>`).join('')}
        </div>
      `;
    }
    setTimeout(() => {
      const egg = document.getElementById('hatch-egg-anim');
      if (egg) egg.classList.add('cracking');
    }, 800);
    setTimeout(() => {
      const egg = document.getElementById('hatch-egg-anim');
      const creature = document.getElementById('hatch-creature-reveal');
      if (egg) egg.style.display = 'none';
      if (creature) creature.classList.remove('hidden');
    }, 2500);
    setTimeout(() => {
      const bonusEl = document.getElementById('hatch-bonuses');
      if (bonusEl) bonusEl.classList.remove('hidden');
    }, 3500);
  },

  home() {
    renderHome();
    drainStats();
    if (G._homeTimer) clearInterval(G._homeTimer);
    G._homeTimer = setInterval(() => {
      if (G.screen !== 'home') { clearInterval(G._homeTimer); return; }
      drainStats();
      renderHome();
    }, 30000);
  },

  train() {
    renderTrainScreen();
  },

  'battle-prep'() {
    renderBattlePrep();
  },

  battle() {
    renderBattleScreen();
  },

  'battle-result'() {
    renderBattleResult();
  },

  profile() {
    renderProfile();
  },

  collection() {
    renderCollection();
  },

  gear() {
    renderGearScreen();
  }
};

// ---- Home Screen Render ----
function renderHome() {
  const c = G.creature;
  if (!c) { showScreen('title'); return; }
  ensureCreatureFields(c);
  const def = CREATURES[c.id];
  const stageDef = stageFromLevel(c.level);
  const stageInfo = def.stages[stageDef.id];
  const pers = PERSONALITIES[c.personality];

  const xpNeeded = xpForLevel(c.level + 1);
  const xpPct = c.level >= 100 ? 100 : Math.floor((c.xp / xpNeeded) * 100);
  const evPath = determineEvolutionPath(c);
  const elem = ELEMENTS[def.element];

  const tintFilter = c.colorTint ? `hue-rotate(${c.colorTint}deg)` : '';
  const glowFilter = `drop-shadow(0 0 ${12 + c.level/10}px ${def.glow})`;

  // Gear badges for equipped items
  const eq = c.equippedGear;
  const gearBadges = [
    eq.weapon  ? `<span class="cgb cgb-weapon"  title="${GEAR[eq.weapon].name}">${GEAR[eq.weapon].icon}</span>`   : '',
    eq.armor   ? `<span class="cgb cgb-armor"   title="${GEAR[eq.armor].name}">${GEAR[eq.armor].icon}</span>`    : '',
    eq.trinket ? `<span class="cgb cgb-trinket" title="${GEAR[eq.trinket].name}">${GEAR[eq.trinket].icon}</span>` : ''
  ].filter(Boolean).join('');

  const el = document.getElementById('home-content');
  if (!el) return;

  el.innerHTML = `
    <div class="home-header">
      <div class="home-coins">💰 ${G.coins}</div>
      <div class="home-level">
        <span class="level-badge" style="background:linear-gradient(135deg,${def.color},${def.glow})">Lv.${c.level}</span>
        <span class="stage-badge">${stageDef.name}</span>
      </div>
    </div>

    <div class="creature-stage">
      <div class="creature-aura" style="background:radial-gradient(circle, ${def.glow} 0%, transparent 70%)"></div>
      <div class="creature-main-sprite" id="home-creature-sprite"
           style="filter:${glowFilter} ${tintFilter}">
        ${getSpriteHTML(c.id, stageDef.id, Math.min(150, 100 + Math.floor(c.level * 0.5)))}
      </div>
      ${gearBadges ? `<div class="creature-gear-badges">${gearBadges}</div>` : ''}
      <div class="creature-name-display">${c.name}</div>
      <div class="creature-subtitle">${stageInfo ? stageInfo.name : ''} · ${def.title}</div>
      <div class="personality-badge" style="background:rgba(255,255,255,0.08)">
        ${pers.icon} ${pers.name} · <span class="elem-text" style="color:${elem.color}">${elem.icon} ${elem.name}</span>
      </div>
    </div>

    <div class="xp-bar-container">
      <div class="xp-label">XP ${c.xp} / ${c.level >= 100 ? 'MAX' : xpNeeded}</div>
      <div class="xp-bar-track"><div class="xp-bar-fill" style="width:${xpPct}%"></div></div>
    </div>

    <div class="vitals-grid">
      ${vitalBar('🍖', 'Hunger',    c.hunger)}
      ${vitalBar('🚿', 'Hygiene',   c.hygiene)}
      ${vitalBar('😊', 'Happiness', c.happiness)}
      ${vitalBar('⚡', 'Energy',    c.energy)}
    </div>

    <div class="care-grid">
      <button class="care-btn" data-action="feed"  onclick="doAction('feed')">
        <span class="care-icon">🍖</span><span class="care-label">Feed</span>
      </button>
      <button class="care-btn" data-action="bathe" onclick="doAction('bathe')">
        <span class="care-icon">🚿</span><span class="care-label">Bathe</span>
      </button>
      <button class="care-btn" data-action="train" onclick="showScreen('train')">
        <span class="care-icon">💪</span><span class="care-label">Train</span>
      </button>
      <button class="care-btn" data-action="bond"  onclick="doAction('bond')">
        <span class="care-icon">💗</span><span class="care-label">Bond</span>
      </button>
      <button class="care-btn" data-action="play"  onclick="doAction('play')">
        <span class="care-icon">🎮</span><span class="care-label">Play</span>
      </button>
      <button class="care-btn" data-action="sleep" onclick="doAction('sleep')">
        <span class="care-icon">💤</span><span class="care-label">Rest</span>
      </button>
    </div>

    <div class="home-actions-row">
      <button class="btn-battle" onclick="showScreen('battle-prep')">⚔️ Battle!</button>
      <button class="btn-profile" onclick="showScreen('profile')">📊 Profile</button>
      <button class="btn-gear" onclick="showScreen('gear')">🗡️ Gear</button>
      <button class="btn-collection" onclick="showScreen('collection')">📖 Codex</button>
    </div>

    <div class="evolution-hint">
      🔬 Evolution tendency: <b>${evPath.charAt(0).toUpperCase() + evPath.slice(1)}</b> path
    </div>
  `;
}

function doAction(action) {
  const ok = careAction(action);
  if (ok !== false) {
    const sprite = document.getElementById('home-creature-sprite');
    if (sprite) {
      sprite.classList.add('care-react');
      setTimeout(() => sprite.classList.remove('care-react'), 800);
    }
    setTimeout(() => renderHome(), 200);
  }
}

// ---- Incubation Render ----
function renderIncubation() {
  const incu = G.incubation;
  if (!incu) return;
  const def = CREATURES[incu.creatureId];
  const prog = incubationProgress();
  const timeLeft = Math.max(0, incu.endTime - Date.now());
  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);
  const windowIdx = Math.floor(prog * 5);

  const el = document.getElementById('incubation-content');
  if (!el) return;

  el.innerHTML = `
    <div class="incu-header">
      <div class="incu-creature-name">${incu.creatureName}'s Egg</div>
      <div class="incu-timer ${prog > 0.9 ? 'almost-done' : ''}">
        ⏱️ ${mins}m ${secs}s remaining
      </div>
    </div>

    <div class="egg-stage">
      <div class="egg-glow" style="background:radial-gradient(circle, ${def.glow} 0%, transparent 65%)"></div>
      <div class="egg-emoji ${prog > 0.75 ? 'egg-shaking' : prog > 0.5 ? 'egg-wiggle' : 'egg-pulse'}" id="incu-egg">🥚</div>
      <div class="egg-category-label">${def.title}</div>
    </div>

    <div class="incu-progress-bar">
      <div class="incu-progress-fill" style="width:${prog * 100}%"></div>
      <div class="incu-progress-label">${Math.round(prog * 100)}% incubated</div>
    </div>

    <div class="care-windows">
      ${incu.careWindows.map((done, i) => `
        <div class="cw-slot ${i < windowIdx ? (done ? 'cw-done' : 'cw-missed') : i === windowIdx ? 'cw-active' : 'cw-future'}">
          <span>${i < windowIdx ? (done ? '✅' : '⚠️') : i === windowIdx ? '🔔' : '○'}</span>
        </div>
      `).join('')}
    </div>

    <div class="incu-stats-grid">
      ${INCUBATION_WINDOWS.map(w => `
        <div class="incu-stat-card" style="border-color:${w.color}22">
          <div class="is-icon">${w.icon}</div>
          <div class="is-label">${w.label}</div>
          <div class="is-bar-track">
            <div class="is-bar-fill" style="width:${incu.stats[w.id] || 0}%;background:${w.color}"></div>
          </div>
          <div class="is-value">${incu.stats[w.id] || 0}%</div>
          <button class="btn-incu-care" style="border-color:${w.color};color:${w.color}"
                  onclick="doIncuCare('${w.id}')">
            Care
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function doIncuCare(statId) {
  incubationCare(statId);
  const egg = document.getElementById('incu-egg');
  if (egg) {
    egg.classList.add('care-react');
    setTimeout(() => egg.classList.remove('care-react'), 600);
  }
  showToast('💗 ' + INCUBATION_WINDOWS.find(w => w.id === statId).label + ' improved!');
  renderIncubation();
}

// ---- Training Screen ----
let trainingGame = null;
function renderTrainScreen() {
  const el = document.getElementById('train-content');
  if (!el) return;
  el.innerHTML = `
    <div class="train-header">
      <button class="btn-back" onclick="showScreen('home')">← Back</button>
      <h2>Training Center</h2>
    </div>
    <div class="train-games-grid">
      <div class="train-game-card" onclick="startTrainingGame('reflex')">
        <div class="tg-icon">⚡</div>
        <div class="tg-name">Reflex Strike</div>
        <div class="tg-desc">Tap the flash! Trains Speed & Attack</div>
        <div class="tg-reward">+20 XP per flash caught</div>
      </div>
      <div class="train-game-card" onclick="startTrainingGame('endurance')">
        <div class="tg-icon">🔥</div>
        <div class="tg-name">Endurance Burn</div>
        <div class="tg-desc">Hold as long as possible! Trains Stamina</div>
        <div class="tg-reward">+5 XP per second held</div>
      </div>
      <div class="train-game-card" onclick="startTrainingGame('focus')">
        <div class="tg-icon">🎯</div>
        <div class="tg-name">Focus Target</div>
        <div class="tg-desc">Hit moving targets! Trains Accuracy</div>
        <div class="tg-reward">+15 XP per hit</div>
      </div>
    </div>
    <div id="training-game-area" class="training-game-area hidden"></div>
  `;
}

function startTrainingGame(type) {
  const area = document.getElementById('training-game-area');
  if (!area) return;
  area.classList.remove('hidden');
  area.innerHTML = '';

  if (type === 'reflex') startReflexGame(area);
  else if (type === 'endurance') startEnduranceGame(area);
  else if (type === 'focus') startFocusGame(area);
}

function startReflexGame(area) {
  let score = 0, hits = 0, total = 8;
  let flashing = false;

  area.innerHTML = `
    <div class="mini-game reflex-game">
      <div class="mg-title">⚡ Reflex Strike — Tap when it flashes!</div>
      <div class="mg-score">Score: <span id="rg-score">0</span>  Round: <span id="rg-round">0</span>/${total}</div>
      <div id="rg-flash" class="reflex-target">TAP!</div>
      <div id="rg-msg" class="mg-msg"></div>
      <button class="btn-primary" onclick="endMiniGame('reflex',0)" style="margin-top:12px">Give Up</button>
    </div>
  `;

  let round = 0;
  function nextFlash() {
    if (round >= total) { endMiniGame('reflex', score); return; }
    const delay = 600 + Math.random() * 1800;
    setTimeout(() => {
      const btn = document.getElementById('rg-flash');
      if (!btn) return;
      flashing = true;
      btn.classList.add('active-flash');
      document.getElementById('rg-round').textContent = ++round;

      const timeout = setTimeout(() => {
        if (flashing) {
          flashing = false;
          btn.classList.remove('active-flash');
          document.getElementById('rg-msg').textContent = '❌ Too slow!';
          nextFlash();
        }
      }, 900);

      btn.onclick = () => {
        if (!flashing) return;
        clearTimeout(timeout);
        flashing = false;
        btn.classList.remove('active-flash');
        score += 20;
        hits++;
        document.getElementById('rg-score').textContent = score;
        document.getElementById('rg-msg').textContent = '✅ Hit! +20 XP';
        nextFlash();
      };
    }, delay);
  }
  nextFlash();
}

function startEnduranceGame(area) {
  let holding = false, xpGained = 0, seconds = 0;
  let timer;

  area.innerHTML = `
    <div class="mini-game endurance-game">
      <div class="mg-title">🔥 Endurance Burn!</div>
      <div class="mg-score">Held: <span id="eg-sec">0</span>s   XP: <span id="eg-xp">0</span></div>
      <div id="eg-btn" class="endurance-btn">HOLD</div>
      <div class="mg-msg">Hold the button as long as you can!</div>
    </div>
  `;

  const btn = document.getElementById('eg-btn');
  const start = () => {
    if (holding) return;
    holding = true;
    btn.classList.add('holding');
    timer = setInterval(() => {
      seconds++;
      xpGained += 5;
      document.getElementById('eg-sec').textContent = seconds;
      document.getElementById('eg-xp').textContent  = xpGained;
      if (seconds >= 20) { stop(); endMiniGame('endurance', xpGained); }
    }, 1000);
  };
  const stop = () => {
    if (!holding) return;
    holding = false;
    clearInterval(timer);
    btn.classList.remove('holding');
    endMiniGame('endurance', xpGained);
  };

  btn.addEventListener('mousedown', start);
  btn.addEventListener('touchstart', e => { e.preventDefault(); start(); });
  btn.addEventListener('mouseup', stop);
  btn.addEventListener('mouseleave', stop);
  btn.addEventListener('touchend', stop);
}

function startFocusGame(area) {
  let score = 0, round = 0, total = 6;

  area.innerHTML = `
    <div class="mini-game focus-game">
      <div class="mg-title">🎯 Focus Target</div>
      <div class="mg-score">Hits: <span id="fg-score">0</span> / ${total}</div>
      <div id="fg-arena" class="focus-arena"></div>
      <div id="fg-msg" class="mg-msg">Tap the targets!</div>
    </div>
  `;

  function spawnTarget() {
    if (round >= total) { endMiniGame('focus', score * 15); return; }
    round++;
    const arena = document.getElementById('fg-arena');
    if (!arena) return;
    const target = document.createElement('div');
    target.className = 'focus-target';
    target.style.left = (5 + Math.random() * 80) + '%';
    target.style.top  = (5 + Math.random() * 70) + '%';
    target.textContent = '🎯';
    arena.appendChild(target);

    const to = setTimeout(() => {
      if (target.parentNode) target.remove();
      document.getElementById('fg-msg').textContent = '❌ Missed!';
      spawnTarget();
    }, 1200);

    target.addEventListener('click', () => {
      clearTimeout(to);
      target.remove();
      score++;
      document.getElementById('fg-score').textContent = score;
      document.getElementById('fg-msg').textContent = '✅ Hit! +15 XP';
      spawnTarget();
    });
  }
  spawnTarget();
}

function endMiniGame(type, xpGained) {
  G.creature.trainingCount++;
  grantXP(xpGained);
  saveGame();
  showToast(`🏆 Training complete! +${xpGained} XP!`);
  setTimeout(() => { renderHome(); showScreen('home'); }, 1500);
}

// ---- Battle Prep ----
function renderBattlePrep() {
  if (!G.creature) { showScreen('home'); return; }
  const def = CREATURES[G.creature.id];
  const el = document.getElementById('battle-prep-content');
  if (!el) return;

  G.selectedMoves = G.creature.equippedMoves.slice(0, 3);
  G.stance = 'balanced';
  G.selectedItem = null;

  const oppIdx = Math.floor(Math.random() * AI_OPPONENTS.length);
  G.opponent = { ...AI_OPPONENTS[oppIdx] };
  G.opponent.id = G.opponent.creature;
  const oppDef = CREATURES[G.opponent.creature];

  el.innerHTML = `
    <div class="bp-header">
      <button class="btn-back" onclick="showScreen('home')">← Back</button>
      <h2>⚔️ Battle Preparation</h2>
    </div>

    <div class="bp-matchup">
      <div class="bp-fighter player-side">
        <div class="bp-fighter-sprite" style="filter:drop-shadow(0 0 16px ${def.glow})">
          ${getSpriteHTML(G.creature.id, stageFromLevel(G.creature.level).id, 72)}
        </div>
        <div class="bp-fighter-name">${G.creature.name}</div>
        <div class="bp-fighter-level">Lv.${G.creature.level}</div>
      </div>
      <div class="bp-vs">VS</div>
      <div class="bp-fighter opponent-side">
        <div class="bp-fighter-sprite" style="filter:drop-shadow(0 0 16px ${oppDef.glow})">
          ${getSpriteHTML(G.opponent.creature, stageFromLevel(G.opponent.level).id, 72)}
        </div>
        <div class="bp-fighter-name">${G.opponent.name}</div>
        <div class="bp-challenger-name">${G.opponent.name}</div>
        <div class="bp-fighter-level">Lv.${G.opponent.level}</div>
      </div>
    </div>

    <div class="opponent-taunt">"${G.opponent.message}"</div>

    <div class="bp-section">
      <div class="bp-section-title">⚔️ Choose 3 Moves</div>
      <div class="bp-moves-grid" id="bp-moves-grid">
        ${def.moves.map(moveId => {
          const move = MOVES[moveId];
          if (!move) return '';
          const elem = ELEMENTS[move.element];
          const selected = G.selectedMoves.includes(moveId);
          return `
            <div class="bp-move-card ${selected ? 'selected' : ''}" data-move="${moveId}"
                 onclick="toggleMove('${moveId}')">
              <div class="bpmc-name">${move.name}</div>
              <div class="bpmc-elem" style="color:${elem.color}">${elem.icon} ${elem.name}</div>
              <div class="bpmc-power">${move.power > 0 ? '⚡ ' + move.power : '🔮 Buff'}</div>
              <div class="bpmc-effect">${move.effect !== 'none' ? '✦ ' + move.effect : ''}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="bp-moves-count" id="bp-moves-count">Selected: ${G.selectedMoves.length} / 3</div>
    </div>

    <div class="bp-section">
      <div class="bp-section-title">🧘 Battle Stance</div>
      <div class="stance-row">
        ${['aggressive','balanced','defensive'].map(s => `
          <button class="stance-btn ${G.stance === s ? 'active' : ''}" onclick="setStance('${s}')">
            ${{ aggressive:'⚔️ Aggressive', balanced:'⚖️ Balanced', defensive:'🛡️ Defensive' }[s]}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="bp-section">
      <div class="bp-section-title">🎒 Battle Item</div>
      <div class="item-row">
        <button class="item-btn ${!G.selectedItem ? 'active' : ''}" onclick="selectItem(null)">None</button>
        ${['bandage','focus_berry','smoke_cloud'].map(itemId => {
          const item = ITEMS[itemId];
          if (!G.inventory.includes(itemId)) return '';
          return `
            <button class="item-btn ${G.selectedItem === itemId ? 'active' : ''}"
                    onclick="selectItem('${itemId}')">
              ${item.icon} ${item.name}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <button class="btn-start-battle" onclick="startBattle()" id="btn-start-battle">
      ⚔️ FIGHT!
    </button>
  `;
}

function toggleMove(moveId) {
  if (G.selectedMoves.includes(moveId)) {
    G.selectedMoves = G.selectedMoves.filter(m => m !== moveId);
  } else if (G.selectedMoves.length < 3) {
    G.selectedMoves.push(moveId);
  } else {
    showToast('⚠️ Already have 3 moves selected!');
    return;
  }
  document.querySelectorAll('.bp-move-card').forEach(card => {
    card.classList.toggle('selected', G.selectedMoves.includes(card.dataset.move));
  });
  const count = document.getElementById('bp-moves-count');
  if (count) count.textContent = `Selected: ${G.selectedMoves.length} / 3`;
}

function setStance(s) {
  G.stance = s;
  document.querySelectorAll('.stance-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase().includes(s));
  });
}

function selectItem(itemId) {
  G.selectedItem = itemId;
  document.querySelectorAll('.item-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

function startBattle() {
  if (G.selectedMoves.length === 0) {
    G.selectedMoves = CREATURES[G.creature.id].moves.slice(0, 3);
  }
  showScreen('battle');
}

// ---- Battle Screen ----
function renderBattleScreen() {
  ensureCreatureFields(G.creature);
  const def      = CREATURES[G.creature.id];
  const oppDef   = CREATURES[G.opponent.creature];
  const stageDef = stageFromLevel(G.creature.level);
  const oppStage = stageFromLevel(G.opponent.level);
  const el = document.getElementById('battle-content');
  if (!el) return;

  const oppMaxHp = Math.floor(oppDef.baseStats.maxHp * (1 + (G.opponent.level - 1) * 0.03));
  const tintFilter = G.creature.colorTint ? `hue-rotate(${G.creature.colorTint}deg)` : '';

  el.innerHTML = `
    <div class="battle-arena">

      <div class="battle-landscape">
        <div class="battle-sky"></div>
        <div class="battle-midground">
          <div class="opp-platform"></div>
          <div class="player-platform"></div>
        </div>
      </div>

      <!-- Move name banner -->
      <div class="battle-move-banner hidden" id="battle-move-banner"></div>

      <!-- Opponent: HP box left, sprite right -->
      <div class="battle-opp-row">
        <div class="battle-infobox opp-infobox">
          <div class="bib-name-row">
            <span class="bib-name">${G.opponent.name}</span>
            <span class="bib-level">Lv.${G.opponent.level}</span>
          </div>
          <div class="bib-hp-row">
            <span class="bib-hp-label">HP</span>
            <div class="bib-hp-track">
              <div class="bib-hp-fill" id="battle-opp-hpbar" style="width:100%;background:#3a9e38"></div>
            </div>
          </div>
          <div class="bib-hp-num" id="battle-opp-hp">${oppMaxHp}/${oppMaxHp}</div>
        </div>
        <div class="opp-sprite-area" id="battle-opp-sprite">
          ${getSpriteHTML(G.opponent.creature, oppStage.id, 110)}
        </div>
      </div>

      <!-- Player: sprite left, HP box right -->
      <div class="battle-player-row">
        <div class="player-sprite-area" id="battle-player-sprite"
             style="${tintFilter ? `filter:${tintFilter}` : ''}">
          ${getSpriteHTML(G.creature.id, stageDef.id, 128)}
        </div>
        <div class="battle-infobox player-infobox">
          <div class="bib-name-row">
            <span class="bib-name">${G.creature.name}</span>
            <span class="bib-level">Lv.${G.creature.level}</span>
          </div>
          <div class="bib-hp-row">
            <span class="bib-hp-label">HP</span>
            <div class="bib-hp-track">
              <div class="bib-hp-fill" id="battle-player-hpbar" style="width:${(G.creature.hp/G.creature.maxHp)*100}%;background:#3a9e38"></div>
            </div>
          </div>
          <div class="bib-hp-num" id="battle-player-hp">${G.creature.hp}/${G.creature.maxHp}</div>
        </div>
      </div>

      <!-- Pokémon-style dialog box -->
      <div class="battle-dialog-box">
        <div class="battle-log" id="battle-log"></div>
      </div>

      <!-- Attack visual effects layer -->
      <div class="battle-fx-layer" id="battle-fx-layer"></div>

    </div>
  `;

  Battle.init(G.selectedMoves, G.stance, G.selectedItem);
  Battle.setElements(
    document.getElementById('battle-log'),
    document.getElementById('battle-player-hpbar'),
    document.getElementById('battle-player-hp'),
    document.getElementById('battle-opp-hpbar'),
    document.getElementById('battle-opp-hp'),
    document.getElementById('battle-player-sprite'),
    document.getElementById('battle-opp-sprite')
  );

  const opponentCreature = {
    id: G.opponent.creature,
    name: CREATURES[G.opponent.creature].name,
    level: G.opponent.level,
    personality: CREATURES[G.opponent.creature].personality,
    trainingCount: 0
  };

  Battle.run(G.creature, opponentCreature).then(result => {
    G.battleResult = result;
    G.creature.battleCount++;
    if (result.winner === 'player') {
      G.creature.hp = Math.max(1, result.playerHpLeft);
      const xpReward = 40 + G.opponent.level * 5;
      grantXP(xpReward);
      G.coins += 20 + G.opponent.level * 2;
      // Chance to earn gear from battle
      if (Math.random() < 0.3) {
        const pool = Object.keys(GEAR).filter(gid => {
          const g = GEAR[gid];
          return g.rarity === 'common' || (G.opponent.level >= 12 && g.rarity === 'rare');
        });
        const earnedId = pool[Math.floor(Math.random() * pool.length)];
        ensureCreatureFields(G.creature);
        G.creature.gearInventory.push(earnedId);
        showToast(`🏆 Victory! +${xpReward} XP! Found: ${GEAR[earnedId].name}!`);
      } else {
        showToast(`🏆 Victory! +${xpReward} XP!`);
      }
    } else {
      G.creature.hp = Math.max(1, Math.floor(G.creature.maxHp * 0.1));
      G.creature.recoveryEvents++;
      showToast(`💔 Defeated... Rest and recover!`);
    }
    saveGame();
    setTimeout(() => showScreen('battle-result'), 2000);
  });
}

// ---- Battle Result ----
function renderBattleResult() {
  const result = G.battleResult;
  if (!result) { showScreen('home'); return; }
  const def = CREATURES[G.creature.id];
  const won = result.winner === 'player';
  const el = document.getElementById('battle-result-content');
  if (!el) return;

  el.innerHTML = `
    <div class="result-screen ${won ? 'result-win' : 'result-lose'}">
      <div class="result-emoji">${won ? '🏆' : '💔'}</div>
      <div class="result-title">${won ? 'VICTORY!' : 'DEFEATED...'}</div>
      <div class="result-creature" style="filter:drop-shadow(0 0 20px ${def.glow})">
        ${getSpriteHTML(G.creature.id, stageFromLevel(G.creature.level).id, 120)}
      </div>
      <div class="result-name">${G.creature.name}</div>
      <div class="result-stats">
        <div class="rs-stat">HP Remaining: ${result.playerHpLeft} / ${G.creature.maxHp}</div>
        <div class="rs-stat">Rounds Fought: ${result.rounds.length}</div>
        ${won ? `<div class="rs-reward">+${40 + G.opponent.level*5} XP  •  +${20 + G.opponent.level*2} 💰</div>` : ''}
      </div>
      <button class="btn-primary" onclick="showScreen('home')">Return to Camp</button>
    </div>
  `;
}

// ---- Profile Screen ----
function renderProfile() {
  if (!G.creature) { showScreen('home'); return; }
  const c = G.creature;
  const def = CREATURES[c.id];
  const stageDef = stageFromLevel(c.level);
  const stageInfo = def.stages[stageDef.id];
  const pers = PERSONALITIES[c.personality];
  const evPath = determineEvolutionPath(c);
  const el = document.getElementById('profile-content');
  if (!el) return;

  el.innerHTML = `
    <div class="profile-header">
      <button class="btn-back" onclick="showScreen('home')">← Back</button>
      <h2>📊 Creature Profile</h2>
    </div>
    <div class="profile-creature">
      <div class="profile-sprite" style="filter:drop-shadow(0 0 24px ${def.glow})">
        ${getSpriteHTML(c.id, stageDef.id, 130)}
      </div>
      <div class="profile-name">${c.name}</div>
      <div class="profile-title">${stageInfo ? stageInfo.name : ''} · ${def.title}</div>
    </div>
    <div class="profile-grid">
      <div class="profile-card">
        <div class="pc-title">📈 Level & Progress</div>
        <div class="pc-row"><span>Level</span><b>${c.level} / 100</b></div>
        <div class="pc-row"><span>Stage</span><b>${stageDef.name}</b></div>
        <div class="pc-row"><span>XP</span><b>${c.xp} / ${c.level < 100 ? xpForLevel(c.level+1) : 'MAX'}</b></div>
        <div class="pc-row"><span>Evolution Path</span><b>${evPath}</b></div>
      </div>
      <div class="profile-card">
        <div class="pc-title">⚔️ Battle Stats</div>
        <div class="pc-row"><span>HP</span><b>${c.hp} / ${c.maxHp}</b></div>
        <div class="pc-row"><span>Attack</span><b>${Math.floor(def.baseStats.atk * (1+(c.level-1)*0.03))}</b></div>
        <div class="pc-row"><span>Defense</span><b>${Math.floor(def.baseStats.def * (1+(c.level-1)*0.03))}</b></div>
        <div class="pc-row"><span>Speed</span><b>${Math.floor(def.baseStats.spd * (1+(c.level-1)*0.03))}</b></div>
      </div>
      <div class="profile-card">
        <div class="pc-title">💗 Care History</div>
        <div class="pc-row"><span>Battles</span><b>${c.battleCount}</b></div>
        <div class="pc-row"><span>Training Sessions</span><b>${c.trainingCount}</b></div>
        <div class="pc-row"><span>Affection Acts</span><b>${c.affectionCount}</b></div>
        <div class="pc-row"><span>Bond Level</span><b>${c.bondLevel} / 100</b></div>
      </div>
      <div class="profile-card">
        <div class="pc-title">🧬 Incubation Bonuses</div>
        ${(c.incubationBonuses || []).length ? c.incubationBonuses.map(b =>
          `<div class="pc-row"><span>${b.name}</span><b>${b.effect}</b></div>`
        ).join('') : '<div class="pc-empty">No bonuses from incubation</div>'}
      </div>
    </div>
    <div class="profile-moves">
      <div class="pm-title">⚔️ Known Moves</div>
      <div class="pm-grid">
        ${def.moves.map(moveId => {
          const move = MOVES[moveId];
          if (!move) return '';
          const elem = ELEMENTS[move.element];
          return `
            <div class="pm-card">
              <div class="pmc-name">${move.name}</div>
              <div class="pmc-elem" style="color:${elem.color}">${elem.icon}</div>
              <div class="pmc-power">${move.power > 0 ? move.power + ' pwr' : 'Buff'}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
    <div class="stage-timeline">
      <div class="st-title">📅 Evolution Stages</div>
      <div class="st-stages">
        ${STAGES.map(s => {
          const past = c.level > s.max;
          const curr = stageDef.id === s.id;
          const stageInfo = def.stages[s.id];
          return `
            <div class="st-stage ${past ? 'past' : curr ? 'current' : 'future'}">
              <div class="sts-level">Lv.${s.min}</div>
              <div class="sts-dot"></div>
              <div class="sts-name">${s.name}</div>
              <div class="sts-form">${stageInfo ? stageInfo.name : ''}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    ${(() => {
      const lore = CREATURE_LORE[c.id];
      if (!lore) return '';
      const rivalDef = CREATURES[lore.rival];
      return `
        <div class="lore-card">
          <div class="lore-title">📖 ${def.name}'s Lore</div>
          <div class="lore-origin">${lore.origin}</div>
          <div class="lore-trait-row">
            <span class="lore-trait-label">Unique Trait</span>
            <span class="lore-trait-text">${lore.trait}</span>
          </div>
          ${rivalDef ? `<div class="lore-rival">Rival: <b>${rivalDef.name}</b> <span style="opacity:0.6">(${rivalDef.title})</span></div>` : ''}
          <div class="lore-quote">${lore.quote}</div>
        </div>
      `;
    })()}

    <div class="customize-card">
      <div class="customize-title">🎨 Customize ${c.name}</div>
      <div class="customize-tints">
        ${[
          { label:'Natural', tint:0 },
          { label:'Ember',   tint:25  },
          { label:'Spring',  tint:75  },
          { label:'Ocean',   tint:155 },
          { label:'Night',   tint:215 },
          { label:'Mystic',  tint:275 },
          { label:'Coral',   tint:340 }
        ].map(opt => `
          <button class="tint-btn ${c.colorTint === opt.tint ? 'tint-active' : ''}"
                  onclick="setColorTint(${opt.tint})"
                  style="${opt.tint !== 0 ? `filter:hue-rotate(${opt.tint}deg) saturate(1.5)` : ''}">
            <div class="tint-swatch" style="background:${def.color};${opt.tint !== 0 ? `filter:hue-rotate(${opt.tint}deg)` : ''}"></div>
            <span>${opt.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// ---- Collection Screen ----
function renderCollection() {
  const el = document.getElementById('collection-content');
  if (!el) return;
  const allCreatures = Object.values(CREATURES);
  el.innerHTML = `
    <div class="collection-header">
      <button class="btn-back" onclick="showScreen('home')">← Back</button>
      <h2>📖 Beast Codex  <span class="codex-count">${G.collection.length} / ${allCreatures.length}</span></h2>
    </div>
    <div class="codex-grid">
      ${allCreatures.map(c => {
        const discovered = G.collection.includes(c.id);
        const elem = ELEMENTS[c.element];
        return `
          <div class="codex-card ${discovered ? 'discovered' : 'undiscovered'}">
            <div class="cc-sprite" style="${discovered ? `filter:drop-shadow(0 0 10px ${c.glow})` : 'filter:grayscale(1) brightness(0.3) opacity(0.45)'}">
              ${discovered ? getSpriteHTML(c.id, 'baby', 58) : '<span style="font-size:1.8rem;line-height:60px;display:block;text-align:center">❓</span>'}
            </div>
            <div class="cc-name">${discovered ? c.name : '???'}</div>
            ${discovered ? `<div class="cc-elem" style="color:${elem.color}">${elem.icon} ${elem.name}</div>` : ''}
            <div class="cc-category">${discovered ? c.category : '---'}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ---- Gear Screen ----
function renderGearScreen() {
  const c = G.creature;
  if (!c) { showScreen('home'); return; }
  ensureCreatureFields(c);
  const def = CREATURES[c.id];
  const el = document.getElementById('gear-content');
  if (!el) return;

  const eq  = c.equippedGear;
  const inv = c.gearInventory;

  const rarityColor = { common:'#a09a80', rare:'#4a90e2', epic:'#c084fc', legend:'#e09020' };
  const slotIcon    = { weapon:'⚔️', armor:'🛡️', trinket:'💫' };
  const slotLabel   = { weapon:'Weapon', armor:'Armor', trinket:'Trinket' };

  // Compute total gear bonuses
  const totals = { atk:0, def:0, spd:0, hp:0 };
  ['weapon','armor','trinket'].forEach(slot => {
    if (eq[slot] && GEAR[eq[slot]]) {
      Object.entries(GEAR[eq[slot]].bonus).forEach(([k,v]) => { totals[k] = (totals[k]||0) + v; });
    }
  });

  const bonusChips = Object.entries(totals).filter(([,v]) => v > 0)
    .map(([k,v]) => `<span class="gear-bonus-chip">+${v} ${k.toUpperCase()}</span>`).join('');

  const tintFilter = c.colorTint ? `hue-rotate(${c.colorTint}deg)` : '';

  const gearCard = (gearId, showEquip = true) => {
    const g = GEAR[gearId];
    if (!g) return '';
    const isEquipped  = eq[g.slot] === gearId;
    const bonusText   = Object.entries(g.bonus).map(([k,v]) => `<span>+${v} ${k.toUpperCase()}</span>`).join('');
    return `
      <div class="gear-card ${isEquipped ? 'gear-equipped' : ''}" style="--rarity:${rarityColor[g.rarity]}">
        <div class="gc-left">
          <div class="gc-icon">${g.icon}</div>
          <div class="gc-rarity-dot" style="background:${rarityColor[g.rarity]}"></div>
        </div>
        <div class="gc-info">
          <div class="gc-name">${g.name} <span class="gc-rarity" style="color:${rarityColor[g.rarity]}">${g.rarity}</span></div>
          <div class="gc-bonus">${bonusText}</div>
          <div class="gc-desc">${g.desc}</div>
        </div>
        ${showEquip ? `
          <div class="gc-action">
            ${isEquipped
              ? `<button class="gear-btn gear-unequip" onclick="unequipGear('${g.slot}')">✕</button>`
              : `<button class="gear-btn gear-equip"   onclick="equipGear('${gearId}')">Equip</button>`}
          </div>` : ''}
      </div>
    `;
  };

  const shopCard = (gearId) => {
    const g = GEAR[gearId];
    if (!g) return '';
    const ownedInInv  = inv.includes(gearId);
    const ownedEquip  = Object.values(eq).includes(gearId);
    const owned       = ownedInInv || ownedEquip;
    const bonusText   = Object.entries(g.bonus).map(([k,v]) => `<span>+${v} ${k.toUpperCase()}</span>`).join('');
    return `
      <div class="gear-card shop-card ${owned ? 'shop-owned' : ''}" style="--rarity:${rarityColor[g.rarity]}">
        <div class="gc-left">
          <div class="gc-icon">${g.icon}</div>
          <div class="gc-rarity-dot" style="background:${rarityColor[g.rarity]}"></div>
        </div>
        <div class="gc-info">
          <div class="gc-name">${g.name} <span class="gc-rarity" style="color:${rarityColor[g.rarity]}">${g.rarity}</span></div>
          <div class="gc-bonus">${bonusText}</div>
        </div>
        <div class="gc-action">
          ${owned
            ? `<span class="gear-owned-badge">✓</span>`
            : `<button class="gear-btn gear-buy ${G.coins < g.cost ? 'gear-cant-buy' : ''}"
                       onclick="buyGear('${gearId}')">💰${g.cost}</button>`}
        </div>
      </div>
    `;
  };

  // Gear in inventory (not equipped)
  const unequippedInv = inv.filter(gid => !Object.values(eq).includes(gid));
  const allOwned = [...Object.values(eq).filter(Boolean), ...unequippedInv];

  el.innerHTML = `
    <div class="gear-header">
      <button class="btn-back" onclick="showScreen('home')">← Back</button>
      <h2>⚔️ Equipment</h2>
      <div class="home-coins">💰 ${G.coins}</div>
    </div>

    <div class="gear-creature-display">
      <div class="gear-sprite-wrap" style="filter:drop-shadow(0 0 20px ${def.glow}) ${tintFilter}">
        ${getSpriteHTML(c.id, stageFromLevel(c.level).id, 100)}
      </div>
      <div class="gear-slots-row">
        ${['weapon','armor','trinket'].map(slot => {
          const gid = eq[slot];
          const g   = gid ? GEAR[gid] : null;
          return `
            <div class="gear-slot ${g ? 'slot-filled' : 'slot-empty'}"
                 style="${g ? `--rarity:${rarityColor[g.rarity]};border-color:${rarityColor[g.rarity]}40` : ''}">
              <div class="gs-icon">${g ? g.icon : slotIcon[slot]}</div>
              <div class="gs-label">${g ? g.name : slotLabel[slot]}</div>
            </div>
          `;
        }).join('')}
      </div>
      ${bonusChips
        ? `<div class="gear-stat-bonuses">${bonusChips}</div>`
        : `<div class="gear-no-bonus">Equip gear to boost your stats in battle</div>`}
    </div>

    ${allOwned.length > 0 ? `
      <div class="gear-section-title">🎒 Your Gear</div>
      <div class="gear-list">
        ${allOwned.map(gid => gearCard(gid)).join('')}
      </div>
    ` : `
      <div class="gear-empty">Win battles or visit the shop to earn gear!</div>
    `}

    <div class="gear-section-title">🛒 Gear Shop</div>
    <div class="gear-list">
      ${Object.keys(GEAR).map(gid => shopCard(gid)).join('')}
    </div>
  `;
}

function equipGear(gearId) {
  const c = G.creature;
  const g = GEAR[gearId];
  if (!g || !c) return;
  ensureCreatureFields(c);

  const inv = c.gearInventory;
  const eq  = c.equippedGear;

  // Remove from inventory if it's there
  const idx = inv.indexOf(gearId);
  if (idx !== -1) inv.splice(idx, 1);

  // Unequip existing in that slot
  if (eq[g.slot] && eq[g.slot] !== gearId) inv.push(eq[g.slot]);

  eq[g.slot] = gearId;
  saveGame();
  renderGearScreen();
  showToast(`${g.icon} ${g.name} equipped!`);
}

function unequipGear(slot) {
  const c = G.creature;
  if (!c) return;
  ensureCreatureFields(c);
  const gid = c.equippedGear[slot];
  if (!gid) return;
  c.gearInventory.push(gid);
  c.equippedGear[slot] = null;
  saveGame();
  renderGearScreen();
  showToast('Gear unequipped.');
}

function buyGear(gearId) {
  const g = GEAR[gearId];
  if (!g || !G.creature) return;
  if (G.coins < g.cost) { showToast('💰 Not enough coins!'); return; }
  G.coins -= g.cost;
  ensureCreatureFields(G.creature);
  G.creature.gearInventory.push(gearId);
  saveGame();
  renderGearScreen();
  showToast(`🎁 Bought ${g.name}!`);
}

function setColorTint(tint) {
  if (!G.creature) return;
  G.creature.colorTint = tint;
  saveGame();
  renderProfile();
  showToast('🎨 Color updated!');
}

// ---- Utility Renderers ----
function statBar(label, val, max) {
  const pct = Math.min(100, (val / max) * 100);
  return `
    <div class="stat-bar-row">
      <span class="sb-label">${label}</span>
      <div class="sb-track"><div class="sb-fill" style="width:${pct}%"></div></div>
      <span class="sb-val">${val}</span>
    </div>
  `;
}

function vitalBar(icon, label, val) {
  const pct = Math.max(0, Math.min(100, val));
  const color = pct > 60 ? '#10b981' : pct > 30 ? '#f59e0b' : '#ef4444';
  return `
    <div class="vital-bar">
      <span class="vb-icon">${icon}</span>
      <div class="vb-track"><div class="vb-fill" style="width:${pct}%;background:${color}"></div></div>
      <span class="vb-val">${Math.round(pct)}%</span>
    </div>
  `;
}

// ---- Particle Background ----
function startParticles() {
  const canvas = document.getElementById('title-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({length: 80}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.6 + 0.2,
    color: ['#d4a032','#e07830','#c85828','#e8c040'][Math.floor(Math.random()*4)]
  }));

  function draw() {
    if (G.screen !== 'title') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ---- Button Event Listeners (global) ----
window.addEventListener('DOMContentLoaded', () => {
  loadGame();

  // Title buttons
  document.getElementById('btn-new-game')?.addEventListener('click', () => showScreen('choose-category'));
  document.getElementById('btn-continue')?.addEventListener('click', () => {
    if (G.incubation) showScreen('incubation');
    else if (G.creature) showScreen('home');
    else showScreen('choose-category');
  });

  // Name creature
  document.getElementById('btn-begin-incubation')?.addEventListener('click', () => {
    const input = document.getElementById('creature-name-input');
    const name = input?.value.trim() || CREATURES[G.selectedCreature].name;
    startIncubation(G.selectedCreature, name);
    showScreen('incubation');
  });

  // Back buttons (delegated)
  document.addEventListener('click', e => {
    if (e.target.matches('[data-back]')) {
      showScreen(e.target.dataset.back);
    }
  });

  showScreen('title');
});
