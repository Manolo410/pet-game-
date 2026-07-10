// =====================================================
// HATCHBOUND: BEAST ARENA — Campaign Mode
// =====================================================
// 5 zones x 8 levels. Every level is generated deterministically
// from its number, so each one has a distinct opponent, level
// scaling, and battle modifier — no two levels play the same.

const CAMPAIGN_ZONES = [
  { name: 'Ember Wastes',   icon: '🌋', color: '#e05820', desc: 'Scorched dunes where fire beasts prowl' },
  { name: 'Verdant Wilds',  icon: '🌿', color: '#4a9e60', desc: 'Deep jungle ruled by primal titans' },
  { name: 'Tidal Abyss',    icon: '🌊', color: '#3080d0', desc: 'Crushing depths and drowned ruins' },
  { name: 'Storm Peaks',    icon: '🌩️', color: '#a08ad8', desc: 'Shrieking winds and sky hunters' },
  { name: 'Shadow Citadel', icon: '🏰', color: '#9050b0', desc: 'The final fortress. Everything awaits.' }
];
const CAMPAIGN_LEVELS_PER_ZONE = 8;
const CAMPAIGN_TOTAL = CAMPAIGN_ZONES.length * CAMPAIGN_LEVELS_PER_ZONE;

// Themed opponent pools per zone (Shadow Citadel draws from everyone)
const CAMPAIGN_POOLS = [
  ['fire_lion', 'komodo', 'dinosaur'],
  ['gorilla', 'bear', 'snake'],
  ['sea_dragon', 'storm_shark', 'jellyfish'],
  ['eagle', 'owl', 'bat'],
  null
];

const CAMPAIGN_EPITHETS = ['Feral', 'Ancient', 'Rabid', 'Alpha', 'Corrupted', 'Elder', 'Prime', 'Dread'];
const CAMPAIGN_TAUNTS = [
  "You don't belong here, hatchling.",
  'Another challenger? How amusing.',
  'My territory. My rules.',
  'Turn back while you still can!',
  'I have crushed a hundred like you.',
  "Show me what that egg of yours was worth.",
  'The strong feast. The weak flee.',
  'This is where your journey ends.'
];

function getCampaignLevel(n) {
  const zoneIdx = Math.min(CAMPAIGN_ZONES.length - 1, Math.floor((n - 1) / CAMPAIGN_LEVELS_PER_ZONE));
  const zone = CAMPAIGN_ZONES[zoneIdx];
  const step = ((n - 1) % CAMPAIGN_LEVELS_PER_ZONE) + 1;
  const isBoss = step === CAMPAIGN_LEVELS_PER_ZONE;
  const pool = CAMPAIGN_POOLS[zoneIdx] || Object.keys(CREATURES);
  const creatureId = pool[(n * 7 + zoneIdx * 3) % pool.length];
  const oppLevel = Math.max(1, Math.round(n * 1.15));

  // Rotating modifiers keep each level of a zone feeling different
  let statMods = null, playerHpPct = 1, modifier = null;
  if (isBoss) {
    statMods = { atk: 1.2, def: 1.2, hp: 1.35 };
    modifier = 'ZONE BOSS — massively empowered';
  } else if (step === 3) {
    statMods = { atk: 1.18 };
    modifier = 'Raging foe: +18% ATK';
  } else if (step === 5) {
    statMods = { spd: 1.3 };
    modifier = 'Blitz foe: +30% SPD';
  } else if (step === 6) {
    playerHpPct = 0.75;
    modifier = 'Ambush! You start at 75% HP';
  } else if (step === 7) {
    statMods = { def: 1.28, hp: 1.1 };
    modifier = 'Armored foe: +28% DEF';
  }

  const def = CREATURES[creatureId];
  return {
    n, zone, zoneIdx, step, isBoss,
    creature: creatureId,
    level: oppLevel,
    name: `${CAMPAIGN_EPITHETS[n % CAMPAIGN_EPITHETS.length]} ${def.name}`,
    message: CAMPAIGN_TAUNTS[n % CAMPAIGN_TAUNTS.length],
    statMods, playerHpPct, modifier,
    coins: 10 + n * 4,
    bossGear: isBoss
  };
}

function campaignStars(playerHpLeft, playerMaxHp) {
  const pct = playerHpLeft / playerMaxHp;
  if (pct >= 0.5)  return 3;
  if (pct >= 0.2)  return 2;
  return 1;
}

function startCampaignBattle(n) {
  if (!G.creature) { showToast('Hatch a beast first!'); return; }
  if (n > (G.campaign.progress || 1)) { showToast('Clear the previous level first!'); return; }
  if (n > CAMPAIGN_TOTAL) return;
  G.battleMode = { type: 'campaign', level: n };
  showScreen('battle-prep');
}

function renderCampaign() {
  const el = document.getElementById('campaign-content');
  if (!el) return;
  const progress = G.campaign.progress || 1;
  const stars = G.campaign.stars || {};
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  let html = `
    <div class="campaign-header">
      <button class="btn-back" onclick="showScreen('home')">← Back</button>
      <h2>Campaign</h2>
      <div class="campaign-total-stars">⭐ ${totalStars} / ${CAMPAIGN_TOTAL * 3}</div>
    </div>
  `;

  CAMPAIGN_ZONES.forEach((zone, zi) => {
    const zoneStart = zi * CAMPAIGN_LEVELS_PER_ZONE + 1;
    const zoneLocked = progress < zoneStart;
    html += `
      <div class="campaign-zone ${zoneLocked ? 'zone-locked' : ''}" style="--zone-color:${zone.color}">
        <div class="cz-header">
          <span class="cz-icon">${zone.icon}</span>
          <div>
            <div class="cz-name">${zone.name}</div>
            <div class="cz-desc">${zoneLocked ? '??? — clear the previous zone' : zone.desc}</div>
          </div>
        </div>
        <div class="cz-levels">
    `;
    for (let s = 1; s <= CAMPAIGN_LEVELS_PER_ZONE; s++) {
      const n = zoneStart + s - 1;
      const lvl = getCampaignLevel(n);
      const cleared = n < progress;
      const current = n === progress;
      const locked = n > progress;
      const starStr = cleared ? '⭐'.repeat(stars[n] || 1) : '';
      html += `
        <div class="cz-node ${cleared ? 'node-cleared' : current ? 'node-current' : 'node-locked'} ${lvl.isBoss ? 'node-boss' : ''}"
             ${!locked ? `onclick="startCampaignBattle(${n})"` : ''}>
          <div class="czn-num">${lvl.isBoss ? '👑' : n}</div>
          ${locked
            ? '<div class="czn-lock">🔒</div>'
            : `<div class="czn-sprite">${getSpriteHTML(lvl.creature, stageFromLevel(lvl.level).id, 40)}</div>`}
          <div class="czn-level">Lv.${lvl.level}</div>
          <div class="czn-stars">${starStr}</div>
        </div>
      `;
    }
    html += `</div></div>`;
  });

  if (progress > CAMPAIGN_TOTAL) {
    html += `<div class="campaign-complete">🏆 CAMPAIGN COMPLETE! Replay any level to perfect your stars.</div>`;
  }

  el.innerHTML = html;
}
