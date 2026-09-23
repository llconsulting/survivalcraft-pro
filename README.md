# SurvivalCraft Pro

A short preparedness game for the web. You walk **The Dry Mile**: four decisions about water, shelter and fire, what to carry, and a care call that is deliberately not a medical course. Progress, streak, and readiness persist on the device.

Tiers are demo flags. There is no StoreKit purchase and no camera identification.

## Play

```bash
npm install
npm start
```

Then press `w` for web, or open the Trail tab.

1. Choose a loadout.
2. Read the leg and pick a decision. The cost shows after you commit.
3. Finish the mile or turn back. The debrief is the training. Run it again if you want the sound calls.

Daily drills clear when you walk the matching leg. Field cards you only read stop at 70. A sound drill is what marks a skill drilled.

## Checks

```bash
npm test
npx tsc --noEmit
npm run build:web
```

`build:web` writes a static site to `dist/`.
