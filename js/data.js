// =====================================================
// HATCHBOUND: BEAST ARENA  — Game Data v1.0
// =====================================================

const GV = '1.0';

// ---- ELEMENT SYSTEM ----
const ELEMENTS = {
  fire:     { name:'Fire',     icon:'🔥', color:'#ff6b35', glow:'rgba(255,107,53,0.5)' },
  water:    { name:'Water',    icon:'💧', color:'#38bdf8', glow:'rgba(56,189,248,0.5)' },
  wind:     { name:'Wind',     icon:'🌪️', color:'#86efac', glow:'rgba(134,239,172,0.5)' },
  stone:    { name:'Stone',    icon:'🪨', color:'#a8a29e', glow:'rgba(168,162,158,0.5)' },
  venom:    { name:'Venom',    icon:'☠️', color:'#4ade80', glow:'rgba(74,222,128,0.5)' },
  mystic:   { name:'Mystic',   icon:'✨', color:'#c084fc', glow:'rgba(192,132,252,0.5)' },
  shadow:   { name:'Shadow',   icon:'🌑', color:'#a855f7', glow:'rgba(168,85,247,0.5)' },
  beast:    { name:'Beast',    icon:'⚡', color:'#fbbf24', glow:'rgba(251,191,36,0.5)' },
  electric: { name:'Electric', icon:'⚡', color:'#eab308', glow:'rgba(234,179,8,0.5)' }
};

// [attacker element][defender element] = multiplier (1.3 super effective, 0.77 not very)
const ELEMENT_CHART = {
  fire:     { fire:1,    water:0.77, wind:0.77, stone:0.77, venom:1.3, mystic:1,    shadow:1.3, beast:1.3,  electric:1    },
  water:    { fire:1.3,  water:1,    wind:0.77, stone:1.3,  venom:1,   mystic:0.77, shadow:1,   beast:1,    electric:0.77 },
  wind:     { fire:1,    water:1.3,  wind:1,    stone:0.77, venom:1.3, mystic:0.77, shadow:1,   beast:1,    electric:0.77 },
  stone:    { fire:1.3,  water:0.77, wind:1.3,  stone:1,    venom:1,   mystic:1,    shadow:1.3, beast:0.77, electric:1.3  },
  venom:    { fire:0.77, water:0.77, wind:0.77, stone:1,    venom:1,   mystic:1.3,  shadow:1,   beast:1.3,  electric:1    },
  mystic:   { fire:1,    water:1.3,  wind:1.3,  stone:1,    venom:0.77,mystic:1,    shadow:0.77,beast:1.3,  electric:1    },
  shadow:   { fire:1.3,  water:1,    wind:1,    stone:0.77, venom:1,   mystic:1.3,  shadow:1,   beast:0.77, electric:1    },
  beast:    { fire:0.77, water:1,    wind:1,    stone:1.3,  venom:0.77,mystic:0.77, shadow:1.3, beast:1,    electric:1    },
  electric: { fire:1,    water:1.3,  wind:1.3,  stone:0.77, venom:1,   mystic:1,    shadow:1,   beast:1,    electric:1    }
};

// ---- CREATURE CATEGORIES ----
const CATEGORIES = [
  { id:'reptilian', name:'Reptilian', icon:'🦎', color:'#4ade80', desc:'Ancient & cunning. Venom masters and earth shakers.', element:'venom' },
  { id:'mammal',    name:'Mammal',    icon:'🦁', color:'#f97316', desc:'Fierce & loyal. Fire warriors and stone defenders.',  element:'fire'  },
  { id:'flying',    name:'Flying',    icon:'🦅', color:'#818cf8', desc:'Swift & mystical. Wind riders and mind benders.',     element:'wind'  },
  { id:'aquatic',   name:'Aquatic',   icon:'🐉', color:'#38bdf8', desc:'Fluid & powerful. Tide masters and electric hunters.',element:'water' }
];

// ---- EVOLUTION STAGE RANGES ----
const STAGES = [
  { id:'baby',     name:'Baby',     min:1,  max:10,  scale:0.75 },
  { id:'child',    name:'Child',    min:11, max:25,  scale:0.88 },
  { id:'teen',     name:'Teen',     min:26, max:45,  scale:1.0  },
  { id:'adult',    name:'Adult',    min:46, max:70,  scale:1.15 },
  { id:'champion', name:'Champion', min:71, max:90,  scale:1.3  },
  { id:'mythic',   name:'Mythic',   min:91, max:100, scale:1.5  }
];

// ---- FULL CREATURE DATABASE ----
const CREATURES = {

  /* ========== REPTILIAN ========== */
  komodo: {
    id:'komodo', name:'Komodo', title:'Thornback Komodo',
    category:'reptilian', element:'venom',
    role:'Tank / Poison Bruiser',
    desc:'Slow but unstoppable. Venom flows through every strike.',
    baseStats:{ maxHp:120, atk:85, def:100, spd:60, sta:90 },
    emoji:'🦎', color:'#4ade80', glow:'rgba(74,222,128,0.45)',
    stages:{
      baby:     { name:'Lizzy',             desc:'Chunky lizard baby with venom-tipped claws and a wobbly tail.' },
      child:    { name:'Spitfang',          desc:'Learning to channel venom through its growing fangs.' },
      teen:     { name:'Thornback',         desc:'Spined back radiates a toxic aura.' },
      adult:    { name:'Venom Drake',       desc:'Massive bruiser with hide that secretes contact poison.' },
      champion: { name:'Poison King',       desc:'Armor-plated destroyer. One scratch means defeat.' },
      mythic:   { name:'Venomancer Supreme',desc:'A living toxin — apex predator of the poison arts.' }
    },
    moves:['venomous_bite','toxic_slam','iron_scales','poison_mist','quake_charge','death_roll'],
    personality:'stubborn'
  },

  snake: {
    id:'snake', name:'Serpentis', title:'Shadow Serpentis',
    category:'reptilian', element:'shadow',
    role:'Speed / Status Assassin',
    desc:'Strikes before you see it. Masters of status and stealth.',
    baseStats:{ maxHp:80, atk:100, def:60, spd:120, sta:75 },
    emoji:'🐍', color:'#a855f7', glow:'rgba(168,85,247,0.45)',
    stages:{
      baby:     { name:'Noodle',         desc:'Tiny noodle serpent with enormous curious eyes.' },
      child:    { name:'Whisper',        desc:'Moves silently, leaves no trace in the sand.' },
      teen:     { name:'Shadefang',      desc:'Shadow energy flows visibly through scales.' },
      adult:    { name:'Venomstrike',    desc:'Fastest striker alive — blinks across the arena.' },
      champion: { name:'Umbra Serpent',  desc:'Moves through shadows like water.' },
      mythic:   { name:'The Eternal Coil',desc:'Ancient serpent deity of shadow and venom.' }
    },
    moves:['shadow_fang','coil_crush','venom_spit','ghost_slide','mind_coil','abyss_strike'],
    personality:'mischievous'
  },

  dinosaur: {
    id:'dinosaur', name:'Dinorawr', title:'Battle Raptorex',
    category:'reptilian', element:'stone',
    role:'Balanced Physical Attacker',
    desc:'Raw physical power with ancient battle instincts.',
    baseStats:{ maxHp:100, atk:95, def:85, spd:80, sta:85 },
    emoji:'🦕', color:'#f59e0b', glow:'rgba(245,158,11,0.45)',
    stages:{
      baby:     { name:'Rexlet',      desc:'Baby raptor with an oversized head, big eyes, and tiny arms.' },
      child:    { name:'Chomper',     desc:'Jaw strength already legendary for its size.' },
      teen:     { name:'Raptorex',    desc:'Balanced power emerges with earth-shaking stomps.' },
      adult:    { name:'Terrortooth', desc:'The ground trembles with every step.' },
      champion: { name:'Seismic Rex', desc:'Living earthquake, commands stone and earth.' },
      mythic:   { name:'Ancient Apex',desc:'The first predator, reborn in legend.' }
    },
    moves:['titan_bite','seismic_stomp','stone_hide','raging_charge','earthbreaker','primal_roar'],
    personality:'brave'
  },

  /* ========== MAMMAL ========== */
  gorilla: {
    id:'gorilla', name:'Gorrox', title:'Battle Gorrox',
    category:'mammal', element:'beast',
    role:'Heavy Combo Fighter',
    desc:'Relentless combo specialist. The more it hits, the stronger it gets.',
    baseStats:{ maxHp:110, atk:105, def:80, spd:70, sta:95 },
    emoji:'🦍', color:'#a3a3a3', glow:'rgba(163,163,163,0.45)',
    stages:{
      baby:     { name:'Knuckle Jr.',  desc:'Baby ape with oversized fists and a look of pure determination.' },
      child:    { name:'Brawler',      desc:'Already throwing combos at everything it sees.' },
      teen:     { name:'Iron Knuckle', desc:'Fists covered in natural battle calluses.' },
      adult:    { name:'War Chief',    desc:'Five-hit combo specialist with seismic ground pounds.' },
      champion: { name:'Apex Brawler', desc:'Berserker mode unlocks hidden, devastating power.' },
      mythic:   { name:'Primal Titan', desc:'The ultimate beast warrior — it fears absolutely nothing.' }
    },
    moves:['knuckle_combo','ground_pound','beast_surge','iron_fist','berserker_mode','titan_slam'],
    personality:'aggressive'
  },

  fire_lion: {
    id:'fire_lion', name:'Emberclaw', title:'Solar Fire Lion',
    category:'mammal', element:'fire',
    role:'Fire Damage Striker',
    desc:'Blazing speed and devastating fire attacks. Born to be a champion.',
    baseStats:{ maxHp:90, atk:110, def:65, spd:95, sta:80 },
    emoji:'🦁', color:'#f97316', glow:'rgba(249,115,22,0.5)',
    stages:{
      baby:     { name:'Emberpaw',      desc:'Tiny cub with a glowing ember tail that never goes out.' },
      child:    { name:'Blazecub',      desc:'Playful cub with glowing paws and warm, crackling fur.' },
      teen:     { name:'Flamemane',     desc:'Young lion with a full fire mane — breathes cinders.' },
      adult:    { name:'Emberclaw',     desc:'Armored fire lion with volcanic claws and burning eyes.' },
      champion: { name:'Volcanic Warlion', desc:'Molten armor erupting with pure solar power.' },
      mythic:   { name:'Solar Guardian', desc:'Solar lion deity — carrier of the eternal flame.' }
    },
    moves:['ember_claw','flame_roar','fire_mane','solar_strike','volcanic_surge','supernova'],
    personality:'noble'
  },

  bear: {
    id:'bear', name:'Bruinax', title:'Battle Bruinax',
    category:'mammal', element:'stone',
    role:'Defense / Tank / Grappler',
    desc:'Immovable fortress. Returns all damage doubled.',
    baseStats:{ maxHp:140, atk:80, def:120, spd:50, sta:100 },
    emoji:'🐻', color:'#d97706', glow:'rgba(217,119,6,0.45)',
    stages:{
      baby:     { name:'Snugglepaw', desc:'Round, impossibly fluffy bear cub that hugs everything.' },
      child:    { name:'Grizzlet',   desc:'Starting to develop rock-hard patches of fur.' },
      teen:     { name:'Iron Paw',   desc:'Claws bend steel; hide deflects arrows.' },
      adult:    { name:'Battlehide', desc:'Walking fortress mastering grapple and counter.' },
      champion: { name:'Stoneback',  desc:'Granite-fused hide, the ultimate unstoppable grappler.' },
      mythic:   { name:'Eternal Bear',desc:'Ancient guardian spirit — the immovable, unbreakable one.' }
    },
    moves:['bear_hug','stone_fur','seismic_paw','rock_armor','hibernate_strike','tectonic_slam'],
    personality:'loyal'
  },

  /* ========== FLYING ========== */
  bat: {
    id:'bat', name:'Nocturnis', title:'Battle Nocturnis',
    category:'flying', element:'shadow',
    role:'Lifesteal / Night Attacker',
    desc:'Drains life with every strike. Grows stronger in the darkness.',
    baseStats:{ maxHp:85, atk:95, def:65, spd:110, sta:70 },
    emoji:'🦇', color:'#a855f7', glow:'rgba(168,85,247,0.5)',
    stages:{
      baby:     { name:'Flicker',      desc:'Tiny fuzzy bat with massive ears and the cutest little fangs.' },
      child:    { name:'Darkwing',     desc:'Wings that seem to absorb light itself.' },
      teen:     { name:'Bloodfang',    desc:'Echolocation pulses damage opponents directly.' },
      adult:    { name:'Nocturnis',    desc:'Night predator that steals life force on contact.' },
      champion: { name:'Umbra Wraith', desc:'Can become pure shadow — untouchable and invisible.' },
      mythic:   { name:'The Nightking',desc:'Ruler of everything hidden in darkness.' }
    },
    moves:['lifedrain_bite','shadow_dive','echowave','dark_veil','night_surge','void_drain'],
    personality:'shy'
  },

  eagle: {
    id:'eagle', name:'Stormtalon', title:'Soaring Stormtalon',
    category:'flying', element:'wind',
    role:'Wind / Precision Striker',
    desc:'Unstoppable aerial precision. Wind amplifies every single strike.',
    baseStats:{ maxHp:85, atk:100, def:70, spd:115, sta:80 },
    emoji:'🦅', color:'#38bdf8', glow:'rgba(56,189,248,0.45)',
    stages:{
      baby:     { name:'Featherlet',    desc:'Fluffy eaglet with wind swirling around it even at rest.' },
      child:    { name:'Gustwing',      desc:'First flight leaves a trail of tiny storm clouds.' },
      teen:     { name:'Stormtalon',    desc:'Dives at supersonic speed — target never escapes.' },
      adult:    { name:'Tempest Striker',desc:'Creates tornadoes with wingbeat pressure alone.' },
      champion: { name:'Sky Sovereign',  desc:'Commands all wind currents across the arena.' },
      mythic:   { name:'Eye of the Storm',desc:'Living hurricane — undisputed master of the skies.' }
    },
    moves:['precision_talon','gust_dive','tornado_wing','cyclone_surge','storm_eye','hurricane_slash'],
    personality:'brave'
  },

  owl: {
    id:'owl', name:'Hypnowl', title:'Mystical Hypnowl',
    category:'flying', element:'mystic',
    role:'Wind + Sleep / Confusion Controller',
    desc:'Controls minds with hypnotic patterns. Wind answers its call.',
    baseStats:{ maxHp:90, atk:85, def:75, spd:90, sta:85 },
    emoji:'🦉', color:'#c084fc', glow:'rgba(192,132,252,0.5)',
    stages:{
      baby:     { name:'Blinky',          desc:'Big-eyed owl chick with mesmerizing spiral feather patterns.' },
      child:    { name:'Dreamhoots',      desc:'Can lull small creatures to sleep with its gaze.' },
      teen:     { name:'Hypnowl',         desc:'Spinning feathers create persistent confusion fields.' },
      adult:    { name:'Mind Weaver',     desc:'Controls weather and minds simultaneously.' },
      champion: { name:'Storm Oracle',    desc:'Sees the future — confuses those stuck in the present.' },
      mythic:   { name:'Dreamstorm Ancient',desc:'Hypnotic wind deity. Master of eternal dreams.' }
    },
    moves:['hypno_stare','sleep_wind','confusion_whirl','dream_dive','mind_storm','eternal_slumber'],
    personality:'sleepy'
  },

  /* ========== AQUATIC ========== */
  sea_dragon: {
    id:'sea_dragon', name:'Tidalrex', title:'Mystic Tidalrex',
    category:'aquatic', element:'water',
    role:'Mystic Water Tank',
    desc:'Ancient sea power. Water mastery combined with raw mystic energy.',
    baseStats:{ maxHp:115, atk:90, def:95, spd:75, sta:100 },
    emoji:'🐲', color:'#06b6d4', glow:'rgba(6,182,212,0.5)',
    stages:{
      baby:     { name:'Tidepup',      desc:'Serpentine baby with glowing fin ridges and huge curious eyes.' },
      child:    { name:'Waveling',     desc:'Can breathe underwater and generate small current rings.' },
      teen:     { name:'Tidalrex',     desc:'Sea dragon form — commands water currents at will.' },
      adult:    { name:'Deep Tide',    desc:'Can summon rushing waves as battle weapons.' },
      champion: { name:'Abyssal Lord', desc:'Rules the depths, weaponizing pressure in every attack.' },
      mythic:   { name:'Sea Emperor',  desc:'Ancient god of the deep — controller of all tides.' }
    },
    moves:['tidal_wave','mystic_surge','ocean_guard','depth_charge','pressure_crush','tsunami_dragon'],
    personality:'noble'
  },

  storm_shark: {
    id:'storm_shark', name:'Shocktide', title:'Storm Shocktide',
    category:'aquatic', element:'electric',
    role:'Speed / Electric Attacker',
    desc:'Lightning-fast in water and in combat. Shocks first, asks later.',
    baseStats:{ maxHp:85, atk:105, def:70, spd:120, sta:80 },
    emoji:'🦈', color:'#3b82f6', glow:'rgba(59,130,246,0.5)',
    stages:{
      baby:     { name:'Sparkling',     desc:'Streamlined baby shark with glowing electric fin markings.' },
      child:    { name:'Bolt Fin',      desc:'Electric charge builds visibly with every movement.' },
      teen:     { name:'Shocktide',     desc:'Creates electromagnetic distortion fields in water.' },
      adult:    { name:'Thunderjaw',    desc:'Every bite carries 10,000 volts.' },
      champion: { name:'Storm Predator',desc:'Generates full electrical storms within the arena.' },
      mythic:   { name:'The Storm Apex',desc:'Living lightning storm — ocean predator supreme.' }
    },
    moves:['electric_bite','surge_current','sonar_blast','tidal_rush','lightning_fin','tempest_jaw'],
    personality:'aggressive'
  },

  jellyfish: {
    id:'jellyfish', name:'Lumilux', title:'Crystal Lumilux',
    category:'aquatic', element:'mystic',
    role:'Status / Support Controller',
    desc:'Master of status effects. Paralyzes, confuses, and drains.',
    baseStats:{ maxHp:95, atk:80, def:80, spd:85, sta:90 },
    emoji:'🪼', color:'#e879f9', glow:'rgba(232,121,249,0.5)',
    stages:{
      baby:     { name:'Glimlet',          desc:'Dome-shaped glowing baby with crystal-like tendrils.' },
      child:    { name:'Lumiveil',         desc:'Each tendril now carries a distinct status effect.' },
      teen:     { name:'Lumilux',          desc:'Crystal dome reflects and amplifies attacks.' },
      adult:    { name:'Prismatic Drifter',desc:'Its aura causes hallucinations and confusion.' },
      champion: { name:'Crystal Oracle',   desc:'Predicts and counters every incoming attack.' },
      mythic:   { name:'The Eternal Glow', desc:'Luminous god of the deep — weaver of living light.' }
    },
    moves:['paralysis_sting','crystal_veil','confusion_pulse','luminous_wave','prism_drain','ethereal_bloom'],
    personality:'mischievous'
  }
};

// ---- MOVE DATABASE ----
const MOVES = {
  // Venom
  venomous_bite:  { name:'Venomous Bite',   element:'venom',   power:65, acc:95, effect:'poison',  desc:'A dripping venom fang strike. May poison the target.' },
  toxic_slam:     { name:'Toxic Slam',      element:'venom',   power:85, acc:85, effect:'slow',    desc:'Body slam soaked in toxins. Slows target.' },
  iron_scales:    { name:'Iron Scales',     element:'stone',   power:0,  acc:100,effect:'def+',    desc:'Hardened scales raise defense by 30%.' },
  poison_mist:    { name:'Poison Mist',     element:'venom',   power:50, acc:90, effect:'poison',  desc:'Exhales a toxic cloud. Poisons all foes.' },
  quake_charge:   { name:'Quake Charge',    element:'stone',   power:90, acc:80, effect:'stun',    desc:'Charging stomp that shakes the ground. May stun.' },
  death_roll:     { name:'Death Roll',      element:'venom',   power:110,acc:75, effect:'none',    desc:'The signature brutal roll attack. Pure devastation.' },

  // Shadow / Snake
  shadow_fang:    { name:'Shadow Fang',     element:'shadow',  power:70, acc:95, effect:'none',    desc:'A fang strike wrapped in shadow energy.' },
  coil_crush:     { name:'Coil Crush',      element:'beast',   power:80, acc:90, effect:'slow',    desc:'Wraps target in coils. Deals and slows.' },
  venom_spit:     { name:'Venom Spit',      element:'venom',   power:55, acc:100,effect:'poison',  desc:'Spits venom at range. Always poisons.' },
  ghost_slide:    { name:'Ghost Slide',     element:'shadow',  power:0,  acc:100,effect:'evade+',  desc:'Phases through shadow — raises evasion.' },
  mind_coil:      { name:'Mind Coil',       element:'mystic',  power:75, acc:85, effect:'confuse', desc:'A hypnotic strike that confuses target.' },
  abyss_strike:   { name:'Abyss Strike',    element:'shadow',  power:120,acc:70, effect:'none',    desc:'Strikes from complete shadow — extremely powerful.' },

  // Stone / Dino
  titan_bite:     { name:'Titan Bite',      element:'beast',   power:90, acc:90, effect:'none',    desc:'Primal jaw-strength attack.' },
  seismic_stomp:  { name:'Seismic Stomp',   element:'stone',   power:85, acc:85, effect:'stun',    desc:'Ground-splitting stomp. May stun.' },
  stone_hide:     { name:'Stone Hide',      element:'stone',   power:0,  acc:100,effect:'def+',    desc:'Hardens hide like stone. Raises defense.' },
  raging_charge:  { name:'Raging Charge',   element:'beast',   power:95, acc:85, effect:'none',    desc:'Full-speed collision attack.' },
  earthbreaker:   { name:'Earthbreaker',    element:'stone',   power:105,acc:80, effect:'slow',    desc:'Breaks the ground to slow and damage.' },
  primal_roar:    { name:'Primal Roar',     element:'beast',   power:0,  acc:100,effect:'atk+',    desc:'Ancient war roar — raises attack by 35%.' },

  // Beast / Gorilla
  knuckle_combo:  { name:'Knuckle Combo',   element:'beast',   power:75, acc:95, effect:'multi',   desc:'Three rapid strikes. Each hit stacks damage.' },
  ground_pound:   { name:'Ground Pound',    element:'stone',   power:90, acc:85, effect:'stun',    desc:'Devastating leap-slam. May stun.' },
  beast_surge:    { name:'Beast Surge',     element:'beast',   power:0,  acc:100,effect:'atk+',    desc:'Battle rush — raises attack significantly.' },
  iron_fist:      { name:'Iron Fist',       element:'beast',   power:100,acc:88, effect:'none',    desc:'Armored punch with maximum force.' },
  berserker_mode: { name:'Berserker Mode',  element:'beast',   power:0,  acc:100,effect:'berserk', desc:'Enters berserker state. Max attack, less defense.' },
  titan_slam:     { name:'Titan Slam',      element:'stone',   power:130,acc:70, effect:'none',    desc:'The ultimate slam attack. Legendary power.' },

  // Fire / Lion
  ember_claw:     { name:'Ember Claw',      element:'fire',    power:70, acc:95, effect:'burn',    desc:'Blazing claw strike. May inflict burn.' },
  flame_roar:     { name:'Flame Roar',      element:'fire',    power:80, acc:90, effect:'burn',    desc:'Fiery roar blast. Burns target.' },
  fire_mane:      { name:'Fire Mane Burst', element:'fire',    power:90, acc:85, effect:'none',    desc:'Explosive mane flare. Wide-area fire.' },
  solar_strike:   { name:'Solar Strike',    element:'fire',    power:100,acc:85, effect:'burn',    desc:'Concentrated solar energy strike.' },
  volcanic_surge: { name:'Volcanic Surge',  element:'fire',    power:115,acc:75, effect:'burn',    desc:'Erupts with volcanic force. Guaranteed burn.' },
  supernova:      { name:'Supernova',       element:'fire',    power:140,acc:65, effect:'burn',    desc:'The ultimate solar explosion. Absolute devastation.' },

  // Stone / Bear
  bear_hug:       { name:'Bear Hug',        element:'beast',   power:80, acc:90, effect:'slow',    desc:'Crushing grapple that slows the target.' },
  stone_fur:      { name:'Stone Fur',       element:'stone',   power:0,  acc:100,effect:'def+',    desc:'Fur hardens to stone. Massive defense boost.' },
  seismic_paw:    { name:'Seismic Paw',     element:'stone',   power:95, acc:85, effect:'stun',    desc:'Paw strike that sends shockwaves.' },
  rock_armor:     { name:'Rock Armor',      element:'stone',   power:0,  acc:100,effect:'def+',    desc:'Full stone armor phase. Near-impervious.' },
  hibernate_strike:{ name:'Hibernate Strike',element:'stone',  power:110,acc:80, effect:'none',    desc:'Energy saved from rest — unleashed in one blow.' },
  tectonic_slam:  { name:'Tectonic Slam',   element:'stone',   power:130,acc:70, effect:'stun',    desc:'The earth-shattering ultimate of the Bear line.' },

  // Shadow / Bat
  lifedrain_bite: { name:'Lifedrain Bite',  element:'shadow',  power:75, acc:95, effect:'drain',   desc:'Bites and absorbs life force from target.' },
  shadow_dive:    { name:'Shadow Dive',     element:'shadow',  power:85, acc:90, effect:'none',    desc:'Dives from shadow cover — hard to dodge.' },
  echowave:       { name:'Echowave',        element:'beast',   power:60, acc:100,effect:'confuse', desc:'Sonic wave that confuses the opponent.' },
  dark_veil:      { name:'Dark Veil',       element:'shadow',  power:0,  acc:100,effect:'evade+',  desc:'Shadow cloak raises evasion dramatically.' },
  night_surge:    { name:'Night Surge',     element:'shadow',  power:100,acc:85, effect:'drain',   desc:'Surges through darkness, draining on impact.' },
  void_drain:     { name:'Void Drain',      element:'shadow',  power:120,acc:75, effect:'drain',   desc:'Channels the void to drain massive HP.' },

  // Wind / Eagle
  precision_talon:{ name:'Precision Talon', element:'wind',    power:75, acc:100,effect:'none',    desc:'Pinpoint accurate talon strike.' },
  gust_dive:      { name:'Gust Dive',       element:'wind',    power:85, acc:90, effect:'slow',    desc:'High-speed dive with wind burst on impact.' },
  tornado_wing:   { name:'Tornado Wing',    element:'wind',    power:90, acc:85, effect:'confuse', desc:'Wing-generated tornado. Confuses foes.' },
  cyclone_surge:  { name:'Cyclone Surge',   element:'wind',    power:100,acc:85, effect:'none',    desc:'Full cyclone charge attack.' },
  storm_eye:      { name:'Storm Eye',       element:'wind',    power:0,  acc:100,effect:'atk+',    desc:'Centers in storm eye — massively boosts attack.' },
  hurricane_slash:{ name:'Hurricane Slash', element:'wind',    power:135,acc:70, effect:'slow',    desc:'The ultimate aerial slash. Devastating wind power.' },

  // Mystic / Owl
  hypno_stare:    { name:'Hypno Stare',     element:'mystic',  power:0,  acc:90, effect:'confuse', desc:'Spiraling eye pattern confuses target.' },
  sleep_wind:     { name:'Sleep Wind',      element:'wind',    power:55, acc:90, effect:'sleep',   desc:'Lullaby wind that puts foes to sleep.' },
  confusion_whirl:{ name:'Confusion Whirl', element:'mystic',  power:70, acc:88, effect:'confuse', desc:'Spinning feather attack that confuses.' },
  dream_dive:     { name:'Dream Dive',      element:'mystic',  power:90, acc:85, effect:'sleep',   desc:'Dives through a dreamstate — causes sleep.' },
  mind_storm:     { name:'Mind Storm',      element:'mystic',  power:105,acc:80, effect:'confuse', desc:'Storm of psychic wind. Confuses and damages.' },
  eternal_slumber:{ name:'Eternal Slumber', element:'mystic',  power:130,acc:70, effect:'sleep',   desc:'Legendary sleep technique. None can resist it.' },

  // Water / Sea Dragon
  tidal_wave:     { name:'Tidal Wave',      element:'water',   power:85, acc:90, effect:'slow',    desc:'Commanding wave that slows on impact.' },
  mystic_surge:   { name:'Mystic Surge',    element:'mystic',  power:80, acc:90, effect:'none',    desc:'Burst of mystic ocean energy.' },
  ocean_guard:    { name:'Ocean Guard',     element:'water',   power:0,  acc:100,effect:'def+',    desc:'Water shield raises defense.' },
  depth_charge:   { name:'Depth Charge',    element:'water',   power:95, acc:85, effect:'stun',    desc:'Deep pressure explosion. May stun.' },
  pressure_crush: { name:'Pressure Crush',  element:'water',   power:110,acc:80, effect:'slow',    desc:'Deep-sea pressure in a single strike.' },
  tsunami_dragon: { name:'Tsunami Dragon',  element:'water',   power:140,acc:65, effect:'stun',    desc:'Legendary full-body tsunami surge.' },

  // Electric / Shark
  electric_bite:  { name:'Electric Bite',   element:'electric',power:75, acc:95, effect:'stun',    desc:'Charged bite delivers massive voltage.' },
  surge_current:  { name:'Surge Current',   element:'electric',power:80, acc:90, effect:'stun',    desc:'Current surge — electrifies the arena.' },
  sonar_blast:    { name:'Sonar Blast',     element:'water',   power:60, acc:100,effect:'confuse', desc:'Disorienting sonar wave attack.' },
  tidal_rush:     { name:'Tidal Rush',      element:'water',   power:90, acc:88, effect:'none',    desc:'Explosive speed rush through water.' },
  lightning_fin:  { name:'Lightning Fin',   element:'electric',power:105,acc:80, effect:'stun',    desc:'Fin charged like a lightning rod.' },
  tempest_jaw:    { name:'Tempest Jaw',     element:'electric',power:135,acc:68, effect:'stun',    desc:'The apex bite — full storm voltage.' },

  // Mystic / Jellyfish
  paralysis_sting:{ name:'Paralysis Sting', element:'mystic',  power:60, acc:95, effect:'stun',    desc:'Tendril sting that paralyzes on contact.' },
  crystal_veil:   { name:'Crystal Veil',    element:'mystic',  power:0,  acc:100,effect:'def+',    desc:'Crystal dome raises defense.' },
  confusion_pulse:{ name:'Confusion Pulse', element:'mystic',  power:65, acc:90, effect:'confuse', desc:'Pulsing light that confuses foes.' },
  luminous_wave:  { name:'Luminous Wave',   element:'water',   power:80, acc:88, effect:'none',    desc:'Wave of luminescent energy.' },
  prism_drain:    { name:'Prism Drain',     element:'mystic',  power:90, acc:85, effect:'drain',   desc:'Prismatic beam drains life from target.' },
  ethereal_bloom: { name:'Ethereal Bloom',  element:'mystic',  power:120,acc:72, effect:'stun',    desc:'Legendary bloom of ethereal crystal light.' }
};

// ---- CONSUMABLES ----
const ITEMS = {
  basic_meat:    { name:'Basic Meat',    icon:'🥩', type:'food',  stat:'hunger', value:30, desc:'Restores hunger.' },
  fire_berry:    { name:'Fire Berry',    icon:'🍒', type:'food',  stat:'hunger', value:25, desc:'Spicy berry — also boosts attack briefly.' },
  sweet_fruit:   { name:'Sweet Fruit',   icon:'🍊', type:'food',  stat:'happiness', value:20, desc:'Favorite treat. Boosts happiness.' },
  crystal_water: { name:'Crystal Water', icon:'💎', type:'food',  stat:'all',    value:15, desc:'Refreshes all stats slightly.' },
  bandage:       { name:'Bandage',       icon:'🩹', type:'battle',stat:'hp',     value:30, desc:'Battle: Restores 30 HP mid-fight.' },
  focus_berry:   { name:'Focus Berry',   icon:'🫐', type:'battle',stat:'atk',    value:25, desc:'Battle: Raises attack by 25% for 2 turns.' },
  smoke_cloud:   { name:'Smoke Cloud',   icon:'💨', type:'battle',stat:'evade',  value:40, desc:'Battle: Raises evasion for 2 turns.' },
  revive_herb:   { name:'Revive Herb',   icon:'🌿', type:'battle',stat:'hp',     value:50, desc:'Battle: Restores 50 HP when below 25%.' }
};

// ---- INCUBATION WINDOWS ----
const INCUBATION_WINDOWS = [
  { id:'warmth',    label:'Warmth',    icon:'🌡️', desc:'Keep temperature stable', affects:'Health & Defense',   color:'#f97316' },
  { id:'comfort',   label:'Comfort',   icon:'🪹', desc:'Keep nest clean & calm',   affects:'Personality & Loyalty', color:'#10b981' },
  { id:'energy',    label:'Energy',    icon:'✨', desc:'Light/dark cycles',         affects:'Speed & Stamina',    color:'#eab308' },
  { id:'stability', label:'Stability', icon:'🔄', desc:'Gently rotate the egg',     affects:'Mutation Chance',    color:'#818cf8' },
  { id:'bond',      label:'Bond',      icon:'💗', desc:'Talk, tap, sing to it',     affects:'Special Passive',    color:'#ec4899' }
];

// ---- AI OPPONENTS ----
const AI_OPPONENTS = [
  { name:'Rival Kade',    creature:'fire_lion', level:5,  avatar:'😤', diff:'easy',   message:'My Emberclaw will roast yours!' },
  { name:'Trainer Mia',  creature:'eagle',     level:8,  avatar:'😊', diff:'easy',   message:'My Stormtalon flies faster than you think!' },
  { name:'Shadow Rex',   creature:'snake',     level:12, avatar:'😈', diff:'medium', message:'You cannot see Shadefang coming...' },
  { name:'Dr. Volta',    creature:'storm_shark',level:18,avatar:'🧪', diff:'medium', message:'My electro-amplified Shocktide is optimal!' },
  { name:'Beast King',   creature:'gorilla',   level:25, avatar:'💪', diff:'hard',   message:'Primal Titan respects no one!' },
  { name:'Abyss Walker', creature:'bat',       level:35, avatar:'🌑', diff:'hard',   message:'In true darkness, my Nocturnis cannot lose.' }
];

// ---- PERSONALITY SYSTEM ----
const PERSONALITIES = {
  brave:       { name:'Brave',       icon:'⚔️',  bonuses:{ atk:5,  def:-3 }, battleQuote:'Charges forward without hesitation!' },
  loyal:       { name:'Loyal',       icon:'🛡️',  bonuses:{ def:5,  hp:10  }, battleQuote:'Fights even harder for its trainer!' },
  aggressive:  { name:'Aggressive',  icon:'💥',  bonuses:{ atk:8,  def:-5 }, battleQuote:'Attacks relentlessly!' },
  noble:       { name:'Noble',       icon:'👑',  bonuses:{ atk:3,  def:3  }, battleQuote:'Battles with grace and power.' },
  mischievous: { name:'Mischievous', icon:'😈',  bonuses:{ spd:5,  def:-2 }, battleQuote:'Finds unexpected angles of attack!' },
  stubborn:    { name:'Stubborn',    icon:'🪨',  bonuses:{ def:8,  spd:-5 }, battleQuote:'Refuses to go down no matter what!' },
  shy:         { name:'Shy',         icon:'🌸',  bonuses:{ spd:3,  atk:-2 }, battleQuote:'Gathers courage and strikes!' },
  sleepy:      { name:'Sleepy',      icon:'😴',  bonuses:{ sta:8,  spd:-4 }, battleQuote:'Woke up, and now the opponent regrets it.' }
};

// ---- XP TABLE ----
function xpForLevel(level) {
  return Math.floor(50 * Math.pow(level, 1.8));
}

// ---- STAGE FROM LEVEL ----
function stageFromLevel(level) {
  return STAGES.find(s => level >= s.min && level <= s.max) || STAGES[5];
}

// ---- ELEMENTAL DAMAGE ----
function calcElementDamage(atkElement, defElement) {
  if (!ELEMENT_CHART[atkElement] || !ELEMENT_CHART[atkElement][defElement]) return 1;
  return ELEMENT_CHART[atkElement][defElement];
}
