// =====================================================
// HATCHBOUND — Custom Character Art (optional)
// =====================================================
// Want higher-fidelity characters than the built-in SVG sprites?
// Generate art with any AI image tool (Krea, Midjourney, DALL-E,
// Leonardo, etc.), then drop the images in and register them here.
//
// HOW TO USE:
// 1. Generate a character image with a TRANSPARENT background
//    (PNG or WebP, roughly square, ~512x512 works great).
//    Prompt tip: "digimon-style armored fire lion monster, angular
//    plates, glowing energy circuits, game character, full body,
//    transparent background, no text"
// 2. Save it as:  assets/creatures/<creatureId>_<stage>.png
//    e.g.         assets/creatures/fire_lion_baby.png
//                 assets/creatures/fire_lion_adult.png
//    Creature ids: fire_lion, komodo, snake, dinosaur, gorilla, bear,
//                  bat, eagle, owl, sea_dragon, storm_shark, jellyfish
//    Stages:       baby, child, teen, adult, champion, mythic
// 3. Register each file below. Any stage NOT listed automatically
//    falls back to the built-in SVG sprite, so you can upgrade
//    creatures one image at a time.
//
// Example:
//   const CUSTOM_SPRITES = {
//     fire_lion: ['baby', 'adult', 'champion'],
//     sea_dragon: ['mythic']
//   };

const CUSTOM_SPRITES = {};
