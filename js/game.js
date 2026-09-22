// =====================================================
// HATCHBOUND: BEAST ARENA  — Core Game Engine v1.0
// =====================================================

// ---- Bond-based incubation threshold ----
const BOND_THRESHOLD = 100;

// Escape player-supplied text before it goes into innerHTML
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// Local calendar date (YYYY-MM-DD). Daily streaks must roll over at the
// player's midnight, not UTC's — otherwise US evenings count as tomorrow.
function localDateKey(d) {
  d = d || new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

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
  campaign: { progress: 1, stars: {} },
  battleMode: null,
  daily: { last: null, streak: 0 },
  settings: { instructions: true },
  inventory: ['basic_meat','basic_meat','sweet_fruit','bandage','focus_berry'],
  notifications: [],
  careActionCooldown: {}
};

// Stage-scaled max HP: hatchlings are fragile, adults are tanks
function scaledMaxHp(def, level) {
  const power = STAGE_POWER[stageFromLevel(level).id] || 1;
  return Math.max(20, Math.floor(def.baseStats.maxHp * power * (1 + (level - 1) * 0.03)));
}

// ---- Creature Template ----
function createCreature(id, name) {
  const def = CREATURES[id];
  const persKeys = Object.keys(PERSONALITIES);
  return {
    id,
    name,
    level: 1,
    xp: 0,
    stage: 'baby',
    // Random personality + nature + IVs: every hatch plays differently
    personality: persKeys[Math.floor(Math.random() * persKeys.length)],
    nature: rollNature(),
    ivs: rollIVs(),
    trainedStats: { atk: 0, def: 0, spd: 0, hp: 0 },
    // Varied starting vitals so the bars never sit at a flat 80%
    hunger:    55 + Math.floor(Math.random() * 25),
    hygiene:   60 + Math.floor(Math.random() * 25),
    happiness: 65 + Math.floor(Math.random() * 25),
    energy:    70 + Math.floor(Math.random() * 25),
    hp: scaledMaxHp(def, 1),
    maxHp: scaledMaxHp(def, 1),
    trainingCount: 0,
    battleCount: 0,
    affectionCount: 0,
    recoveryEvents: 0,
    bondLevel: 0,
    nightSessions: 0,
    evolutionPaths: [],
    stageActivity: freshStageActivity(),
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
  if (!c.trainedStats)   c.trainedStats   = { atk: 0, def: 0, spd: 0, hp: 0 };
  c.incubationBonuses = normalizeBonuses(c.incubationBonuses);
  if (!c.nature)         c.nature         = rollNature();
  if (!c.ivs)            c.ivs            = rollIVs();
  if (typeof c.level === 'number') c.stage = stageFromLevel(c.level).id;
  if (!c.stageActivity)  c.stageActivity  = freshStageActivity();
  if (!Array.isArray(c.evolutionPaths)) c.evolutionPaths = [];
  delete c.evolutionPath;   // unused field from earlier versions
  return c;
}

// ---- Save / Load ----
const SAVE_KEY = 'hatchbound_save';
const SAVE_BACKUP_KEY = 'hatchbound_save_backup';

function collectSaveData() {
  return {
    version: GV,
    savedAt: Date.now(),
    // Which account this save belongs to (null = played without signing
    // in). Only sign-in reconciliation changes it, so neither an expired
    // session nor an autosave mid-sign-in can re-label someone's beast.
    owner: G.owner || null,
    cloudBase: G.cloudBase || 0,   // savedAt of the cloud version last synced
    coins: G.coins,
    creature: G.creature,
    collection: G.collection,
    inventory: G.inventory,
    incubation: G.incubation,
    campaign: G.campaign,
    daily: G.daily,
    settings: G.settings
  };
}

function saveGame() {
  const data = collectSaveData();
  let json;
  try {
    json = JSON.stringify(data);
  } catch (e) {
    console.warn('save serialize failed', e);
    return false;
  }
  try {
    // Keep the previous good save as a backup before overwriting, so a
    // half-written or corrupted write can never lose everything.
    const prev = localStorage.getItem(SAVE_KEY);
    if (prev) localStorage.setItem(SAVE_BACKUP_KEY, prev);
    localStorage.setItem(SAVE_KEY, json);
  } catch (e) {
    // Private mode / quota exhausted — tell the player rather than failing silently
    console.warn('local save failed', e);
    if (!saveGame._warned) {
      saveGame._warned = true;
      showToast("Couldn't save locally — storage is blocked or full", 5000);
    }
    return false;
  }
  // Mirror to the cloud when the player is signed in
  if (typeof Cloud !== 'undefined' && Cloud.isSignedIn()) Cloud.queuePush(data);
  return true;
}

// Apply a save object (from local storage or the cloud) into game state
function applySaveData(data) {
  if (!data) return false;
  G.coins = typeof data.coins === 'number' ? data.coins : 100;
  G.creature = ensureCreatureFields(data.creature || null);
  G.collection = data.collection || [];
  G.inventory = data.inventory || ['basic_meat','bandage'];
  G.incubation = data.incubation || null;
  // Migrate incubation saved by the old timer-based system (no bond field)
  if (G.incubation && typeof G.incubation.bond !== 'number') {
    G.incubation = {
      creatureId: G.incubation.creatureId,
      creatureName: G.incubation.creatureName,
      bond: 0,
      stats: { warmth: 0, comfort: 0, energy: 0, stability: 0, bond: 0 },
      careActions: [],
      crackStage: 0
    };
  }
  G.campaign = data.campaign || { progress: 1, stars: {} };
  G.daily = data.daily || { last: null, streak: 0 };
  G.settings = data.settings || { instructions: true };
  G.owner = data.owner || null;
  G.cloudBase = data.cloudBase || 0;
  return true;
}

function readLocalSave() {
  for (const key of [SAVE_KEY, SAVE_BACKUP_KEY]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        if (key === SAVE_BACKUP_KEY) console.warn('primary save unreadable — recovered from backup');
        return data;
      }
    } catch (e) { /* try the backup next */ }
  }
  return null;
}

function loadGame() {
  const data = readLocalSave();
  if (!data) return false;
  return applySaveData(data);
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
    G.creature.maxHp = scaledMaxHp(def, G.creature.level);
    G.creature.hp = Math.min(G.creature.hp + 20, G.creature.maxHp);
    const newStage = stageFromLevel(G.creature.level);
    if (newStage.id !== G.creature.stage) {
      G.creature.stage = newStage.id;
      // Undecided upbringing defaults to Guardian — it was cared for, at least
      const path = determineEvolutionPath(G.creature) || 'guardian';
      if (!G.creature.evolutionPaths) G.creature.evolutionPaths = [];
      G.creature.evolutionPaths.push({ stage: newStage.id, path });
      G.creature.stageActivity = freshStageActivity();
      G.notifications.push({ type:'evolve', stage: newStage, path });
    }
  }
  if (leveled) {
    saveGame();
    SFX.levelup();
  }
  return leveled;
}

// ---- Evolution paths ----
// How you raise your beast during a stage decides the path it locks in when
// it evolves, and each locked path is a permanent stat bonus (applied in
// battle). Activity is counted per stage, so every evolution reflects that
// stage's upbringing.
const EVOLUTION_PATHS = {
  warrior:  { name: 'Warrior',  icon: '⚔️', via: 'training',      stat: 'atk', label: '+6% ATK' },
  guardian: { name: 'Guardian', icon: '🛡️', via: 'care & affection', stat: 'hp',  label: '+6% HP' },
  duelist:  { name: 'Duelist',  icon: '💨', via: 'battling',       stat: 'spd', label: '+6% SPD' },
  survivor: { name: 'Survivor', icon: '🪨', via: 'pulling through hard times', stat: 'def', label: '+6% DEF' }
};
const PATH_BONUS = 1.06;
// Weights balance how often each activity happens: care actions are cheap
// and frequent, training is energy-gated, hardship is rare.
const PATH_WEIGHTS = { training: 4, care: 0.6, battle: 2, recovery: 5 };

function freshStageActivity() { return { training: 0, care: 0, battle: 0, recovery: 0 }; }

function trackActivity(kind, amount) {
  const c = G.creature;
  if (!c) return;
  if (!c.stageActivity) c.stageActivity = freshStageActivity();
  c.stageActivity[kind] = (c.stageActivity[kind] || 0) + (amount || 1);
}

// Leading path for the current stage, or null if nothing's happened yet
function determineEvolutionPath(creature) {
  const a = creature.stageActivity || freshStageActivity();
  const scores = {
    warrior:  a.training * PATH_WEIGHTS.training,
    guardian: a.care     * PATH_WEIGHTS.care,
    duelist:  a.battle   * PATH_WEIGHTS.battle,
    survivor: a.recovery * PATH_WEIGHTS.recovery
  };
  const [best, score] = Object.entries(scores).sort((x, y) => y[1] - x[1])[0];
  return score > 0 ? best : null;
}

// ---- Care Actions ----
function careAction(action) {
  if (!G.creature) return;
  const now = Date.now();
  const cooldown = 8000;
  if (G.careActionCooldown[action] && now - G.careActionCooldown[action] < cooldown) {
    showToast('Wait a moment before doing that again!');
    return false;
  }
  G.careActionCooldown[action] = now;

  const c = G.creature;
  drainStats();   // settle elapsed decay before applying the action
  let xpGained = 0;

  switch(action) {
    case 'feed':
      if (c.hunger >= 100) { showToast('Not hungry right now!'); return false; }
      c.hunger = Math.min(100, c.hunger + 25);
      c.happiness = Math.min(100, c.happiness + 5);
      c.affectionCount++;
      xpGained = 8; grantXP(8);
      showToast('Nom nom! Hunger restored!');
      break;
    case 'bathe':
      if (c.hygiene >= 100) { showToast('Already squeaky clean!'); return false; }
      c.hygiene = Math.min(100, c.hygiene + 30);
      c.happiness = Math.min(100, c.happiness + 5);
      c.affectionCount++;
      xpGained = 6; grantXP(6);
      showToast('Fresh and clean!');
      break;
    case 'train':
      if (c.energy < 20) { showToast('Too tired to train!'); return false; }
      c.energy = Math.max(0, c.energy - 15);
      c.trainingCount++;
      c.happiness = Math.min(100, c.happiness + 3);
      xpGained = 15; grantXP(15);
      showToast('Training complete! XP gained!');
      break;
    case 'bond':
      c.happiness = Math.min(100, c.happiness + 20);
      c.bondLevel = Math.min(100, c.bondLevel + 2);
      c.affectionCount++;
      xpGained = 10; grantXP(10);
      showToast('Your bond grows stronger!');
      break;
    case 'play':
      if (c.energy < 10) { showToast('Too tired to play!'); return false; }
      c.happiness = Math.min(100, c.happiness + 15);
      c.energy = Math.max(0, c.energy - 10);
      c.hunger = Math.max(0, c.hunger - 5);
      c.affectionCount++;
      xpGained = 8; grantXP(8);
      showToast('Playtime! Pure joy!');
      break;
    case 'sleep':
      c.energy = Math.min(100, c.energy + 40);
      const isNight = new Date().getHours() >= 20 || new Date().getHours() < 6;
      if (isNight) { c.nightSessions++; showToast('Night rest! Bonus stat gain!'); }
      else { showToast('Taking a nap...'); }
      xpGained = 5; grantXP(5);
      break;
  }

  c.lastCareTime = Date.now();
  trackActivity('care');
  saveGame();
  return { xp: xpGained };
}

// ---- Stat decay over time ----
// Vitals fall ~2 points per 3 minutes. Decay is applied only for the time
// since the previous drain, so it stays linear however often this runs.
// (It used to measure from the last care action on every call, which
// re-subtracted the same minutes over and over and drained quadratically.)
const VITAL_DECAY_PER_MIN = 2 / 3;
// Coming back after days away should find a hungry, needy beast — not an
// empty one. Offline decay stops at this floor.
const VITAL_OFFLINE_FLOOR = 12;

function drainStats() {
  if (!G.creature) return;
  const c = G.creature;
  const now = Date.now();
  const last = c.lastDrainTime || c.lastCareTime || now;
  const minutes = Math.max(0, (now - last) / 60000);
  c.lastDrainTime = now;
  if (minutes <= 0) return;

  const rate = VITAL_DECAY_PER_MIN * minutes;
  const wasHungry = c.hunger < 20;
  // A long gap means the player was away: never push a vital below the
  // floor, but don't raise one that was already lower.
  const away = minutes > 30;
  const decay = (v, mult) => {
    const next = v - rate * mult;
    return away ? Math.max(Math.min(v, VITAL_OFFLINE_FLOOR), next) : Math.max(0, next);
  };
  c.hunger    = decay(c.hunger,    1);
  c.hygiene   = decay(c.hygiene,   0.8);
  c.happiness = decay(c.happiness, 0.6);
  c.energy    = decay(c.energy,    0.5);
  // Count each time it slips into hunger once, not every tick while hungry
  if (!wasHungry && c.hunger < 20) {
    c.recoveryEvents = (c.recoveryEvents || 0) + 1;
    if (!c.stageActivity) c.stageActivity = freshStageActivity();
    c.stageActivity.recovery++;
  }
}

// ---- Incubation ----
function startIncubation(creatureId, creatureName) {
  G.incubation = {
    creatureId,
    creatureName,
    bond: 0,           // hidden bond level (0-100), hatches at BOND_THRESHOLD
    stats: { warmth: 0, comfort: 0, energy: 0, stability: 0, bond: 0 },
    careActions: [],
    crackStage: 0       // visual crack progress 0-4
  };
  lastHypeBondTier = 0;
  saveGame();
}

// Every bonus here is applied in battle (see Battle.buildCombatant).
const INCUBATION_BONUSES = {
  warmth:    { key: 'tough_shell',  name: 'Tough Shell',   effect: '+10% DEF',  mods: { def: 1.10 } },
  comfort:   { key: 'gentle_soul',  name: 'Gentle Soul',   effect: '+10% HP',   mods: { hp: 1.10 } },
  energy:    { key: 'swift_wings',  name: 'Swift Wings',   effect: '+10% SPD',  mods: { spd: 1.10 } },
  stability: { key: 'iron_will',    name: 'Iron Will',     effect: '+10% ATK',  mods: { atk: 1.10 } }
};
const BONUS_PERFECT = { key: 'perfect_care', name: 'Perfect Care', effect: '+5% to every stat',
                        mods: { hp: 1.05, atk: 1.05, def: 1.05, spd: 1.05 } };
const BONUS_HEART   = { key: 'heart_bond',   name: 'Heart Bond',   effect: 'Heals 4% HP each round', regen: 0.04 };

function calculateIncubationBonus(stats) {
  const games = ['warmth', 'comfort', 'energy', 'stability'];
  const total = games.reduce((a, k) => a + (stats[k] || 0), 0);
  const bonuses = [];
  if (total > 0) {
    // Specialist: a game that got 40%+ of your effort
    for (const k of games) {
      if ((stats[k] || 0) / total >= 0.40) bonuses.push(INCUBATION_BONUSES[k]);
    }
    // All-rounder: every game got at least 15%
    if (games.every(k => (stats[k] || 0) / total >= 0.15)) bonuses.push(BONUS_PERFECT);
  }
  // Affection: petting the egg often
  if ((stats.bond || 0) >= 6) bonuses.push(BONUS_HEART);
  return bonuses.map(b => ({ ...b }));
}

// Older saves stored bonuses as {name, effect} text only; map names back
// to the real definitions so those beasts get their bonuses too.
function normalizeBonuses(list) {
  const all = [...Object.values(INCUBATION_BONUSES), BONUS_PERFECT, BONUS_HEART];
  const legacy = { 'Mutation Seed': 'iron_will' };
  return (list || []).map(b => {
    if (b && b.key) return all.find(x => x.key === b.key) || b;
    const key = legacy[b && b.name];
    return all.find(x => x.name === (b && b.name) || x.key === key) || null;
  }).filter(Boolean);
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

// ---- Egg SVG Crack Overlays ----
function getEggCrackSVG(bond) {
  // Returns SVG path strings for progressive cracks based on bond level
  let cracks = '';
  const opacity = Math.min(1, bond / 60 + 0.3);

  if (bond > 20) {
    // First small crack
    cracks += `<path d="M50,15 L47,25 L52,30" stroke="#5a4a30" stroke-width="1.5" fill="none" opacity="${opacity}"/>`;
  }
  if (bond > 35) {
    // Second crack
    cracks += `<path d="M35,30 L30,40 L35,45 L28,50" stroke="#5a4a30" stroke-width="1.5" fill="none" opacity="${opacity}"/>`;
  }
  if (bond > 50) {
    // More cracks
    cracks += `<path d="M60,25 L65,35 L60,42 L67,50" stroke="#5a4a30" stroke-width="1.8" fill="none" opacity="${opacity}"/>`;
    cracks += `<path d="M45,40 L40,50 L45,55" stroke="#5a4a30" stroke-width="1.5" fill="none" opacity="${opacity}"/>`;
  }
  if (bond > 65) {
    // Heavy cracks
    cracks += `<path d="M55,45 L60,55 L55,60 L62,68" stroke="#5a4a30" stroke-width="2" fill="none" opacity="${opacity}"/>`;
    cracks += `<path d="M30,50 L25,58 L30,65 L22,70" stroke="#5a4a30" stroke-width="2" fill="none" opacity="${opacity}"/>`;
  }
  if (bond > 80) {
    // Shattering
    cracks += `<path d="M50,50 L45,60 L50,65 L43,72 L48,78" stroke="#5a4a30" stroke-width="2.2" fill="none" opacity="1"/>`;
    cracks += `<path d="M40,35 L35,42 L40,48 L33,55" stroke="#5a4a30" stroke-width="2" fill="none" opacity="1"/>`;
    cracks += `<path d="M58,38 L63,45 L58,52 L65,58" stroke="#5a4a30" stroke-width="2" fill="none" opacity="1"/>`;
  }

  return cracks;
}

function getEggHTML(bond, creatureColor, creatureGlow) {
  // Determine animation class based on bond level
  let animClass = 'egg-pulse';
  if (bond > 80) animClass = 'egg-violent-shake';
  else if (bond > 60) animClass = 'egg-shake';
  else if (bond > 40) animClass = 'egg-rock';
  else if (bond > 20) animClass = 'egg-wiggle';

  // Glow intensity based on bond
  const glowIntensity = Math.min(30, 4 + bond * 0.26);
  const glowOpacity = Math.min(0.8, 0.1 + bond * 0.007);

  const cracks = getEggCrackSVG(bond);

  return `
    <div class="egg-container ${animClass}" onclick="tapEgg()" title="Pet the egg!">
      <div class="egg-glow-aura" style="
        background: radial-gradient(circle, ${creatureGlow} 0%, transparent 65%);
        opacity: ${glowOpacity};
        width: ${120 + glowIntensity * 2}px;
        height: ${120 + glowIntensity * 2}px;
      "></div>
      <svg class="egg-svg" viewBox="0 0 100 120" width="120" height="144">
        <defs>
          <radialGradient id="eggGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#fff8e8"/>
            <stop offset="40%" stop-color="#f5e6c8"/>
            <stop offset="100%" stop-color="#d4b896"/>
          </radialGradient>
          <filter id="eggShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${creatureGlow}" flood-opacity="${glowOpacity}"/>
          </filter>
        </defs>
        <!-- Egg shape -->
        <ellipse cx="50" cy="62" rx="34" ry="44" fill="url(#eggGrad)" stroke="#b8a080" stroke-width="1.5" filter="url(#eggShadow)"/>
        <!-- Spots/pattern -->
        <ellipse cx="38" cy="50" rx="6" ry="4" fill="${creatureColor}" opacity="0.25" transform="rotate(-15 38 50)"/>
        <ellipse cx="58" cy="42" rx="5" ry="3.5" fill="${creatureColor}" opacity="0.2" transform="rotate(10 58 42)"/>
        <ellipse cx="45" cy="72" rx="7" ry="4" fill="${creatureColor}" opacity="0.2" transform="rotate(-5 45 72)"/>
        <!-- Cracks -->
        ${cracks}
        <!-- Shine highlight -->
        <ellipse cx="40" cy="40" rx="10" ry="14" fill="white" opacity="0.15"/>
      </svg>
    </div>
  `;
}

// ---- Egg petting: heartbeat thump, wiggle, and a slow trickle of bond ----
let lastEggTapReward = 0;
function tapEgg() {
  const incu = G.incubation;
  const egg = document.querySelector('.egg-container');
  if (!incu || !egg) return;
  SFX.thump();
  egg.classList.remove('egg-tapped');
  void egg.offsetWidth; // restart the animation
  egg.classList.add('egg-tapped');
  showEmote(egg, ['💗', '♪', '✨'][Math.floor(Math.random() * 3)]);

  const now = Date.now();
  if (now - lastEggTapReward > 10000 && incu.bond < BOND_THRESHOLD) {
    lastEggTapReward = now;
    incu.bond = Math.min(BOND_THRESHOLD + 10, incu.bond + 1);
    incu.stats.bond = Math.min(100, incu.stats.bond + 1);
    saveGame();
    // Refresh the screen once the tap animation has played, so the
    // state message and Hatch button stay in sync with the new bond.
    if (incu.bond >= BOND_THRESHOLD) setTimeout(() => renderIncubation(), 600);
  }
}

// ---- Egg state message ----
function getEggStateMessage(bond) {
  if (bond >= BOND_THRESHOLD) return "Your egg is ready to hatch!";
  if (bond >= 81) return "It's almost time! The egg is glowing!";
  if (bond >= 61) return "The egg is rocking on its own!";
  if (bond >= 41) return "Something is stirring! Keep going...";
  if (bond >= 21) return "You feel a faint warmth from inside...";
  return "Your egg is cold and still...";
}

// ---- Mini-game session token ----
// Incremented every time the incubation screen re-renders (including "Give Up"),
// so any still-running game loop from a previous session knows to stop.
let incuGameToken = 0;
function incuGameActive(token) {
  return token === incuGameToken && G.screen === 'incubation';
}


// Big end-of-game reaction scaled to performance
function gameEndHype(ratio) {
  if (ratio >= 0.75)      hype('AMAZING WORK!', '#ffd700');
  else if (ratio >= 0.45) hype('GREAT JOB!', '#60d080');
  else                    hype('GOOD EFFORT!', null, true);
}

// ---- Incubation Mini-Game: Warm the Egg ----
function startWarmGame() {
  showInstructions('runWarmGame', 'Warm the Egg', [
    'Tap <b>Add Heat</b> to raise the temperature',
    'Keep the needle inside the green PERFECT zone',
    'Heat drains fast — and watch out for cold gusts!',
    'More time in the zone = more bond'
  ], runWarmGame);
}

function runWarmGame() {
  const incu = G.incubation;
  if (!incu) return;

  const el = document.getElementById('incubation-content');
  if (!el) return;
  const token = ++incuGameToken;

  el.innerHTML = `
    <div class="mini-game warm-game">
      <div class="mg-title">Warm the Egg</div>
      <div class="mg-subtitle">Keep the temperature in the green zone!</div>
      <div class="mg-score">Time: <span id="wg-time">15</span>s &nbsp; Zone: <span id="wg-zone">0</span>s</div>
      <div class="warm-gauge-container">
        <div class="warm-gauge-bg">
          <div class="warm-zone warm-cold">COLD</div>
          <div class="warm-zone warm-sweet">PERFECT</div>
          <div class="warm-zone warm-hot">HOT</div>
          <div class="warm-indicator" id="wg-indicator"></div>
        </div>
      </div>
      <button class="btn-primary warm-heat-btn" id="wg-heat-btn">Add Heat</button>
      <div id="wg-msg" class="mg-msg">Tap to warm the egg!</div>
      <button class="btn-secondary" onclick="renderIncubation()" style="margin-top:10px">Give Up</button>
    </div>
  `;

  let temp = 30; // 0-100, sweet spot is 35-65
  let timeLeft = 15;
  let timeInZone = 0;
  let gameOver = false;

  const indicator = document.getElementById('wg-indicator');
  const timeEl = document.getElementById('wg-time');
  const zoneEl = document.getElementById('wg-zone');
  const msgEl = document.getElementById('wg-msg');
  const heatBtn = document.getElementById('wg-heat-btn');

  // Heating on press
  heatBtn.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (!gameOver) { temp = Math.min(100, temp + 7); SFX.tap(); }
  });

  const gameLoop = setInterval(() => {
    if (gameOver || !incuGameActive(token)) { clearInterval(gameLoop); return; }

    // Temperature drifts down naturally
    temp = Math.max(0, temp - (2.2 + (Math.random() < 0.05 ? 9 : 0))); // cold gusts!

    // Check if in sweet spot (35-65)
    const inZone = temp >= 40 && temp <= 62;
    if (inZone) timeInZone += 0.1;

    // Update indicator position (0=bottom, 100=top)
    if (indicator) indicator.style.bottom = temp + '%';

    if (timeEl) timeEl.textContent = Math.ceil(timeLeft);
    if (zoneEl) zoneEl.textContent = timeInZone.toFixed(1);

    if (inZone) {
      if (msgEl) msgEl.textContent = 'In the sweet spot!';
      if (msgEl) msgEl.style.color = '#10b981';
      if (timeInZone > 4.9 && timeInZone < 5.1) hypePraise();
    } else if (temp < 40) {
      if (msgEl) msgEl.textContent = 'Too cold! Add heat!';
      if (msgEl) msgEl.style.color = '#60a5fa';
    } else {
      if (msgEl) msgEl.textContent = 'Too hot! Let it cool!';
      if (msgEl) msgEl.style.color = '#ef4444';
    }

    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      gameOver = true;
      clearInterval(gameLoop);
      // Calculate bond reward: 8-15 based on time in zone (max 15s)
      const ratio = Math.min(1, timeInZone / 10);
      gameEndHype(ratio);
      const bondGain = Math.floor(8 + ratio * 7);
      incu.bond = Math.min(BOND_THRESHOLD + 10, incu.bond + bondGain);
      incu.stats.warmth = Math.min(100, incu.stats.warmth + bondGain);
      incu.crackStage = Math.floor(incu.bond / 25);
      incu.careActions.push({ stat: 'warmth', time: Date.now() });
      saveGame();
      if (msgEl) {
        msgEl.textContent = `+${bondGain} bond from warming!`;
        msgEl.style.color = '#f59e0b';
      }
      SFX.good();
      showToast(`Warmth session done! +${bondGain} bond`);
      setTimeout(() => renderIncubation(), 1500);
    }
  }, 100);
}

// ---- Incubation Mini-Game: Rock the Egg ----
function startRockGame() {
  showInstructions('runRockGame', 'Rock the Egg', [
    'Tap <b>Left</b> and <b>Right</b>, alternating',
    'Time your taps for when the needle is in the green zone',
    'Perfect-timed rocks earn much more bond'
  ], runRockGame);
}

function runRockGame() {
  const incu = G.incubation;
  if (!incu) return;

  const el = document.getElementById('incubation-content');
  if (!el) return;
  const token = ++incuGameToken;

  el.innerHTML = `
    <div class="mini-game rock-game">
      <div class="mg-title">Rock the Egg</div>
      <div class="mg-subtitle">Alternate tapping Left and Right in rhythm!</div>
      <div class="mg-score">Rocks: <span id="rkg-score">0</span> / 10 &nbsp; Perfect: <span id="rkg-perfect">0</span></div>
      <div class="rock-visual">
        <div class="rock-indicator-track">
          <div class="rock-indicator-zone" id="rkg-zone"></div>
          <div class="rock-indicator-needle" id="rkg-needle"></div>
        </div>
        <div class="rock-egg-display" id="rkg-egg">
          <svg viewBox="0 0 80 100" width="80" height="100">
            <ellipse cx="40" cy="52" rx="28" ry="38" fill="#f5e6c8" stroke="#b8a080" stroke-width="1.5"/>
          </svg>
        </div>
      </div>
      <div class="rock-buttons">
        <button class="btn-primary rock-btn rock-left" id="rkg-left">Left</button>
        <button class="btn-primary rock-btn rock-right" id="rkg-right">Right</button>
      </div>
      <div id="rkg-msg" class="mg-msg">Start rocking!</div>
      <button class="btn-secondary" onclick="renderIncubation()" style="margin-top:10px">Give Up</button>
    </div>
  `;

  let rocks = 0;
  let perfectRocks = 0;
  let expectLeft = true; // alternating pattern
  let totalRocks = 10;
  let gameOver = false;
  let needlePos = 50; // 0-100, perfect zone is 40-60
  let needleDir = 1;

  const scoreEl = document.getElementById('rkg-score');
  const perfectEl = document.getElementById('rkg-perfect');
  const msgEl = document.getElementById('rkg-msg');
  const needleEl = document.getElementById('rkg-needle');
  const eggEl = document.getElementById('rkg-egg');
  const leftBtn = document.getElementById('rkg-left');
  const rightBtn = document.getElementById('rkg-right');

  // Needle swings back and forth - press at the right time!
  const needleLoop = setInterval(() => {
    if (gameOver || !incuGameActive(token)) { clearInterval(needleLoop); return; }
    needlePos += needleDir * 3.4;
    if (needlePos >= 100) { needlePos = 100; needleDir = -1; }
    if (needlePos <= 0) { needlePos = 0; needleDir = 1; }
    if (needleEl) needleEl.style.left = needlePos + '%';
  }, 50);

  function doRock(isLeft) {
    if (gameOver) return;
    if (isLeft !== expectLeft) {
      if (msgEl) msgEl.textContent = `Press ${expectLeft ? 'Left' : 'Right'} next!`;
      return;
    }

    rocks++;
    expectLeft = !expectLeft;

    // Check timing (needle in zone 35-65 = perfect)
    const perfect = needlePos >= 40 && needlePos <= 60;
    if (perfect) {
      perfectRocks++;
      SFX.good();
      if (msgEl) msgEl.textContent = 'Perfect rock!';
      if (perfectRocks === 3) hype('PERFECT STREAK!', '#ffd700', true);
    } else {
      SFX.tap();
      if (msgEl) msgEl.textContent = 'Good rock!';
    }

    // Animate egg tilt
    if (eggEl) {
      eggEl.style.transform = isLeft ? 'rotate(-15deg)' : 'rotate(15deg)';
      setTimeout(() => { if (eggEl) eggEl.style.transform = 'rotate(0deg)'; }, 300);
    }

    if (scoreEl) scoreEl.textContent = rocks;
    if (perfectEl) perfectEl.textContent = perfectRocks;

    // Highlight active button
    if (isLeft && leftBtn) {
      leftBtn.classList.add('rock-active');
      setTimeout(() => leftBtn.classList.remove('rock-active'), 200);
    } else if (!isLeft && rightBtn) {
      rightBtn.classList.add('rock-active');
      setTimeout(() => rightBtn.classList.remove('rock-active'), 200);
    }

    if (rocks >= totalRocks) {
      gameOver = true;
      clearInterval(needleLoop);
      const ratio = perfectRocks / totalRocks;
      gameEndHype(ratio);
      const bondGain = Math.floor(8 + ratio * 7);
      incu.bond = Math.min(BOND_THRESHOLD + 10, incu.bond + bondGain);
      incu.stats.comfort = Math.min(100, incu.stats.comfort + bondGain);
      incu.crackStage = Math.floor(incu.bond / 25);
      incu.careActions.push({ stat: 'comfort', time: Date.now() });
      saveGame();
      if (msgEl) msgEl.textContent = `+${bondGain} bond! (${perfectRocks} perfect)`;
      SFX.good();
      showToast(`Rocking done! +${bondGain} bond`);
      setTimeout(() => renderIncubation(), 1500);
    }
  }

  leftBtn.addEventListener('pointerdown', e => { e.preventDefault(); doRock(true); });
  rightBtn.addEventListener('pointerdown', e => { e.preventDefault(); doRock(false); });
}

// ---- Incubation Mini-Game: Sing to It (Simon Says) ----
function startSingGame() {
  showInstructions('runSingGame', 'Sing to the Egg', [
    'Watch the colored pads light up and play notes',
    'Repeat the pattern by tapping the pads in order',
    'Each round adds a note and gets faster!'
  ], runSingGame);
}

function runSingGame() {
  const incu = G.incubation;
  if (!incu) return;

  const el = document.getElementById('incubation-content');
  if (!el) return;
  const token = ++incuGameToken;

  const colors = [
    { name: 'red', bg: '#ef4444', glow: '#fca5a5' },
    { name: 'blue', bg: '#3b82f6', glow: '#93c5fd' },
    { name: 'green', bg: '#22c55e', glow: '#86efac' },
    { name: 'yellow', bg: '#eab308', glow: '#fde047' }
  ];

  el.innerHTML = `
    <div class="mini-game sing-game">
      <div class="mg-title">Sing to the Egg</div>
      <div class="mg-subtitle">Watch the pattern, then repeat it!</div>
      <div class="mg-score">Sequence: <span id="sg-seq">1</span> &nbsp; Bond: <span id="sg-bond">0</span></div>
      <div class="simon-grid" id="sg-grid">
        ${colors.map((c, i) => `
          <button class="simon-btn" id="sg-btn-${i}" data-idx="${i}"
                  style="background:${c.bg}; --glow-color:${c.glow}">
          </button>
        `).join('')}
      </div>
      <div id="sg-msg" class="mg-msg">Watch carefully...</div>
      <button class="btn-secondary" onclick="renderIncubation()" style="margin-top:10px">Give Up</button>
    </div>
  `;

  let sequence = [];
  let playerIdx = 0;
  let totalBond = 0;
  let maxRounds = 5;
  let roundNum = 0;
  let accepting = false;

  const msgEl = document.getElementById('sg-msg');
  const seqEl = document.getElementById('sg-seq');
  const bondEl = document.getElementById('sg-bond');

  function flashButton(idx, duration) {
    duration = duration || Math.max(220, 380 - roundNum * 30); // faster each round
    return new Promise(resolve => {
      const btn = document.getElementById(`sg-btn-${idx}`);
      SFX.note(idx);
      if (btn) btn.classList.add('simon-active');
      setTimeout(() => {
        if (btn) btn.classList.remove('simon-active');
        setTimeout(resolve, 150);
      }, duration);
    });
  }

  async function playSequence() {
    accepting = false;
    if (msgEl) msgEl.textContent = 'Watch carefully...';
    await new Promise(r => setTimeout(r, 600));
    for (let i = 0; i < sequence.length; i++) {
      if (!incuGameActive(token)) return;
      await flashButton(sequence[i]);
    }
    accepting = true;
    playerIdx = 0;
    if (msgEl) msgEl.textContent = 'Your turn! Repeat the pattern.';
  }

  function nextRound() {
    if (!incuGameActive(token)) return;
    roundNum++;
    if (roundNum > maxRounds) {
      // Game complete
      finishSingGame();
      return;
    }
    // Add a random note (two on the first round)
    sequence.push(Math.floor(Math.random() * 4));
    if (roundNum === 1) sequence.push(Math.floor(Math.random() * 4));
    if (seqEl) seqEl.textContent = sequence.length;
    playSequence();
  }

  function finishSingGame() {
    if (!incuGameActive(token)) return;
    incuGameToken++;   // this session is over — ignore any late taps
    const roundsCleared = totalBond / 4;
    const ratio = roundsCleared / maxRounds;
    gameEndHype(ratio);
    totalBond = Math.floor(8 + ratio * 7);
    incu.bond = Math.min(BOND_THRESHOLD + 10, incu.bond + totalBond);
    incu.stats.energy = Math.min(100, incu.stats.energy + totalBond);
    incu.crackStage = Math.floor(incu.bond / 25);
    incu.careActions.push({ stat: 'energy', time: Date.now() });
    saveGame();
    if (msgEl) msgEl.textContent = `Song complete! +${totalBond} bond`;
    SFX.good();
    showToast(`Singing done! +${totalBond} bond`);
    setTimeout(() => renderIncubation(), 1500);
  }

  // Button click handler
  const grid = document.getElementById('sg-grid');
  grid.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.simon-btn');
    if (!btn || !accepting) return;
    const idx = parseInt(btn.dataset.idx);

    // Flash it
    SFX.note(idx, 0.2);
    btn.classList.add('simon-active');
    setTimeout(() => btn.classList.remove('simon-active'), 200);

    if (idx === sequence[playerIdx]) {
      playerIdx++;
      if (playerIdx >= sequence.length) {
        // Correct sequence!
        totalBond += 4;
        if (bondEl) bondEl.textContent = totalBond;
        accepting = false;
        if (msgEl) msgEl.textContent = 'Correct!';
        if (roundNum === 3) hype('INCREDIBLE MEMORY!', '#c084fc', true);
        setTimeout(() => nextRound(), 800);
      }
    } else {
      // Wrong - end game
      SFX.bad();
      accepting = false;
      if (msgEl) msgEl.textContent = 'Wrong note! Song ended.';
      setTimeout(() => finishSingGame(), 1000);
    }
  });

  // Start first round
  nextRound();
}

// ---- Incubation Mini-Game: Shield the Egg ----
function startShieldGame() {
  showInstructions('runShieldGame', 'Shield the Egg', [
    'Threats fly in from every side toward your egg',
    'Tap them before they reach the center!',
    'Every hit on the egg costs you bond'
  ], runShieldGame);
}

function runShieldGame() {
  const incu = G.incubation;
  if (!incu) return;

  const el = document.getElementById('incubation-content');
  if (!el) return;
  const token = ++incuGameToken;

  el.innerHTML = `
    <div class="mini-game shield-game">
      <div class="mg-title">Shield the Egg</div>
      <div class="mg-subtitle">Tap threats before they reach the egg!</div>
      <div class="mg-score">Time: <span id="shg-time">14</span>s &nbsp; Blocked: <span id="shg-blocked">0</span> &nbsp; Hit: <span id="shg-hit">0</span></div>
      <div class="shield-arena" id="shg-arena">
        <div class="shield-egg-center">
          <svg viewBox="0 0 60 80" width="50" height="66">
            <ellipse cx="30" cy="42" rx="22" ry="30" fill="#f5e6c8" stroke="#b8a080" stroke-width="1.5"/>
          </svg>
        </div>
      </div>
      <div id="shg-msg" class="mg-msg">Protect the egg!</div>
      <button class="btn-secondary" onclick="endShieldGame(true)" style="margin-top:10px">Give Up</button>
    </div>
  `;

  let timeLeft = 14;
  let blocked = 0;
  let hit = 0;
  let gameOver = false;
  let spawnInterval;

  const arena = document.getElementById('shg-arena');
  const timeEl = document.getElementById('shg-time');
  const blockedEl = document.getElementById('shg-blocked');
  const hitEl = document.getElementById('shg-hit');
  const msgEl = document.getElementById('shg-msg');

  const threats = ['wind', 'rain', 'bug'];
  const threatEmoji = { wind: '💨', rain: '🌧️', bug: '🕷️' };

  function spawnThreat() {
    if (gameOver || !incuGameActive(token)) return;

    const type = threats[Math.floor(Math.random() * threats.length)];
    const threat = document.createElement('div');
    threat.className = 'shield-threat';
    threat.textContent = threatEmoji[type];

    // Spawn from random edge
    const side = Math.floor(Math.random() * 4);
    let startX, startY;
    const arenaW = arena.offsetWidth || 280;
    const arenaH = arena.offsetHeight || 280;

    switch (side) {
      case 0: startX = Math.random() * arenaW; startY = -30; break; // top
      case 1: startX = arenaW + 10; startY = Math.random() * arenaH; break; // right
      case 2: startX = Math.random() * arenaW; startY = arenaH + 10; break; // bottom
      case 3: startX = -30; startY = Math.random() * arenaH; break; // left
    }

    threat.style.left = startX + 'px';
    threat.style.top = startY + 'px';
    arena.appendChild(threat);

    // Move toward center
    const centerX = arenaW / 2 - 15;
    const centerY = arenaH / 2 - 15;
    const dx = centerX - startX;
    const dy = centerY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = 1.6 + Math.random() * 1.2; // px per frame
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;

    let posX = startX;
    let posY = startY;
    let alive = true;

    threat.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (!alive || gameOver) return;
      alive = false;
      SFX.block();
      threat.classList.add('threat-blocked');
      blocked++;
      if (blocked === 6) hype('SHIELD MASTER!', '#60a5fa', true);
      if (blockedEl) blockedEl.textContent = blocked;
      setTimeout(() => threat.remove(), 300);
    });

    const moveLoop = setInterval(() => {
      if (!alive || gameOver || !incuGameActive(token)) {
        clearInterval(moveLoop);
        if (threat.parentNode) threat.remove();
        return;
      }
      posX += vx;
      posY += vy;
      threat.style.left = posX + 'px';
      threat.style.top = posY + 'px';

      // Check if reached center
      const toCenterX = centerX - posX;
      const toCenterY = centerY - posY;
      const distToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
      if (distToCenter < 25) {
        alive = false;
        clearInterval(moveLoop);
        hit++;
        SFX.bad();
        if (hitEl) hitEl.textContent = hit;
        threat.classList.add('threat-hit');
        setTimeout(() => threat.remove(), 300);
      }
    }, 30);
  }

  // Spawn threats periodically
  spawnInterval = setInterval(() => {
    if (gameOver || !incuGameActive(token)) { clearInterval(spawnInterval); return; }
    spawnThreat();
  }, 550 + Math.random() * 300);

  // Timer countdown
  const timerLoop = setInterval(() => {
    if (gameOver || !incuGameActive(token)) { clearInterval(timerLoop); return; }
    timeLeft -= 0.1;
    if (timeEl) timeEl.textContent = Math.ceil(timeLeft);
    if (timeLeft <= 0) {
      gameOver = true;
      clearInterval(timerLoop);
      clearInterval(spawnInterval);
      endShieldGame(false);
    }
  }, 100);

  // Store reference for cleanup
  window._shieldGameCleanup = () => {
    gameOver = true;
    clearInterval(timerLoop);
    clearInterval(spawnInterval);
  };

  window.endShieldGame = function(gaveUp) {
    if (window._shieldGameCleanup) window._shieldGameCleanup();
    if (gaveUp || !incuGameActive(token)) {
      renderIncubation();
      return;
    }
    const netBlocked = Math.max(0, blocked - hit);
    const maxPossible = Math.max(1, blocked + hit);
    const ratio = netBlocked / maxPossible;
    gameEndHype(ratio);
    const bondGain = Math.floor(8 + ratio * 7);
    incu.bond = Math.min(BOND_THRESHOLD + 10, incu.bond + bondGain);
    incu.stats.stability = Math.min(100, incu.stats.stability + bondGain);
    incu.crackStage = Math.floor(incu.bond / 25);
    incu.careActions.push({ stat: 'stability', time: Date.now() });
    saveGame();
    if (msgEl) msgEl.textContent = `+${bondGain} bond! (${blocked} blocked, ${hit} hit)`;
    SFX.good();
    showToast(`Shielding done! +${bondGain} bond`);
    setTimeout(() => renderIncubation(), 1500);
  };
}

// ---- Incubation Render (Bond-based, mini-game driven) ----
function renderIncubation() {
  incuGameToken++; // invalidate any mini-game loop still running (e.g. after Give Up)
  const incu = G.incubation;
  if (!incu) return;
  const def = CREATURES[incu.creatureId];
  const bond = incu.bond;

  const el = document.getElementById('incubation-content');
  if (!el) return;

  const stateMsg = getEggStateMessage(bond);
  const readyToHatch = bond >= BOND_THRESHOLD;
  eggHypeCheck(bond);

  el.innerHTML = `
    <div class="incu-header">
      <div class="incu-creature-name">${esc(incu.creatureName)}'s Egg</div>
      <div class="incu-category-label">${def.title}</div>
      <button class="btn-mute" onclick="toggleMute(this)">${SFX.isMuted() ? '🔇' : '🔊'}</button>
    </div>

    <div class="egg-stage">
      ${getEggHTML(bond, def.color, def.glow)}
    </div>

    <div class="incu-state-msg ${readyToHatch ? 'incu-ready' : ''}">${stateMsg}</div>

    ${readyToHatch ? `
      <div class="hatch-ready-section">
        <button class="btn-hatch-now" onclick="showScreen('hatching')">Hatch Now!</button>
      </div>
    ` : `
      ${(() => {
        const preview = calculateIncubationBonus(incu.stats);
        return preview.length
          ? `<div class="incu-bonus-preview">On track for: ${preview.map(b => `<b>${b.name}</b>`).join(' · ')}</div>`
          : `<div class="incu-bonus-preview incu-bonus-hint">Focus on one game — or play them all evenly — to earn a hatching bonus</div>`;
      })()}
      <div class="incu-stats-summary">
        <div class="iss-item" style="color:#f97316"><span>Warmth</span> <b>${incu.stats.warmth}</b></div>
        <div class="iss-item" style="color:#10b981"><span>Comfort</span> <b>${incu.stats.comfort}</b></div>
        <div class="iss-item" style="color:#eab308"><span>Energy</span> <b>${incu.stats.energy}</b></div>
        <div class="iss-item" style="color:#8b5cf6"><span>Stability</span> <b>${incu.stats.stability}</b></div>
      </div>

      <div class="incu-games-grid">
        <div class="incu-game-card" onclick="startWarmGame()">
          <div class="igc-icon">🌡️</div>
          <div class="igc-name">Warm</div>
          <div class="igc-desc">Keep temp steady</div>
        </div>
        <div class="incu-game-card" onclick="startRockGame()">
          <div class="igc-icon">🪹</div>
          <div class="igc-name">Rock</div>
          <div class="igc-desc">Rhythm rocking</div>
        </div>
        <div class="incu-game-card" onclick="startSingGame()">
          <div class="igc-icon">✨</div>
          <div class="igc-name">Sing</div>
          <div class="igc-desc">Pattern memory</div>
        </div>
        <div class="incu-game-card" onclick="startShieldGame()">
          <div class="igc-icon">🛡️</div>
          <div class="igc-name">Shield</div>
          <div class="igc-desc">Block threats</div>
        </div>
      </div>
    `}
  `;
}

// ---- Hatch celebration: screen flash, light rays, confetti storm ----
function hatchCelebration(def) {
  const screen = document.getElementById('screen-hatching');
  const container = document.getElementById('hatch-container');
  if (!screen || !container) return;

  const flash = document.createElement('div');
  flash.className = 'hatch-flash';
  screen.appendChild(flash);
  setTimeout(() => flash.remove(), 900);

  const rays = document.createElement('div');
  rays.className = 'hatch-rays';
  rays.style.setProperty('--ray-color', def.glow);
  container.prepend(rays);
  setTimeout(() => rays.remove(), 6000);

  const colors = [def.color, '#ffd700', '#ff6b9d', '#60d080', '#60a5fa', '#c084fc', '#fff'];
  for (let i = 0; i < 50; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = (Math.random() * 0.9) + 's';
    c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    c.style.width = c.style.height = (5 + Math.random() * 7) + 'px';
    screen.appendChild(c);
    setTimeout(() => c.remove(), 3600);
  }
}

// =====================================================
// ACCOUNTS — optional cloud login and save sync
// =====================================================

// Decide between the device save and the account save after signing in.
// A device can be shared, so the save on it isn't necessarily this
// player's. Saves record their owner:
//   - this player's        -> the device wins only if the account hasn't
//                             moved on since this device last synced
//                             (cloudBase); otherwise the account wins
//   - another account's    -> parked for its owner, never uploaded here,
//                             and restored when they next sign in here
//   - nobody's (played signed-out):
//        account empty     -> adopt it (the "made an account later" case)
//        account has a beast -> ask which to keep
// Timestamps alone can't decide: opening an old device bumps its savedAt
// (daily bonus, autosave) and would push stale progress over newer.
// Whatever loses is set aside on the device, never discarded.
let cloudSyncing = false;
let cloudRetryTimer = null;

async function syncAfterSignIn({ quiet = false } = {}) {
  if (cloudSyncing) return;
  cloudSyncing = true;
  try { await reconcileCloudSave(quiet); }
  finally { cloudSyncing = false; }
}

// Offline at launch: keep playing locally and quietly try again later
function retryCloudSyncSoon() {
  clearTimeout(cloudRetryTimer);
  cloudRetryTimer = setTimeout(() => {
    if (Cloud.isSignedIn() && !Cloud.isReady()) syncAfterSignIn({ quiet: true });
  }, 60000);
}

// Saves set aside during sign-in. Autosave never rotates these, unlike
// the backup slot. A slot named after an account is restored when that
// account signs in here; 'guest' and 'replaced' are safety copies.
const STASH_PREFIX = 'hatchbound_stash_';
function stashSave(data, slot) {
  if (!hasBeast(data)) return;
  try { localStorage.setItem(STASH_PREFIX + slot, JSON.stringify(data)); } catch {}
}
function takeStash(slot) {
  try {
    const raw = localStorage.getItem(STASH_PREFIX + slot);
    if (!raw) return null;
    localStorage.removeItem(STASH_PREFIX + slot);
    return JSON.parse(raw);
  } catch { return null; }
}
function hasBeast(s) { return !!(s && (s.creature || s.incubation)); }

// Remember which cloud version this device holds, so the next sign-in can
// tell "the account moved on elsewhere" from "this device is ahead"
Cloud.onPushed(data => {
  G.cloudBase = data.savedAt || 0;
  try {
    const stored = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (stored && stored.owner === data.owner) {
      stored.cloudBase = G.cloudBase;
      localStorage.setItem(SAVE_KEY, JSON.stringify(stored));
    }
  } catch {}
});

async function reconcileCloudSave(quiet) {
  Cloud.setReady(false);
  let cloudSave = null;
  try { cloudSave = await Cloud.pull(); }
  catch (e) {
    console.warn('cloud pull failed', e.message);
    if (!quiet) showToast("Couldn't reach the cloud — playing locally", 4000);
    retryCloudSyncSoon();
    return;   // stay not-ready: nothing is uploaded until we can reconcile
  }

  // pull() drops a session whose login has expired. Without an account
  // there's nothing to reconcile against — and treating uid as null would
  // mistake this player's own beast for someone else's.
  const uid = Cloud.userId();
  if (!Cloud.isSignedIn() || !uid) {
    showToast('Your login expired — sign in again to keep syncing', 4500);
    if (G.screen === 'title' || G.screen === 'account') showScreen(G.screen);
    return;
  }

  const local = readLocalSave();
  if (local && local.owner && local.owner !== uid) stashSave(local, local.owner);
  const guest = local && !local.owner && hasBeast(local) ? local : null;
  // This player's own progress on this device: live, or parked when
  // someone else signed in here after them
  const mine = guest ? null : (local && local.owner === uid ? local : takeStash(uid));
  const describe = s => s && s.creature
    ? `${esc(s.creature.name)} (Lv.${s.creature.level})`
    : (s && s.incubation ? 'an unhatched egg' : 'no beast');

  let pick;
  if (guest) {
    if (!hasBeast(cloudSave)) {
      pick = guest;
    } else {
      const keepDevice = await confirmDialog({
        title: 'Which beast is yours?',
        body: `Your account has <b>${describe(cloudSave)}</b>. This device has <b>${describe(guest)}</b>, ` +
              `played without signing in. Keep one — the other is set aside on this device.`,
        confirm: `Keep ${guest.creature ? esc(guest.creature.name) : 'this device’s'}`,
        cancel: `Keep ${cloudSave.creature ? esc(cloudSave.creature.name) : 'my account’s'}`
      });
      pick = keepDevice ? guest : cloudSave;
      if (keepDevice) stashSave(cloudSave, 'replaced');
      else stashSave(guest, 'guest');
    }
  } else if (mine && (!cloudSave || (mine.savedAt || 0) === (cloudSave.savedAt || 0))) {
    pick = mine;   // account empty, or already in sync
  } else if (mine && cloudSave) {
    const cloudAt = cloudSave.savedAt || 0;
    const deviceAhead = cloudAt <= (mine.cloudBase || 0);
    pick = deviceAhead ? mine : cloudSave;
    if (!deviceAhead) stashSave(mine, 'replaced');
  } else if (cloudSave) {
    pick = cloudSave;
  } else {
    // Nothing anywhere for this account. An unlinked save with coins but
    // no beast still carries over; someone else's never does.
    pick = local && !local.owner ? local : null;
  }

  const changed = pick !== local;
  if (pick && pick === cloudSave) {
    applySaveData(cloudSave);
    G.cloudBase = cloudSave.savedAt || 0;
  } else if (pick) {
    if (changed) applySaveData(pick);
    try { await Cloud.push({ ...pick, owner: uid }); }
    catch (e) { console.warn('cloud push failed', e.message); }
    if (pick === guest) showToast('Progress saved to your account!', 3500);
  } else {
    applySaveData({});
    G.creature = null; G.incubation = null;
  }

  G.owner = uid;
  Cloud.setReady(true);
  saveGame();
  if (quiet && changed) {
    // Came back online mid-session and the account had newer progress
    showToast('Loaded your latest progress from your account', 4000);
    showScreen('title');
    return;
  }
  showToast(quiet ? 'Back online — progress synced' : 'Signed in — your beast is saved to your account', 3500);
  if (G.screen === 'title' || G.screen === 'account') showScreen(G.screen);
}

function renderAccount() {
  const el = document.getElementById('account-content');
  if (!el) return;

  if (!Cloud.isEnabled()) {
    el.innerHTML = `
      <div class="screen-header">
        <button class="btn-back" onclick="showScreen('title')">← Back</button>
        <h2>Account</h2>
      </div>
      <div class="account-box">
        <div class="acct-title">Playing on this device</div>
        <p class="acct-note">Your beast is saved automatically in this browser, so you can
        close the game and pick up right where you left off.</p>
        <p class="acct-note">Accounts that carry your beast between phones and computers
        aren't switched on yet. Setup instructions are in <b>docs/CLOUD-SETUP.md</b>.</p>
        <button class="btn-secondary" onclick="showScreen('title')">Back to Title</button>
      </div>`;
    return;
  }

  if (Cloud.isSignedIn()) {
    el.innerHTML = `
      <div class="screen-header">
        <button class="btn-back" onclick="showScreen('title')">← Back</button>
        <h2>Account</h2>
      </div>
      <div class="account-box">
        <div class="acct-title">Signed in</div>
        <div class="acct-email">${esc(Cloud.email() || '')}</div>
        <p class="acct-note">Your progress saves to your account automatically. Sign in on any
        phone or computer and your beast will be waiting.</p>
        <button class="btn-primary" onclick="showScreen('title')">Continue Playing</button>
        <button class="btn-secondary" style="margin-top:10px" onclick="doSignOut()">Sign Out</button>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="screen-header">
      <button class="btn-back" onclick="showScreen('title')">← Back</button>
      <h2>Account</h2>
    </div>
    <div class="account-box">
      <div class="acct-title">Save your beast forever</div>
      <p class="acct-note">Create an account and your character follows you to any device.
      You can also skip this and just play on this device.</p>
      <input id="acct-email" class="acct-input" type="email" autocomplete="email"
             placeholder="Email" spellcheck="false">
      <input id="acct-pass" class="acct-input" type="password" autocomplete="current-password"
             placeholder="Password (6+ characters)">
      <div id="acct-msg" class="acct-msg"></div>
      <button class="btn-primary" id="acct-signin">Log In</button>
      <button class="btn-secondary" id="acct-signup" style="margin-top:10px">Create Account</button>
      <button class="btn-secondary" style="margin-top:10px" onclick="showScreen('title')">
        Play on this device only
      </button>
    </div>`;

  const msg = document.getElementById('acct-msg');
  const busy = (on, label) => {
    ['acct-signin','acct-signup'].forEach(id => {
      const b = document.getElementById(id);
      if (b) b.disabled = on;
    });
    if (on && msg) { msg.className = 'acct-msg'; msg.textContent = label; }
  };
  const creds = () => {
    const e = document.getElementById('acct-email');
    const p = document.getElementById('acct-pass');
    return { email: (e && e.value || '').trim(), password: (p && p.value) || '' };
  };
  const fail = text => { if (msg) { msg.className = 'acct-msg acct-err'; msg.textContent = text; } };

  document.getElementById('acct-signin').addEventListener('click', async () => {
    const { email, password } = creds();
    if (!email || !password) return fail('Enter your email and password.');
    busy(true, 'Signing in…');
    try {
      await Cloud.signIn(email, password);
      await syncAfterSignIn();
      SFX.good();
      showScreen('title');
    } catch (e) {
      fail(e.status === 400 ? 'Wrong email or password.' : e.message);
      busy(false);
    }
  });

  document.getElementById('acct-signup').addEventListener('click', async () => {
    const { email, password } = creds();
    if (!email || !password) return fail('Enter an email and password.');
    if (password.length < 6) return fail('Password must be at least 6 characters.');
    busy(true, 'Creating your account…');
    try {
      const r = await Cloud.signUp(email, password);
      if (r.needsConfirmation) {
        if (msg) { msg.className = 'acct-msg acct-ok'; msg.textContent = 'Check your email to confirm, then log in.'; }
        busy(false);
        return;
      }
      await syncAfterSignIn();
      SFX.good();
      showScreen('title');
    } catch (e) {
      fail(e.message);
      busy(false);
    }
  });
}

async function doSignOut() {
  const synced = await Cloud.signOut(collectSaveData());
  if (synced) {
    // Safely in the account — clear the device so the next person to pick
    // it up starts fresh instead of playing (and saving over) this beast.
    try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(SAVE_BACKUP_KEY); } catch {}
    applySaveData({});
    G.creature = null; G.incubation = null;
    showToast('Signed out. Your beast is safe in your account.', 4000);
  } else {
    showToast("Signed out — couldn't reach the cloud, so this device kept its save.", 5000);
  }
  renderAccount();
}

// ---- Screen Router ----
// The page body is the scroller, so without this a screen opens wherever
// the previous one was scrolled to.
function resetScroll() {
  for (const el of [document.scrollingElement, document.body]) {
    if (!el) continue;
    el.style.scrollBehavior = 'auto';   // jump, don't smooth-scroll
    el.scrollTop = 0;
    el.style.scrollBehavior = '';
  }
}

function showScreen(id, data = {}) {
  G.screen = id;
  if (typeof FX !== 'undefined') FX.setTheme(id);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  resetScroll();
  const target = document.getElementById('screen-' + id);
  if (target) {
    target.classList.add('active');
    // Restart the entrance animation on every navigation
    target.classList.remove('screen-enter');
    void target.offsetWidth;
    target.classList.add('screen-enter');
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
    const hasProgress = !!(G.creature || G.incubation);
    const cont = document.getElementById('btn-continue');
    const fresh = document.getElementById('btn-new-game');
    if (cont) cont.style.display = hasProgress ? 'block' : 'none';
    // Returning players: Continue is the big primary button, New Journey
    // becomes secondary and sits below it.
    if (cont && fresh) {
      cont.className = hasProgress ? 'btn-primary' : 'btn-secondary';
      fresh.className = hasProgress ? 'btn-secondary' : 'btn-primary';
      if (hasProgress && cont.nextElementSibling !== fresh) cont.after(fresh);
      if (!hasProgress && fresh.nextElementSibling !== cont) fresh.after(cont);
      if (hasProgress && G.creature) cont.textContent = `⚡ Continue with ${G.creature.name}`;
      else if (hasProgress) cont.textContent = '⚡ Continue Incubating';
    }
    const acct = document.getElementById('btn-account');
    if (acct) {
      acct.textContent = Cloud.isSignedIn()
        ? '✅ ' + (Cloud.email() || 'Account')
        : (Cloud.isEnabled() ? '☁️ Log In / Sign Up' : '💾 Save Info');
    }
    startParticles();
    startTitleParade();
  },

  'choose-category'() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.style.setProperty('--cat-color', cat.color);
      const CATEGORY_ART = { reptilian: 'komodo', mammal: 'fire_lion', flying: 'eagle', aquatic: 'sea_dragon' };
      card.innerHTML = `
        <div class="cat-art" style="filter:drop-shadow(0 0 14px ${cat.color})">
          ${getSpriteHTML(CATEGORY_ART[cat.id], 'adult', 104)}
        </div>
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

    grid.onclick = e => {
      const btn = e.target.closest('.btn-choose-creature');
      if (btn) {
        G.selectedCreature = btn.dataset.id;
        showScreen('name-creature');
      }
    };
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
  },

  hatching() {
    if (!G.incubation && !G.creature) { showScreen('title'); return; }
    const meetBtn = document.getElementById('btn-after-hatch');
    if (meetBtn) {
      meetBtn.style.display = 'none';
      setTimeout(() => { if (G.screen === 'hatching') meetBtn.style.display = 'block'; }, 4500);
    }
    const bonuses = hatchEgg() || G.creature.incubationBonuses || [];
    const def = CREATURES[G.creature.id];
    const container = document.getElementById('hatch-container');
    if (container) {
      container.innerHTML = `
        <div class="hatch-egg" id="hatch-egg-anim">
          <svg viewBox="0 0 100 120" width="100" height="120">
            <ellipse cx="50" cy="62" rx="34" ry="44" fill="#f5e6c8" stroke="#b8a080" stroke-width="1.5"/>
            ${getEggCrackSVG(100)}
          </svg>
        </div>
        <div class="hatch-creature hidden" id="hatch-creature-reveal">
          <div class="hatch-sprite" style="filter:drop-shadow(0 0 30px ${def.glow})">
            ${getSpriteHTML(G.creature.id, 'baby', 150)}
          </div>
          <div class="hatch-name">${esc(G.creature.name)}</div>
          <div class="hatch-subtitle">A ${def.stages.baby.name} hatched!</div>
        </div>
        ${bonuses.length ? `
        <div class="hatch-bonuses hidden" id="hatch-bonuses">
          <div class="bonus-title">Incubation Bonuses!</div>
          ${bonuses.map(b => `<div class="bonus-item"><b>${b.name}</b> - ${b.effect}</div>`).join('')}
        </div>` : ''}
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
      SFX.hatch();
      if (typeof FX !== 'undefined') { FX.flash('rgba(255,250,220,0.85)', 700); FX.shake(12); }
      hatchCelebration(def);
      setTimeout(() => hype(`${esc(G.creature.name)} IS BORN!`, def.color), 700);
    }, 2500);
    setTimeout(() => {
      const bonusEl = document.getElementById('hatch-bonuses');
      if (bonusEl) bonusEl.classList.remove('hidden');
    }, 3500);
  },

  home() {
    drainStats();
    renderHome();
    if (G._homeTimer) clearInterval(G._homeTimer);
    G._homeTimer = setInterval(() => {
      if (G.screen !== 'home') { clearInterval(G._homeTimer); return; }
      drainStats();
      renderHome();
    }, 30000);
    if (G._moodTimer) clearInterval(G._moodTimer);
    G._moodTimer = setInterval(() => {
      if (G.screen !== 'home') { clearInterval(G._moodTimer); return; }
      ambientMood();
    }, 7000);
  },

  train() {
    renderTrainScreen();
  },

  campaign() {
    renderCampaign();
  },

  account() {
    renderAccount();
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

// ---- Daily streak: reward returning players ----
function checkDailyStreak() {
  const now = new Date();
  const today = localDateKey(now);
  if (G.daily.last === today) return;
  // Built from calendar parts, so DST changes can't skip or repeat a day
  const yesterday = localDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  G.daily.streak = (G.daily.last === yesterday) ? (G.daily.streak || 0) + 1 : 1;
  G.daily.last = today;
  const reward = 20 + 10 * Math.min(G.daily.streak - 1, 6);
  G.coins += reward;
  saveGame();
  setTimeout(() => {
    SFX.coin();
    showToast(`🔥 Day ${G.daily.streak} streak! +${reward} coins!`, 4000);
  }, 1200);
}

// ---- HYPE BANNERS — big flashy popping feedback (casino/CoD style) ----
const HYPE_PRAISE = ['GREAT WORK!', 'KEEP IT UP!', 'AWESOME!', 'ON FIRE!', 'CRUSHING IT!'];
function hype(text, color, small) {
  const el = document.createElement('div');
  el.className = 'hype-banner' + (small ? ' hype-small' : '');
  el.innerHTML = `<span>${text}</span>`;
  if (color) el.style.setProperty('--hype-color', color);
  // sparkle burst around the text
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('i');
    s.className = 'hype-spark';
    s.style.setProperty('--sx', (Math.random() * 240 - 120) + 'px');
    s.style.setProperty('--sy', (Math.random() * 160 - 80) + 'px');
    s.style.animationDelay = (Math.random() * 0.2) + 's';
    el.appendChild(s);
  }
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
  if (!small) {
    SFX.levelup();
    if (typeof FX !== 'undefined') FX.shake(5);
  } else SFX.good();
}
function hypePraise() { hype(HYPE_PRAISE[Math.floor(Math.random() * HYPE_PRAISE.length)], null, true); }

// Anticipation banners as the egg's hidden bond crosses milestones
let lastHypeBondTier = 0;
function eggHypeCheck(bond) {
  const tiers = [
    [95, 'THE EGG IS ABOUT TO HATCH!', '#ffd700'],
    [80, 'IT WANTS TO MEET YOU!', '#ff9040'],
    [60, "YOU'RE ALMOST THERE!", '#ff9040'],
    [40, "IT'S GETTING STRONGER!", '#60d080'],
    [20, 'SOMETHING IS STIRRING...', '#80b0ff']
  ];
  for (const [t, msg, col] of tiers) {
    if (bond >= t && lastHypeBondTier < t) {
      lastHypeBondTier = t;
      setTimeout(() => hype(msg, col), 600);
      return;
    }
  }
}

// ---- Pre-game instructions (toggleable in-overlay) ----
function showInstructions(key, title, lines, onStart) {
  if (!G.settings || G.settings.instructions === false) { onStart(); return; }
  const ov = document.createElement('div');
  ov.className = 'instructions-overlay';
  ov.innerHTML = `
    <div class="instructions-box">
      <div class="ib-title">${title}</div>
      <ul class="ib-lines">${lines.map(l => `<li>${l}</li>`).join('')}</ul>
      <button class="btn-primary ib-start">Let's Go!</button>
      <label class="ib-toggle"><input type="checkbox" id="ib-hide-check"> Don't show instructions again</label>
    </div>`;
  ov.querySelector('.ib-start').addEventListener('click', () => {
    if (ov.querySelector('#ib-hide-check').checked) {
      G.settings.instructions = false;
      saveGame();
      showToast('Instructions off — turn them back on in Profile → Settings', 3500);
    }
    ov.remove();
    SFX.good();
    onStart();
  });
  document.body.appendChild(ov);
}

// ---- Confirm dialog ----
function confirmDialog({ title, body, confirm = 'OK', cancel = 'Cancel', danger = false }) {
  return new Promise(resolve => {
    const ov = document.createElement('div');
    ov.className = 'instructions-overlay confirm-overlay';
    ov.innerHTML = `
      <div class="instructions-box confirm-box" role="dialog" aria-modal="true">
        <div class="ib-title">${title}</div>
        <p class="confirm-body">${body}</p>
        <button class="${danger ? 'btn-danger' : 'btn-primary'} cd-yes">${confirm}</button>
        <button class="btn-secondary cd-no" style="margin-top:10px">${cancel}</button>
      </div>`;
    const done = v => { ov.remove(); resolve(v); };
    ov.querySelector('.cd-yes').addEventListener('click', () => done(true));
    ov.querySelector('.cd-no').addEventListener('click', () => done(false));
    ov.addEventListener('click', e => { if (e.target === ov) done(false); });
    document.body.appendChild(ov);
    ov.querySelector('.cd-no').focus();
  });
}

// ---- Liveliness helpers ----
function showEmote(container, emoji) {
  if (!container) return;
  const b = document.createElement('div');
  b.className = 'emote-bubble';
  b.textContent = emoji;
  b.style.left = (30 + Math.random() * 40) + '%';
  container.appendChild(b);
  setTimeout(() => b.remove(), 1400);
}

function spawnFloatText(container, text, color) {
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  if (color) el.style.color = color;
  container.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

let lastPokeReward = 0;
function pokeCreature() {
  const c = G.creature;
  const sprite = document.getElementById('home-creature-sprite');
  if (!c || !sprite) return;
  SFX.poke();
  sprite.classList.remove('poke-react');
  void sprite.offsetWidth; // restart the animation
  sprite.classList.add('poke-react');

  // Contextual emote: creature tells you what it needs
  let pool;
  if      (c.energy < 30)    pool = ['💤', '😪'];
  else if (c.hunger < 40)    pool = ['🍖', '🤤'];
  else if (c.hygiene < 40)   pool = ['🧼', '💦'];
  else if (c.happiness < 40) pool = ['💔', '🥺'];
  else                       pool = ['💗', '✨', '♪', '😊'];
  showEmote(sprite, pool[Math.floor(Math.random() * pool.length)]);
  if (typeof FX !== 'undefined') FX.burst(sprite, '#22e0ff', 8);

  const now = Date.now();
  if (now - lastPokeReward > 3000) {
    lastPokeReward = now;
    c.happiness = Math.min(100, c.happiness + 1);
    saveGame();
  }
}

// Ambient mood: creature emotes about its needs (or contentment) on its own
function ambientMood() {
  const c = G.creature;
  const sprite = document.getElementById('home-creature-sprite');
  if (!c || !sprite) return;
  const needs = [];
  if (c.hunger < 40)    needs.push('🍖');
  if (c.hygiene < 40)   needs.push('🧼');
  if (c.energy < 30)    needs.push('💤');
  if (c.happiness < 40) needs.push('💔');
  if (needs.length) {
    showEmote(sprite, needs[Math.floor(Math.random() * needs.length)]);
  } else if (Math.random() < 0.5) {
    showEmote(sprite, ['♪', '✨', '😊', '💗'][Math.floor(Math.random() * 4)]);
  }
  if (Math.random() < 0.4) {
    sprite.classList.remove('idle-hop');
    void sprite.offsetWidth;
    sprite.classList.add('idle-hop');
  }
}

// Evolution celebration overlay (consumes the notification queue)
function checkEvolutionNotice() {
  if (!G.creature || !G.notifications || !G.notifications.length) return;
  const note = G.notifications.shift();
  if (note.type !== 'evolve') return;
  const def = CREATURES[G.creature.id];
  const stageInfo = def.stages[note.stage.id];
  const overlay = document.createElement('div');
  overlay.className = 'evolve-overlay';
  overlay.innerHTML = `
    <div class="evolve-box">
      <div class="evolve-title">EVOLUTION!</div>
      <div class="evolve-sprite" style="filter:drop-shadow(0 0 34px ${def.glow})">
        ${getSpriteHTML(G.creature.id, note.stage.id, 170)}
      </div>
      <div class="evolve-name">${esc(G.creature.name)} evolved into<br><b>${stageInfo ? stageInfo.name : note.stage.name}</b>!</div>
      ${note.path && EVOLUTION_PATHS[note.path] ? `
        <div class="evolve-path">${EVOLUTION_PATHS[note.path].icon} Raised as a <b>${EVOLUTION_PATHS[note.path].name}</b>
          <span>${EVOLUTION_PATHS[note.path].label} — permanent</span></div>` : ''}
      <button class="btn-primary" style="max-width:220px">Amazing!</button>
    </div>`;
  overlay.querySelector('button').addEventListener('click', () => {
    overlay.remove();
    if (G.screen === 'home') renderHome();
  });
  document.body.appendChild(overlay);
  SFX.evolve();
  if (typeof FX !== 'undefined') { FX.flash('rgba(180,92,255,0.7)', 650); FX.shake(10); }
}

function toggleMute(btn) {
  const muted = SFX.toggleMute();
  if (btn) btn.textContent = muted ? '🔇' : '🔊';
  if (!muted) SFX.good();
}

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
        <button class="btn-mute" onclick="toggleMute(this)">${SFX.isMuted() ? '🔇' : '🔊'}</button>
      </div>
    </div>

    <div class="creature-stage">
      <div class="creature-aura" style="background:radial-gradient(circle, ${def.glow} 0%, transparent 70%)"></div>
      <div class="creature-main-sprite" id="home-creature-sprite"
           style="filter:${glowFilter} ${tintFilter}" onclick="pokeCreature()" title="Pet ${esc(c.name)}!">
        ${getSpriteHTML(c.id, stageDef.id, Math.min(150, 100 + Math.floor(c.level * 0.5)))}
      </div>
      ${gearBadges ? `<div class="creature-gear-badges">${gearBadges}</div>` : ''}
      <div class="creature-name-display">${esc(c.name)}</div>
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
      <button class="care-btn" data-action="bond"  onclick="doBondAction()">
        <span class="care-icon">💗</span><span class="care-label">Bond</span>
      </button>
      <button class="care-btn" data-action="play"  onclick="doPlayAction()">
        <span class="care-icon">🎮</span><span class="care-label">Play</span>
      </button>
      <button class="care-btn" data-action="sleep" onclick="doAction('sleep')">
        <span class="care-icon">💤</span><span class="care-label">Rest</span>
      </button>
    </div>

    ${(() => {
      const prog = G.campaign.progress || 1;
      if (prog > CAMPAIGN_TOTAL) return `
        <button class="campaign-banner campaign-done" onclick="showScreen('campaign')">
          <span class="cb-icon">🏆</span>
          <span class="cb-text"><b>Campaign Complete!</b><small>Replay levels to perfect your stars</small></span>
        </button>`;
      const lvl = getCampaignLevel(prog);
      return `
        <button class="campaign-banner" onclick="showScreen('campaign')" style="--zone-color:${lvl.zone.color}">
          <span class="cb-icon">${lvl.zone.icon}</span>
          <span class="cb-text"><b>Campaign — Level ${prog}</b><small>${lvl.zone.name}${lvl.isBoss ? ' · BOSS FIGHT' : ''} · vs Lv.${lvl.level} ${CREATURES[lvl.creature].name}</small></span>
          <span class="cb-go">▶</span>
        </button>`;
    })()}

    <div class="home-actions-row">
      <button class="btn-battle" onclick="G.battleMode=null;showScreen('battle-prep')">⚔️ Battle!</button>
      <button class="btn-profile" onclick="showScreen('profile')">📊 Profile</button>
      <button class="btn-gear" onclick="showScreen('gear')">🗡️ Gear</button>
      <button class="btn-collection" onclick="showScreen('collection')">📖 Codex</button>
    </div>

    ${(() => {
      const next = STAGES.find(s => s.min > c.level);
      if (!next) {
        const locked = (c.evolutionPaths || []).map(p => EVOLUTION_PATHS[p.path]).filter(Boolean);
        return locked.length
          ? `<div class="evolution-hint">Fully evolved · ${locked.map(p => `${p.icon} ${p.name}`).join(' · ')}</div>` : '';
      }
      const p = evPath && EVOLUTION_PATHS[evPath];
      return `<div class="evolution-hint">
        ${p ? `Evolving at Lv.${next.min} as a <b>${p.icon} ${p.name}</b> (${p.label}) — from ${p.via}`
            : `Evolves at Lv.${next.min} · train, care or battle to shape its path`}
      </div>`;
    })()}
  `;

  checkEvolutionNotice();
}

function doAction(action) {
  const ok = careAction(action);
  if (ok === false) return;

  // Re-render first so vitals update, then animate on the fresh node —
  // otherwise the re-render destroys the animation mid-flight.
  renderHome();

  const sprite = document.getElementById('home-creature-sprite');
  if (sprite) {
    sprite.classList.add('care-react');
    setTimeout(() => sprite.classList.remove('care-react'), 800);
    if (ok && ok.xp) spawnFloatText(sprite, `+${ok.xp} XP`);
  }
  if (action === 'feed') SFX.munch();
  else if (action === 'bathe') SFX.splash();
  else if (action === 'sleep') SFX.good();
  const burstColor = { feed:'#ff8324', bathe:'#22e0ff', sleep:'#b45cff', train:'#b4ff3d' }[action] || '#ffc531';
  if (sprite && typeof FX !== 'undefined') FX.burst(sprite, burstColor, 12);
  if (Math.random() < 0.25) hypePraise();

  // Feed animation: show food flying to creature
  if (action === 'feed' && sprite) {
    const foods = ['🍖', '🍗', '🥩', '🍎', '🧀'];
    const food = foods[Math.floor(Math.random() * foods.length)];
    for (let i = 0; i < 3; i++) {
      const foodEl = document.createElement('div');
      foodEl.className = 'flying-food';
      foodEl.textContent = food;
      foodEl.style.animationDelay = (i * 0.15) + 's';
      sprite.appendChild(foodEl);
      setTimeout(() => foodEl.remove(), 1000);
    }
    // Creature bounce
    sprite.classList.add('creature-eating');
    setTimeout(() => sprite.classList.remove('creature-eating'), 800);
  }
}

// ---- Enhanced Bond Action (hearts animation) ----
function doBondAction() {
  const ok = careAction('bond');
  if (ok === false) return;
  SFX.heart();
  renderHome();

  const sprite = document.getElementById('home-creature-sprite');
  if (sprite && typeof FX !== 'undefined') FX.burst(sprite, '#ff4fd8', 16);
  if (sprite) {
    sprite.classList.add('care-react');
    setTimeout(() => sprite.classList.remove('care-react'), 800);
    if (ok && ok.xp) spawnFloatText(sprite, `+${ok.xp} XP`);

    // Flying hearts
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('div');
      heart.className = 'flying-heart';
      heart.textContent = '💗';
      heart.style.left = (20 + Math.random() * 60) + '%';
      heart.style.animationDelay = (i * 0.12) + 's';
      sprite.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    }

    // Pet animation on touch
    sprite.classList.add('creature-pet');
    setTimeout(() => sprite.classList.remove('creature-pet'), 600);
  }
}

// ---- Enhanced Play Action (catch mini-game) ----
function doPlayAction() {
  if (!G.creature) return;
  const c = G.creature;
  const now = Date.now();
  const cooldown = 8000;
  if (G.careActionCooldown['play'] && now - G.careActionCooldown['play'] < cooldown) {
    showToast('Wait a moment before doing that again!');
    return;
  }
  if (c.energy < 10) { showToast('Too tired to play!'); return; }

  // Show catch mini-game overlay
  const el = document.getElementById('home-content');
  if (!el) return;

  const overlay = document.createElement('div');
  overlay.className = 'play-catch-overlay';
  overlay.id = 'play-catch-overlay';
  overlay.innerHTML = `
    <div class="catch-game">
      <div class="catch-title">Catch the Ball!</div>
      <div class="catch-score">Catches: <span id="catch-count">0</span> / 3</div>
      <div class="catch-arena" id="catch-arena"></div>
      <div class="catch-msg" id="catch-msg">Tap the ball!</div>
    </div>
  `;
  el.appendChild(overlay);

  let catches = 0;
  let spawned = 0;
  const maxBalls = 5;

  function spawnBall() {
    if (catches >= 3 || spawned >= maxBalls) {
      // End game
      setTimeout(() => {
        const ov = document.getElementById('play-catch-overlay');
        if (ov) ov.remove();
        if (catches >= 3) {
          careAction('play');
          const sprite = document.getElementById('home-creature-sprite');
          if (sprite) {
            sprite.classList.add('care-react');
            setTimeout(() => sprite.classList.remove('care-react'), 800);
          }
        } else {
          showToast('Almost caught them all!');
        }
        setTimeout(() => renderHome(), 200);
      }, 500);
      return;
    }

    spawned++;
    const arena = document.getElementById('catch-arena');
    if (!arena) return;

    const ball = document.createElement('div');
    ball.className = 'catch-ball';
    ball.textContent = '🏐';
    ball.style.left = (10 + Math.random() * 70) + '%';
    ball.style.top = (10 + Math.random() * 60) + '%';
    arena.appendChild(ball);

    const timeout = setTimeout(() => {
      if (ball.parentNode) {
        ball.classList.add('ball-miss');
        setTimeout(() => { ball.remove(); spawnBall(); }, 300);
      }
    }, 1200);

    ball.addEventListener('pointerdown', () => {
      if (ball.classList.contains('ball-caught') || ball.classList.contains('ball-miss')) return;
      clearTimeout(timeout);
      SFX.pop();
      catches++;
      const countEl = document.getElementById('catch-count');
      if (countEl) countEl.textContent = catches;
      ball.classList.add('ball-caught');
      const msgEl = document.getElementById('catch-msg');
      if (msgEl) msgEl.textContent = catches >= 3 ? 'Great catches!' : 'Nice catch!';
      setTimeout(() => { ball.remove(); spawnBall(); }, 300);
    });
  }

  spawnBall();
}

// ---- Training Screen ----
// Training costs energy, so it ties back into care: a tired beast has to
// rest before it can train again. (It used to be free and unlimited.)
const TRAIN_ENERGY_COST = 15;
const TRAIN_HUNGER_COST = 5;

// Session token, like the incubation games: bumped whenever a session ends
// or the screen changes, so any timer still running from an old session
// sees it's stale and stops. Without this, leaving mid-game let the timers
// finish in the background, pay out, and force-navigate the player home.
let trainToken = 0;
function trainActive(t) { return t === trainToken && G.screen === 'train'; }

function renderTrainScreen() {
  trainToken++;
  const el = document.getElementById('train-content');
  if (!el) return;
  ensureCreatureFields(G.creature);
  drainStats();
  const c = G.creature;
  const ts = c.trainedStats;
  const tired = c.energy < TRAIN_ENERGY_COST;
  el.innerHTML = `
    <div class="train-header">
      <button class="btn-back" onclick="showScreen('home')">← Back</button>
      <h2>Training Center</h2>
    </div>
    <div class="train-stats-bar">
      <div class="tsb-item"><span>⚔️ ATK</span><b>+${ts.atk}</b><i>/${TRAIN_STAT_CAP}</i></div>
      <div class="tsb-item"><span>🛡️ DEF</span><b>+${ts.def}</b><i>/${TRAIN_STAT_CAP}</i></div>
      <div class="tsb-item"><span>💨 SPD</span><b>+${ts.spd}</b><i>/${TRAIN_STAT_CAP}</i></div>
      <div class="tsb-item"><span>💗 HP</span><b>+${ts.hp * 2}</b><i>/${TRAIN_STAT_CAP * 2}</i></div>
    </div>
    <div class="train-energy ${tired ? 'train-energy-low' : ''}">
      ⚡ Energy ${Math.round(c.energy)}% · each session costs ${TRAIN_ENERGY_COST}
      ${tired ? `<button class="btn-secondary train-rest-btn" onclick="showScreen('home')">Too tired — go Rest</button>` : ''}
    </div>
    <div class="train-games-grid ${tired ? 'train-locked' : ''}">
      <div class="train-game-card" onclick="startTrainingGame('reflex')">
        <div class="tg-icon">⚡</div>
        <div class="tg-name">Reflex Strike</div>
        <div class="tg-desc">Tap the flash! Builds SPD + ATK permanently</div>
        <div class="tg-reward">up to +160 XP · +4 SPD +2 ATK</div>
      </div>
      <div class="train-game-card" onclick="startTrainingGame('endurance')">
        <div class="tg-icon">🔥</div>
        <div class="tg-name">Endurance Burn</div>
        <div class="tg-desc">Hold as long as possible! Builds HP + DEF permanently</div>
        <div class="tg-reward">up to +150 XP · +8 HP +2 DEF</div>
      </div>
      <div class="train-game-card" onclick="startTrainingGame('focus')">
        <div class="tg-icon">🎯</div>
        <div class="tg-name">Focus Target</div>
        <div class="tg-desc">Hit moving targets! Builds ATK + SPD permanently</div>
        <div class="tg-reward">up to +90 XP · +4 ATK +2 SPD</div>
      </div>
    </div>
    <div id="training-game-area" class="training-game-area hidden"></div>
  `;
}

const TRAIN_INSTRUCTIONS = {
  reflex: ['Reflex Strike', ['Wait for the circle to flash', 'Tap it the INSTANT it lights up', 'The window is short — stay sharp!', 'Builds SPD and ATK permanently']],
  endurance: ['Endurance Burn', ['Press and HOLD the button', 'Hold as long as you can — up to 30 seconds', 'Letting go ends the session', 'Builds HP and DEF permanently']],
  focus: ['Focus Target', ['Targets appear and vanish quickly', 'Tap them before they disappear', 'Six targets — hit as many as you can', 'Builds ATK and SPD permanently']]
};

function startTrainingGame(type) {
  const c = G.creature;
  if (!c) return;
  drainStats();
  if (c.energy < TRAIN_ENERGY_COST) {
    showToast(`${c.name} is too tired to train — Rest first!`, 3000);
    return;
  }
  const [title, lines] = TRAIN_INSTRUCTIONS[type] || ['Training', []];
  showInstructions(type, title, lines, () => {
    if (G.screen !== 'train') return;
    const area = document.getElementById('training-game-area');
    if (!area) return;
    // Pay the cost up front so quitting can't dodge it
    c.energy = Math.max(0, c.energy - TRAIN_ENERGY_COST);
    c.hunger = Math.max(0, c.hunger - TRAIN_HUNGER_COST);
    saveGame();
    const token = ++trainToken;
    document.querySelector('.train-games-grid')?.classList.add('hidden');
    area.classList.remove('hidden');
    area.innerHTML = '';
    if (type === 'reflex') startReflexGame(area, token);
    else if (type === 'endurance') startEnduranceGame(area, token);
    else if (type === 'focus') startFocusGame(area, token);
  });
}

function quitTraining() {
  trainToken++;   // stops any running timers
  showToast('Session ended — no rewards this time.');
  renderTrainScreen();
}

function startReflexGame(area, token) {
  let score = 0, total = 8, round = 0;
  let flashing = false;

  area.innerHTML = `
    <div class="mini-game reflex-game">
      <div class="mg-title">Reflex Strike</div>
      <div class="mg-score">Score: <span id="rg-score">0</span> · Round: <span id="rg-round">0</span>/${total}</div>
      <div id="rg-flash" class="reflex-target">WAIT…</div>
      <div id="rg-msg" class="mg-msg"></div>
      <button class="btn-secondary" onclick="quitTraining()" style="margin-top:12px">Give Up</button>
    </div>
  `;
  const btn = document.getElementById('rg-flash');
  const msg = document.getElementById('rg-msg');
  let missTimer = null;

  // pointerdown fires the instant a finger lands; click waits for release,
  // which is a real handicap in a reaction test
  btn.addEventListener('pointerdown', () => {
    if (!trainActive(token)) return;
    if (!flashing) { if (msg) msg.textContent = 'Too early!'; return; }
    clearTimeout(missTimer);
    flashing = false;
    btn.classList.remove('active-flash');
    btn.textContent = 'WAIT…';
    score += 20;
    document.getElementById('rg-score').textContent = score;
    if (msg) msg.textContent = 'Hit! +20 XP';
    SFX.good();
    nextFlash();
  });

  function nextFlash() {
    if (!trainActive(token)) return;
    if (round >= total) { endMiniGame('reflex', score, token); return; }
    setTimeout(() => {
      if (!trainActive(token)) return;
      flashing = true;
      btn.classList.add('active-flash');
      btn.textContent = 'TAP!';
      document.getElementById('rg-round').textContent = ++round;
      missTimer = setTimeout(() => {
        if (!trainActive(token) || !flashing) return;
        flashing = false;
        btn.classList.remove('active-flash');
        btn.textContent = 'WAIT…';
        if (msg) msg.textContent = 'Too slow!';
        nextFlash();
      }, 650);
    }, 600 + Math.random() * 1800);
  }
  nextFlash();
}

function startEnduranceGame(area, token) {
  let holding = false, xpGained = 0, seconds = 0, finished = false;
  let timer;

  area.innerHTML = `
    <div class="mini-game endurance-game">
      <div class="mg-title">Endurance Burn</div>
      <div class="mg-score">Held: <span id="eg-sec">0</span>s · XP: <span id="eg-xp">0</span></div>
      <div id="eg-btn" class="endurance-btn">HOLD</div>
      <div class="mg-msg">Press and hold — let go and it's over!</div>
    </div>
  `;

  const btn = document.getElementById('eg-btn');
  // One place ends the session, once. It used to be called both by stop()
  // and again at the 30s cap, which paid every reward twice.
  const finish = () => {
    if (finished) return;
    finished = true;
    holding = false;
    clearInterval(timer);
    btn.classList.remove('holding');
    endMiniGame('endurance', xpGained, token);
  };
  const start = e => {
    if (e) e.preventDefault();
    if (holding || finished || !trainActive(token)) return;
    holding = true;
    btn.classList.add('holding');
    timer = setInterval(() => {
      if (!trainActive(token)) { clearInterval(timer); return; }
      seconds++;
      xpGained += 5;
      document.getElementById('eg-sec').textContent = seconds;
      document.getElementById('eg-xp').textContent = xpGained;
      if (seconds === 15) hypePraise();
      if (seconds >= 30) finish();
    }, 1000);
  };
  const stop = () => { if (holding) finish(); };

  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', stop);
  btn.addEventListener('pointerleave', stop);
  btn.addEventListener('pointercancel', stop);
  btn.addEventListener('contextmenu', e => e.preventDefault());  // long-press menu on phones
}

function startFocusGame(area, token) {
  let score = 0, round = 0, total = 6;

  area.innerHTML = `
    <div class="mini-game focus-game">
      <div class="mg-title">Focus Target</div>
      <div class="mg-score">Hits: <span id="fg-score">0</span> / ${total}</div>
      <div id="fg-arena" class="focus-arena"></div>
      <div id="fg-msg" class="mg-msg">Tap the targets!</div>
      <button class="btn-secondary" onclick="quitTraining()" style="margin-top:12px">Give Up</button>
    </div>
  `;

  function spawnTarget() {
    if (!trainActive(token)) return;
    if (round >= total) { endMiniGame('focus', score * 15, token); return; }
    round++;
    const arena = document.getElementById('fg-arena');
    if (!arena) return;
    const target = document.createElement('div');
    target.className = 'focus-target';
    target.style.left = (5 + Math.random() * 80) + '%';
    target.style.top  = (5 + Math.random() * 70) + '%';
    target.textContent = '🎯';
    arena.appendChild(target);

    let done = false;
    const to = setTimeout(() => {
      if (done) return;
      done = true;
      target.remove();
      if (!trainActive(token)) return;
      const m = document.getElementById('fg-msg');
      if (m) m.textContent = 'Missed!';
      spawnTarget();
    }, 850);

    target.addEventListener('pointerdown', () => {
      if (done || !trainActive(token)) return;
      done = true;
      clearTimeout(to);
      target.remove();
      score++;
      SFX.pop();
      document.getElementById('fg-score').textContent = score;
      const m = document.getElementById('fg-msg');
      if (m) m.textContent = 'Hit! +15 XP';
      spawnTarget();
    });
  }
  spawnTarget();
}

// Each training game builds different stats. Performance decides the gain.
const TRAIN_STAT_CAP = 60;
const TRAIN_GAINS = {
  reflex:    { primary: 'spd', secondary: 'atk', maxScore: 160 },
  endurance: { primary: 'hp',  secondary: 'def', maxScore: 150 },
  focus:     { primary: 'atk', secondary: 'spd', maxScore: 90 }
};

function endMiniGame(type, xpGained, token) {
  // Only a live session pays out, and only once
  if (token !== undefined && !trainActive(token)) return;
  trainToken++;

  const c = G.creature;
  if (!c) return;
  c.trainingCount++;
  ensureCreatureFields(c);
  trackActivity('training');

  // Stat gains scale with performance: 1-4 primary (endurance: 1-8 HP),
  // up to 2 secondary. A zero score still teaches a little.
  const cfg = TRAIN_GAINS[type];
  let gainMsg = '';
  if (cfg) {
    const ratio = Math.min(1, xpGained / cfg.maxScore);
    const pGain = Math.max(1, Math.round(ratio * 4));
    const sGain = Math.round(ratio * 2);
    const ts = c.trainedStats;
    const applied = [];
    if (ts[cfg.primary] < TRAIN_STAT_CAP) {
      const g = Math.min(pGain, TRAIN_STAT_CAP - ts[cfg.primary]);
      ts[cfg.primary] += g;
      applied.push(`+${cfg.primary === 'hp' ? g * 2 : g} ${cfg.primary.toUpperCase()}`);
    }
    if (sGain > 0 && ts[cfg.secondary] < TRAIN_STAT_CAP) {
      const g = Math.min(sGain, TRAIN_STAT_CAP - ts[cfg.secondary]);
      ts[cfg.secondary] += g;
      applied.push(`+${g} ${cfg.secondary.toUpperCase()}`);
    }
    gainMsg = applied.length ? ` ${applied.join(' ')}` : ' (stats maxed!)';
    gameEndHype(ratio);
  }

  grantXP(xpGained);
  saveGame();
  showToast(`Training complete! +${xpGained} XP!${gainMsg}`, 3200);
  // Back to the Training Center so another session is one tap away
  setTimeout(() => { if (G.screen === 'train') renderTrainScreen(); }, 1600);
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

  const camp = G.battleMode && G.battleMode.type === 'campaign'
    ? getCampaignLevel(G.battleMode.level) : null;

  if (camp) {
    G.opponent = {
      name: camp.name,
      creature: camp.creature,
      level: camp.level,
      message: camp.message,
      statMods: camp.statMods
    };
  } else {
    const rival = AI_OPPONENTS[Math.floor(Math.random() * AI_OPPONENTS.length)];
    const stage = stageFromLevel(G.creature.level);
    let lv = G.creature.level + (Math.floor(Math.random() * 3) - 1);
    lv = Math.max(1, Math.max(stage.min, Math.min(stage.max, lv)));
    G.opponent = { ...rival, level: lv };
  }
  G.opponent.id = G.opponent.creature;
  const oppDef = CREATURES[G.opponent.creature];
  const backTarget = camp ? 'campaign' : 'home';

  el.innerHTML = `
    <div class="bp-header">
      <button class="btn-back" onclick="showScreen('${backTarget}')">← Back</button>
      <h2>${camp ? `Campaign ${camp.zone.icon} Level ${camp.n}` : 'Battle Preparation'}</h2>
    </div>
    ${camp && camp.modifier ? `<div class="campaign-modifier-banner">⚠️ ${camp.modifier}</div>` : ''}

    <div class="bp-matchup">
      <div class="bp-fighter player-side">
        <div class="bp-fighter-sprite" style="filter:drop-shadow(0 0 16px ${def.glow})">
          ${getSpriteHTML(G.creature.id, stageFromLevel(G.creature.level).id, 72)}
        </div>
        <div class="bp-fighter-name">${esc(G.creature.name)}</div>
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
    ${(() => {
      drainStats();
      const conds = Battle.conditionOf(G.creature);
      if (!conds.length) return '';
      return `<div class="bp-conditions">${conds.map(cd =>
        `<span class="bp-cond ${cd.bad ? 'bp-cond-bad' : 'bp-cond-good'}">${cd.bad ? '⚠️' : '✨'} ${cd.label}: ${cd.effect}</span>`
      ).join('')}${conds.some(cd => cd.bad) ? `<div class="bp-cond-tip">Feed and rest ${esc(G.creature.name)} at camp to fight at full strength.</div>` : ''}</div>`;
    })()}

    <div class="bp-section">
      <div class="bp-section-title">Choose 3 Moves</div>
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
              <div class="bpmc-power">${move.power > 0 ? 'Power ' + move.power : 'Buff'}</div>
              <div class="bpmc-effect">${move.effect !== 'none' ? move.effect : ''}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="bp-moves-count" id="bp-moves-count">Selected: ${G.selectedMoves.length} / 3</div>
    </div>

    <div class="bp-section">
      <div class="bp-section-title">Battle Stance</div>
      <div class="stance-row">
        ${['aggressive','balanced','defensive'].map(s => `
          <button class="stance-btn ${G.stance === s ? 'active' : ''}" onclick="setStance('${s}')">
            ${{ aggressive:'Aggressive', balanced:'Balanced', defensive:'Defensive' }[s]}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="bp-section">
      <div class="bp-section-title">Battle Item</div>
      <div class="item-row">
        <button class="item-btn ${!G.selectedItem ? 'active' : ''}" onclick="selectItem(null, this)">None</button>
        ${['bandage','focus_berry','smoke_cloud'].map(itemId => {
          const item = ITEMS[itemId];
          if (!G.inventory.includes(itemId)) return '';
          return `
            <button class="item-btn ${G.selectedItem === itemId ? 'active' : ''}"
                    onclick="selectItem('${itemId}', this)">
              ${item.icon} ${item.name}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <button class="btn-start-battle" onclick="startBattle()" id="btn-start-battle">
      FIGHT!
    </button>
  `;
}

function toggleMove(moveId) {
  if (G.selectedMoves.includes(moveId)) {
    G.selectedMoves = G.selectedMoves.filter(m => m !== moveId);
  } else if (G.selectedMoves.length < 3) {
    G.selectedMoves.push(moveId);
  } else {
    showToast('Already have 3 moves selected!');
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

function selectItem(itemId, btn) {
  G.selectedItem = itemId;
  document.querySelectorAll('.item-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function toggleBattleSpeed(btn) {
  const s = Battle.setSpeed(Battle.getSpeed() > 1 ? 1 : 2);
  if (!G.settings) G.settings = {};
  G.settings.battleSpeed = s;
  saveGame();
  if (btn) btn.textContent = s > 1 ? '⏩ 2x' : '▶ 1x';
}

function skipBattle(btn) {
  Battle.skip();
  if (btn) btn.disabled = true;
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

  const tintFilter = G.creature.colorTint ? `hue-rotate(${G.creature.colorTint}deg)` : '';

  drainStats();
  const campMods = G.battleMode && G.battleMode.type === 'campaign'
    ? { playerHpPct: getCampaignLevel(G.battleMode.level).playerHpPct } : null;
  Battle.init(G.selectedMoves, G.stance, G.selectedItem, campMods);
  const opponentCreature = {
    id: G.opponent.creature,
    name: G.opponent.name || CREATURES[G.opponent.creature].name,
    level: G.opponent.level,
    personality: CREATURES[G.opponent.creature].personality,
    trainingCount: 0,
    statMods: G.opponent.statMods || null
  };
  const match = Battle.prepare(G.creature, opponentCreature);
  const pStartPct = Math.round(100 * match.player.hp / match.player.maxHp);
  Battle.setSpeed((G.settings && G.settings.battleSpeed) || 1);

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
              <div class="bib-hp-fill" id="battle-opp-hpbar" style="width:100%;background:#10b981"></div>
            </div>
          </div>
          <div class="bib-hp-num" id="battle-opp-hp">${match.opponent.hp}/${match.opponent.maxHp}</div>
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
            <span class="bib-name">${esc(G.creature.name)}</span>
            <span class="bib-level">Lv.${G.creature.level}</span>
          </div>
          <div class="bib-hp-row">
            <span class="bib-hp-label">HP</span>
            <div class="bib-hp-track">
              <div class="bib-hp-fill" id="battle-player-hpbar" style="width:${pStartPct}%;background:${pStartPct > 60 ? '#10b981' : '#f59e0b'}"></div>
            </div>
          </div>
          <div class="bib-hp-num" id="battle-player-hp">${match.player.hp}/${match.player.maxHp}</div>
        </div>
      </div>

      <!-- Dialog box -->
      <div class="battle-dialog-box">
        <div class="battle-log" id="battle-log"></div>
      </div>

      <!-- Attack visual effects layer -->
      <div class="battle-fx-layer" id="battle-fx-layer"></div>

      <!-- Playback speed -->
      <div class="battle-speed">
        <button class="bs-btn" id="bs-speed" onclick="toggleBattleSpeed(this)">${Battle.getSpeed() > 1 ? '⏩ 2x' : '▶ 1x'}</button>
        <button class="bs-btn" id="bs-skip" onclick="skipBattle(this)">⏭ Skip</button>
      </div>

    </div>
  `;

  Battle.setElements(
    document.getElementById('battle-log'),
    document.getElementById('battle-player-hpbar'),
    document.getElementById('battle-player-hp'),
    document.getElementById('battle-opp-hpbar'),
    document.getElementById('battle-opp-hp'),
    document.getElementById('battle-player-sprite'),
    document.getElementById('battle-opp-sprite')
  );

  Battle.run(match).then(result => {
    document.querySelector('.battle-speed')?.remove();
    G.battleResult = result;
    G.creature.battleCount++;
    trackActivity('battle');
    const camp = G.battleMode && G.battleMode.type === 'campaign'
      ? getCampaignLevel(G.battleMode.level) : null;

    // Beasts recover between fights — HP is a per-battle resource
    G.creature.hp = G.creature.maxHp;
    // Fighting is tiring
    G.creature.energy = Math.max(0, G.creature.energy - 6);
    G.creature.hunger = Math.max(0, G.creature.hunger - 4);

    if (result.winner === 'player') {
      SFX.victoryTheme();
      const xpReward = 40 + G.opponent.level * 5;
      grantXP(xpReward);

      if (camp) {
        // Campaign rewards: stars, coins (double on first clear), boss gear
        const stars = campaignStars(result.playerHpLeft, result.playerMaxHp);
        const firstClear = camp.n >= (G.campaign.progress || 1);
        const prevStars = G.campaign.stars[camp.n] || 0;
        G.campaign.stars[camp.n] = Math.max(prevStars, stars);
        const coinReward = firstClear ? camp.coins * 2 : camp.coins;
        G.coins += coinReward;
        if (firstClear) G.campaign.progress = camp.n + 1;
        G.battleResult.campaign = { level: camp.n, stars, coinReward, firstClear };
        if (camp.bossGear && firstClear) {
          const pool = Object.keys(GEAR).filter(gid => GEAR[gid].rarity === 'rare' || GEAR[gid].rarity === 'epic');
          const earnedId = pool[(camp.n * 3) % pool.length];
          ensureCreatureFields(G.creature);
          G.creature.gearInventory.push(earnedId);
          G.battleResult.campaign.gear = earnedId;
        }
        showToast(`Level ${camp.n} cleared! +${coinReward} coins!`);
      } else {
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
          showToast(`Victory! +${xpReward} XP! Found: ${GEAR[earnedId].name}!`);
        } else {
          showToast(`Victory! +${xpReward} XP!`);
        }
      }
      setTimeout(() => SFX.coin(), 2000);
    } else {
      SFX.defeatTheme();
      // A loss still teaches something
      grantXP(10 + G.opponent.level * 2);
      showToast(`Defeated... Train up and try again!`);
    }
    saveGame();
    setTimeout(() => showScreen('battle-result'), 2200);
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

  const camp = result.campaign;
  const nextLevel = camp && camp.level < CAMPAIGN_TOTAL ? camp.level + 1 : null;

  el.innerHTML = `
    <div class="result-screen ${won ? 'result-win' : 'result-lose'}">
      <div class="result-emoji">${won ? '🏆' : '💔'}</div>
      <div class="result-title">${won ? 'VICTORY!' : 'DEFEATED...'}</div>
      ${camp && won ? `
        <div class="result-stars">
          ${[1,2,3].map(i => `<span class="star ${i <= camp.stars ? 'star-earned' : 'star-empty'}" style="animation-delay:${i*0.25}s">⭐</span>`).join('')}
        </div>` : ''}
      <div class="result-creature" style="filter:drop-shadow(0 0 20px ${def.glow})">
        ${getSpriteHTML(G.creature.id, stageFromLevel(G.creature.level).id, 120)}
      </div>
      <div class="result-name">${esc(G.creature.name)}</div>
      <div class="result-stats">
        <div class="rs-stat">HP Remaining: ${result.playerHpLeft} / ${result.playerMaxHp || G.creature.maxHp}</div>
        <div class="rs-stat">Rounds Fought: ${result.rounds.length}</div>
        ${won && camp ? `<div class="rs-reward">+${40 + G.opponent.level*5} XP  •  +${camp.coinReward} coins${camp.gear ? `  •  ${GEAR[camp.gear].icon} ${GEAR[camp.gear].name}!` : ''}</div>` : ''}
        ${won && !camp ? `<div class="rs-reward">+${40 + G.opponent.level*5} XP  •  +${20 + G.opponent.level*2} coins</div>` : ''}
        ${!won ? `<div class="rs-reward rs-consolation">+${10 + G.opponent.level*2} XP for the experience</div>
                  <div class="rs-tip">Tip: training in the Training Center raises stats permanently.</div>` : ''}
      </div>
      ${camp ? `
        ${won && nextLevel && nextLevel <= G.campaign.progress ? `<button class="btn-primary" onclick="startCampaignBattle(${nextLevel})">Next Level ▶</button>` : ''}
        ${!won ? `<button class="btn-primary" onclick="startCampaignBattle(${G.battleMode.level})">Try Again</button>` : ''}
        <button class="btn-secondary" onclick="showScreen('campaign')">Campaign Map</button>
      ` : `
        <button class="btn-primary" onclick="showScreen('home')">Return to Camp</button>
      `}
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
      <h2>Creature Profile</h2>
    </div>
    <div class="profile-creature">
      <div class="profile-sprite" style="filter:drop-shadow(0 0 24px ${def.glow})">
        ${getSpriteHTML(c.id, stageDef.id, 130)}
      </div>
      <div class="profile-name">${esc(c.name)}</div>
      <div class="profile-title">${stageInfo ? stageInfo.name : ''} · ${def.title}</div>
    </div>
    <div class="profile-grid">
      <div class="profile-card">
        <div class="pc-title">Level & Progress</div>
        <div class="pc-row"><span>Level</span><b>${c.level} / 100</b></div>
        <div class="pc-row"><span>Stage</span><b>${stageDef.name}</b></div>
        <div class="pc-row"><span>XP</span><b>${c.xp} / ${c.level < 100 ? xpForLevel(c.level+1) : 'MAX'}</b></div>
        <div class="pc-row"><span>Paths</span><b>${
          (c.evolutionPaths || []).length
            ? c.evolutionPaths.map(p => EVOLUTION_PATHS[p.path] ? EVOLUTION_PATHS[p.path].icon + ' ' + EVOLUTION_PATHS[p.path].name : '').join(', ')
            : (evPath && EVOLUTION_PATHS[evPath] ? 'Leaning ' + EVOLUTION_PATHS[evPath].name : 'Not yet')
        }</b></div>
      </div>
      <div class="profile-card">
        <div class="pc-title">Battle Stats</div>
        ${(() => {
          const s = Battle.previewStats(c);
          const t = c.trainedStats || {};
          const tr = v => v ? ` <i class="trained-plus">+${v} trained</i>` : '';
          return `
            <div class="pc-row"><span>HP</span><b>${s.hp}${tr((t.hp || 0) * 2)}</b></div>
            <div class="pc-row"><span>Attack</span><b>${s.atk}${tr(t.atk)}</b></div>
            <div class="pc-row"><span>Defense</span><b>${s.def}${tr(t.def)}</b></div>
            <div class="pc-row"><span>Speed</span><b>${s.spd}${tr(t.spd)}</b></div>`;
        })()}
        ${c.nature && NATURES[c.nature] ? `<div class="pc-row"><span>Nature</span><b>${NATURES[c.nature].icon} ${NATURES[c.nature].name}</b></div>` : ''}
      </div>
      <div class="profile-card">
        <div class="pc-title">Care History</div>
        <div class="pc-row"><span>Battles</span><b>${c.battleCount}</b></div>
        <div class="pc-row"><span>Training Sessions</span><b>${c.trainingCount}</b></div>
        <div class="pc-row"><span>Affection Acts</span><b>${c.affectionCount}</b></div>
        <div class="pc-row"><span>Bond Level</span><b>${c.bondLevel} / 100</b></div>
      </div>
      <div class="profile-card">
        <div class="pc-title">Incubation Bonuses</div>
        ${(c.incubationBonuses || []).length ? c.incubationBonuses.map(b =>
          `<div class="pc-row"><span>${b.name}</span><b>${b.effect}</b></div>`
        ).join('') : '<div class="pc-empty">No bonuses from incubation</div>'}
      </div>
    </div>
    <div class="profile-moves">
      <div class="pm-title">Known Moves</div>
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
      <div class="st-title">Evolution Stages</div>
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
          <div class="lore-title">${def.name}'s Lore</div>
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

    <div class="customize-card settings-card">
      <div class="customize-title">Settings</div>
      <label class="setting-row">
        <span>Show instructions before games</span>
        <input type="checkbox" ${G.settings && G.settings.instructions !== false ? 'checked' : ''}
               onchange="setSetting('instructions', this.checked)">
      </label>
      <label class="setting-row">
        <span>Sound</span>
        <input type="checkbox" ${SFX.isMuted() ? '' : 'checked'}
               onchange="if (SFX.isMuted() === this.checked) SFX.toggleMute()">
      </label>
      <label class="setting-row">
        <span>Fast battles (2x)</span>
        <input type="checkbox" ${G.settings && G.settings.battleSpeed > 1 ? 'checked' : ''}
               onchange="setSetting('battleSpeed', this.checked ? 2 : 1)">
      </label>
    </div>

    <div class="customize-card">
      <div class="customize-title">Customize ${esc(c.name)}</div>
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
      <h2>Beast Codex  <span class="codex-count">${G.collection.length} / ${allCreatures.length}</span></h2>
    </div>
    <div class="codex-grid">
      ${allCreatures.map(c => {
        const discovered = G.collection.includes(c.id);
        const elem = ELEMENTS[c.element];
        return `
          <div class="codex-card ${discovered ? 'discovered' : 'undiscovered'}">
            <div class="cc-sprite" style="${discovered ? `filter:drop-shadow(0 0 10px ${c.glow})` : 'filter:grayscale(1) brightness(0.3) opacity(0.45)'}">
              ${discovered ? getSpriteHTML(c.id, 'baby', 58) : '<span style="font-size:1.8rem;line-height:60px;display:block;text-align:center">?</span>'}
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
      <h2>Equipment</h2>
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
      <div class="gear-section-title">Your Gear</div>
      <div class="gear-list">
        ${allOwned.map(gid => gearCard(gid)).join('')}
      </div>
    ` : `
      <div class="gear-empty">Win battles or visit the shop to earn gear!</div>
    `}

    <div class="gear-section-title">Gear Shop</div>
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
  if (G.coins < g.cost) { showToast('Not enough coins!'); return; }
  G.coins -= g.cost;
  ensureCreatureFields(G.creature);
  G.creature.gearInventory.push(gearId);
  saveGame();
  renderGearScreen();
  showToast(`Bought ${g.name}!`);
}

function setSetting(key, value) {
  if (!G.settings) G.settings = {};
  G.settings[key] = value;
  saveGame();
  showToast('Saved');
}

function setColorTint(tint) {
  if (!G.creature) return;
  G.creature.colorTint = tint;
  saveGame();
  renderProfile();
  showToast('Color updated!');
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
  // Neon gradient fills that shift from toxic-green through gold to hot red
  const grad = pct > 60
    ? 'linear-gradient(90deg,#2fe89a,#b4ff3d)'
    : pct > 30
      ? 'linear-gradient(90deg,#ff8324,#ffc531)'
      : 'linear-gradient(90deg,#ff1f4f,#ff3b6b)';
  const tint = pct > 60 ? '#2fe89a' : pct > 30 ? '#ffc531' : '#ff3b6b';
  return `
    <div class="vital-bar ${pct <= 25 ? 'vital-low' : ''}" title="${label}">
      <span class="vb-icon">${icon}</span>
      <div class="vb-track">
        <div class="vb-fill" style="width:${pct}%;background:${grad};color:${tint}"></div>
      </div>
      <span class="vb-val" style="color:${tint}">${Math.round(pct)}%</span>
    </div>
  `;
}

// ---- Title Creature Parade ----
// The roster drifts slowly across the title screen at varying depths so
// the art is showcased without competing with the logo.
function startTitleParade() {
  const host = document.getElementById('title-parade');
  if (!host || host.dataset.built === '1') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ids = Object.keys(CREATURES);
  // Shuffle so the order differs each visit
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  // Three depth layers: far ones are small, dim and slow; near ones large and
  // brighter. Depth comes from size + opacity only — CSS filters on a
  // continuously transformed element force a re-raster every frame.
  const LAYERS = [
    { size: 84,  opacity: 0.62, dur: [78, 96], top: [4, 26] },
    { size: 116, opacity: 0.82, dur: [62, 78], top: [24, 56] },
    { size: 152, opacity: 1.00, dur: [48, 62], top: [52, 84] }
  ];
  const rand = (a, b) => a + Math.random() * (b - a);

  ids.forEach((id, i) => {
    const layer = LAYERS[i % LAYERS.length];
    const def = CREATURES[id];
    const rightward = i % 2 === 0;
    const dur = rand(layer.dur[0], layer.dur[1]);

    const el = document.createElement('div');
    el.className = 'parade-creature ' + (rightward ? 'parade-rtl' : 'parade-ltr');
    el.style.top = rand(layer.top[0], layer.top[1]) + '%';
    el.style.opacity = layer.opacity;
    // A soft radial glow behind the sprite reads like the drop-shadow but
    // composites for free instead of re-filtering every frame.
    el.style.setProperty('--parade-glow', def.glow);
    el.style.animationDuration = dur + 's';
    // Negative delay starts each one mid-journey, so the screen is alive instantly
    el.style.animationDelay = '-' + (dur * (i / ids.length)) + 's';

    const inner = document.createElement('div');
    inner.className = 'parade-bob';
    inner.style.animationDuration = rand(4.5, 7.5) + 's';
    inner.innerHTML = getSpriteHTML(id, 'adult', layer.size);
    el.appendChild(inner);
    host.appendChild(el);
  });

  host.dataset.built = '1';
}

// ---- Particle Background ----
let titleParticlesRaf = null;
function startParticles() {
  const canvas = document.getElementById('title-particles');
  if (!canvas) return;
  if (titleParticlesRaf) cancelAnimationFrame(titleParticlesRaf);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#ffc531', '#ff8324', '#22e0ff', '#ff4fd8', '#b45cff'];
  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.6 + 0.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));

  function draw() {
    if (G.screen !== 'title') { titleParticlesRaf = null; return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
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
    }
    ctx.globalAlpha = 1;
    titleParticlesRaf = requestAnimationFrame(draw);
  }
  titleParticlesRaf = requestAnimationFrame(draw);
}

// ---- Button Event Listeners (global) ----
window.addEventListener('DOMContentLoaded', () => {
  if (typeof FX !== 'undefined') FX.init();
  loadGame();
  checkDailyStreak();

  // Title buttons
  document.getElementById('btn-new-game')?.addEventListener('click', () => {
    const c = G.creature;
    const egg = G.incubation;
    if (c || egg) {
      const what = c
        ? `${c.name} (Lv.${c.level})`
        : `the egg you're incubating`;
      confirmDialog({
        title: 'Start a new journey?',
        body: `Hatching a new egg will release <b>${esc(what)}</b> for good. ` +
              `Your coins, codex and campaign progress are kept.`,
        confirm: 'Start Over',
        cancel: 'Keep My Beast',
        danger: true
      }).then(ok => { if (ok) showScreen('choose-category'); });
      return;
    }
    showScreen('choose-category');
  });
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

  // Progress always saved: flush on every way a player can leave.
  // iOS Safari frequently skips beforeunload, so pagehide/visibilitychange
  // do the real work there.
  const flushSave = () => {
    try {
      saveGame();
      if (Cloud.isSignedIn()) Cloud.flush(collectSaveData());
    } catch {}
  };
  window.addEventListener('beforeunload', flushSave);
  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flushSave(); });
  // Safety net for long sessions that never background
  setInterval(() => { try { saveGame(); } catch {} }, 30000);

  // Resume a signed-in session on load
  if (Cloud.isSignedIn()) syncAfterSignIn();
  window.addEventListener('online', () => {
    if (Cloud.isSignedIn() && !Cloud.isReady()) syncAfterSignIn({ quiet: true });
  });

  showScreen('title');
});
