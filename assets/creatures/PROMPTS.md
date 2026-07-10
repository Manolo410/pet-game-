# HatchBound — Character Art Generation Guide

## Where to generate (free options)

| Tool | Cost | Notes |
|------|------|-------|
| **Recraft** (recraft.ai) | Free daily credits | **Best pick** — can export true transparent-background PNGs directly |
| **Microsoft Bing Image Creator** (bing.com/create) | Free | DALL-E powered, 15 fast generations/day |
| **Google ImageFX** (labs.google/fx) | Free | High quality, needs a Google account |
| **Leonardo.ai** | 150 free tokens/day (~20 images) | Has a background-remover built in |
| **Krea** | Free tier, limited daily | Real-time generation is fun for iterating |

You need **36 images total** (12 creatures × 3 phases) — that fits comfortably
in one or two days of free daily credits on any of these.

**Transparency tip:** Only Recraft reliably outputs transparent PNGs. On other
tools, add "isolated on plain solid white background" to the prompt, then
remove the background for free at **remove.bg** (free size is plenty) or
photopea.com (Select > Color Range > delete). Save as PNG.

## How to add images to the game (no coding)

1. Name each file **exactly** (lowercase): `<creatureId>_<phase>.png`
   - Phases: `baby`, `teen`, `adult`
   - Example: `fire_lion_baby.png`, `fire_lion_teen.png`, `fire_lion_adult.png`
2. On GitHub: open this folder (`assets/creatures/`) on the **gh-pages** branch
   → **Add file → Upload files** → drop the images → Commit.
3. Reload the game. It auto-detects every image at startup — no code edits.
   Missing images just keep the built-in SVG art, so add art at your own pace.

The baby image also covers the Child stage; the adult image covers
Champion and Mythic. Square images ~512×512 or 1024×1024 work best.

## Style block (keep identical across ALL 36 prompts for a consistent look)

> 2D game character art, digimon-inspired armored digital monster, cel-shaded
> with dramatic rim lighting, angular armor plates, glowing energy circuit
> lines, full body, centered, facing slightly left, isolated on plain solid
> white background, no text, no watermark, no shadow on ground

Phase modifiers:
- **baby**: chibi hatchling proportions, oversized head and eyes, tiny body, cute but fierce, minimal armor
- **teen**: lean adolescent build, partial armor forming, energetic battle stance
- **adult**: massive battle-hardened build, full heavy armor, imposing pose, crackling with elemental power

---

## The 36 prompts

### 1. Emberclaw — fire lion (`fire_lion`)
- **fire_lion_baby.png** — Chibi baby fire lion cub digital monster, oversized head and huge amber eyes, tiny flame-tipped tail that glows like an ember, small orange and gold armor shoulder pads, warm orange fur with glowing circuit lines, cute but fierce. [style block + baby]
- **fire_lion_teen.png** — Adolescent fire lion digital monster, lean athletic build, growing mane of crystallized flames, partial orange and black armor plates on chest and forelegs, glowing orange energy circuits along its flanks, cinders drifting from its mouth. [style block + teen]
- **fire_lion_adult.png** — Massive armored fire lion war beast, full mane of blazing crystalline flames, heavy volcanic black-and-orange armor with a glowing solar core in the chest plate, molten claws, burning eyes, ember circuit lines pulsing across its body. [style block + adult]

### 2. Komodo — venom lizard (`komodo`)
- **komodo_baby.png** — Chibi baby komodo dragon digital monster, chunky body, oversized head with big green eyes, tiny venom-tipped claws, small thorn buds on its back, bright toxic-green scales with faint glowing circuit lines. [style block + baby]
- **komodo_teen.png** — Adolescent komodo dragon digital monster, lean muscular build, rows of sharp thorn spines growing along its back, green and dark-gray armor plates forming on shoulders, venom dripping from fangs, toxic-green energy circuits glowing on its hide. [style block + teen]
- **komodo_adult.png** — Massive armored komodo dragon war beast, thick plated hide in toxic green and black, huge thorned back spines radiating a poisonous aura, heavy claws with venom channels glowing bright green, armored skull crest, dripping acid. [style block + adult]

### 3. Serpentis — shadow snake (`snake`)
- **snake_baby.png** — Chibi baby serpent digital monster, small coiled noodle body, enormous curious purple eyes, tiny dark-violet scales with a faint glowing shadow aura, one small armor plate on its forehead. [style block + baby]
- **snake_teen.png** — Adolescent shadow serpent digital monster, sleek coiled body, dark purple scales with visible ribbons of shadow energy flowing through them, angular violet armor segments along its spine, narrow glowing eyes. [style block + teen]
- **snake_adult.png** — Massive armored shadow serpent deity, huge coiled body in near-black violet scales, heavy segmented dark armor with glowing purple runes, hood flared like a cobra with shadow flames, piercing glowing slit eyes, wisps of darkness swirling around it. [style block + adult]

### 4. Dinorawr — stone raptor (`dinosaur`)
- **dinosaur_baby.png** — Chibi baby T-rex digital monster, oversized head with big eyes and tiny arms, stubby tail, amber-orange hide with small stone pebble armor patches, cute ferocious grin. [style block + baby]
- **dinosaur_teen.png** — Adolescent raptor digital monster, athletic predator build, amber and gray hide with rocky armor plates forming on its back and thighs, glowing orange circuit lines, powerful jaw, dust and pebbles floating around its stomping feet. [style block + teen]
- **dinosaur_adult.png** — Massive armored tyrannosaur war beast, hide fused with granite armor slabs, glowing magma-orange circuit veins between stone plates, colossal jaws, spiked stone tail club, cracked earth beneath it. [style block + adult]

### 5. Gorrox — battle gorilla (`gorilla`)
- **gorilla_baby.png** — Chibi baby gorilla digital monster, oversized fists bigger than its head, determined scowl, gray fur with small silver armor knuckle guards, faint white energy circuits on its arms. [style block + baby]
- **gorilla_teen.png** — Adolescent gorilla brawler digital monster, lean muscular build, silver-gray fur, angular gunmetal armor forming on shoulders and forearms, glowing white knuckle plates, boxing stance. [style block + teen]
- **gorilla_adult.png** — Massive armored gorilla war chief, hulking build with full gunmetal and steel armor across chest and arms, colossal glowing gauntlet fists, silverback plating, white energy circuits blazing across its armor, mid ground-pound pose. [style block + adult]

### 6. Bruinax — stone bear (`bear`)
- **bear_baby.png** — Chibi baby bear cub digital monster, round and impossibly fluffy, big warm eyes, brown fur with tiny stone pebble armor patches on shoulders, faint amber circuit glow. [style block + baby]
- **bear_teen.png** — Adolescent bear digital monster, sturdy build, brown fur hardening into rock patches on back and forearms, amber armor plates forming, glowing amber circuit lines, standing on hind legs. [style block + teen]
- **bear_adult.png** — Massive armored bear fortress beast, granite-fused hide, heavy stone slab armor across its back and shoulders, glowing amber energy seams between rock plates, giant steel-tipped claws, immovable stance. [style block + adult]

### 7. Nocturnis — shadow bat (`bat`)
- **bat_baby.png** — Chibi baby bat digital monster, oversized head with huge glowing violet eyes, tiny folded wings, fluffy dark-purple fur, one small armor plate on its chest, hanging upside down pose optional. [style block + baby]
- **bat_teen.png** — Adolescent bat digital monster, sleek build with wide angular wings, dark purple membrane with glowing violet circuit veins, forming armor on chest and wing joints, sharp ears, echolocation rings visible. [style block + teen]
- **bat_adult.png** — Massive armored vampire bat war beast, huge blade-edged wings with glowing violet energy membranes, segmented dark armor over torso, glowing purple sonic emitter in chest plate, fanged snarl, shadow mist swirling. [style block + adult]

### 8. Stormtalon — wind eagle (`eagle`)
- **eagle_baby.png** — Chibi baby eagle chick digital monster, round fluffy sky-blue body, oversized eyes, tiny wings, small white and cyan armor plate on its head, faint wind swirl lines around it. [style block + baby]
- **eagle_teen.png** — Adolescent storm eagle digital monster, sleek aerodynamic build, sky-blue and white feathers with cyan circuit lines, angular armor forming on wings and talons, wind currents visibly bending around its wings. [style block + teen]
- **eagle_adult.png** — Massive armored storm eagle war bird, huge razor wings with blade-like armored feathers in blue and white, glowing cyan wind circuits, heavy talon gauntlets, storm clouds and lightning crackling behind its wingspan. [style block + adult]

### 9. Hypnowl — mystic owl (`owl`)
- **owl_baby.png** — Chibi baby owl digital monster, huge hypnotic spiral purple eyes, round fluffy violet body, tiny wings, small mystic rune armor plate on forehead, sparkles drifting around it. [style block + baby]
- **owl_teen.png** — Adolescent mystic owl digital monster, elegant build, violet and lavender feathers with glowing arcane circuit patterns, crescent-moon armor plates forming on chest and wings, eyes glowing with psychic rings. [style block + teen]
- **owl_adult.png** — Massive armored arch-mage owl, regal violet plumage with gold-trimmed mystic armor, floating arcane rune rings orbiting its wings, third-eye gem blazing on its armored forehead, psychic energy radiating in waves. [style block + adult]

### 10. Tidalrex — sea dragon (`sea_dragon`)
- **sea_dragon_baby.png** — Chibi baby sea dragon digital monster, small serpentine body, oversized head with big teal eyes, tiny fins, aqua-cyan scales with faint glowing water circuit lines, one small coral armor plate. [style block + baby]
- **sea_dragon_teen.png** — Adolescent sea dragon digital monster, sleek serpentine build, teal and deep-blue scales, fin blades growing along its spine, aqua armor segments forming, glowing cyan circuits, water spiraling around its body. [style block + teen]
- **sea_dragon_adult.png** — Massive armored leviathan sea dragon, long powerful serpentine body in deep blue and teal, heavy coral-steel armor plates with glowing tide runes, blade fins, whirlpool energy core in its chest, commanding a wave. [style block + adult]

### 11. Shocktide — storm shark (`storm_shark`)
- **storm_shark_baby.png** — Chibi baby shark digital monster, round torpedo body, oversized head with big electric-yellow eyes, tiny dorsal fin with one little lightning bolt spark, blue skin with faint yellow circuit lines. [style block + baby]
- **storm_shark_teen.png** — Adolescent storm shark digital monster, sleek hydrodynamic build, electric blue skin with yellow lightning circuit veins, angular armor forming on its dorsal fin and snout, sparks arcing off its fins. [style block + teen]
- **storm_shark_adult.png** — Massive armored thunder shark war beast, heavy storm-gray and electric-blue armor plating, giant blade dorsal fin channeling a lightning bolt, glowing yellow tesla core in its jaw armor, electricity arcing across its whole body. [style block + adult]

### 12. Lumilux — crystal jellyfish (`jellyfish`)
- **jellyfish_baby.png** — Chibi baby jellyfish digital monster, small glowing translucent pink dome, huge cute glowing eyes inside the bell, short stubby tentacles, one tiny crystal armor ring around its dome, soft magenta light. [style block + baby]
- **jellyfish_teen.png** — Adolescent crystal jellyfish digital monster, elegant translucent magenta bell with glowing circuit filaments inside, crystal armor segments forming around the dome rim, long flowing luminous tentacles. [style block + teen]
- **jellyfish_adult.png** — Massive armored crystal jellyfish deity, huge radiant magenta-and-violet bell crowned with prismatic crystal armor, a blazing light core visible inside, dozens of flowing energy tentacles ending in crystal blades, aurora light rippling through its body. [style block + adult]
