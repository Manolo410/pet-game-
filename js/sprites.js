// =====================================================
// HATCHBOUND: BEAST ARENA — Custom Creature Sprites
// All creatures drawn as inline SVG (200×200 viewBox)
// =====================================================

const SPRITES = {

  /* ═══════════════════════════════════════════════
     FIRE LION — Emberclaw
     ═══════════════════════════════════════════════ */
  fire_lion: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="85" r="50" fill="#c2410c" opacity="0.55"/>
  <circle cx="100" cy="85" r="44" fill="#ea580c" opacity="0.6"/>
  <ellipse cx="100" cy="148" rx="36" ry="30" fill="#f97316"/>
  <circle cx="100" cy="82" r="40" fill="#fb923c"/>
  <ellipse cx="100" cy="90" rx="26" ry="22" fill="#fed7aa"/>
  <ellipse cx="63" cy="47" rx="14" ry="13" fill="#ea580c"/>
  <ellipse cx="63" cy="47" rx="7"  ry="7"  fill="#fdba74"/>
  <ellipse cx="137" cy="47" rx="14" ry="13" fill="#ea580c"/>
  <ellipse cx="137" cy="47" rx="7"  ry="7"  fill="#fdba74"/>
  <circle cx="83" cy="77" r="11" fill="#0d0700"/>
  <circle cx="87" cy="73" r="4"  fill="white"/>
  <circle cx="86" cy="72" r="2"  fill="white" opacity="0.6"/>
  <circle cx="117" cy="77" r="11" fill="#0d0700"/>
  <circle cx="121" cy="73" r="4"  fill="white"/>
  <circle cx="120" cy="72" r="2"  fill="white" opacity="0.6"/>
  <ellipse cx="100" cy="95" rx="6" ry="4" fill="#c2410c"/>
  <circle cx="78" cy="100" r="2" fill="#c2410c" opacity="0.5"/>
  <circle cx="86" cy="103" r="2" fill="#c2410c" opacity="0.5"/>
  <circle cx="114" cy="100" r="2" fill="#c2410c" opacity="0.5"/>
  <circle cx="122" cy="103" r="2" fill="#c2410c" opacity="0.5"/>
  <path d="M89 103 Q100 112 111 103" stroke="#c2410c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="73"  cy="172" rx="17" ry="11" fill="#ea580c"/>
  <ellipse cx="127" cy="172" rx="17" ry="11" fill="#ea580c"/>
  <path d="M64 176 L61 183 M70 178 L68 185 M76 177 L74 184" stroke="#c2410c" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M118 177 L116 184 M124 178 L122 185 M130 176 L127 183" stroke="#c2410c" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M136 148 Q168 120 160 90 Q150 115 165 100 Q148 130 158 108 Q140 145 136 148" fill="#ef4444"/>
  <path d="M136 148 Q162 122 154 96 Q147 118 160 104 Q145 132 154 112 Q138 143 136 148" fill="#fbbf24"/>
  <path d="M136 148 Q155 128 148 104 Q143 124 153 112 Q140 138 136 148" fill="#fffbeb" opacity="0.8"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     KOMODO — Thornback Komodo
     ═══════════════════════════════════════════════ */
  komodo: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M110 158 Q155 170 175 155 Q165 168 180 160 Q162 172 170 162 Q148 175 115 162" fill="#15803d"/>
  <ellipse cx="88" cy="148" rx="42" ry="26" fill="#16a34a"/>
  <polygon points="68,130 72,118 76,130" fill="#14532d"/>
  <polygon points="80,126 84,112 88,126" fill="#14532d"/>
  <polygon points="92,124 96,110 100,124" fill="#14532d"/>
  <polygon points="104,126 108,112 112,126" fill="#14532d"/>
  <ellipse cx="60" cy="118" rx="30" ry="22" fill="#22c55e"/>
  <ellipse cx="42" cy="120" rx="18" ry="12" fill="#16a34a"/>
  <ellipse cx="90" cy="154" rx="30" ry="16" fill="#86efac"/>
  <ellipse cx="82" cy="148" rx="8" ry="5" fill="#4ade80" opacity="0.4"/>
  <ellipse cx="96" cy="152" rx="8" ry="5" fill="#4ade80" opacity="0.4"/>
  <ellipse cx="74" cy="155" rx="7" ry="4" fill="#4ade80" opacity="0.4"/>
  <circle cx="52" cy="113" r="9"  fill="#0d1f0d"/>
  <circle cx="55" cy="110" r="3"  fill="white"/>
  <circle cx="54" cy="109" r="1.5" fill="white" opacity="0.6"/>
  <ellipse cx="36" cy="117" rx="3" ry="2" fill="#14532d"/>
  <path d="M27 122 Q18 120 14 116 M14 116 Q12 113 10 110 M14 116 Q12 119 11 122" stroke="#ef4444" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="62"  cy="170" rx="12" ry="8"  fill="#15803d" transform="rotate(-20,62,170)"/>
  <ellipse cx="108" cy="172" rx="12" ry="8"  fill="#15803d" transform="rotate(15,108,172)"/>
  <path d="M54 175 L50 183 M60 177 L57 185 M66 176 L63 184" stroke="#14532d" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M100 176 L97 184 M106 178 L104 185 M112 176 L110 183" stroke="#14532d" stroke-width="1.8" stroke-linecap="round"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     SERPENTIS — Shadow Serpentis
     ═══════════════════════════════════════════════ */
  snake: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="158" rx="52" ry="22" fill="#7e22ce"/>
  <ellipse cx="100" cy="158" rx="38" ry="14" fill="#6b21a8"/>
  <path d="M48 145 Q50 120 72 110 Q100 100 128 110 Q150 120 152 145" fill="#9333ea" stroke="#7e22ce" stroke-width="2"/>
  <polygon points="80,130 90,122 100,130 90,138" fill="#a855f7" opacity="0.5"/>
  <polygon points="100,130 110,122 120,130 110,138" fill="#a855f7" opacity="0.5"/>
  <polygon points="60,138 70,130 80,138 70,146" fill="#a855f7" opacity="0.5"/>
  <polygon points="120,138 130,130 140,138 130,146" fill="#a855f7" opacity="0.5"/>
  <path d="M85 110 Q78 90 70 78 Q76 92 70 78" stroke="#9333ea" stroke-width="24" fill="none" stroke-linecap="round"/>
  <path d="M85 110 Q78 90 70 78" stroke="#c084fc" stroke-width="14" fill="none" stroke-linecap="round"/>
  <ellipse cx="68" cy="72" rx="26" ry="20" fill="#a855f7"/>
  <ellipse cx="65" cy="68" rx="18" ry="13" fill="#c084fc" opacity="0.4"/>
  <ellipse cx="57" cy="66" rx="8" ry="9" fill="#0d0016"/>
  <ellipse cx="57" cy="66" rx="4" ry="5" fill="#7c3aed"/>
  <circle  cx="59" cy="63" r="2.5" fill="white"/>
  <ellipse cx="79" cy="66" rx="8" ry="9" fill="#0d0016"/>
  <ellipse cx="79" cy="66" rx="4" ry="5" fill="#7c3aed"/>
  <circle  cx="81" cy="63" r="2.5" fill="white"/>
  <ellipse cx="68" cy="80" rx="10" ry="6" fill="#9333ea"/>
  <circle cx="63" cy="79" r="2" fill="#6b21a8"/>
  <circle cx="73" cy="79" r="2" fill="#6b21a8"/>
  <path d="M68 86 L68 96 M68 96 Q63 102 60 106 M68 96 Q73 102 76 106" stroke="#f43f5e" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M148 155 Q168 148 172 138 Q165 146 170 140 Q160 150 165 143 Q152 152 148 155" fill="#7e22ce"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     DINORAWR — Battle Raptorex
     ═══════════════════════════════════════════════ */
  dinosaur: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M130 140 Q175 135 185 115 Q172 130 182 120 Q165 138 178 125 Q155 140 130 140" fill="#d97706"/>
  <ellipse cx="92" cy="142" rx="44" ry="34" fill="#f59e0b"/>
  <polygon points="76,115 80,100 84,115" fill="#b45309"/>
  <polygon points="88,110 93,93  97,110"  fill="#b45309"/>
  <polygon points="100,112 105,95 110,112" fill="#b45309"/>
  <polygon points="112,116 117,100 121,116" fill="#b45309"/>
  <ellipse cx="90" cy="152" rx="32" ry="20" fill="#fef3c7"/>
  <path d="M72 120 Q62 100 58 82" stroke="#f59e0b" stroke-width="28" fill="none" stroke-linecap="round"/>
  <ellipse cx="52" cy="72" rx="32" ry="26" fill="#fbbf24"/>
  <path d="M22 74 Q36 90 60 88 Q36 92 22 82 Z" fill="#f59e0b"/>
  <path d="M22 74 Q36 70 60 74 L60 80 Q36 76 22 74 Z" fill="#fef3c7"/>
  <path d="M30 74 L32 68 M38 72 L40 65 M46 72 L47 65 M54 74 L55 68" stroke="#fffbeb" stroke-width="3" stroke-linecap="round"/>
  <circle cx="62" cy="62" r="11" fill="#0d0a00"/>
  <circle cx="66" cy="58" r="4"  fill="white"/>
  <circle cx="65" cy="57" r="2"  fill="white" opacity="0.7"/>
  <path d="M52 52 Q62 48 72 52" stroke="#b45309" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="114" cy="138" rx="10" ry="7" fill="#f59e0b" transform="rotate(-30,114,138)"/>
  <ellipse cx="70"  cy="140" rx="10" ry="7" fill="#f59e0b" transform="rotate(20,70,140)"/>
  <ellipse cx="74"  cy="172" rx="14" ry="10" fill="#d97706" transform="rotate(-10,74,172)"/>
  <ellipse cx="116" cy="174" rx="14" ry="10" fill="#d97706" transform="rotate(8,116,174)"/>
  <path d="M67 177 L64 185 M73 179 L71 187 M79 178 L77 186" stroke="#b45309" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M109 178 L107 186 M115 179 L113 187 M121 177 L119 185" stroke="#b45309" stroke-width="1.8" stroke-linecap="round"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     GORROX — Battle Gorrox
     ═══════════════════════════════════════════════ */
  gorilla: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="148" rx="48" ry="36" fill="#4b5563"/>
  <ellipse cx="100" cy="148" rx="28" ry="24" fill="#6b7280"/>
  <circle cx="100" cy="82" r="38" fill="#374151"/>
  <ellipse cx="100" cy="74" rx="30" ry="12" fill="#1f2937"/>
  <ellipse cx="100" cy="96" rx="22" ry="16" fill="#4b5563"/>
  <circle cx="84" cy="74" r="9"  fill="#0d0d0d"/>
  <circle cx="87" cy="71" r="3"  fill="white"/>
  <circle cx="86" cy="70" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="116" cy="74" r="9"  fill="#0d0d0d"/>
  <circle cx="119" cy="71" r="3"  fill="white"/>
  <circle cx="118" cy="70" r="1.5" fill="white" opacity="0.6"/>
  <ellipse cx="100" cy="92" rx="8" ry="5" fill="#1f2937"/>
  <circle  cx="96"  cy="91" r="2.5" fill="#111827"/>
  <circle  cx="104" cy="91" r="2.5" fill="#111827"/>
  <path d="M88 102 Q100 110 112 102" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="62" cy="80" r="12" fill="#374151"/>
  <circle cx="62" cy="80" r="7"  fill="#4b5563"/>
  <circle cx="138" cy="80" r="12" fill="#374151"/>
  <circle cx="138" cy="80" r="7"  fill="#4b5563"/>
  <ellipse cx="48"  cy="148" rx="16" ry="30" fill="#374151"/>
  <ellipse cx="48"  cy="176" rx="20" ry="14" fill="#374151"/>
  <path d="M36 174 Q48 168 60 174" stroke="#1f2937" stroke-width="2" fill="none"/>
  <path d="M37 179 Q49 173 61 179" stroke="#1f2937" stroke-width="1.5" fill="none"/>
  <ellipse cx="152" cy="148" rx="16" ry="30" fill="#374151"/>
  <ellipse cx="152" cy="176" rx="20" ry="14" fill="#374151"/>
  <path d="M140 174 Q152 168 164 174" stroke="#1f2937" stroke-width="2" fill="none"/>
  <path d="M141 179 Q153 173 165 179" stroke="#1f2937" stroke-width="1.5" fill="none"/>
  <ellipse cx="78"  cy="182" rx="16" ry="10" fill="#374151"/>
  <ellipse cx="122" cy="182" rx="16" ry="10" fill="#374151"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     BRUINAX — Battle Bear
     ═══════════════════════════════════════════════ */
  bear: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="148" r="44" fill="#92400e"/>
  <ellipse cx="100" cy="156" rx="28" ry="22" fill="#d97706" opacity="0.5"/>
  <ellipse cx="100" cy="158" rx="22" ry="17" fill="#fef3c7"/>
  <circle cx="100" cy="80" r="42" fill="#a16207"/>
  <circle cx="100" cy="85" r="30" fill="#b45309"/>
  <ellipse cx="100" cy="98" rx="18" ry="14" fill="#d97706"/>
  <circle cx="62" cy="44" r="16" fill="#92400e"/>
  <circle cx="62" cy="44" r="9"  fill="#c2850a"/>
  <circle cx="138" cy="44" r="16" fill="#92400e"/>
  <circle cx="138" cy="44" r="9"  fill="#c2850a"/>
  <circle cx="82" cy="76" r="10" fill="#0d0600"/>
  <circle cx="85" cy="73" r="3.5" fill="white"/>
  <path d="M72 72 Q82 68 92 72" stroke="#92400e" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="118" cy="76" r="10" fill="#0d0600"/>
  <circle cx="121" cy="73" r="3.5" fill="white"/>
  <path d="M108 72 Q118 68 128 72" stroke="#92400e" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="100" cy="94" rx="7" ry="5" fill="#451a03"/>
  <path d="M90 103 Q100 112 110 103" stroke="#451a03" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="56"  cy="178" rx="20" ry="13" fill="#92400e"/>
  <path d="M44 180 L40 188 M52 182 L49 190 M60 182 L58 190 M68 180 L66 188" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="144" cy="178" rx="20" ry="13" fill="#92400e"/>
  <path d="M132 180 L130 188 M140 182 L138 190 M148 182 L146 190 M156 180 L154 188" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     NOCTURNIS — Battle Bat
     ═══════════════════════════════════════════════ */
  bat: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M72 90 Q30 60 10 80 Q20 100 10 120 Q35 105 55 115 Q65 100 72 90Z" fill="#581c87"/>
  <path d="M72 90 Q45 85 20 95" stroke="#6b21a8" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M68 100 Q42 100 18 110" stroke="#6b21a8" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M65 110 Q42 112 22 118" stroke="#6b21a8" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M128 90 Q170 60 190 80 Q180 100 190 120 Q165 105 145 115 Q135 100 128 90Z" fill="#581c87"/>
  <path d="M128 90 Q155 85 180 95" stroke="#6b21a8" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M132 100 Q158 100 182 110" stroke="#6b21a8" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M135 110 Q158 112 178 118" stroke="#6b21a8" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M10 80 Q20 90 10 120"   stroke="#3b0764" stroke-width="2" fill="none"/>
  <path d="M190 80 Q180 90 190 120" stroke="#3b0764" stroke-width="2" fill="none"/>
  <ellipse cx="100" cy="130" rx="22" ry="28" fill="#7e22ce"/>
  <circle  cx="100" cy="88"  r="32" fill="#9333ea"/>
  <circle  cx="100" cy="92"  r="22" fill="#c084fc" opacity="0.35"/>
  <polygon points="72,62 64,28 88,56" fill="#7e22ce"/>
  <polygon points="74,60 68,34 86,57" fill="#c084fc" opacity="0.5"/>
  <polygon points="128,62 136,28 112,56" fill="#7e22ce"/>
  <polygon points="126,60 132,34 114,57" fill="#c084fc" opacity="0.5"/>
  <circle cx="84" cy="84" r="11" fill="#0d001a"/>
  <circle cx="84" cy="84" r="7"  fill="#7c3aed"/>
  <circle cx="87" cy="80" r="3"  fill="white"/>
  <circle cx="86" cy="79" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="116" cy="84" r="11" fill="#0d001a"/>
  <circle cx="116" cy="84" r="7"  fill="#7c3aed"/>
  <circle cx="119" cy="80" r="3"  fill="white"/>
  <circle cx="118" cy="79" r="1.5" fill="white" opacity="0.6"/>
  <ellipse cx="100" cy="96" rx="5" ry="3" fill="#581c87"/>
  <path d="M88 102 Q100 110 112 102" stroke="#581c87" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M94 104 L94 112 M106 104 L106 112" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <path d="M88 158 Q82 170 76 175 Q84 165 78 178 M82 175 Q79 180 76 185" stroke="#581c87" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M112 158 Q118 170 124 175 Q116 165 122 178 M118 175 Q121 180 124 185" stroke="#581c87" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     STORMTALON — Soaring Eagle
     ═══════════════════════════════════════════════ */
  eagle: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M76 105 Q40 75 12 88 Q28 108 18 128 Q44 110 62 122 Q70 112 76 105Z" fill="#0ea5e9"/>
  <path d="M12 88 Q30 95 44 88"  stroke="#bae6fd" stroke-width="2.5" fill="none"/>
  <path d="M14 100 Q34 106 50 99" stroke="#bae6fd" stroke-width="2"   fill="none"/>
  <path d="M16 113 Q36 117 54 111" stroke="#bae6fd" stroke-width="1.8" fill="none"/>
  <path d="M18 124 Q38 127 56 120" stroke="#bae6fd" stroke-width="1.5" fill="none"/>
  <path d="M124 105 Q160 75 188 88 Q172 108 182 128 Q156 110 138 122 Q130 112 124 105Z" fill="#0ea5e9"/>
  <path d="M188 88 Q170 95 156 88"  stroke="#bae6fd" stroke-width="2.5" fill="none"/>
  <path d="M186 100 Q166 106 150 99" stroke="#bae6fd" stroke-width="2"   fill="none"/>
  <path d="M184 113 Q164 117 146 111" stroke="#bae6fd" stroke-width="1.8" fill="none"/>
  <path d="M182 124 Q162 127 144 120" stroke="#bae6fd" stroke-width="1.5" fill="none"/>
  <ellipse cx="100" cy="132" rx="26" ry="30" fill="#0284c7"/>
  <ellipse cx="100" cy="140" rx="16" ry="18" fill="#f0f9ff"/>
  <circle  cx="100" cy="86" r="30" fill="#f0f9ff"/>
  <circle  cx="88"  cy="64" r="10" fill="#bae6fd"/>
  <circle  cx="100" cy="60" r="11" fill="#e0f2fe"/>
  <circle  cx="112" cy="64" r="10" fill="#bae6fd"/>
  <path d="M72 84 Q100 78 128 84" stroke="#0c4a6e" stroke-width="6" fill="none"/>
  <circle cx="84" cy="87" r="9"  fill="#0c0c0c"/>
  <circle cx="87" cy="84" r="3"  fill="white"/>
  <circle cx="86" cy="83" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="116" cy="87" r="9"  fill="#0c0c0c"/>
  <circle cx="119" cy="84" r="3"  fill="white"/>
  <circle cx="118" cy="83" r="1.5" fill="white" opacity="0.6"/>
  <path d="M90 96 L100 92 L110 96 L100 110 Z" fill="#fbbf24"/>
  <path d="M90 96 L110 96 L100 100 Z" fill="#f59e0b"/>
  <path d="M80 162 L70 178 M74 162 Q68 172 62 180 M78 164 L72 180" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
  <path d="M120 162 L130 178 M126 162 Q132 172 138 180 M122 164 L128 180" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
  <path d="M20 140 Q30 130 40 140 Q50 150 60 140" stroke="#7dd3fc" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M140 140 Q150 130 160 140 Q170 150 180 140" stroke="#7dd3fc" stroke-width="2" fill="none" opacity="0.6"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     HYPNOWL — Mystical Owl
     ═══════════════════════════════════════════════ */
  owl: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="145" r="46" fill="#581c87"/>
  <ellipse cx="56"  cy="152" rx="18" ry="28" fill="#6b21a8" transform="rotate(-10,56,152)"/>
  <ellipse cx="144" cy="152" rx="18" ry="28" fill="#6b21a8" transform="rotate(10,144,152)"/>
  <ellipse cx="100" cy="148" rx="30" ry="22" fill="#7e22ce" opacity="0.5"/>
  <ellipse cx="100" cy="158" rx="22" ry="18" fill="#ede9fe"/>
  <circle  cx="100" cy="82" r="44" fill="#7e22ce"/>
  <polygon points="64,46 56,18 78,44" fill="#581c87"/>
  <polygon points="66,45 60,22 76,44" fill="#a78bfa" opacity="0.4"/>
  <polygon points="136,46 144,18 122,44" fill="#581c87"/>
  <polygon points="134,45 140,22 124,44" fill="#a78bfa" opacity="0.4"/>
  <ellipse cx="100" cy="86" rx="36" ry="34" fill="#ddd6fe" opacity="0.55"/>
  <circle cx="78"  cy="80" r="22" fill="#0d001a"/>
  <circle cx="122" cy="80" r="22" fill="#0d001a"/>
  <circle cx="78"  cy="80" r="16" fill="#6d28d9"/>
  <circle cx="78"  cy="80" r="11" fill="#4c1d95"/>
  <circle cx="78"  cy="80" r="7"  fill="#7c3aed"/>
  <circle cx="78"  cy="80" r="4"  fill="#0d001a"/>
  <path d="M78 64 Q94 66 94 80 Q94 96 78 96 Q62 96 62 80 Q62 67 74 65" stroke="#a78bfa" stroke-width="1.5" fill="none" opacity="0.6"/>
  <circle cx="122" cy="80" r="16" fill="#6d28d9"/>
  <circle cx="122" cy="80" r="11" fill="#4c1d95"/>
  <circle cx="122" cy="80" r="7"  fill="#7c3aed"/>
  <circle cx="122" cy="80" r="4"  fill="#0d001a"/>
  <path d="M122 64 Q138 66 138 80 Q138 96 122 96 Q106 96 106 80 Q106 67 118 65" stroke="#a78bfa" stroke-width="1.5" fill="none" opacity="0.6"/>
  <circle cx="84"  cy="73" r="4.5" fill="white"/>
  <circle cx="128" cy="73" r="4.5" fill="white"/>
  <polygon points="96,96 104,96 100,106" fill="#fbbf24"/>
  <path d="M84 190 L78 175 M88 192 L84 176 M92 192 L90 175" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
  <path d="M116 190 L122 175 M112 192 L116 176 M108 192 L110 175" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
  <circle cx="42"  cy="60" r="3" fill="#c4b5fd" opacity="0.7"/>
  <circle cx="158" cy="60" r="3" fill="#c4b5fd" opacity="0.7"/>
  <circle cx="38"  cy="78" r="2" fill="#c4b5fd" opacity="0.5"/>
  <circle cx="162" cy="78" r="2" fill="#c4b5fd" opacity="0.5"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     TIDALREX — Mystic Sea Dragon
     ═══════════════════════════════════════════════ */
  sea_dragon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M118 160 Q168 158 180 132 Q165 150 178 138 Q160 155 172 142 Q148 160 155 145 Q130 162 118 160" fill="#0e7490"/>
  <path d="M50 148 Q54 120 70 108 Q92 96 112 108 Q130 120 130 148 Z" fill="#0891b2"/>
  <polygon points="72,112 68,96 78,108"  fill="#22d3ee" opacity="0.8"/>
  <polygon points="84,106 82,88 92,104"  fill="#22d3ee" opacity="0.8"/>
  <polygon points="98,104 98,86 106,102" fill="#22d3ee" opacity="0.8"/>
  <polygon points="112,108 114,92 120,106" fill="#22d3ee" opacity="0.8"/>
  <path d="M56 148 Q90 168 124 148" fill="#67e8f9" opacity="0.4"/>
  <ellipse cx="76"  cy="152" rx="10" ry="6" fill="#a5f3fc" opacity="0.3"/>
  <ellipse cx="94"  cy="158" rx="10" ry="6" fill="#a5f3fc" opacity="0.3"/>
  <ellipse cx="112" cy="153" rx="10" ry="6" fill="#a5f3fc" opacity="0.3"/>
  <path d="M70 112 Q58 95 52 76" stroke="#0891b2" stroke-width="26" fill="none" stroke-linecap="round"/>
  <path d="M70 112 Q58 95 52 76" stroke="#06b6d4" stroke-width="16" fill="none" stroke-linecap="round"/>
  <ellipse cx="48" cy="68" rx="30" ry="22" fill="#0ea5e9"/>
  <ellipse cx="30" cy="70" rx="18" ry="10" fill="#0891b2"/>
  <polygon points="44,50 38,32 52,48" fill="#22d3ee" opacity="0.9"/>
  <polygon points="55,46 52,28 62,44" fill="#22d3ee" opacity="0.9"/>
  <circle cx="58" cy="60" r="10" fill="#001820"/>
  <circle cx="58" cy="60" r="6"  fill="#06b6d4"/>
  <circle cx="61" cy="57" r="3"  fill="white"/>
  <circle cx="60" cy="56" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="24" cy="67" r="2.5" fill="#065f73"/>
  <path d="M26 64 Q14 58 6 60"  stroke="#67e8f9" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M26 70 Q14 70 6 74"  stroke="#67e8f9" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M26 76 Q14 78 6 80"  stroke="#67e8f9" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M70 170 L64 182 M76 172 L72 184 M82 171 L80 183" stroke="#0e7490" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M112 170 L106 182 M118 172 L116 184 M124 171 L122 183" stroke="#0e7490" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="160" cy="90" rx="4" ry="6"  fill="#67e8f9" opacity="0.5"/>
  <ellipse cx="174" cy="108" rx="3" ry="5" fill="#67e8f9" opacity="0.4"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     SHOCKTIDE — Storm Shark
     ═══════════════════════════════════════════════ */
  storm_shark: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M162 120 Q188 100 186 82 Q174 100 188 90 Q170 108 184 96 Q165 115 162 120Z" fill="#1d4ed8"/>
  <path d="M162 120 Q188 140 186 158 Q174 140 188 150 Q170 132 184 144 Q165 125 162 120Z" fill="#1d4ed8"/>
  <ellipse cx="95" cy="118" rx="66" ry="32" fill="#2563eb"/>
  <path d="M60 108 L68 116 L60 124 L72 118 L64 126 L76 120" stroke="#fde047" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
  <path d="M85 104 L93 112 L85 120 L97 114 L89 122 L101 116" stroke="#fde047" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
  <ellipse cx="92" cy="124" rx="50" ry="18" fill="#60a5fa" opacity="0.5"/>
  <ellipse cx="90" cy="128" rx="36" ry="12" fill="#bfdbfe" opacity="0.4"/>
  <path d="M100 90 Q108 54 118 48 Q112 68 122 56 Q110 76 120 64 Q106 86 100 90Z" fill="#1e40af"/>
  <path d="M106 82 L112 68 L106 72 L113 58" stroke="#fde047" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M50 112 Q28 98 18 108 Q34 116 22 120 Q38 112 50 118Z" fill="#1d4ed8"/>
  <path d="M50 126 Q28 136 18 128 Q34 122 22 118 Q38 126 50 118Z" fill="#1d4ed8"/>
  <path d="M36 118 Q28 100 20 104 Q28 118 20 132 Q28 136 36 118Z" fill="#2563eb"/>
  <path d="M36 118 Q18 112 8 116 Q16 118 8 120 Q18 124 36 118Z" fill="#1d4ed8"/>
  <circle cx="42" cy="112" r="8"  fill="#0d0d1f"/>
  <circle cx="44" cy="109" r="3"  fill="white"/>
  <circle cx="43" cy="108" r="1.5" fill="white" opacity="0.7"/>
  <path d="M60 106 Q56 118 60 130" stroke="#1e40af" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M68 104 Q64 116 68 128" stroke="#1e40af" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="95" cy="118" rx="70" ry="36" stroke="#fde047" stroke-width="1.5" fill="none" opacity="0.25"/>
  <circle cx="30"  cy="95"  r="3" fill="#fde047" opacity="0.6"/>
  <circle cx="150" cy="90"  r="3" fill="#fde047" opacity="0.6"/>
  <circle cx="170" cy="115" r="2" fill="#fde047" opacity="0.5"/>
</svg>`,

  /* ═══════════════════════════════════════════════
     LUMILUX — Crystal Jellyfish
     ═══════════════════════════════════════════════ */
  jellyfish: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="78" rx="62" ry="52" fill="#f0abfc" opacity="0.2"/>
  <ellipse cx="100" cy="80" rx="54" ry="46" fill="#e879f9"/>
  <path d="M58 68 Q72 42 100 38 Q128 42 142 68"  stroke="#f5d0fe" stroke-width="2.5" fill="none" opacity="0.7"/>
  <path d="M52 82 Q64 52 100 46 Q136 52 148 82"  stroke="#f5d0fe" stroke-width="2"   fill="none" opacity="0.5"/>
  <path d="M50 94 Q60 62 100 54 Q140 62 150 94"  stroke="#f5d0fe" stroke-width="1.5" fill="none" opacity="0.4"/>
  <ellipse cx="100" cy="76" rx="38" ry="32" fill="#fae8ff" opacity="0.35"/>
  <ellipse cx="100" cy="72" rx="18" ry="14" fill="#f0abfc" opacity="0.6"/>
  <circle cx="84" cy="72" r="10" fill="#1a001f"/>
  <circle cx="84" cy="72" r="6"  fill="#a21caf"/>
  <circle cx="87" cy="68" r="3.5" fill="white"/>
  <circle cx="86" cy="67" r="1.8" fill="white" opacity="0.6"/>
  <circle cx="116" cy="72" r="10" fill="#1a001f"/>
  <circle cx="116" cy="72" r="6"  fill="#a21caf"/>
  <circle cx="119" cy="68" r="3.5" fill="white"/>
  <circle cx="118" cy="67" r="1.8" fill="white" opacity="0.6"/>
  <ellipse cx="72"  cy="82" rx="8" ry="5" fill="#f9a8d4" opacity="0.5"/>
  <ellipse cx="128" cy="82" rx="8" ry="5" fill="#f9a8d4" opacity="0.5"/>
  <path d="M93 86 Q100 93 107 86" stroke="#9d174d" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M46 118 Q56 128 66 118 Q76 108 86 118 Q96 128 100 120 Q104 128 114 118 Q124 108 134 118 Q144 128 154 118" stroke="#e879f9" stroke-width="3" fill="none"/>
  <path d="M66 122 Q58 148 64 168 Q68 150 62 174 Q72 154 66 180"  stroke="#c026d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M80 126 Q76 154 80 172 Q84 156 80 178"                 stroke="#d946ef" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M100 128 Q100 158 104 176 Q100 160 98 180"             stroke="#c026d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M120 126 Q124 154 120 172 Q116 156 120 178"            stroke="#d946ef" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M134 122 Q142 148 136 168 Q132 150 138 174 Q128 154 134 180" stroke="#c026d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="64"  cy="160" r="3.5" fill="#f0abfc" opacity="0.7"/>
  <circle cx="80"  cy="155" r="3"   fill="#f0abfc" opacity="0.7"/>
  <circle cx="100" cy="158" r="3.5" fill="#f0abfc" opacity="0.7"/>
  <circle cx="120" cy="155" r="3"   fill="#f0abfc" opacity="0.7"/>
  <circle cx="136" cy="160" r="3.5" fill="#f0abfc" opacity="0.7"/>
</svg>`

};

// ---- Stage visual modifiers ----
const STAGE_STYLES = {
  baby:     { scale: 0.78, filter: 'brightness(1.05)',    extra: '' },
  child:    { scale: 0.90, filter: 'brightness(1.07)',    extra: '' },
  teen:     { scale: 1.00, filter: 'brightness(1.1)',     extra: '' },
  adult:    { scale: 1.12, filter: 'brightness(1.15) saturate(1.1)', extra: '' },
  champion: { scale: 1.25, filter: 'brightness(1.2) saturate(1.2) contrast(1.05)', extra: '' },
  mythic:   { scale: 1.40, filter: 'brightness(1.3) saturate(1.35) contrast(1.1)',  extra: '' }
};

function getSpriteHTML(creatureId, stage, sizePx) {
  const svg = SPRITES[creatureId] || '';
  const styleDef = STAGE_STYLES[stage] || STAGE_STYLES.baby;
  const base = sizePx || 120;
  const scaled = Math.round(base * styleDef.scale);
  return `<div class="creature-sprite-wrap" style="width:${base}px;height:${base}px;display:flex;align-items:center;justify-content:center">
    <div style="width:${scaled}px;height:${scaled}px;filter:${styleDef.filter};transition:all 0.5s ease;">
      ${svg}
    </div>
  </div>`;
}
