// =====================================================
// HATCHBOUND: BEAST ARENA  — Battle System v1.0
// =====================================================

const Battle = (() => {
  let state = {};
  let logEl, p1HpBar, p2HpBar, p1HpNum, p2HpNum;
  let p1Sprite, p2Sprite;
  let animQueue = [];
  let running = false;

  // ---- Build combat stats from creature save ----
  function buildCombatant(creature, isPlayer) {
    const def = CREATURES[creature.id];
    const pers = PERSONALITIES[creature.personality || def.personality];
    const stageDef = stageFromLevel(creature.level);
    // Babies are weak, teens strong, adults all-powerful
    const statMult = (1 + (creature.level - 1) * 0.03) * (STAGE_POWER[stageDef.id] || 1);

    let hp  = Math.max(15, Math.floor((def.baseStats.maxHp  + (pers.bonuses.hp  || 0)) * statMult));
    let atk = Math.max(8,  Math.floor((def.baseStats.atk    + (pers.bonuses.atk || 0)) * statMult));
    let def_ = Math.max(8, Math.floor((def.baseStats.def    + (pers.bonuses.def || 0)) * statMult));
    let spd = Math.max(8,  Math.floor((def.baseStats.spd    + (pers.bonuses.spd || 0)) * statMult));

    const careBonus = isPlayer ? Math.min(20, Math.floor((creature.trainingCount || 0) / 5)) : 0;

    // Nature/IV rolls (unique per hatched creature)
    if (creature.ivs) {
      hp   = Math.floor(hp   * (creature.ivs.hp  || 1));
      atk  = Math.floor(atk  * (creature.ivs.atk || 1));
      def_ = Math.floor(def_ * (creature.ivs.def || 1));
      spd  = Math.floor(spd  * (creature.ivs.spd || 1));
    }
    if (creature.nature && typeof NATURES !== 'undefined' && NATURES[creature.nature]) {
      const n = NATURES[creature.nature].mods;
      hp   = Math.floor(hp   * (n.hp  || 1));
      atk  = Math.floor(atk  * (n.atk || 1));
      def_ = Math.floor(def_ * (n.def || 1));
      spd  = Math.floor(spd  * (n.spd || 1));
    }

    // Trained stats: earned in the Training Center, flat additions
    if (isPlayer && creature.trainedStats) {
      hp   += (creature.trainedStats.hp  || 0) * 2;
      atk  += creature.trainedStats.atk || 0;
      def_ += creature.trainedStats.def || 0;
      spd  += creature.trainedStats.spd || 0;
    }

    // Campaign modifiers: AI stat multipliers, player HP handicap
    if (!isPlayer && creature.statMods) {
      hp   = Math.floor(hp   * (creature.statMods.hp  || 1));
      atk  = Math.floor(atk  * (creature.statMods.atk || 1));
      def_ = Math.floor(def_ * (creature.statMods.def || 1));
      spd  = Math.floor(spd  * (creature.statMods.spd || 1));
    }

    // Apply gear bonuses for player
    if (isPlayer && creature.equippedGear && typeof GEAR !== 'undefined') {
      ['weapon', 'armor', 'trinket'].forEach(slot => {
        const gearId = creature.equippedGear[slot];
        if (gearId && GEAR[gearId]) {
          const bonus = GEAR[gearId].bonus;
          if (bonus.atk) atk  += bonus.atk;
          if (bonus.def) def_ += bonus.def;
          if (bonus.spd) spd  += bonus.spd;
          if (bonus.hp)  hp   += bonus.hp;
        }
      });
    }

    const startHp = isPlayer && state.mods && state.mods.playerHpPct
      ? Math.max(1, Math.floor(hp * state.mods.playerHpPct)) : hp;

    return {
      id:        creature.id,
      name:      creature.name,
      element:   def.element,
      emoji:     def.emoji,
      color:     def.color,
      glow:      def.glow,
      maxHp:     hp,
      hp:        startHp,
      atk:       atk + careBonus,
      def:       def_,
      spd:       spd,
      level:     creature.level,
      moves:     isPlayer ? state.selectedMoves : buildAIMoves(def),
      stance:    isPlayer ? state.stance : pickAIStance(),
      item:      isPlayer ? state.selectedItem : null,
      itemUsed:  false,
      statusEffects: [],
      buffAtk:   0,
      buffDef:   0,
      buffEvade: 0,
      isBerserk: false
    };
  }

  function buildAIMoves(def) {
    const pool = def.moves.slice();
    return pool.slice(0, 3);
  }

  function pickAIStance() {
    const stances = ['aggressive','balanced','defensive'];
    return stances[Math.floor(Math.random() * stances.length)];
  }

  // ---- Damage formula (Pokémon-style balanced) ----
  function calcDamage(attacker, defender, moveId) {
    const move = MOVES[moveId];
    if (!move || move.power === 0) return 0;

    let base = move.power;
    let atkStat = attacker.atk * (1 + attacker.buffAtk * 0.15);
    let defStat = defender.def * (1 + defender.buffDef * 0.15);

    // Stance modifier
    if (attacker.stance === 'aggressive') atkStat *= 1.15;
    if (attacker.stance === 'defensive')  atkStat *= 0.88;
    if (defender.stance === 'defensive')  defStat *= 1.15;
    if (defender.stance === 'aggressive') defStat *= 0.88;

    // Berserker
    if (attacker.isBerserk) atkStat *= 1.3;

    // Element
    const elemMult = calcElementDamage(move.element, defender.element);

    // Balanced formula: ensures 4-8 hit range across level bands
    const level = Math.min(100, attacker.level || 1);
    const rawDmg = ((2 * level / 5 + 2) * base * atkStat / defStat / 50 + 2);
    let dmg = Math.floor(rawDmg * elemMult * (0.85 + Math.random() * 0.3));
    dmg = Math.max(1, dmg);

    return { dmg, elemMult };
  }

  // ---- Apply effect ----
  function applyEffect(target, effect) {
    const effects = { poison:true, burn:true, stun:true, sleep:true, confuse:true, slow:true };
    if (!effects[effect]) return null;

    const blocked = target.statusEffects.find(s => s.type === effect);
    if (blocked) return null;

    if (effect === 'stun' || effect === 'sleep') {
      target.statusEffects.push({ type: effect, turns: 2 });
      return effect;
    }
    if (effect === 'poison' || effect === 'burn') {
      target.statusEffects.push({ type: effect, turns: 3, tickDmg: Math.floor(target.maxHp * 0.06) });
      return effect;
    }
    if (effect === 'slow')   { target.spd = Math.floor(target.spd * 0.65); return effect; }
    if (effect === 'confuse'){ target.statusEffects.push({ type:'confuse', turns:2 }); return effect; }
    return null;
  }

  function applyBuff(target, effect) {
    if (effect === 'atk+')   { target.buffAtk++;  return 'attack rose!'; }
    if (effect === 'def+')   { target.buffDef++;  return 'defense rose!'; }
    if (effect === 'evade+') { target.buffEvade++;return 'evasion rose!'; }
    if (effect === 'drain')  return null;
    if (effect === 'multi')  return null;
    if (effect === 'berserk'){ target.isBerserk = true; target.buffDef = Math.max(0, target.buffDef - 1); return 'entered BERSERKER mode!'; }
    return null;
  }

  // ---- Tick status effects ----
  function tickStatus(combatant) {
    const msgs = [];
    combatant.statusEffects = combatant.statusEffects.filter(s => {
      if (s.type === 'poison' || s.type === 'burn') {
        combatant.hp = Math.max(0, combatant.hp - s.tickDmg);
        msgs.push({ text:`${combatant.name} takes ${s.tickDmg} ${s.type} damage!`, type:s.type });
      }
      s.turns--;
      return s.turns > 0;
    });
    return msgs;
  }

  function hasStatus(combatant, type) {
    return combatant.statusEffects.some(s => s.type === type);
  }

  // ---- One turn of combat ----
  function executeTurn(attacker, defender, attackerMove, round) {
    const events = [];

    // Status tick
    const tickMsgs = tickStatus(attacker);
    events.push(...tickMsgs);
    if (attacker.hp <= 0) return events;

    // Stun / sleep check
    if (hasStatus(attacker, 'stun')) {
      events.push({ text:`${attacker.name} is stunned and cannot move!`, type:'stun' });
      return events;
    }
    if (hasStatus(attacker, 'sleep')) {
      events.push({ text:`${attacker.name} is fast asleep!`, type:'sleep' });
      return events;
    }

    // Confusion: 30% self-hit chance
    if (hasStatus(attacker, 'confuse') && Math.random() < 0.3) {
      const selfDmg = Math.floor(attacker.maxHp * 0.08);
      attacker.hp = Math.max(0, attacker.hp - selfDmg);
      events.push({ text:`${attacker.name} hurt itself in confusion! (${selfDmg})`, type:'confuse', dmg: selfDmg, target:'self' });
      return events;
    }

    const move = MOVES[attackerMove];
    if (!move) return events;

    events.push({ text:`${attacker.name} used ${move.name}!`, type:'move', move: attackerMove, attacker: attacker.id });

    if (move.power === 0) {
      // Buff / status-only move
      const buffMsg = applyBuff(attacker, move.effect);
      if (buffMsg) events.push({ text:`${attacker.name}'s ${buffMsg}`, type:'buff' });
      return events;
    }

    // Evasion check
    const evasionFactor = defender.buffEvade * 0.12;
    if (Math.random() < evasionFactor) {
      events.push({ text:`${defender.name} evaded the attack!`, type:'evade' });
      return events;
    }

    const { dmg, elemMult } = calcDamage(attacker, defender, attackerMove);

    let actualDmg = dmg;

    // Item: bandage (auto use when low)
    if (!attacker.itemUsed && attacker.item === 'bandage' && attacker.hp < attacker.maxHp * 0.35) {
      const heal = Math.floor(attacker.maxHp * 0.3);
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
      attacker.itemUsed = true;
      events.push({ text:`${attacker.name} used Bandage! Restored ${heal} HP!`, type:'item' });
    }

    // Item: focus berry (first attack bonus)
    if (!attacker.itemUsed && attacker.item === 'focus_berry' && round === 1) {
      actualDmg = Math.floor(actualDmg * 1.25);
      attacker.itemUsed = true;
      events.push({ text:`${attacker.name} used Focus Berry! Attack boosted!`, type:'item' });
    }

    // Multi-hit
    let hitCount = 1;
    if (move.effect === 'multi') {
      hitCount = 2 + Math.floor(Math.random() * 2); // 2-3 hits
    }

    let totalDmg = 0;
    for (let i = 0; i < hitCount; i++) {
      const thisDmg = hitCount > 1 ? Math.floor(actualDmg * 0.4) : actualDmg;
      defender.hp = Math.max(0, defender.hp - thisDmg);
      totalDmg += thisDmg;
    }

    const elemStr = elemMult >= 1.5 ? '⚡ Super effective! ' : elemMult <= 0.65 ? '🛡️ Not very effective. ' : '';
    const hitStr  = hitCount > 1 ? ` (${hitCount} hits!)` : '';
    events.push({ text:`${elemStr}${defender.name} took ${totalDmg} damage!${hitStr}`, type:'damage', dmg: totalDmg, target: defender.id, elemMult });

    // Drain
    if (move.effect === 'drain') {
      const heal = Math.floor(totalDmg * 0.4);
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
      events.push({ text:`${attacker.name} absorbed ${heal} HP!`, type:'drain' });
    }

    // Effect
    if (move.effect && move.effect !== 'none' && move.effect !== 'drain' && move.effect !== 'multi' && move.power > 0) {
      if (Math.random() < 0.6) {
        const applied = applyEffect(defender, move.effect);
        if (applied) {
          const effectNames = { poison:'poisoned', burn:'burned', stun:'stunned', sleep:'put to sleep', confuse:'confused', slow:'slowed' };
          events.push({ text:`${defender.name} was ${effectNames[applied] || applied}!`, type:'status', status: applied });
        }
      }
    }

    return events;
  }

  // ---- Full battle simulation ----
  function simulateBattle(player, opponent) {
    const rounds = [];
    let round = 0;
    const maxRounds = 20;

    while (player.hp > 0 && opponent.hp > 0 && round < maxRounds) {
      round++;
      const roundEvents = [];

      // Determine attack order by speed
      const pMove = player.moves[round % player.moves.length];
      const oMove = opponent.moves[round % opponent.moves.length];

      const pFirst = player.spd >= opponent.spd;

      if (pFirst) {
        roundEvents.push(...executeTurn(player, opponent, pMove, round));
        if (opponent.hp > 0) roundEvents.push(...executeTurn(opponent, player, oMove, round));
      } else {
        roundEvents.push(...executeTurn(opponent, player, oMove, round));
        if (player.hp > 0) roundEvents.push(...executeTurn(player, opponent, pMove, round));
      }

      rounds.push({
        round,
        events: roundEvents,
        playerHp: player.hp,
        opponentHp: opponent.hp
      });

      if (player.hp <= 0 || opponent.hp <= 0) break;
    }

    return {
      rounds,
      winner: player.hp > 0 ? 'player' : 'opponent',
      playerHpLeft: player.hp,
      playerMaxHp: player.maxHp,
      opponentHpLeft: opponent.hp
    };
  }

  // ---- Render helpers ----
  function hpPercent(hp, max) { return Math.max(0, Math.min(100, (hp / max) * 100)); }

  function hpColor(pct) {
    if (pct > 60) return '#10b981';
    if (pct > 30) return '#f59e0b';
    return '#ef4444';
  }

  function statusBadge(effects) {
    return effects.map(e => {
      const icons = { poison:'☠️', burn:'🔥', stun:'⚡', sleep:'💤', confuse:'😵', slow:'🐢' };
      return `<span class="status-badge">${icons[e.type] || '❓'}</span>`;
    }).join('');
  }

  // ---- Visual effect helpers ----
  function showMoveBanner(moveName, color) {
    const banner = document.getElementById('battle-move-banner');
    if (!banner) return;
    banner.textContent = moveName;
    banner.style.color = color || '#fff';
    banner.style.setProperty('--banner-color', color || '#fff');
    banner.classList.remove('hidden', 'banner-show');
    void banner.offsetWidth; // force reflow
    banner.classList.add('banner-show');
    setTimeout(() => banner.classList.add('hidden'), 1200);
  }

  function spawnAttackEffect(element, targetSide) {
    const fxLayer = document.getElementById('battle-fx-layer');
    if (!fxLayer) return;
    const fx = document.createElement('div');
    fx.className = `battle-fx fx-${element} fx-target-${targetSide}`;
    fxLayer.appendChild(fx);
    setTimeout(() => fx.remove(), 900);
  }

  function spawnDamageNumber(dmg, targetSide, elemMult) {
    const arena = document.querySelector('.battle-arena');
    if (!arena) return;
    const num = document.createElement('div');
    let cls = 'battle-dmg-num';
    if (elemMult >= 1.25)  cls += ' dmg-super';
    else if (elemMult <= 0.8) cls += ' dmg-weak';
    num.className = cls;
    num.textContent = dmg;
    num.style.left = targetSide === 'opp' ? (55 + Math.random() * 15) + '%' : (10 + Math.random() * 15) + '%';
    num.style.top  = targetSide === 'opp' ? (12 + Math.random() * 12) + '%' : (48 + Math.random() * 10) + '%';
    arena.appendChild(num);
    setTimeout(() => num.remove(), 1100);
  }

  // ---- DOM playback ----
  async function playBattle(result, playerC, opponentC) {
    for (const round of result.rounds) {
      for (const ev of round.events) {

        // Visual effects fire BEFORE the log entry
        if (ev.type === 'move') {
          const move = MOVES[ev.move];
          if (move && ELEMENTS[move.element]) {
            showMoveBanner(move.name, ELEMENTS[move.element].color);
          }
          const src = ev.attacker === playerC.id ? p1Sprite : p2Sprite;
          if (src) {
            src.classList.add('attack-lunge');
            setTimeout(() => src.classList.remove('attack-lunge'), 500);
          }
          if (move) {
            spawnAttackEffect(move.element, ev.attacker === playerC.id ? 'opp' : 'player');
            if (move.power > 0) SFX.attack(move.element);
          }
        }

        if (ev.type === 'evade') SFX.evadeSwish();
        if (ev.type === 'buff') SFX.powerUp();
        if (ev.type === 'status') SFX.debuff();

        if (ev.type === 'damage') {
          const mult = ev.elemMult || 1;
          SFX.impact(mult);
          const target = ev.target === opponentC.id ? p2Sprite : p1Sprite;
          if (target) {
            target.classList.add('hit-shake');
            setTimeout(() => target.classList.remove('hit-shake'), 500);
            if (typeof FX !== 'undefined') {
              // Super-effective hits rock the whole screen
              FX.shake(mult >= 1.25 ? 14 : 6);
              FX.burst(target, mult >= 1.25 ? '#ffe066' : '#ff3b6b', mult >= 1.25 ? 20 : 10);
              if (mult >= 1.25) FX.flash('rgba(255,230,102,0.35)', 260);
              // Taking a hit tints the screen red
              if (ev.target !== opponentC.id) FX.flash('rgba(255,59,107,0.28)', 240);
            }
          }
          spawnDamageNumber(ev.dmg, ev.target === opponentC.id ? 'opp' : 'player', mult);
        }

        await addLog(ev);
        await sleep(600);

        // Update HP bars after log
        const p1Pct = hpPercent(round.playerHp, playerC.maxHp);
        const p2Pct = hpPercent(round.opponentHp, opponentC.maxHp);

        if (p1HpBar) {
          p1HpBar.style.width = p1Pct + '%';
          p1HpBar.style.background = hpColor(p1Pct);
        }
        if (p2HpBar) {
          p2HpBar.style.width = p2Pct + '%';
          p2HpBar.style.background = hpColor(p2Pct);
        }
        if (p1HpNum) p1HpNum.textContent = round.playerHp + '/' + playerC.maxHp;
        if (p2HpNum) p2HpNum.textContent = round.opponentHp + '/' + opponentC.maxHp;
      }
      await sleep(400);
    }
  }

  async function addLog(ev) {
    if (!logEl) return;
    const classes = {
      damage:  'log-damage',
      move:    'log-move',
      status:  'log-status',
      buff:    'log-buff',
      drain:   'log-drain',
      item:    'log-item',
      evade:   'log-evade',
      stun:    'log-status',
      sleep:   'log-status',
      confuse: 'log-status',
      poison:  'log-status',
      burn:    'log-status'
    };
    const cls = classes[ev.type] || 'log-normal';
    const entry = document.createElement('div');
    entry.className = `battle-log-entry ${cls}`;
    entry.textContent = ev.text;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ---- Public API ----
  return {
    init(selectedMoves, stance, selectedItem, mods) {
      state = { selectedMoves, stance, selectedItem, mods: mods || null };
    },

    setElements(log, hp1Bar, hp1Num, hp2Bar, hp2Num, spr1, spr2) {
      logEl   = log;
      p1HpBar = hp1Bar;
      p1HpNum = hp1Num;
      p2HpBar = hp2Bar;
      p2HpNum = hp2Num;
      p1Sprite = spr1;
      p2Sprite = spr2;
    },

    async run(playerCreature, opponentData) {
      const player   = buildCombatant(playerCreature, true);
      const opponent = buildCombatant(opponentData,   false);
      SFX.battleStart();
      if (typeof FX !== 'undefined') { FX.flash('rgba(255,59,107,0.45)', 420); FX.shake(9); }
      const result   = simulateBattle(player, opponent);
      await playBattle(result, player, opponent);
      return result;
    },

    // Quick sim (no animation) for stat purposes
    quickSim(playerCreature, opponentData) {
      const player   = buildCombatant(playerCreature, true);
      const opponent = buildCombatant(opponentData,   false);
      return simulateBattle(player, opponent);
    }
  };
})();
