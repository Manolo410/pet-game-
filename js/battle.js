// =====================================================
// HATCHBOUND: BEAST ARENA  — Battle System v1.0
// =====================================================

const Battle = (() => {
  let state = {};
  let logEl, p1HpBar, p2HpBar, p1HpNum, p2HpNum;
  let p1Sprite, p2Sprite;
  let animQueue = [];
  let running = false;

  function buildCombatant(creature, isPlayer) {
    const def = CREATURES[creature.id];
    const pers = PERSONALITIES[creature.personality || def.personality];
    const stageDef = stageFromLevel(creature.level);
    const statMult = 1 + (creature.level - 1) * 0.03;

    let hp  = Math.floor((def.baseStats.maxHp  + (pers.bonuses.hp  || 0)) * statMult);
    let atk = Math.floor((def.baseStats.atk    + (pers.bonuses.atk || 0)) * statMult);
    let def_ = Math.floor((def.baseStats.def   + (pers.bonuses.def || 0)) * statMult);
    let spd = Math.floor((def.baseStats.spd    + (pers.bonuses.spd || 0)) * statMult);

    const careBonus = isPlayer ? Math.min(20, Math.floor((creature.trainingCount || 0) / 5)) : 0;

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

    return {
      id:        creature.id,
      name:      creature.name,
      element:   def.element,
      emoji:     def.emoji,
      color:     def.color,
      glow:      def.glow,
      maxHp:     hp,
      hp:        hp,
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
    return def.moves.slice(0, 3);
  }

  function pickAIStance() {
    const stances = ['aggressive','balanced','defensive'];
    return stances[Math.floor(Math.random() * stances.length)];
  }

  function calcDamage(attacker, defender, moveId) {
    const move = MOVES[moveId];
    if (!move || move.power === 0) return 0;

    let base = move.power;
    let atkStat = attacker.atk * (1 + attacker.buffAtk * 0.15);
    let defStat = defender.def * (1 + defender.buffDef * 0.15);

    if (attacker.stance === 'aggressive') atkStat *= 1.15;
    if (attacker.stance === 'defensive')  atkStat *= 0.88;
    if (defender.stance === 'defensive')  defStat *= 1.15;
    if (defender.stance === 'aggressive') defStat *= 0.88;

    if (attacker.isBerserk) atkStat *= 1.3;

    const elemMult = calcElementDamage(move.element, defender.element);

    const level = Math.min(100, attacker.level || 1);
    const rawDmg = ((2 * level / 5 + 2) * base * atkStat / defStat / 50 + 2);
    let dmg = Math.floor(rawDmg * elemMult * (0.85 + Math.random() * 0.3));
    dmg = Math.max(1, dmg);

    return { dmg, elemMult };
  }

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

  function executeTurn(attacker, defender, attackerMove, round) {
    const events = [];

    const tickMsgs = tickStatus(attacker);
    events.push(...tickMsgs);
    if (attacker.hp <= 0) return events;

    if (hasStatus(attacker, 'stun')) {
      events.push({ text:`${attacker.name} is stunned and cannot move!`, type:'stun' });
      return events;
    }
    if (hasStatus(attacker, 'sleep')) {
      events.push({ text:`${attacker.name} is fast asleep!`, type:'sleep' });
      return events;
    }

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
      const buffMsg = applyBuff(attacker, move.effect);
      if (buffMsg) events.push({ text:`${attacker.name}'s ${buffMsg}`, type:'buff' });
      return events;
    }

    const evasionFactor = defender.buffEvade * 0.12;
    if (Math.random() < evasionFactor) {
      events.push({ text:`${defender.name} evaded the attack!`, type:'evade' });
      return events;
    }

    const { dmg, elemMult } = calcDamage(attacker, defender, attackerMove);

    let actualDmg = dmg;

    if (!attacker.itemUsed && attacker.item === 'bandage' && attacker.hp < attacker.maxHp * 0.35) {
      const heal = Math.floor(attacker.maxHp * 0.3);
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
      attacker.itemUsed = true;
      events.push({ text:`${attacker.name} used Bandage! Restored ${heal} HP!`, type:'item' });
    }

    if (!attacker.itemUsed && attacker.item === 'focus_berry' && round === 1) {
      actualDmg = Math.floor(actualDmg * 1.25);
      attacker.itemUsed = true;
      events.push({ text:`${attacker.name} used Focus Berry! Attack boosted!`, type:'item' });
    }

    let hitCount = 1;
    if (move.effect === 'multi') {
      hitCount = 2 + Math.floor(Math.random() * 2);
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

    if (move.effect === 'drain') {
      const heal = Math.floor(totalDmg * 0.4);
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
      events.push({ text:`${attacker.name} absorbed ${heal} HP!`, type:'drain' });
    }

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

  function simulateBattle(player, opponent) {
    const rounds = [];
    let round = 0;
    const maxRounds = 20;

    while (player.hp > 0 && opponent.hp > 0 && round < maxRounds) {
      round++;
      const roundEvents = [];

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
      opponentHpLeft: opponent.hp
    };
  }

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

  function showMoveBanner(moveName, color) {
    const banner = document.getElementById('battle-move-banner');
    if (!banner) return;
    banner.textContent = moveName;
    banner.style.color = color || '#fff';
    banner.style.setProperty('--banner-color', color || '#fff');
    banner.classList.remove('hidden', 'banner-show');
    void banner.offsetWidth;
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

  async function playBattle(result, playerC, opponentC) {
    for (const round of result.rounds) {
      for (const ev of round.events) {

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
          if (move) spawnAttackEffect(move.element, ev.attacker === playerC.id ? 'opp' : 'player');
        }

        if (ev.type === 'damage') {
          const target = ev.target === opponentC.id ? p2Sprite : p1Sprite;
          if (target) {
            target.classList.add('hit-shake');
            setTimeout(() => target.classList.remove('hit-shake'), 500);
          }
          spawnDamageNumber(ev.dmg, ev.target === opponentC.id ? 'opp' : 'player', ev.elemMult || 1);
        }

        await addLog(ev);
        await sleep(600);

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

  return {
    init(selectedMoves, stance, selectedItem) {
      state = { selectedMoves, stance, selectedItem };
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
      const result   = simulateBattle(player, opponent);
      await playBattle(result, player, opponent);
      return result;
    },

    quickSim(playerCreature, opponentData) {
      const player   = buildCombatant(playerCreature, true);
      const opponent = buildCombatant(opponentData,   false);
      return simulateBattle(player, opponent);
    }
  };
})();
