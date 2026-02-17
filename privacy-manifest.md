# Privacy Manifest (Draft / Placeholder)

You will need to generate Apple's required Privacy Manifest file(s) for iOS 18+ based on your actual data collection.

Current behavior in this repo:
- Camera access: used for scan screen UI (permission gated)
- Local storage: AsyncStorage to persist user progress/tier
- No analytics, no tracking, no third-party data sharing

Planned (stubbed):
- Location: for localized alerts/maps (not actively used in UI yet)
- Purchases: StoreKit subscriptions (not implemented)

Action:
- When you add any SDKs (analytics, ads, attribution, etc), update the manifest and App Store privacy details accordingly.
