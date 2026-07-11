# HatchBound — Roadmap

## Monetization direction (owner's plan)
Character customization is the monetization path: each creature gets
special fitted gear/cosmetics, with premium items behind a paywall.

Implications to build toward:
- Per-creature gear slots already exist (weapon/armor/trinket) — extend
  with cosmetic slots (skins, auras, accessories) that change the
  creature's visual, not just stats
- Custom art pipeline (assets/creatures/) should support gear overlay
  layers per creature so premium gear renders ON the character
- IMPORTANT: a real paywall needs a payment provider (e.g. Stripe) and
  a small backend to verify purchases — GitHub Pages is static, so
  anything gated purely in client JS can be bypassed by savvy users.
  Fine for prototyping the UX now; add server-side entitlements before
  charging real money.

## Near-term engagement backlog
- Second egg slot / creature switching (biggest gap: no path to owning
  more than one creature)
- Daily quests ("win 2 battles, feed 3 times" -> reward chest)
- Achievements board with coin payouts
- Interactive battles (pick your move each round)
- Battle music loop + arena backgrounds per campaign zone
