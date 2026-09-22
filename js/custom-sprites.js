// =====================================================
// HATCHBOUND — Character Art
// =====================================================
// Drop images into assets/creatures/ and the game uses them automatically.
//
// File naming (exact, lowercase, .png):
//   assets/creatures/<creatureId>_<phase>.png   phases: baby, teen, adult
//   e.g. assets/creatures/fire_lion_baby.png
//
// Creature ids: fire_lion, komodo, snake, dinosaur, gorilla, bear,
//               bat, eagle, owl, sea_dragon, storm_shark, jellyfish
//
// A missing image falls back to the built-in SVG sprite for that creature,
// so art can be added or replaced one file at a time.
//
// Generation prompts for all 36 images: assets/creatures/PROMPTS.md

// Maps game stages onto the three art phases. The game now has exactly
// these three stages; the older names are kept so saves from earlier
// versions still resolve to the right image.
const CUSTOM_STAGE_MAP = {
  baby: 'baby', child: 'baby',
  teen: 'teen',
  adult: 'adult', champion: 'adult', mythic: 'adult'
};
