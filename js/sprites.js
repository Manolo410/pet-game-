// =====================================================
// HATCHBOUND: BEAST ARENA — Digimon-Inspired Creature Sprites
// All creatures drawn as inline SVG (200x200 viewBox)
// Advanced armored/digital monster aesthetic
// =====================================================

const SPRITES = {

  /* ═══════════════════════════════════════════════
     FIRE LION — Emberclaw
     Armored fire lion with crystallized flame mane,
     chest armor, ember circuits, metallic claws
     ═══════════════════════════════════════════════ */
  fire_lion: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="fl_core" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="60%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f97316"/>
    </radialGradient>
    <linearGradient id="fl_armor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
    <filter id="fl_glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Flame aura background -->
  <path d="M100 20 Q120 40 115 60 Q130 35 125 55 Q145 30 135 65 Q150 50 140 72 Q158 48 145 78 Q160 65 148 85" stroke="#fbbf24" stroke-width="2" fill="none" opacity="0.4" filter="url(#fl_glow)"/>
  <path d="M100 20 Q80 40 85 60 Q70 35 75 55 Q55 30 65 65 Q50 50 60 72 Q42 48 55 78 Q40 65 52 85" stroke="#fbbf24" stroke-width="2" fill="none" opacity="0.4" filter="url(#fl_glow)"/>
  <!-- Crystallized flame mane - angular shards -->
  <polygon points="100,22 115,55 108,50" fill="#fbbf24" opacity="0.9"/>
  <polygon points="108,50 130,30 125,60" fill="#f97316" opacity="0.85"/>
  <polygon points="125,60 148,38 140,68" fill="#c2410c" opacity="0.9"/>
  <polygon points="140,68 160,52 150,80" fill="#f97316" opacity="0.8"/>
  <polygon points="92,50 70,30 75,60" fill="#f97316" opacity="0.85"/>
  <polygon points="75,60 52,38 60,68" fill="#c2410c" opacity="0.9"/>
  <polygon points="60,68 40,52 50,80" fill="#f97316" opacity="0.8"/>
  <polygon points="150,80 165,70 155,90" fill="#c2410c" opacity="0.7"/>
  <polygon points="50,80 35,70 45,90" fill="#c2410c" opacity="0.7"/>
  <!-- Head - angular shape -->
  <path d="M60 85 L72 52 L100 42 L128 52 L140 85 L130 105 L70 105 Z" fill="#f97316"/>
  <!-- Forehead armor plate -->
  <path d="M75 58 L100 46 L125 58 L118 72 L82 72 Z" fill="url(#fl_armor)" stroke="#fbbf24" stroke-width="1"/>
  <path d="M88 55 L100 48 L112 55 L108 63 L92 63 Z" fill="#fffbeb" opacity="0.3"/>
  <!-- Angular ear armor left -->
  <polygon points="62,58 52,32 72,50" fill="#c2410c" stroke="#fbbf24" stroke-width="1"/>
  <polygon points="62,55 55,38 70,50" fill="#f97316"/>
  <!-- Angular ear armor right -->
  <polygon points="138,58 148,32 128,50" fill="#c2410c" stroke="#fbbf24" stroke-width="1"/>
  <polygon points="138,55 145,38 130,50" fill="#f97316"/>
  <!-- Face inner angular -->
  <path d="M78 72 L100 68 L122 72 L118 98 L82 98 Z" fill="#fbbf24" opacity="0.6"/>
  <!-- Intense eyes - glowing slits -->
  <path d="M80 78 L92 74 L92 84 Z" fill="#0d0700"/>
  <path d="M83 78 L90 75 L90 82 Z" fill="#c2410c"/>
  <line x1="84" y1="78" x2="89" y2="78" stroke="#fffbeb" stroke-width="2" filter="url(#fl_glow)"/>
  <circle cx="87" cy="78" r="1" fill="#fffbeb"/>
  <path d="M120 78 L108 74 L108 84 Z" fill="#0d0700"/>
  <path d="M117 78 L110 75 L110 82 Z" fill="#c2410c"/>
  <line x1="111" y1="78" x2="116" y2="78" stroke="#fffbeb" stroke-width="2" filter="url(#fl_glow)"/>
  <circle cx="113" cy="78" r="1" fill="#fffbeb"/>
  <!-- Nose - angular -->
  <polygon points="96,92 104,92 100,97" fill="#c2410c"/>
  <!-- Mouth - fierce -->
  <path d="M88 100 L96 98 L100 102 L104 98 L112 100" stroke="#c2410c" stroke-width="1.5" fill="none"/>
  <!-- Fangs -->
  <line x1="92" y1="99" x2="90" y2="105" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="108" y1="99" x2="110" y2="105" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <!-- Chest armor plate -->
  <path d="M70 105 L100 100 L130 105 L135 130 L100 145 L65 130 Z" fill="url(#fl_armor)" stroke="#fbbf24" stroke-width="1"/>
  <path d="M85 108 L100 104 L115 108 L112 125 L100 132 L88 125 Z" fill="#fffbeb" opacity="0.2"/>
  <!-- Energy core in chest -->
  <circle cx="100" cy="118" r="6" fill="url(#fl_core)" filter="url(#fl_glow)"/>
  <circle cx="100" cy="118" r="3" fill="#fffbeb" opacity="0.8"/>
  <!-- Body -->
  <path d="M65 130 L55 165 L80 175 L100 170 L120 175 L145 165 L135 130 Z" fill="#f97316"/>
  <!-- Ember circuit lines on body -->
  <path d="M75 135 L80 142 L72 148 L78 155" stroke="#fbbf24" stroke-width="1.5" fill="none" opacity="0.7" filter="url(#fl_glow)"/>
  <path d="M125 135 L120 142 L128 148 L122 155" stroke="#fbbf24" stroke-width="1.5" fill="none" opacity="0.7" filter="url(#fl_glow)"/>
  <path d="M90 140 L95 148 L88 152" stroke="#fffbeb" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M110 140 L105 148 L112 152" stroke="#fffbeb" stroke-width="1" fill="none" opacity="0.5"/>
  <!-- Shoulder armor plates -->
  <path d="M55 110 L45 105 L50 125 L65 130 Z" fill="#c2410c" stroke="#fbbf24" stroke-width="1"/>
  <path d="M145 110 L155 105 L150 125 L135 130 Z" fill="#c2410c" stroke="#fbbf24" stroke-width="1"/>
  <!-- Front paws - metallic claws -->
  <path d="M60 168 L50 175 L55 182 L65 185 L75 182 L80 175 Z" fill="#c2410c"/>
  <path d="M140 168 L130 175 L125 182 L135 185 L145 182 L150 175 Z" fill="#c2410c"/>
  <!-- Metallic claws left -->
  <line x1="53" y1="180" x2="48" y2="192" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="60" y1="183" x2="56" y2="195" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="68" y1="183" x2="65" y2="195" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Metallic claws right -->
  <line x1="132" y1="183" x2="128" y2="195" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="140" y1="183" x2="137" y2="195" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="147" y1="180" x2="152" y2="192" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Ember tail with crystallized flame -->
  <path d="M135 145 Q155 130 165 108 Q158 128 168 112 Q152 135 162 118 Q142 148 135 145" fill="#c2410c"/>
  <path d="M135 145 Q152 132 160 114 Q155 130 163 118 Q148 138 135 145" fill="#f97316"/>
  <path d="M135 145 Q148 135 155 120 Q150 132 135 145" fill="#fbbf24" opacity="0.8"/>
  <polygon points="165,108 172,95 168,110" fill="#fbbf24" opacity="0.7"/>
  <polygon points="168,112 178,100 172,115" fill="#fffbeb" opacity="0.5"/>
  <!-- Circuit accent lines -->
  <path d="M60 58 L55 65 L48 62" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.6"/>
  <path d="M140 58 L145 65 L152 62" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.6"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     KOMODO — Cyber-Reptile Thornback
     Armored scales, data-glow ridge spines,
     thick armored jaw, toxic drip
     ═══════════════════════════════════════════════ */
  komodo: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="km_armor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
    <filter id="km_glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Tail - armored segments -->
  <path d="M125 148 L145 142 L160 148 L172 140 L185 145 L180 150 L170 152 L155 155 L140 152 L125 155 Z" fill="#15803d"/>
  <path d="M145 142 L148 138 L155 140" stroke="#4ade80" stroke-width="1" fill="none" opacity="0.6"/>
  <path d="M160 148 L162 144 L168 146" stroke="#4ade80" stroke-width="1" fill="none" opacity="0.6"/>
  <polygon points="185,145 194,140 190,148" fill="#15803d"/>
  <!-- Body - angular armored form -->
  <path d="M45 135 L60 118 L90 108 L120 108 L140 118 L145 135 L140 160 L120 170 L70 170 L50 160 Z" fill="#16a34a"/>
  <!-- Armor scale plates on body -->
  <path d="M70 125 L80 120 L90 125 L80 130 Z" fill="#15803d" stroke="#4ade80" stroke-width="0.8"/>
  <path d="M90 125 L100 120 L110 125 L100 130 Z" fill="#15803d" stroke="#4ade80" stroke-width="0.8"/>
  <path d="M110 125 L120 120 L130 125 L120 130 Z" fill="#15803d" stroke="#4ade80" stroke-width="0.8"/>
  <path d="M75 138 L85 133 L95 138 L85 143 Z" fill="#15803d" stroke="#4ade80" stroke-width="0.8"/>
  <path d="M95 138 L105 133 L115 138 L105 143 Z" fill="#15803d" stroke="#4ade80" stroke-width="0.8"/>
  <path d="M115 138 L125 133 L135 138 L125 143 Z" fill="#15803d" stroke="#4ade80" stroke-width="0.8"/>
  <!-- Belly armor -->
  <path d="M65 155 L90 148 L115 148 L135 155 L120 165 L75 165 Z" fill="#86efac" opacity="0.5"/>
  <!-- Back ridge spines with data glow -->
  <polygon points="68,118 72,96 76,118" fill="#15803d" stroke="#4ade80" stroke-width="1"/>
  <polygon points="82,112 87,88 92,112" fill="#15803d" stroke="#4ade80" stroke-width="1"/>
  <polygon points="96,108 102,82 108,108" fill="#15803d" stroke="#4ade80" stroke-width="1"/>
  <polygon points="110,112 116,88 122,112" fill="#15803d" stroke="#4ade80" stroke-width="1"/>
  <polygon points="124,118 129,96 134,118" fill="#15803d" stroke="#4ade80" stroke-width="1"/>
  <!-- Data glow on spines -->
  <line x1="72" y1="96" x2="72" y2="104" stroke="#4ade80" stroke-width="2" filter="url(#km_glow)" opacity="0.8"/>
  <line x1="87" y1="88" x2="87" y2="98" stroke="#4ade80" stroke-width="2" filter="url(#km_glow)" opacity="0.8"/>
  <line x1="102" y1="82" x2="102" y2="94" stroke="#4ade80" stroke-width="2" filter="url(#km_glow)" opacity="0.9"/>
  <line x1="116" y1="88" x2="116" y2="98" stroke="#4ade80" stroke-width="2" filter="url(#km_glow)" opacity="0.8"/>
  <line x1="129" y1="96" x2="129" y2="104" stroke="#4ade80" stroke-width="2" filter="url(#km_glow)" opacity="0.8"/>
  <!-- Neck - thick armored -->
  <path d="M45 135 L35 120 L28 105 L38 100 L52 112 Z" fill="#16a34a"/>
  <path d="M38 115 L42 108 L48 115" stroke="#4ade80" stroke-width="0.8" fill="none" opacity="0.5"/>
  <!-- Head - heavy angular jaw -->
  <path d="M28 105 L15 88 L8 95 L5 108 L12 118 L28 122 L40 115 L38 100 Z" fill="#16a34a"/>
  <!-- Armored jaw plate -->
  <path d="M5 108 L12 118 L28 122 L32 115 L28 108 L15 105 Z" fill="#15803d" stroke="#4ade80" stroke-width="0.8"/>
  <!-- Head crest armor -->
  <path d="M15 88 L20 82 L30 85 L38 100 L28 105 Z" fill="#15803d" stroke="#86efac" stroke-width="0.8"/>
  <path d="M20 82 L18 76 L26 78 L30 85 Z" fill="#16a34a"/>
  <!-- Eye - fierce reptilian slit -->
  <path d="M22 96 L34 92 L34 100 Z" fill="#0d1f0d"/>
  <path d="M25 96 L32 93 L32 99 Z" fill="#4ade80"/>
  <line x1="27" y1="96" x2="31" y2="96" stroke="#fffbeb" stroke-width="1.5" opacity="0.9"/>
  <!-- Nostrils -->
  <circle cx="10" cy="100" r="2" fill="#0d1f0d"/>
  <circle cx="10" cy="106" r="2" fill="#0d1f0d"/>
  <!-- Teeth -->
  <line x1="10" y1="112" x2="8" y2="118" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="15" y1="114" x2="14" y2="120" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="115" x2="20" y2="122" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="116" x2="26" y2="122" stroke="#fffbeb" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Toxic drip from fangs -->
  <path d="M8 118 Q6 125 8 132" stroke="#4ade80" stroke-width="2" fill="none" opacity="0.7" filter="url(#km_glow)"/>
  <circle cx="8" cy="132" r="2.5" fill="#4ade80" opacity="0.6" filter="url(#km_glow)"/>
  <path d="M14 120 Q12 128 15 135" stroke="#4ade80" stroke-width="1.5" fill="none" opacity="0.5" filter="url(#km_glow)"/>
  <circle cx="15" cy="135" r="2" fill="#4ade80" opacity="0.5" filter="url(#km_glow)"/>
  <!-- Legs - thick armored -->
  <path d="M60 160 L52 175 L45 180 L55 185 L65 182 L70 172 Z" fill="#15803d"/>
  <path d="M115 162 L110 175 L105 182 L115 186 L125 183 L128 172 Z" fill="#15803d"/>
  <!-- Leg armor plates -->
  <path d="M55 168 L60 164 L65 168 L60 172 Z" fill="#16a34a" stroke="#4ade80" stroke-width="0.5"/>
  <path d="M112 170 L118 165 L122 170 L118 174 Z" fill="#16a34a" stroke="#4ade80" stroke-width="0.5"/>
  <!-- Claws -->
  <line x1="47" y1="180" x2="42" y2="190" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
  <line x1="53" y1="183" x2="50" y2="193" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
  <line x1="60" y1="184" x2="58" y2="194" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
  <line x1="107" y1="182" x2="103" y2="192" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
  <line x1="113" y1="184" x2="111" y2="194" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
  <line x1="120" y1="183" x2="118" y2="193" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
  <!-- Data circuit lines on body -->
  <path d="M70 150 L78 145 L82 150 L90 148" stroke="#4ade80" stroke-width="1" fill="none" opacity="0.5" filter="url(#km_glow)"/>
  <path d="M105 150 L112 145 L118 150 L125 148" stroke="#4ade80" stroke-width="1" fill="none" opacity="0.5" filter="url(#km_glow)"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     SERPENTIS — Digital Shadow Serpent
     Holographic diamond patterns, shadow energy,
     glowing purple slit eyes, armored head crest
     ═══════════════════════════════════════════════ */
  snake: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sn_body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9333ea"/>
      <stop offset="100%" stop-color="#6b21a8"/>
    </linearGradient>
    <filter id="sn_glow">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="sn_eye" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#6b21a8"/>
    </radialGradient>
  </defs>
  <!-- Shadow energy aura -->
  <ellipse cx="100" cy="140" rx="70" ry="40" fill="#6b21a8" opacity="0.15" filter="url(#sn_glow)"/>
  <!-- Body coil bottom - armored segments -->
  <path d="M35 155 Q50 175 100 178 Q150 175 165 155 Q155 168 100 170 Q45 168 35 155 Z" fill="#6b21a8"/>
  <path d="M40 150 Q55 170 100 172 Q145 170 160 150 Q150 162 100 165 Q50 162 40 150 Z" fill="#9333ea"/>
  <!-- Body coil mid -->
  <path d="M38 140 Q42 115 65 102 Q100 88 135 102 Q158 115 162 140" fill="url(#sn_body)" stroke="#a855f7" stroke-width="1.5"/>
  <!-- Holographic diamond pattern on coils -->
  <polygon points="65,125 75,115 85,125 75,135" fill="#a855f7" opacity="0.4" stroke="#c084fc" stroke-width="0.8"/>
  <polygon points="85,120 95,110 105,120 95,130" fill="#a855f7" opacity="0.4" stroke="#c084fc" stroke-width="0.8"/>
  <polygon points="105,120 115,110 125,120 115,130" fill="#a855f7" opacity="0.4" stroke="#c084fc" stroke-width="0.8"/>
  <polygon points="125,125 135,115 145,125 135,135" fill="#a855f7" opacity="0.4" stroke="#c084fc" stroke-width="0.8"/>
  <polygon points="52,140 62,130 72,140 62,150" fill="#a855f7" opacity="0.3" stroke="#c084fc" stroke-width="0.5"/>
  <polygon points="72,138 82,128 92,138 82,148" fill="#a855f7" opacity="0.3" stroke="#c084fc" stroke-width="0.5"/>
  <polygon points="108,138 118,128 128,138 118,148" fill="#a855f7" opacity="0.3" stroke="#c084fc" stroke-width="0.5"/>
  <polygon points="128,140 138,130 148,140 138,150" fill="#a855f7" opacity="0.3" stroke="#c084fc" stroke-width="0.5"/>
  <!-- Holographic sheen lines -->
  <path d="M50 132 L65 120 L80 132 L95 120 L110 132 L125 120 L140 132 L155 120" stroke="#c084fc" stroke-width="0.8" fill="none" opacity="0.3"/>
  <!-- Neck - thick angular -->
  <path d="M75 105 Q68 85 62 70 Q58 82 55 68" stroke="#9333ea" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M75 105 Q68 85 62 70" stroke="#c084fc" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.3"/>
  <!-- Head - angular armored -->
  <path d="M38 65 L50 42 L62 38 L78 42 L88 55 L85 75 L78 82 L48 82 L38 75 Z" fill="#a855f7"/>
  <!-- Armored head crest -->
  <path d="M50 42 L55 28 L62 32 L62 38 Z" fill="#6b21a8" stroke="#c084fc" stroke-width="1"/>
  <path d="M62 38 L65 25 L72 30 L78 42 Z" fill="#6b21a8" stroke="#c084fc" stroke-width="1"/>
  <path d="M78 42 L82 32 L88 38 L88 55 Z" fill="#6b21a8" stroke="#c084fc" stroke-width="1"/>
  <!-- Head armor plate center -->
  <path d="M52 48 L63 40 L76 48 L72 60 L56 60 Z" fill="#9333ea" stroke="#c084fc" stroke-width="0.8"/>
  <!-- Eyes - glowing purple slits -->
  <path d="M48 60 L60 56 L60 68 Z" fill="#0d0016"/>
  <path d="M50 61 L58 58 L58 66 Z" fill="url(#sn_eye)"/>
  <line x1="52" y1="62" x2="57" y2="62" stroke="#c084fc" stroke-width="2" filter="url(#sn_glow)"/>
  <circle cx="55" cy="62" r="1" fill="#fffbeb" opacity="0.9"/>
  <path d="M78 60 L66 56 L66 68 Z" fill="#0d0016"/>
  <path d="M76 61 L68 58 L68 66 Z" fill="url(#sn_eye)"/>
  <line x1="69" y1="62" x2="74" y2="62" stroke="#c084fc" stroke-width="2" filter="url(#sn_glow)"/>
  <circle cx="71" cy="62" r="1" fill="#fffbeb" opacity="0.9"/>
  <!-- Snout angular -->
  <path d="M48 72 L56 68 L70 68 L78 72 L70 78 L56 78 Z" fill="#9333ea"/>
  <!-- Fangs -->
  <line x1="54" y1="78" x2="52" y2="86" stroke="#fffbeb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="72" y1="78" x2="74" y2="86" stroke="#fffbeb" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Forked tongue -->
  <path d="M63 82 L63 96 M63 96 Q58 102 54 108 M63 96 Q68 102 72 108" stroke="#f43f5e" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Shadow energy wrapping body -->
  <path d="M45 145 Q38 135 42 125 Q48 118 55 122" stroke="#6b21a8" stroke-width="3" fill="none" opacity="0.4" filter="url(#sn_glow)"/>
  <path d="M155 145 Q162 135 158 125 Q152 118 145 122" stroke="#6b21a8" stroke-width="3" fill="none" opacity="0.4" filter="url(#sn_glow)"/>
  <!-- Tail tip armored -->
  <path d="M160 148 Q172 142 178 132 Q168 140 175 135 Q165 145 172 138 Q158 150 160 148" fill="#6b21a8"/>
  <polygon points="178,132 185,124 180,135" fill="#a855f7" opacity="0.6"/>
  <!-- Circuit data lines -->
  <path d="M55 90 L50 95 L44 92" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.5" filter="url(#sn_glow)"/>
  <path d="M80 90 L85 95 L90 92" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.5" filter="url(#sn_glow)"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     DINORAWR — Mech-Raptor
     Armored head crest/visor, powerful jaw with teeth,
     blade-like back ridges, cyber stripes
     ═══════════════════════════════════════════════ */
  dinosaur: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dn_armor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="dn_glow">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Tail - armored segmented -->
  <path d="M132 135 L148 128 L162 132 L175 125 L188 128 L185 138 L172 140 L158 138 L145 142 L132 140 Z" fill="#d97706"/>
  <path d="M148 128 L150 122 L158 125" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.6"/>
  <path d="M162 132 L165 126 L172 128" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.6"/>
  <polygon points="188,128 196,122 192,132" fill="#d97706"/>
  <!-- Body - muscular angular form -->
  <path d="M52 120 L70 105 L110 100 L135 105 L142 120 L138 158 L118 168 L72 168 L55 158 Z" fill="#f59e0b"/>
  <!-- Belly -->
  <path d="M68 148 L90 140 L115 140 L135 148 L120 162 L78 162 Z" fill="#fef3c7" opacity="0.6"/>
  <!-- Back blade ridges -->
  <polygon points="72,105 76,78 80,105" fill="#d97706" stroke="#fbbf24" stroke-width="1"/>
  <polygon points="84,100 90,70 96,100" fill="#d97706" stroke="#fbbf24" stroke-width="1"/>
  <polygon points="98,98 105,65 112,98" fill="#d97706" stroke="#fbbf24" stroke-width="1"/>
  <polygon points="114,100 120,72 126,100" fill="#d97706" stroke="#fbbf24" stroke-width="1"/>
  <!-- Blade ridge energy lines -->
  <line x1="76" y1="78" x2="76" y2="88" stroke="#fbbf24" stroke-width="1.5" filter="url(#dn_glow)" opacity="0.8"/>
  <line x1="90" y1="70" x2="90" y2="82" stroke="#fbbf24" stroke-width="1.5" filter="url(#dn_glow)" opacity="0.9"/>
  <line x1="105" y1="65" x2="105" y2="78" stroke="#fbbf24" stroke-width="2" filter="url(#dn_glow)" opacity="0.9"/>
  <line x1="120" y1="72" x2="120" y2="84" stroke="#fbbf24" stroke-width="1.5" filter="url(#dn_glow)" opacity="0.8"/>
  <!-- Cyber stripes on body -->
  <path d="M75 125 L85 118 L78 128 L88 122" stroke="#fbbf24" stroke-width="1.5" fill="none" opacity="0.5"/>
  <path d="M115 125 L125 118 L118 128 L128 122" stroke="#fbbf24" stroke-width="1.5" fill="none" opacity="0.5"/>
  <path d="M90 150 L100 145 L110 150" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.4"/>
  <!-- Neck thick -->
  <path d="M52 120 L40 100 L32 82 L42 78 L58 95 Z" fill="#f59e0b"/>
  <!-- Head - angular with visor -->
  <path d="M20 72 L10 60 L18 48 L35 42 L52 48 L55 62 L50 78 L35 85 L22 82 Z" fill="#fbbf24"/>
  <!-- Armored head crest / visor -->
  <path d="M18 48 L22 35 L35 30 L48 35 L52 48 L42 52 L28 52 Z" fill="url(#dn_armor)" stroke="#fbbf24" stroke-width="1"/>
  <path d="M25 38 L35 33 L45 38 L42 46 L28 46 Z" fill="#fffbeb" opacity="0.15"/>
  <!-- Visor stripe -->
  <path d="M22 55 L52 55" stroke="#d97706" stroke-width="4" fill="none"/>
  <path d="M24 55 L50 55" stroke="#fef3c7" stroke-width="1.5" fill="none" opacity="0.4"/>
  <!-- Eye through visor - glowing -->
  <path d="M32 58 L46 54 L46 62 Z" fill="#0d0a00"/>
  <path d="M35 58 L44 55 L44 61 Z" fill="#d97706"/>
  <line x1="37" y1="58" x2="42" y2="58" stroke="#fffbeb" stroke-width="2" filter="url(#dn_glow)"/>
  <!-- Jaw - powerful with teeth -->
  <path d="M10 60 L20 72 L35 78 L50 72 L55 62 L48 68 L35 72 L22 68 Z" fill="#d97706"/>
  <path d="M12 65 L20 72 L32 75 L22 70 Z" fill="#f59e0b"/>
  <!-- Teeth -->
  <line x1="15" y1="66" x2="13" y2="73" stroke="#fffbeb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="22" y1="68" x2="21" y2="76" stroke="#fffbeb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="29" y1="70" x2="29" y2="78" stroke="#fffbeb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="36" y1="72" x2="37" y2="80" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="42" y1="70" x2="44" y2="78" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="48" y1="68" x2="50" y2="75" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <!-- Arms - small but clawed -->
  <path d="M55 130 L62 125 L68 132 L62 138 Z" fill="#d97706"/>
  <line x1="68" y1="130" x2="72" y2="126" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  <line x1="68" y1="134" x2="73" y2="132" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  <!-- Legs - powerful -->
  <path d="M70 160 L60 175 L52 182 L58 188 L68 186 L78 178 L80 168 Z" fill="#d97706"/>
  <path d="M118 162 L112 175 L105 184 L112 190 L122 188 L130 178 L128 168 Z" fill="#d97706"/>
  <!-- Leg armor -->
  <path d="M62 172 L68 168 L74 172 L68 176 Z" fill="#f59e0b" stroke="#fbbf24" stroke-width="0.5"/>
  <path d="M114 174 L120 170 L126 174 L120 178 Z" fill="#f59e0b" stroke="#fbbf24" stroke-width="0.5"/>
  <!-- Claws -->
  <line x1="54" y1="182" x2="48" y2="194" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="60" y1="186" x2="56" y2="196" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="66" y1="186" x2="64" y2="196" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="108" y1="184" x2="103" y2="195" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="115" y1="188" x2="112" y2="198" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="120" y1="186" x2="118" y2="196" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     GORROX — Cyber-Ape with Tech Gauntlets
     Massive tech gauntlets, chest plate with energy core,
     armored shoulders, heavy muscular build
     ═══════════════════════════════════════════════ */
  gorilla: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="go_armor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6b7280"/>
      <stop offset="100%" stop-color="#374151"/>
    </linearGradient>
    <radialGradient id="go_core" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="40%" stop-color="#9ca3af"/>
      <stop offset="100%" stop-color="#374151"/>
    </radialGradient>
    <filter id="go_glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Body - massive heavy build -->
  <path d="M55 100 L50 115 L48 145 L55 170 L80 180 L120 180 L145 170 L152 145 L150 115 L145 100 Z" fill="#4b5563"/>
  <!-- Chest plate armor -->
  <path d="M68 105 L100 98 L132 105 L135 130 L100 142 L65 130 Z" fill="url(#go_armor)" stroke="#9ca3af" stroke-width="1.5"/>
  <path d="M78 110 L100 104 L122 110 L120 128 L100 135 L80 128 Z" fill="#374151" stroke="#6b7280" stroke-width="0.8"/>
  <!-- Energy core in chest -->
  <circle cx="100" cy="120" r="8" fill="url(#go_core)" filter="url(#go_glow)"/>
  <circle cx="100" cy="120" r="4" fill="#9ca3af" opacity="0.9"/>
  <circle cx="100" cy="120" r="2" fill="#fffbeb" opacity="0.7"/>
  <!-- Chest circuit lines -->
  <path d="M92 120 L78 118 L72 125" stroke="#9ca3af" stroke-width="1" fill="none" opacity="0.6" filter="url(#go_glow)"/>
  <path d="M108 120 L122 118 L128 125" stroke="#9ca3af" stroke-width="1" fill="none" opacity="0.6" filter="url(#go_glow)"/>
  <!-- Shoulder armor - left -->
  <path d="M48 105 L35 95 L30 108 L38 120 L50 118 Z" fill="url(#go_armor)" stroke="#9ca3af" stroke-width="1"/>
  <path d="M38 102 L42 98 L48 102 L44 108 Z" fill="#6b7280" opacity="0.5"/>
  <line x1="36" y1="105" x2="32" y2="112" stroke="#9ca3af" stroke-width="1" opacity="0.5" filter="url(#go_glow)"/>
  <!-- Shoulder armor - right -->
  <path d="M152 105 L165 95 L170 108 L162 120 L150 118 Z" fill="url(#go_armor)" stroke="#9ca3af" stroke-width="1"/>
  <path d="M162 102 L158 98 L152 102 L156 108 Z" fill="#6b7280" opacity="0.5"/>
  <line x1="164" y1="105" x2="168" y2="112" stroke="#9ca3af" stroke-width="1" opacity="0.5" filter="url(#go_glow)"/>
  <!-- Head - angular heavy -->
  <path d="M65 85 L72 55 L88 42 L112 42 L128 55 L135 85 L125 98 L75 98 Z" fill="#374151"/>
  <!-- Brow ridge - heavy -->
  <path d="M68 68 L78 58 L122 58 L132 68 L128 75 L72 75 Z" fill="#1f2937"/>
  <!-- Face muzzle area -->
  <path d="M78 75 L90 72 L110 72 L122 75 L118 95 L82 95 Z" fill="#4b5563"/>
  <!-- Eye left - intense narrow -->
  <path d="M80 68 L92 64 L92 72 Z" fill="#0d0d0d"/>
  <line x1="83" y1="68" x2="90" y2="68" stroke="#9ca3af" stroke-width="2.5" filter="url(#go_glow)"/>
  <circle cx="87" cy="68" r="1.2" fill="#fffbeb"/>
  <!-- Eye right - intense narrow -->
  <path d="M120 68 L108 64 L108 72 Z" fill="#0d0d0d"/>
  <line x1="110" y1="68" x2="117" y2="68" stroke="#9ca3af" stroke-width="2.5" filter="url(#go_glow)"/>
  <circle cx="113" cy="68" r="1.2" fill="#fffbeb"/>
  <!-- Nose -->
  <path d="M94 82 L100 78 L106 82 L104 88 L96 88 Z" fill="#1f2937"/>
  <circle cx="96" cy="85" r="2" fill="#111827"/>
  <circle cx="104" cy="85" r="2" fill="#111827"/>
  <!-- Mouth - grim -->
  <path d="M88 92 L96 90 L100 93 L104 90 L112 92" stroke="#1f2937" stroke-width="2" fill="none"/>
  <!-- Head armor details -->
  <path d="M72 55 L80 48 L88 52" stroke="#6b7280" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M128 55 L120 48 L112 52" stroke="#6b7280" stroke-width="1" fill="none" opacity="0.5"/>
  <!-- Left arm - massive with tech gauntlet -->
  <path d="M35 118 L28 135 L22 150 L18 165 L25 175 L45 178 L52 168 L48 145 Z" fill="#374151"/>
  <!-- Left gauntlet -->
  <path d="M18 158 L12 162 L10 175 L18 185 L35 188 L48 182 L52 170 L45 162 Z" fill="url(#go_armor)" stroke="#9ca3af" stroke-width="1.5"/>
  <path d="M15 168 L22 165 L38 165 L45 168 L42 178 L35 182 L22 182 L15 178 Z" fill="#374151"/>
  <!-- Gauntlet knuckle plates left -->
  <path d="M16 175 L22 172 L28 175 L22 178 Z" fill="#6b7280" stroke="#9ca3af" stroke-width="0.5"/>
  <path d="M28 175 L35 172 L42 175 L35 178 Z" fill="#6b7280" stroke="#9ca3af" stroke-width="0.5"/>
  <!-- Gauntlet energy lines left -->
  <line x1="14" y1="170" x2="14" y2="178" stroke="#9ca3af" stroke-width="1.5" filter="url(#go_glow)" opacity="0.7"/>
  <line x1="46" y1="170" x2="46" y2="178" stroke="#9ca3af" stroke-width="1.5" filter="url(#go_glow)" opacity="0.7"/>
  <!-- Right arm - massive with tech gauntlet -->
  <path d="M165 118 L172 135 L178 150 L182 165 L175 175 L155 178 L148 168 L152 145 Z" fill="#374151"/>
  <!-- Right gauntlet -->
  <path d="M182 158 L188 162 L190 175 L182 185 L165 188 L152 182 L148 170 L155 162 Z" fill="url(#go_armor)" stroke="#9ca3af" stroke-width="1.5"/>
  <path d="M185 168 L178 165 L162 165 L155 168 L158 178 L165 182 L178 182 L185 178 Z" fill="#374151"/>
  <!-- Gauntlet knuckle plates right -->
  <path d="M158 175 L165 172 L172 175 L165 178 Z" fill="#6b7280" stroke="#9ca3af" stroke-width="0.5"/>
  <path d="M172 175 L178 172 L184 175 L178 178 Z" fill="#6b7280" stroke="#9ca3af" stroke-width="0.5"/>
  <!-- Gauntlet energy lines right -->
  <line x1="154" y1="170" x2="154" y2="178" stroke="#9ca3af" stroke-width="1.5" filter="url(#go_glow)" opacity="0.7"/>
  <line x1="186" y1="170" x2="186" y2="178" stroke="#9ca3af" stroke-width="1.5" filter="url(#go_glow)" opacity="0.7"/>
  <!-- Legs -->
  <path d="M72 170 L65 185 L70 194 L85 194 L90 185 Z" fill="#374151"/>
  <path d="M128 170 L122 185 L118 194 L132 194 L138 185 Z" fill="#374151"/>
  <!-- Body circuit accents -->
  <path d="M60 145 L55 150 L58 158" stroke="#9ca3af" stroke-width="1" fill="none" opacity="0.4" filter="url(#go_glow)"/>
  <path d="M140 145 L145 150 L142 158" stroke="#9ca3af" stroke-width="1" fill="none" opacity="0.4" filter="url(#go_glow)"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     BRUINAX — Crystal-Armored Bear
     Crystal-infused fur, shoulder armor, massive
     reinforced paws, rock patterns on hide
     ═══════════════════════════════════════════════ */
  bear: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="br_armor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <filter id="br_glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="br_crystal" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#d97706"/>
    </radialGradient>
  </defs>
  <!-- Body - massive heavy form -->
  <path d="M50 105 L45 130 L42 158 L50 178 L80 190 L120 190 L150 178 L158 158 L155 130 L150 105 Z" fill="#92400e"/>
  <!-- Rock pattern on hide -->
  <path d="M60 130 L70 125 L80 130 L70 135 Z" fill="#a16207" opacity="0.5" stroke="#92400e" stroke-width="0.5"/>
  <path d="M80 140 L90 135 L100 140 L90 145 Z" fill="#a16207" opacity="0.5" stroke="#92400e" stroke-width="0.5"/>
  <path d="M110 135 L120 130 L130 135 L120 140 Z" fill="#a16207" opacity="0.5" stroke="#92400e" stroke-width="0.5"/>
  <path d="M70 150 L80 145 L90 150 L80 155 Z" fill="#a16207" opacity="0.4" stroke="#92400e" stroke-width="0.5"/>
  <path d="M105 148 L115 143 L125 148 L115 153 Z" fill="#a16207" opacity="0.4" stroke="#92400e" stroke-width="0.5"/>
  <path d="M130 145 L140 140 L148 145 L140 150 Z" fill="#a16207" opacity="0.4" stroke="#92400e" stroke-width="0.5"/>
  <!-- Belly -->
  <path d="M72 155 L90 148 L110 148 L128 155 L118 175 L82 175 Z" fill="#fef3c7" opacity="0.5"/>
  <!-- Crystal formations on back -->
  <polygon points="70,108 76,85 82,108" fill="url(#br_crystal)" stroke="#d97706" stroke-width="1" opacity="0.9"/>
  <polygon points="88,102 96,75 104,102" fill="url(#br_crystal)" stroke="#d97706" stroke-width="1" opacity="0.9"/>
  <polygon points="108,105 115,80 122,105" fill="url(#br_crystal)" stroke="#d97706" stroke-width="1" opacity="0.9"/>
  <polygon points="128,110 134,88 140,110" fill="url(#br_crystal)" stroke="#d97706" stroke-width="1" opacity="0.85"/>
  <!-- Crystal glow lines -->
  <line x1="76" y1="85" x2="76" y2="94" stroke="#fef3c7" stroke-width="1.5" filter="url(#br_glow)" opacity="0.7"/>
  <line x1="96" y1="75" x2="96" y2="86" stroke="#fef3c7" stroke-width="2" filter="url(#br_glow)" opacity="0.8"/>
  <line x1="115" y1="80" x2="115" y2="90" stroke="#fef3c7" stroke-width="1.5" filter="url(#br_glow)" opacity="0.7"/>
  <line x1="134" y1="88" x2="134" y2="96" stroke="#fef3c7" stroke-width="1.5" filter="url(#br_glow)" opacity="0.6"/>
  <!-- Shoulder armor - left -->
  <path d="M42 110 L30 100 L25 112 L32 125 L45 122 Z" fill="url(#br_armor)" stroke="#d97706" stroke-width="1"/>
  <path d="M32 108 L38 104 L44 108 L40 115 Z" fill="#a16207" opacity="0.4"/>
  <!-- Shoulder armor - right -->
  <path d="M158 110 L170 100 L175 112 L168 125 L155 122 Z" fill="url(#br_armor)" stroke="#d97706" stroke-width="1"/>
  <path d="M168 108 L162 104 L156 108 L160 115 Z" fill="#a16207" opacity="0.4"/>
  <!-- Head - angular heavy -->
  <path d="M62 88 L70 58 L86 45 L114 45 L130 58 L138 88 L128 100 L72 100 Z" fill="#a16207"/>
  <!-- Forehead armor -->
  <path d="M75 55 L100 46 L125 55 L120 68 L80 68 Z" fill="url(#br_armor)" stroke="#d97706" stroke-width="0.8"/>
  <!-- Muzzle - heavy angular -->
  <path d="M80 75 L92 70 L108 70 L120 75 L118 92 L82 92 Z" fill="#d97706"/>
  <!-- Angular ear left -->
  <polygon points="66,52 55,28 78,48" fill="#92400e" stroke="#d97706" stroke-width="1"/>
  <polygon points="68,50 60,34 76,48" fill="#a16207"/>
  <!-- Angular ear right -->
  <polygon points="134,52 145,28 122,48" fill="#92400e" stroke="#d97706" stroke-width="1"/>
  <polygon points="132,50 140,34 124,48" fill="#a16207"/>
  <!-- Eyes - fierce narrow -->
  <path d="M78 68 L92 64 L92 74 Z" fill="#0d0600"/>
  <line x1="81" y1="69" x2="90" y2="69" stroke="#d97706" stroke-width="2.5" filter="url(#br_glow)"/>
  <circle cx="86" cy="69" r="1.2" fill="#fffbeb"/>
  <path d="M122 68 L108 64 L108 74 Z" fill="#0d0600"/>
  <line x1="110" y1="69" x2="119" y2="69" stroke="#d97706" stroke-width="2.5" filter="url(#br_glow)"/>
  <circle cx="114" cy="69" r="1.2" fill="#fffbeb"/>
  <!-- Nose -->
  <polygon points="96,82 100,78 104,82 102,87 98,87" fill="#451a03"/>
  <!-- Mouth -->
  <path d="M90 90 L96 88 L100 92 L104 88 L110 90" stroke="#451a03" stroke-width="1.5" fill="none"/>
  <!-- Fangs -->
  <line x1="94" y1="89" x2="92" y2="95" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="106" y1="89" x2="108" y2="95" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <!-- Left paw - massive reinforced -->
  <path d="M30 125 L22 148 L18 165 L22 178 L38 185 L55 182 L58 168 L52 145 Z" fill="#92400e"/>
  <path d="M18 170 L15 175 L20 185 L35 190 L50 186 L55 178 L48 172 Z" fill="#a16207" stroke="#d97706" stroke-width="1"/>
  <!-- Reinforced claws left -->
  <line x1="20" y1="182" x2="14" y2="195" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <line x1="30" y1="186" x2="26" y2="198" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <line x1="40" y1="186" x2="38" y2="198" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <line x1="48" y1="184" x2="48" y2="196" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <!-- Right paw - massive reinforced -->
  <path d="M170 125 L178 148 L182 165 L178 178 L162 185 L145 182 L142 168 L148 145 Z" fill="#92400e"/>
  <path d="M182 170 L185 175 L180 185 L165 190 L150 186 L145 178 L152 172 Z" fill="#a16207" stroke="#d97706" stroke-width="1"/>
  <!-- Reinforced claws right -->
  <line x1="152" y1="184" x2="152" y2="196" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <line x1="160" y1="186" x2="162" y2="198" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <line x1="170" y1="186" x2="174" y2="198" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <line x1="180" y1="182" x2="186" y2="195" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     NOCTURNIS — Digi-Bat
     Circuit-veined wing membranes, sharp angular ears,
     sleek dark body with energy lines, fangs
     ═══════════════════════════════════════════════ */
  bat: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bt_wing" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7e22ce"/>
      <stop offset="100%" stop-color="#581c87"/>
    </linearGradient>
    <filter id="bt_glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Wing left - angular bat wing with sharp points -->
  <path d="M72 85 Q55 60 25 52 L15 68 Q20 82 8 95 L12 108 Q25 100 18 118 L28 125 Q40 108 48 120 L60 112 Z" fill="url(#bt_wing)" stroke="#581c87" stroke-width="1"/>
  <!-- Wing bone struts left -->
  <line x1="72" y1="85" x2="25" y2="52" stroke="#3b0764" stroke-width="2.5"/>
  <line x1="68" y1="92" x2="8" y2="95" stroke="#3b0764" stroke-width="2"/>
  <line x1="64" y1="100" x2="18" y2="118" stroke="#3b0764" stroke-width="2"/>
  <line x1="60" y1="108" x2="28" y2="125" stroke="#3b0764" stroke-width="1.5"/>
  <!-- Circuit veins on left wing membrane -->
  <path d="M50 62 L48 72 L42 68 L38 78 L32 75" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.6" filter="url(#bt_glow)"/>
  <path d="M35 85 L30 92 L22 88 L18 98" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.5" filter="url(#bt_glow)"/>
  <path d="M48 98 L42 105 L35 102 L30 112" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.5" filter="url(#bt_glow)"/>
  <!-- Wing right - angular bat wing -->
  <path d="M128 85 Q145 60 175 52 L185 68 Q180 82 192 95 L188 108 Q175 100 182 118 L172 125 Q160 108 152 120 L140 112 Z" fill="url(#bt_wing)" stroke="#581c87" stroke-width="1"/>
  <!-- Wing bone struts right -->
  <line x1="128" y1="85" x2="175" y2="52" stroke="#3b0764" stroke-width="2.5"/>
  <line x1="132" y1="92" x2="192" y2="95" stroke="#3b0764" stroke-width="2"/>
  <line x1="136" y1="100" x2="182" y2="118" stroke="#3b0764" stroke-width="2"/>
  <line x1="140" y1="108" x2="172" y2="125" stroke="#3b0764" stroke-width="1.5"/>
  <!-- Circuit veins on right wing membrane -->
  <path d="M150 62 L152 72 L158 68 L162 78 L168 75" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.6" filter="url(#bt_glow)"/>
  <path d="M165 85 L170 92 L178 88 L182 98" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.5" filter="url(#bt_glow)"/>
  <path d="M152 98 L158 105 L165 102 L170 112" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.5" filter="url(#bt_glow)"/>
  <!-- Body - sleek angular -->
  <path d="M80 95 L100 88 L120 95 L125 130 L115 155 L85 155 L75 130 Z" fill="#7e22ce"/>
  <!-- Body armor plates -->
  <path d="M88 105 L100 100 L112 105 L110 125 L100 130 L90 125 Z" fill="#581c87" stroke="#9333ea" stroke-width="0.8"/>
  <!-- Energy lines on body -->
  <path d="M85 115 L80 122 L82 130" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.5" filter="url(#bt_glow)"/>
  <path d="M115 115 L120 122 L118 130" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.5" filter="url(#bt_glow)"/>
  <path d="M95 130 L100 138 L105 130" stroke="#c084fc" stroke-width="1" fill="none" opacity="0.4" filter="url(#bt_glow)"/>
  <!-- Head - angular sleek -->
  <path d="M72 75 L82 52 L100 45 L118 52 L128 75 L122 92 L78 92 Z" fill="#9333ea"/>
  <!-- Head armor ridge -->
  <path d="M85 55 L100 48 L115 55 L112 65 L88 65 Z" fill="#581c87" stroke="#c084fc" stroke-width="0.8"/>
  <!-- Sharp angular ears -->
  <polygon points="72,58 58,15 82,52" fill="#7e22ce" stroke="#9333ea" stroke-width="1"/>
  <polygon points="74,55 62,22 80,52" fill="#581c87"/>
  <line x1="68" y1="35" x2="70" y2="48" stroke="#c084fc" stroke-width="1" filter="url(#bt_glow)" opacity="0.6"/>
  <polygon points="128,58 142,15 118,52" fill="#7e22ce" stroke="#9333ea" stroke-width="1"/>
  <polygon points="126,55 138,22 120,52" fill="#581c87"/>
  <line x1="132" y1="35" x2="130" y2="48" stroke="#c084fc" stroke-width="1" filter="url(#bt_glow)" opacity="0.6"/>
  <!-- Eyes - glowing intense -->
  <path d="M82 72 L94 68 L94 78 Z" fill="#0d001a"/>
  <path d="M84 72 L92 69 L92 76 Z" fill="#7e22ce"/>
  <line x1="86" y1="73" x2="91" y2="73" stroke="#c084fc" stroke-width="2" filter="url(#bt_glow)"/>
  <circle cx="89" cy="73" r="1" fill="#fffbeb"/>
  <path d="M118 72 L106 68 L106 78 Z" fill="#0d001a"/>
  <path d="M116 72 L108 69 L108 76 Z" fill="#7e22ce"/>
  <line x1="109" y1="73" x2="114" y2="73" stroke="#c084fc" stroke-width="2" filter="url(#bt_glow)"/>
  <circle cx="111" cy="73" r="1" fill="#fffbeb"/>
  <!-- Nose -->
  <polygon points="97,82 103,82 100,86" fill="#3b0764"/>
  <!-- Mouth with fangs -->
  <path d="M90 88 L96 86 L100 89 L104 86 L110 88" stroke="#3b0764" stroke-width="1.5" fill="none"/>
  <line x1="94" y1="87" x2="92" y2="96" stroke="#fffbeb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="106" y1="87" x2="108" y2="96" stroke="#fffbeb" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Feet - clawed -->
  <path d="M85 152 L78 165 L74 172 L80 175 L88 170 Z" fill="#581c87"/>
  <line x1="76" y1="170" x2="72" y2="180" stroke="#c084fc" stroke-width="2" stroke-linecap="round"/>
  <line x1="80" y1="172" x2="78" y2="182" stroke="#c084fc" stroke-width="2" stroke-linecap="round"/>
  <path d="M115 152 L122 165 L126 172 L120 175 L112 170 Z" fill="#581c87"/>
  <line x1="124" y1="170" x2="128" y2="180" stroke="#c084fc" stroke-width="2" stroke-linecap="round"/>
  <line x1="120" y1="172" x2="122" y2="182" stroke="#c084fc" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     STORMTALON — Storm-Hawk
     Razor energy feathers, armored talons with lightning,
     angular head with visor stripe, wing patterns
     ═══════════════════════════════════════════════ */
  eagle: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="eg_wing" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <filter id="eg_glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Wing left spread - angular razor feathers -->
  <path d="M72 95 Q50 68 18 62 L8 78 Q15 92 5 105 L12 118 Q28 105 22 122 L35 128 Q48 112 55 125 L65 115 Z" fill="url(#eg_wing)"/>
  <!-- Razor feather tips left -->
  <polygon points="18,62 8,55 10,68" fill="#0284c7"/>
  <polygon points="5,105 -2,98 4,112" fill="#0284c7"/>
  <polygon points="22,122 14,118 18,128" fill="#0284c7"/>
  <!-- Wing energy patterns left -->
  <line x1="70" y1="95" x2="18" y2="62" stroke="#bae6fd" stroke-width="2" opacity="0.5"/>
  <line x1="65" y1="105" x2="5" y2="105" stroke="#bae6fd" stroke-width="1.5" opacity="0.4"/>
  <line x1="62" y1="112" x2="22" y2="122" stroke="#bae6fd" stroke-width="1.5" opacity="0.4"/>
  <path d="M40 72 L38 80 L32 76 L28 85" stroke="#bae6fd" stroke-width="1" fill="none" opacity="0.5" filter="url(#eg_glow)"/>
  <path d="M25 95 L22 102 L15 98" stroke="#bae6fd" stroke-width="1" fill="none" opacity="0.4" filter="url(#eg_glow)"/>
  <!-- Wing right spread - angular razor feathers -->
  <path d="M128 95 Q150 68 182 62 L192 78 Q185 92 195 105 L188 118 Q172 105 178 122 L165 128 Q152 112 145 125 L135 115 Z" fill="url(#eg_wing)"/>
  <!-- Razor feather tips right -->
  <polygon points="182,62 192,55 190,68" fill="#0284c7"/>
  <polygon points="195,105 202,98 196,112" fill="#0284c7"/>
  <polygon points="178,122 186,118 182,128" fill="#0284c7"/>
  <!-- Wing energy patterns right -->
  <line x1="130" y1="95" x2="182" y2="62" stroke="#bae6fd" stroke-width="2" opacity="0.5"/>
  <line x1="135" y1="105" x2="195" y2="105" stroke="#bae6fd" stroke-width="1.5" opacity="0.4"/>
  <line x1="138" y1="112" x2="178" y2="122" stroke="#bae6fd" stroke-width="1.5" opacity="0.4"/>
  <path d="M160 72 L162 80 L168 76 L172 85" stroke="#bae6fd" stroke-width="1" fill="none" opacity="0.5" filter="url(#eg_glow)"/>
  <path d="M175 95 L178 102 L185 98" stroke="#bae6fd" stroke-width="1" fill="none" opacity="0.4" filter="url(#eg_glow)"/>
  <!-- Body - angular streamlined -->
  <path d="M78 100 L100 92 L122 100 L125 135 L115 158 L85 158 L75 135 Z" fill="#0284c7"/>
  <!-- Breast plate -->
  <path d="M85 110 L100 105 L115 110 L112 135 L100 142 L88 135 Z" fill="#bae6fd" opacity="0.3"/>
  <!-- Head - angular hawk shape -->
  <path d="M72 82 L82 55 L95 45 L105 45 L118 55 L128 82 L122 95 L78 95 Z" fill="#bae6fd"/>
  <!-- Head armor crest -->
  <path d="M85 50 L100 42 L115 50 L112 62 L88 62 Z" fill="#0284c7" stroke="#0ea5e9" stroke-width="0.8"/>
  <polygon points="95,42 100,32 105,42" fill="#0ea5e9" opacity="0.6"/>
  <!-- Visor stripe - across eyes -->
  <path d="M74 75 L126 75" stroke="#0c4a6e" stroke-width="7" fill="none"/>
  <path d="M76 75 L124 75" stroke="#0284c7" stroke-width="3" fill="none" opacity="0.5"/>
  <!-- Eyes through visor - intense -->
  <path d="M82 74 L92 70 L92 80 Z" fill="#0c0c0c"/>
  <line x1="84" y1="75" x2="90" y2="75" stroke="#bae6fd" stroke-width="2.5" filter="url(#eg_glow)"/>
  <circle cx="88" cy="75" r="1" fill="#fffbeb"/>
  <path d="M118 74 L108 70 L108 80 Z" fill="#0c0c0c"/>
  <line x1="110" y1="75" x2="116" y2="75" stroke="#bae6fd" stroke-width="2.5" filter="url(#eg_glow)"/>
  <circle cx="112" cy="75" r="1" fill="#fffbeb"/>
  <!-- Beak - sharp angular -->
  <path d="M92 85 L100 82 L108 85 L100 102 Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
  <path d="M92 85 L108 85 L100 90 Z" fill="#f59e0b"/>
  <!-- Armored talons left with lightning marks -->
  <path d="M78 155 L68 170 L62 180 L70 185 L82 178 Z" fill="#0284c7" stroke="#0ea5e9" stroke-width="1"/>
  <line x1="64" y1="178" x2="58" y2="192" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="70" y1="182" x2="66" y2="195" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="76" y1="180" x2="74" y2="192" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Lightning mark on left talon -->
  <path d="M72 168 L68 174 L74 172 L70 178" stroke="#fde047" stroke-width="1.5" fill="none" filter="url(#eg_glow)"/>
  <!-- Armored talons right with lightning marks -->
  <path d="M122 155 L132 170 L138 180 L130 185 L118 178 Z" fill="#0284c7" stroke="#0ea5e9" stroke-width="1"/>
  <line x1="136" y1="178" x2="142" y2="192" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="130" y1="182" x2="134" y2="195" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="124" y1="180" x2="126" y2="192" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Lightning mark on right talon -->
  <path d="M128 168 L132 174 L126 172 L130 178" stroke="#fde047" stroke-width="1.5" fill="none" filter="url(#eg_glow)"/>
  <!-- Wind energy swirls -->
  <path d="M15 135 Q22 125 30 135 Q38 145 46 135" stroke="#7dd3fc" stroke-width="2" fill="none" opacity="0.4" filter="url(#eg_glow)"/>
  <path d="M155 135 Q162 125 170 135 Q178 145 186 135" stroke="#7dd3fc" stroke-width="2" fill="none" opacity="0.4" filter="url(#eg_glow)"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     HYPNOWL — Psychic Tech-Owl
     Massive spiral-energy eyes, data-feathered body,
     mystical aura circles, tech ear tufts
     ═══════════════════════════════════════════════ */
  owl: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ow_eye" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="50%" stop-color="#6d28d9"/>
      <stop offset="100%" stop-color="#581c87"/>
    </radialGradient>
    <filter id="ow_glow">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="ow_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7e22ce"/>
      <stop offset="100%" stop-color="#581c87"/>
    </linearGradient>
  </defs>
  <!-- Mystical aura circles -->
  <circle cx="100" cy="95" r="88" stroke="#a78bfa" stroke-width="1" fill="none" opacity="0.15" filter="url(#ow_glow)"/>
  <circle cx="100" cy="95" r="78" stroke="#7e22ce" stroke-width="1" fill="none" opacity="0.12" filter="url(#ow_glow)"/>
  <circle cx="100" cy="95" r="68" stroke="#a78bfa" stroke-width="0.8" fill="none" opacity="0.1"/>
  <!-- Body - angular data-feathered -->
  <path d="M58 110 L55 135 L52 160 L60 180 L85 192 L115 192 L140 180 L148 160 L145 135 L142 110 Z" fill="url(#ow_body)"/>
  <!-- Data feather pattern on body -->
  <path d="M68 125 L78 120 L88 125 L78 130 Z" fill="#6b21a8" stroke="#a78bfa" stroke-width="0.5" opacity="0.6"/>
  <path d="M88 125 L98 120 L108 125 L98 130 Z" fill="#6b21a8" stroke="#a78bfa" stroke-width="0.5" opacity="0.6"/>
  <path d="M108 125 L118 120 L128 125 L118 130 Z" fill="#6b21a8" stroke="#a78bfa" stroke-width="0.5" opacity="0.6"/>
  <path d="M62 140 L72 135 L82 140 L72 145 Z" fill="#6b21a8" stroke="#a78bfa" stroke-width="0.5" opacity="0.5"/>
  <path d="M82 140 L92 135 L102 140 L92 145 Z" fill="#6b21a8" stroke="#a78bfa" stroke-width="0.5" opacity="0.5"/>
  <path d="M102 140 L112 135 L122 140 L112 145 Z" fill="#6b21a8" stroke="#a78bfa" stroke-width="0.5" opacity="0.5"/>
  <path d="M122 140 L132 135 L142 140 L132 145 Z" fill="#6b21a8" stroke="#a78bfa" stroke-width="0.5" opacity="0.5"/>
  <!-- Belly panel -->
  <path d="M80 155 L95 148 L105 148 L120 155 L115 178 L85 178 Z" fill="#ede9fe" opacity="0.3"/>
  <!-- Wing hints left - angular -->
  <path d="M52 118 L40 125 L35 145 L38 160 L52 155 Z" fill="#6b21a8" stroke="#7e22ce" stroke-width="1"/>
  <path d="M42 132 L46 128 L50 135" stroke="#a78bfa" stroke-width="0.8" fill="none" opacity="0.4"/>
  <path d="M38 145 L44 140 L48 148" stroke="#a78bfa" stroke-width="0.8" fill="none" opacity="0.4"/>
  <!-- Wing hints right - angular -->
  <path d="M148 118 L160 125 L165 145 L162 160 L148 155 Z" fill="#6b21a8" stroke="#7e22ce" stroke-width="1"/>
  <path d="M158 132 L154 128 L150 135" stroke="#a78bfa" stroke-width="0.8" fill="none" opacity="0.4"/>
  <path d="M162 145 L156 140 L152 148" stroke="#a78bfa" stroke-width="0.8" fill="none" opacity="0.4"/>
  <!-- Head - large angular -->
  <path d="M58 85 L68 48 L88 35 L112 35 L132 48 L142 85 L135 105 L65 105 Z" fill="#7e22ce"/>
  <!-- Tech ear tufts - angular with circuits -->
  <polygon points="62,52 48,10 80,42" fill="#581c87" stroke="#7e22ce" stroke-width="1"/>
  <polygon points="64,48 52,18 78,42" fill="#6b21a8"/>
  <line x1="56" y1="28" x2="60" y2="40" stroke="#a78bfa" stroke-width="1.5" filter="url(#ow_glow)" opacity="0.7"/>
  <line x1="52" y1="22" x2="58" y2="32" stroke="#a78bfa" stroke-width="1" filter="url(#ow_glow)" opacity="0.5"/>
  <polygon points="138,52 152,10 120,42" fill="#581c87" stroke="#7e22ce" stroke-width="1"/>
  <polygon points="136,48 148,18 122,42" fill="#6b21a8"/>
  <line x1="144" y1="28" x2="140" y2="40" stroke="#a78bfa" stroke-width="1.5" filter="url(#ow_glow)" opacity="0.7"/>
  <line x1="148" y1="22" x2="142" y2="32" stroke="#a78bfa" stroke-width="1" filter="url(#ow_glow)" opacity="0.5"/>
  <!-- Facial disc - angular -->
  <path d="M68 60 L88 50 L112 50 L132 60 L135 90 L128 100 L72 100 L65 90 Z" fill="#ddd6fe" opacity="0.35"/>
  <!-- HUGE eye sockets - angular -->
  <path d="M70 72 L80 55 L98 55 L105 72 L98 92 L80 92 Z" fill="#0d001a"/>
  <path d="M130 72 L120 55 L102 55 L95 72 L102 92 L120 92 Z" fill="#0d001a"/>
  <!-- Spiral energy iris left -->
  <circle cx="88" cy="74" r="16" fill="url(#ow_eye)"/>
  <circle cx="88" cy="74" r="11" fill="#4c1d95"/>
  <circle cx="88" cy="74" r="7" fill="#6d28d9"/>
  <circle cx="88" cy="74" r="4" fill="#0d001a"/>
  <!-- Spiral energy line left -->
  <path d="M88 58 Q104 60 104 74 Q104 88 88 90 Q72 90 72 74 Q72 62 84 59" stroke="#a78bfa" stroke-width="1.5" fill="none" opacity="0.6" filter="url(#ow_glow)"/>
  <path d="M88 64 Q98 66 98 74 Q98 84 88 84 Q78 84 78 74 Q78 66 86 65" stroke="#c4b5fd" stroke-width="1" fill="none" opacity="0.4"/>
  <!-- Spiral energy iris right -->
  <circle cx="112" cy="74" r="16" fill="url(#ow_eye)"/>
  <circle cx="112" cy="74" r="11" fill="#4c1d95"/>
  <circle cx="112" cy="74" r="7" fill="#6d28d9"/>
  <circle cx="112" cy="74" r="4" fill="#0d001a"/>
  <!-- Spiral energy line right -->
  <path d="M112 58 Q128 60 128 74 Q128 88 112 90 Q96 90 96 74 Q96 62 108 59" stroke="#a78bfa" stroke-width="1.5" fill="none" opacity="0.6" filter="url(#ow_glow)"/>
  <path d="M112 64 Q122 66 122 74 Q122 84 112 84 Q102 84 102 74 Q102 66 110 65" stroke="#c4b5fd" stroke-width="1" fill="none" opacity="0.4"/>
  <!-- Eye highlights -->
  <circle cx="94" cy="68" r="4" fill="white" opacity="0.8"/>
  <circle cx="118" cy="68" r="4" fill="white" opacity="0.8"/>
  <circle cx="92" cy="66" r="1.5" fill="white" opacity="0.5"/>
  <circle cx="116" cy="66" r="1.5" fill="white" opacity="0.5"/>
  <!-- Beak - angular sharp -->
  <polygon points="96,94 100,90 104,94 100,105" fill="#fbbf24" stroke="#f59e0b" stroke-width="0.8"/>
  <path d="M96 94 L104 94 L100 98 Z" fill="#f59e0b"/>
  <!-- Feet - tech claws -->
  <path d="M82 188 L75 178 L72 185 L76 192" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M86 190 L82 180 L80 188" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M118 188 L125 178 L128 185 L124 192" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M114 190 L118 180 L120 188" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Psychic sparkle nodes -->
  <circle cx="38" cy="55" r="2.5" fill="#c4b5fd" opacity="0.7" filter="url(#ow_glow)"/>
  <circle cx="162" cy="55" r="2.5" fill="#c4b5fd" opacity="0.7" filter="url(#ow_glow)"/>
  <circle cx="32" cy="75" r="2" fill="#a78bfa" opacity="0.5" filter="url(#ow_glow)"/>
  <circle cx="168" cy="75" r="2" fill="#a78bfa" opacity="0.5" filter="url(#ow_glow)"/>
  <circle cx="42" cy="42" r="1.5" fill="#c4b5fd" opacity="0.4"/>
  <circle cx="158" cy="42" r="1.5" fill="#c4b5fd" opacity="0.4"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     TIDALREX — Aquatic Cyber-Dragon
     Bioluminescent circuit patterns, armored fin crests,
     serpentine body, whisker tendrils
     ═══════════════════════════════════════════════ */
  sea_dragon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sd_body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0891b2"/>
      <stop offset="100%" stop-color="#0e7490"/>
    </linearGradient>
    <filter id="sd_glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="sd_eye" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="100%" stop-color="#0e7490"/>
    </radialGradient>
  </defs>
  <!-- Tail - armored serpentine -->
  <path d="M128 152 L142 145 L158 148 L172 140 L184 144 L188 135 L180 148 L168 152 L155 155 L140 155 L128 158 Z" fill="#0e7490"/>
  <polygon points="188,135 196,128 192,140" fill="#0e7490"/>
  <!-- Tail bioluminescent nodes -->
  <circle cx="145" cy="148" r="2" fill="#67e8f9" opacity="0.7" filter="url(#sd_glow)"/>
  <circle cx="162" cy="145" r="2" fill="#67e8f9" opacity="0.6" filter="url(#sd_glow)"/>
  <circle cx="178" cy="140" r="1.5" fill="#67e8f9" opacity="0.5" filter="url(#sd_glow)"/>
  <!-- Tail fin -->
  <polygon points="188,135 196,125 198,138 196,148 190,142" fill="#22d3ee" opacity="0.7"/>
  <!-- Body - serpentine angular -->
  <path d="M45 140 Q50 112 68 100 Q92 85 118 100 Q138 112 140 140 L135 162 L120 168 L72 168 L55 162 Z" fill="url(#sd_body)"/>
  <!-- Armor scale segments -->
  <path d="M72 118 L82 112 L92 118 L82 124 Z" fill="#0e7490" stroke="#22d3ee" stroke-width="0.8" opacity="0.6"/>
  <path d="M92 115 L102 108 L112 115 L102 122 Z" fill="#0e7490" stroke="#22d3ee" stroke-width="0.8" opacity="0.6"/>
  <path d="M112 118 L122 112 L132 118 L122 124 Z" fill="#0e7490" stroke="#22d3ee" stroke-width="0.8" opacity="0.6"/>
  <path d="M78 132 L88 126 L98 132 L88 138 Z" fill="#0e7490" stroke="#22d3ee" stroke-width="0.5" opacity="0.5"/>
  <path d="M98 132 L108 126 L118 132 L108 138 Z" fill="#0e7490" stroke="#22d3ee" stroke-width="0.5" opacity="0.5"/>
  <!-- Bioluminescent circuit patterns on body -->
  <path d="M70 128 L78 122 L72 130 L80 125 L75 135" stroke="#67e8f9" stroke-width="1.5" fill="none" opacity="0.6" filter="url(#sd_glow)"/>
  <path d="M125 128 L118 122 L124 130 L116 125 L120 135" stroke="#67e8f9" stroke-width="1.5" fill="none" opacity="0.6" filter="url(#sd_glow)"/>
  <path d="M88 145 L95 140 L102 145 L95 150" stroke="#22d3ee" stroke-width="1" fill="none" opacity="0.4" filter="url(#sd_glow)"/>
  <!-- Belly scales -->
  <path d="M60 155 L90 148 L115 148 L135 155 L120 165 L75 165 Z" fill="#67e8f9" opacity="0.25"/>
  <!-- Armored fin crests on back -->
  <polygon points="72,100 68,78 78,98" fill="#22d3ee" stroke="#0891b2" stroke-width="1" opacity="0.9"/>
  <polygon points="84,94 82,68 92,92" fill="#22d3ee" stroke="#0891b2" stroke-width="1" opacity="0.9"/>
  <polygon points="98,90 98,62 106,88" fill="#22d3ee" stroke="#0891b2" stroke-width="1" opacity="0.95"/>
  <polygon points="112,94 114,68 120,92" fill="#22d3ee" stroke="#0891b2" stroke-width="1" opacity="0.9"/>
  <polygon points="124,100 128,78 132,98" fill="#22d3ee" stroke="#0891b2" stroke-width="1" opacity="0.85"/>
  <!-- Fin crest energy glow -->
  <line x1="68" y1="78" x2="68" y2="86" stroke="#67e8f9" stroke-width="1.5" filter="url(#sd_glow)" opacity="0.7"/>
  <line x1="82" y1="68" x2="82" y2="78" stroke="#67e8f9" stroke-width="1.5" filter="url(#sd_glow)" opacity="0.8"/>
  <line x1="98" y1="62" x2="98" y2="74" stroke="#67e8f9" stroke-width="2" filter="url(#sd_glow)" opacity="0.9"/>
  <line x1="114" y1="68" x2="114" y2="78" stroke="#67e8f9" stroke-width="1.5" filter="url(#sd_glow)" opacity="0.8"/>
  <line x1="128" y1="78" x2="128" y2="86" stroke="#67e8f9" stroke-width="1.5" filter="url(#sd_glow)" opacity="0.7"/>
  <!-- Neck - armored -->
  <path d="M50 135 L40 115 L32 95 L42 90 L55 108 Z" fill="url(#sd_body)"/>
  <path d="M42 108 L48 102 L52 110" stroke="#22d3ee" stroke-width="0.8" fill="none" opacity="0.4"/>
  <!-- Head - angular dragon shape -->
  <path d="M20 82 L10 65 L15 52 L28 45 L48 42 L58 50 L62 65 L58 82 L48 90 L30 92 Z" fill="#0ea5e9"/>
  <!-- Head armor plate -->
  <path d="M18 55 L28 45 L48 42 L55 52 L48 62 L25 62 Z" fill="#0e7490" stroke="#22d3ee" stroke-width="0.8"/>
  <path d="M28 48 L42 45 L50 50 L45 58 L30 58 Z" fill="#0891b2" opacity="0.4"/>
  <!-- Armored jaw -->
  <path d="M10 65 L20 82 L35 88 L50 82 L58 68 L48 75 L30 78 Z" fill="#0e7490"/>
  <!-- Crest fins on head -->
  <polygon points="32,45 26,28 40,42" fill="#22d3ee" opacity="0.9"/>
  <polygon points="45,42 42,22 52,40" fill="#22d3ee" opacity="0.9"/>
  <polygon points="55,48 58,30 60,46" fill="#22d3ee" opacity="0.8"/>
  <!-- Eye - intense with data glow -->
  <path d="M38 58 L52 54 L52 64 Z" fill="#001820"/>
  <path d="M40 58 L50 55 L50 62 Z" fill="url(#sd_eye)"/>
  <line x1="42" y1="59" x2="49" y2="59" stroke="#67e8f9" stroke-width="2" filter="url(#sd_glow)"/>
  <circle cx="46" cy="59" r="1" fill="#fffbeb"/>
  <!-- Nostrils -->
  <circle cx="14" cy="68" r="2" fill="#065f73"/>
  <circle cx="14" cy="74" r="2" fill="#065f73"/>
  <!-- Teeth -->
  <line x1="15" y1="72" x2="13" y2="79" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="22" y1="76" x2="21" y2="83" stroke="#fffbeb" stroke-width="2" stroke-linecap="round"/>
  <line x1="30" y1="78" x2="30" y2="86" stroke="#fffbeb" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Whisker tendrils - bioluminescent -->
  <path d="M12 62 Q2 56 -4 58" stroke="#67e8f9" stroke-width="2" fill="none" stroke-linecap="round" filter="url(#sd_glow)"/>
  <path d="M12 70 Q0 68 -6 72" stroke="#67e8f9" stroke-width="2" fill="none" stroke-linecap="round" filter="url(#sd_glow)"/>
  <path d="M12 78 Q2 80 -4 84" stroke="#22d3ee" stroke-width="1.5" fill="none" stroke-linecap="round" filter="url(#sd_glow)"/>
  <!-- Whisker tendril nodes -->
  <circle cx="-2" cy="58" r="2" fill="#67e8f9" opacity="0.7" filter="url(#sd_glow)"/>
  <circle cx="-4" cy="72" r="2" fill="#67e8f9" opacity="0.6" filter="url(#sd_glow)"/>
  <circle cx="-2" cy="84" r="1.5" fill="#22d3ee" opacity="0.5" filter="url(#sd_glow)"/>
  <!-- Clawed feet -->
  <path d="M68 162 L60 175 L55 182 L62 186 L72 180 Z" fill="#0e7490"/>
  <line x1="57" y1="180" x2="52" y2="192" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>
  <line x1="62" y1="183" x2="58" y2="194" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>
  <line x1="68" y1="182" x2="66" y2="193" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>
  <path d="M118 162 L125 175 L130 182 L122 186 L114 180 Z" fill="#0e7490"/>
  <line x1="128" y1="180" x2="133" y2="192" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>
  <line x1="122" y1="183" x2="126" y2="194" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>
  <line x1="118" y1="182" x2="118" y2="193" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>
  <!-- Water ripple effects -->
  <path d="M165 95 Q170 88 178 92 Q185 96 180 102" stroke="#67e8f9" stroke-width="1.5" fill="none" opacity="0.3" filter="url(#sd_glow)"/>
  <path d="M170 105 Q176 100 182 104" stroke="#67e8f9" stroke-width="1" fill="none" opacity="0.25"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     SHOCKTIDE — Electric Armored Shark
     Armor plating, lightning bolt patterns etched,
     electrified dorsal fin, sharp streamlined form
     ═══════════════════════════════════════════════ */
  storm_shark: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ss_body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <filter id="ss_glow">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="ss_armor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <!-- Electric aura -->
  <ellipse cx="95" cy="118" rx="75" ry="40" stroke="#fde047" stroke-width="1" fill="none" opacity="0.15" filter="url(#ss_glow)"/>
  <!-- Tail fin - angular armored -->
  <path d="M162 118 L180 95 L188 82 L184 98 L192 88 L186 105 L178 110 Z" fill="#1d4ed8"/>
  <path d="M162 118 L180 140 L188 155 L184 138 L192 148 L186 132 L178 126 Z" fill="#1d4ed8"/>
  <path d="M180 95 L182 90 L186 95" stroke="#fde047" stroke-width="1" fill="none" opacity="0.5" filter="url(#ss_glow)"/>
  <path d="M180 140 L182 146 L186 140" stroke="#fde047" stroke-width="1" fill="none" opacity="0.5" filter="url(#ss_glow)"/>
  <!-- Body - streamlined angular with armor plates -->
  <path d="M28 118 L40 95 L65 86 L120 82 L155 90 L170 105 L172 118 L170 132 L155 145 L120 152 L65 148 L40 140 Z" fill="url(#ss_body)"/>
  <!-- Armor plates on body -->
  <path d="M55 100 L75 95 L95 100 L75 105 Z" fill="#1d4ed8" stroke="#60a5fa" stroke-width="0.8" opacity="0.6"/>
  <path d="M85 96 L105 90 L125 96 L105 102 Z" fill="#1d4ed8" stroke="#60a5fa" stroke-width="0.8" opacity="0.6"/>
  <path d="M115 98 L135 92 L150 98 L135 104 Z" fill="#1d4ed8" stroke="#60a5fa" stroke-width="0.8" opacity="0.6"/>
  <path d="M55 132 L75 128 L95 132 L75 136 Z" fill="#1d4ed8" stroke="#60a5fa" stroke-width="0.8" opacity="0.5"/>
  <path d="M85 135 L105 130 L125 135 L105 140 Z" fill="#1d4ed8" stroke="#60a5fa" stroke-width="0.8" opacity="0.5"/>
  <!-- Lightning bolt patterns etched into body -->
  <path d="M60 106 L68 102 L62 112 L72 108 L66 118 L76 112" stroke="#fde047" stroke-width="2" fill="none" stroke-linejoin="round" filter="url(#ss_glow)"/>
  <path d="M88 100 L96 96 L90 108 L100 104 L94 114 L104 108" stroke="#fde047" stroke-width="2" fill="none" stroke-linejoin="round" filter="url(#ss_glow)"/>
  <path d="M118 102 L126 98 L120 110 L130 106 L124 116" stroke="#fde047" stroke-width="1.5" fill="none" stroke-linejoin="round" filter="url(#ss_glow)" opacity="0.8"/>
  <!-- Belly lighter armor -->
  <path d="M45 125 L70 120 L110 118 L145 120 L160 125 L145 138 L110 142 L70 140 Z" fill="#60a5fa" opacity="0.35"/>
  <path d="M55 128 L80 124 L110 122 L135 124 L150 128 L135 135 L110 138 L80 136 Z" fill="#bfdbfe" opacity="0.2"/>
  <!-- Electrified dorsal fin -->
  <path d="M100 86 Q108 52 115 42 Q110 62 120 48 Q106 72 118 56 Q104 82 100 86Z" fill="#1e40af"/>
  <!-- Dorsal armor plates -->
  <path d="M105 78 L110 65 L115 72 L112 80 Z" fill="#1d4ed8" stroke="#60a5fa" stroke-width="0.5"/>
  <!-- Lightning on dorsal -->
  <path d="M108 76 L112 62 L106 68 L114 50" stroke="#fde047" stroke-width="2" fill="none" stroke-linecap="round" filter="url(#ss_glow)"/>
  <path d="M112 54 L116 46 L110 50" stroke="#fde047" stroke-width="1.5" fill="none" filter="url(#ss_glow)" opacity="0.7"/>
  <!-- Pectoral fins - angular armored -->
  <path d="M48 112 L30 98 L18 102 Q28 110 20 114 Q32 108 48 118 Z" fill="#1d4ed8"/>
  <path d="M48 124 L30 136 L18 132 Q28 126 20 122 Q32 128 48 118 Z" fill="#1d4ed8"/>
  <path d="M30 102 L26 108 L22 104" stroke="#fde047" stroke-width="1" fill="none" opacity="0.4" filter="url(#ss_glow)"/>
  <!-- Head - angular predatory -->
  <path d="M28 118 L18 108 L8 112 Q14 118 8 124 L18 128 Z" fill="#2563eb"/>
  <!-- Snout armor -->
  <path d="M28 118 L14 112 L6 116 Q12 118 6 120 L14 124 Z" fill="#1d4ed8" stroke="#60a5fa" stroke-width="0.5"/>
  <!-- Eye - intense glowing -->
  <path d="M38 110 L50 106 L50 116 Z" fill="#0d0d1f"/>
  <line x1="40" y1="111" x2="48" y2="111" stroke="#60a5fa" stroke-width="2.5" filter="url(#ss_glow)"/>
  <circle cx="45" cy="111" r="1" fill="#fffbeb"/>
  <!-- Gills - armored slits -->
  <line x1="58" y1="104" x2="56" y2="115" stroke="#1e40af" stroke-width="3" stroke-linecap="round"/>
  <line x1="65" y1="102" x2="63" y2="113" stroke="#1e40af" stroke-width="3" stroke-linecap="round"/>
  <line x1="72" y1="100" x2="70" y2="112" stroke="#1e40af" stroke-width="3" stroke-linecap="round"/>
  <!-- Gill energy -->
  <line x1="58" y1="108" x2="56" y2="112" stroke="#60a5fa" stroke-width="1" opacity="0.5" filter="url(#ss_glow)"/>
  <line x1="65" y1="106" x2="63" y2="110" stroke="#60a5fa" stroke-width="1" opacity="0.5" filter="url(#ss_glow)"/>
  <!-- Spark dots -->
  <circle cx="25" cy="92" r="3" fill="#fde047" opacity="0.6" filter="url(#ss_glow)"/>
  <circle cx="150" cy="82" r="3" fill="#fde047" opacity="0.6" filter="url(#ss_glow)"/>
  <circle cx="172" cy="112" r="2" fill="#fde047" opacity="0.5" filter="url(#ss_glow)"/>
  <circle cx="35" cy="140" r="2.5" fill="#fde047" opacity="0.5" filter="url(#ss_glow)"/>
  <circle cx="140" cy="155" r="2" fill="#fde047" opacity="0.4" filter="url(#ss_glow)"/>
  <!-- Additional lightning arcs -->
  <path d="M22 95 L18 100 L24 98 L20 104" stroke="#fde047" stroke-width="1.5" fill="none" opacity="0.4" filter="url(#ss_glow)"/>
  <path d="M155 85 L160 88 L156 92 L162 90" stroke="#fde047" stroke-width="1.5" fill="none" opacity="0.4" filter="url(#ss_glow)"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     LUMILUX — Crystal Prismatic Jellyfish
     Prismatic crystal dome, data-stream tendrils,
     inner energy core visible, bioluminescent nodes
     ═══════════════════════════════════════════════ */
  jellyfish: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="jf_dome" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#f5d0fe"/>
      <stop offset="50%" stop-color="#e879f9"/>
      <stop offset="100%" stop-color="#c026d3"/>
    </radialGradient>
    <radialGradient id="jf_core" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="40%" stop-color="#f0abfc"/>
      <stop offset="100%" stop-color="#c026d3"/>
    </radialGradient>
    <filter id="jf_glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="jf_softglow">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Outer energy aura -->
  <ellipse cx="100" cy="72" rx="68" ry="56" fill="#f0abfc" opacity="0.12" filter="url(#jf_glow)"/>
  <!-- Main prismatic dome - crystalline faceted shape -->
  <path d="M38 92 L42 65 L55 42 L75 28 L100 22 L125 28 L145 42 L158 65 L162 92 L155 105 L45 105 Z" fill="url(#jf_dome)"/>
  <!-- Crystal facet lines on dome -->
  <path d="M100 22 L100 105" stroke="#f5d0fe" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M75 28 L85 105" stroke="#f5d0fe" stroke-width="1" fill="none" opacity="0.3"/>
  <path d="M125 28 L115 105" stroke="#f5d0fe" stroke-width="1" fill="none" opacity="0.3"/>
  <path d="M55 42 L68 105" stroke="#f5d0fe" stroke-width="0.8" fill="none" opacity="0.25"/>
  <path d="M145 42 L132 105" stroke="#f5d0fe" stroke-width="0.8" fill="none" opacity="0.25"/>
  <path d="M42 65 L52 105" stroke="#f5d0fe" stroke-width="0.8" fill="none" opacity="0.2"/>
  <path d="M158 65 L148 105" stroke="#f5d0fe" stroke-width="0.8" fill="none" opacity="0.2"/>
  <!-- Crystal ridge arcs -->
  <path d="M52 60 Q68 38 100 32 Q132 38 148 60" stroke="#f5d0fe" stroke-width="2" fill="none" opacity="0.5"/>
  <path d="M45 78 Q62 50 100 42 Q138 50 155 78" stroke="#f5d0fe" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M40 92 Q58 62 100 52 Q142 62 160 92" stroke="#f5d0fe" stroke-width="1" fill="none" opacity="0.3"/>
  <!-- Inner dome glow - translucent -->
  <path d="M52 88 L58 62 L72 45 L100 38 L128 45 L142 62 L148 88 L140 98 L60 98 Z" fill="#fae8ff" opacity="0.2"/>
  <!-- Inner energy core visible through dome -->
  <ellipse cx="100" cy="68" rx="18" ry="16" fill="url(#jf_core)" filter="url(#jf_softglow)" opacity="0.8"/>
  <ellipse cx="100" cy="68" rx="10" ry="9" fill="#f0abfc" opacity="0.6"/>
  <ellipse cx="100" cy="68" rx="5" ry="4" fill="#fffbeb" opacity="0.7"/>
  <!-- Core energy radiating lines -->
  <line x1="100" y1="52" x2="100" y2="58" stroke="#f5d0fe" stroke-width="1" opacity="0.5" filter="url(#jf_softglow)"/>
  <line x1="100" y1="78" x2="100" y2="84" stroke="#f5d0fe" stroke-width="1" opacity="0.5" filter="url(#jf_softglow)"/>
  <line x1="82" y1="68" x2="88" y2="68" stroke="#f5d0fe" stroke-width="1" opacity="0.5" filter="url(#jf_softglow)"/>
  <line x1="112" y1="68" x2="118" y2="68" stroke="#f5d0fe" stroke-width="1" opacity="0.5" filter="url(#jf_softglow)"/>
  <line x1="88" y1="56" x2="92" y2="60" stroke="#f5d0fe" stroke-width="0.8" opacity="0.4"/>
  <line x1="112" y1="56" x2="108" y2="60" stroke="#f5d0fe" stroke-width="0.8" opacity="0.4"/>
  <line x1="88" y1="80" x2="92" y2="76" stroke="#f5d0fe" stroke-width="0.8" opacity="0.4"/>
  <line x1="112" y1="80" x2="108" y2="76" stroke="#f5d0fe" stroke-width="0.8" opacity="0.4"/>
  <!-- Eyes - intense energy eyes (not cute) -->
  <path d="M78 70 L90 66 L90 76 Z" fill="#1a001f"/>
  <path d="M80 70 L88 67 L88 74 Z" fill="#c026d3"/>
  <line x1="82" y1="71" x2="87" y2="71" stroke="#f0abfc" stroke-width="2" filter="url(#jf_softglow)"/>
  <circle cx="85" cy="71" r="1" fill="#fffbeb"/>
  <path d="M122 70 L110 66 L110 76 Z" fill="#1a001f"/>
  <path d="M120 70 L112 67 L112 74 Z" fill="#c026d3"/>
  <line x1="113" y1="71" x2="118" y2="71" stroke="#f0abfc" stroke-width="2" filter="url(#jf_softglow)"/>
  <circle cx="115" cy="71" r="1" fill="#fffbeb"/>
  <!-- Dome bottom edge - crystalline frills -->
  <path d="M42 105 L50 112 L58 102 L66 110 L74 100 L82 108 L90 98 L100 108 L110 98 L118 108 L126 100 L134 110 L142 102 L150 112 L158 105" stroke="#e879f9" stroke-width="2.5" fill="none"/>
  <path d="M42 105 L50 112 L58 102 L66 110 L74 100 L82 108 L90 98 L100 108 L110 98 L118 108 L126 100 L134 110 L142 102 L150 112 L158 105" stroke="#f5d0fe" stroke-width="1" fill="none" opacity="0.5"/>
  <!-- Data-stream tendrils -->
  <path d="M58 108 Q52 130 56 148 Q60 135 54 158 Q62 142 56 168 Q66 150 58 178" stroke="#c026d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M74 104 Q70 130 74 152 Q78 138 72 162 Q80 148 74 175" stroke="#e879f9" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M90 100 Q86 128 90 155 Q94 140 88 165 Q96 150 90 178" stroke="#c026d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M110 100 Q114 128 110 155 Q106 140 112 165 Q104 150 110 178" stroke="#c026d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M126 104 Q130 130 126 152 Q122 138 128 162 Q120 148 126 175" stroke="#e879f9" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M142 108 Q148 130 144 148 Q140 135 146 158 Q138 142 144 168 Q134 150 142 178" stroke="#c026d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Data-stream circuit patterns on tendrils -->
  <path d="M56 135 L52 138 L56 142" stroke="#f0abfc" stroke-width="1" fill="none" opacity="0.5" filter="url(#jf_softglow)"/>
  <path d="M74 138 L70 142 L74 146" stroke="#f0abfc" stroke-width="1" fill="none" opacity="0.4" filter="url(#jf_softglow)"/>
  <path d="M90 140 L86 144 L90 148" stroke="#f0abfc" stroke-width="1" fill="none" opacity="0.4" filter="url(#jf_softglow)"/>
  <path d="M110 140 L114 144 L110 148" stroke="#f0abfc" stroke-width="1" fill="none" opacity="0.4" filter="url(#jf_softglow)"/>
  <path d="M126 138 L130 142 L126 146" stroke="#f0abfc" stroke-width="1" fill="none" opacity="0.4" filter="url(#jf_softglow)"/>
  <path d="M144 135 L148 138 L144 142" stroke="#f0abfc" stroke-width="1" fill="none" opacity="0.5" filter="url(#jf_softglow)"/>
  <!-- Bioluminescent nodes on tendrils -->
  <circle cx="56" cy="150" r="3.5" fill="#f0abfc" opacity="0.8" filter="url(#jf_glow)"/>
  <circle cx="74" cy="155" r="3" fill="#e879f9" opacity="0.7" filter="url(#jf_glow)"/>
  <circle cx="90" cy="158" r="3.5" fill="#f0abfc" opacity="0.8" filter="url(#jf_glow)"/>
  <circle cx="110" cy="158" r="3.5" fill="#f0abfc" opacity="0.8" filter="url(#jf_glow)"/>
  <circle cx="126" cy="155" r="3" fill="#e879f9" opacity="0.7" filter="url(#jf_glow)"/>
  <circle cx="144" cy="150" r="3.5" fill="#f0abfc" opacity="0.8" filter="url(#jf_glow)"/>
  <!-- Secondary bioluminescent nodes -->
  <circle cx="54" cy="168" r="2.5" fill="#c026d3" opacity="0.6" filter="url(#jf_softglow)"/>
  <circle cx="72" cy="165" r="2" fill="#e879f9" opacity="0.5" filter="url(#jf_softglow)"/>
  <circle cx="88" cy="170" r="2.5" fill="#c026d3" opacity="0.6" filter="url(#jf_softglow)"/>
  <circle cx="112" cy="170" r="2.5" fill="#c026d3" opacity="0.6" filter="url(#jf_softglow)"/>
  <circle cx="128" cy="165" r="2" fill="#e879f9" opacity="0.5" filter="url(#jf_softglow)"/>
  <circle cx="146" cy="168" r="2.5" fill="#c026d3" opacity="0.6" filter="url(#jf_softglow)"/>
</svg>`

};

// ---- Stage visual modifiers (CSS injected per stage) ----
const STAGE_STYLES = {
  baby:     { scale: 0.78, filter: 'brightness(1.05)',    extra: '' },
  child:    { scale: 0.90, filter: 'brightness(1.07)',    extra: '' },
  teen:     { scale: 1.00, filter: 'brightness(1.1)',     extra: '' },
  adult:    { scale: 1.12, filter: 'brightness(1.15) saturate(1.1)', extra: '' },
  champion: { scale: 1.25, filter: 'brightness(1.2) saturate(1.2) contrast(1.05)', extra: '' },
  mythic:   { scale: 1.40, filter: 'brightness(1.3) saturate(1.35) contrast(1.1)',  extra: '' }
};

// Returns an HTML string: SVG wrapped in a styled container.
// If a custom image is registered for this creature+stage in
// CUSTOM_SPRITES (js/custom-sprites.js), it is used instead —
// so dropped-in AI-generated art overrides the built-in SVGs.
function getSpriteHTML(creatureId, stage, sizePx) {
  const styleDef = STAGE_STYLES[stage] || STAGE_STYLES.baby;
  const base = sizePx || 120;
  const scaled = Math.round(base * styleDef.scale);

  const custom = typeof CUSTOM_SPRITES !== 'undefined' && CUSTOM_SPRITES[creatureId];
  const inner = custom && custom.includes(stage)
    ? `<img src="assets/creatures/${creatureId}_${stage}.png" alt="" draggable="false"
            style="width:100%;height:100%;object-fit:contain;image-rendering:auto">`
    : (SPRITES[creatureId] || '');

  return `<div class="creature-sprite-wrap" style="width:${base}px;height:${base}px;display:flex;align-items:center;justify-content:center">
    <div style="width:${scaled}px;height:${scaled}px;filter:${styleDef.filter};transition:all 0.5s ease;">
      ${inner}
    </div>
  </div>`;
}
