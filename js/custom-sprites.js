// =====================================================
// HATCHBOUND — Custom Character Art (zero-config)
// =====================================================
// Drop AI-generated images into assets/creatures/ and the game
// finds them automatically at startup. NO code changes needed.
//
// File naming (exact, lowercase, .png):
//   assets/creatures/<creatureId>_<phase>.png
//   phases: baby, teen, adult   (3 images per creature)
//
//   e.g. assets/creatures/fire_lion_baby.png
//        assets/creatures/fire_lion_teen.png
//        assets/creatures/fire_lion_adult.png
//
// Creature ids: fire_lion, komodo, snake, dinosaur, gorilla, bear,
//               bat, eagle, owl, sea_dragon, storm_shark, jellyfish
//
// The game has 6 growth stages but only needs 3 art phases:
//   baby image covers Baby + Child, teen covers Teen,
//   adult covers Adult + Champion + Mythic.
// Any missing image falls back to the built-in SVG sprite, so you
// can upgrade one image at a time.
//
// Ready-to-paste generation prompts for all 36 images are in
// assets/creatures/PROMPTS.md

// Populated automatically by detectCustomSprites() at startup
const CUSTOM_SPRITES = {};

// Maps the 6 game stages onto the 3 art phases
const CUSTOM_STAGE_MAP = {
  baby: 'baby', child: 'baby',
  teen: 'teen',
  adult: 'adult', champion: 'adult', mythic: 'adult'
};
const CUSTOM_SPRITE_PHASES = ['baby', 'teen', 'adult'];

// Probes assets/creatures/ for every creature+phase image.
// Calls onDone(foundAny) once all probes settle.
function detectCustomSprites(onDone) {
  const ids = Object.keys(CREATURES);
  let pending = ids.length * CUSTOM_SPRITE_PHASES.length;
  let found = false;
  const settle = () => { if (--pending === 0 && onDone) onDone(found); };
  ids.forEach(id => {
    CUSTOM_SPRITE_PHASES.forEach(phase => {
      const img = new Image();
      img.onload = () => {
        (CUSTOM_SPRITES[id] = CUSTOM_SPRITES[id] || []).push(phase);
        found = true;
        settle();
      };
      img.onerror = settle;
      img.src = `assets/creatures/${id}_${phase}.png`;
    });
  });
}
