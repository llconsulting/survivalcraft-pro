# SurvivalCraft Pro (iOS starter build)

What you have here:
- Expo SDK 50 + TypeScript
- Bottom tab nav with elevated center Scan button
- Pure black UI + glass cards + haptics
- Skills tree + detail modal + safe, non-actionable content
- AR scan screen (camera + animated scan line) with placeholder results
- Intel feed (demo dataset)
- Profile screen with tier selection + elite age gate (UI/state only)
- Persisted user state via AsyncStorage

## Run

```bash
npm install
npx expo start
```

## Notes (read this)
- **No StoreKit purchases** are implemented in this build. The tier selector is state-only.
- **Elite modules are educational-only placeholders** (no harmful/illegal instructions).
- AR “plant ID” is UI-only. Add a vetted model/API later.
