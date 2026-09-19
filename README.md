# 🥚 HatchBound: Beast Arena

**Play now → [manolo410.github.io/pet-game-](https://manolo410.github.io/pet-game-/)**

Raise a digital beast from an egg, train it, and fight your way through a
40-level campaign. You don't just collect the fighter — you raise the fighter.

Works in any phone or desktop browser. No install, no sign-up required.

---

## 📱 How to play (and how to share it)

Just open the link. On a phone, tap **Share → Add to Home Screen** and it
behaves like a real app — fullscreen, with its own icon.

**Sending it to a friend:** text them the link above. That's the whole thing.
They open it, get their own egg, and their character saves on their phone.
Nothing to install and nothing for you to set up. See
[Testing with friends](#-testing-with-friends) for the details.

**Turn the sound on.** Half the game is audio — musical mini-games, battle
impacts, victory fanfares. There's a 🔊 button on the home and egg screens.

---

## 🎮 The game

### 1. Choose your bloodline
Four lineages — **Reptilian**, **Mammal**, **Flying**, **Aquatic** — each with
three beasts. Twelve in total, each with its own element, stats, moves and lore.

### 2. Hatch your egg — no waiting
There is no timer. Your egg hatches when you've bonded with it enough, and
bonding happens by playing. Four mini-games each build a different stat:

| Game | What you do | Builds |
|------|-------------|--------|
| 🌡️ **Warm** | Keep the temperature in the green zone as heat drains and cold gusts hit | Warmth |
| 🪹 **Rock** | Tap Left/Right alternately, timed to a swinging needle | Comfort |
| ✨ **Sing** | Repeat a growing pattern of colored notes (it speeds up) | Energy |
| 🛡️ **Shield** | Tap incoming threats before they reach the egg | Stability |

You can also just **tap the egg** to pet it — it thumps like a heartbeat and
slowly builds bond on its own.

Watch the egg: it cracks, rocks, and shakes harder as the hidden bond grows,
and the game shouts encouragement as you get close. Score well and you earn
**incubation bonuses** that stay with your beast for life.

### 3. Raise it
Your beast hatches **weak on purpose** — a hatchling has stats in the teens.
Care for it with **Feed, Bathe, Bond, Play, Rest**, and its vitals drop over
time if you neglect it (the bars pulse red when it needs you). Tap your beast
any time to pet it — it reacts, and tells you what it needs.

**Training makes it permanently stronger.** Three games in the Training Center:

- ⚡ **Reflex Strike** → Speed + Attack
- 🔥 **Endurance Burn** → Health + Defense
- 🎯 **Focus Target** → Attack + Speed

Stat gains scale with how well you play, up to +60 per stat.

### 4. Evolve
Three life stages, each a dramatic visual change:

| Stage | Levels | Power |
|-------|--------|-------|
| **Baby** | 1–23 | Fragile |
| **Teen** | 24–49 | Roughly double |
| **Adult** | 50+ | Devastating |

### 5. Fight
- **Quick Battle** — a random opponent whenever you want
- **Campaign** — 40 levels across 5 themed zones, ending at the Shadow Citadel

Every campaign level plays differently thanks to rotating modifiers: raging
foes (+18% attack), blitz foes (+30% speed), armored foes, ambush levels where
you start at 75% health, and empowered bosses that drop rare gear. Earn **1–3
stars** per level based on how much health you keep.

Spend coins in the **Gear** shop on weapons, armor and trinkets.

### Every playthrough is different
Each hatch rolls a random **nature** (7 kinds, each with stat trade-offs),
hidden **IVs** (±8% per stat), and a random **personality**. Two players who
pick the same creature will get meaningfully different beasts.

---

## 💾 Saving your progress

**Your game saves automatically.** Every action saves, plus a save fires the
moment you switch apps, lock your phone, or close the tab, and again every 30
seconds during long sessions. Come back any time and tap **Continue**.

A backup copy is kept, so if a save is ever interrupted or corrupted the game
recovers from the backup instead of losing your beast.

**By default, saves live on the device you play on.** Your friend's beast is on
their phone, yours is on yours. This means:

- ✅ Close the app and come back — your beast is waiting
- ✅ Each player has their own independent character
- ⚠️ Clearing your browser data erases the save
- ⚠️ Your beast doesn't follow you from phone to laptop

**Want real accounts?** The game has optional email login with cloud saves
built in — players sign up and their beast follows them to any device. It's
free and takes about 5 minutes to switch on:
see **[docs/CLOUD-SETUP.md](docs/CLOUD-SETUP.md)**.

---

## 👥 Testing with friends

1. Send them **https://manolo410.github.io/pet-game-/**
2. Tell them to tap **Share → Add to Home Screen** (iPhone) or
   **⋮ → Add to Home screen** (Android) for the fullscreen experience
3. Tell them to **turn the sound on**

Each person automatically gets their own egg and their own save on their own
phone — no accounts, no setup, no interference between players. The first load
pulls about 11 MB of character art; after that it's cached and instant.

**Good things to ask a tester:**
- Did the egg mini-games feel fun, or too hard/easy?
- Was it clear what to do next at every point?
- Did you come back a second time? What pulled you back?
- Did anything look broken or confusing on your phone?

---

## 🛠️ Working on the game

No build step, no dependencies. It's plain HTML, CSS and JavaScript — edit a
file, refresh the browser.

```bash
git clone https://github.com/Manolo410/pet-game-.git
cd pet-game-
python3 -m http.server 8000     # then open http://localhost:8000
```

> Open `index.html` directly and the character art won't load — browsers block
> local file access. Use the tiny server above.

### Where things live

| File | What's in it |
|------|--------------|
| `index.html` | Screen containers and script order |
| `css/main.css` | Everything visual — theme tokens live at the top in `:root` |
| `js/data.js` | Creatures, moves, elements, gear, stages, XP curve |
| `js/game.js` | Game state, screens, care, training, saves, mini-games |
| `js/battle.js` | Combat simulation and playback |
| `js/campaign.js` | The 40-level campaign |
| `js/sprites.js` | Built-in SVG sprites + art loader |
| `js/sfx.js` | All sound, synthesized in the browser |
| `js/fx.js` | Visual effects engine (background, ripples, shake, bursts) |
| `js/cloud.js` | Optional accounts and cloud saves |
| `assets/creatures/` | Character art (12 creatures × baby/teen/adult) |
| `tools/` | Art generation and review scripts |

### Common edits

**Change the look** — every color is a token at the top of `css/main.css`:
```css
:root {
  --cyan: #22e0ff;   --purple: #b45cff;   --gold: #ffc531;
  --green: #2fe89a;  --red: #ff3b6b;      --pink: #ff4fd8;
}
```

**Rebalance the game** — in `js/data.js`:
- `xpForLevel()` — how fast players level up
- `STAGES` / `STAGE_POWER` — stage bands and how strong each one is
- `CREATURES` — every creature's base stats

**Tune the campaign** — `getCampaignLevel()` in `js/campaign.js` controls
opponent levels, modifiers and rewards.

**Replace character art** — drop a PNG into `assets/creatures/` named
`<creatureId>_<phase>.png` (phases: `baby`, `teen`, `adult`). The game finds it
automatically; missing images fall back to the built-in sprites. Prompts for
generating new art are in `assets/creatures/PROMPTS.md`.

### Branches

| Branch | Purpose |
|--------|---------|
| `main` | The source of truth |
| `gh-pages` | What the live site serves — deploy by copying `index.html`, `css/`, `js/`, `assets/` here |

To deploy after changes on `main`:
```bash
git checkout gh-pages
git checkout main -- index.html css js assets
git commit -am "Deploy" && git push
git checkout main
```

The live site updates a minute or two after pushing. Hard-refresh your phone
to get past the cache.

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md). Highlights:

- A second egg slot so you can raise more than one beast
- Daily quests and an achievements board
- Interactive battles (choose your move each round)
- Cosmetic gear per creature — the planned monetization path
