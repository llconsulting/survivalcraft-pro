# Privacy Manifest (Draft / Placeholder)

You will need to generate Apple's required Privacy Manifest file(s) for iOS 18+ based on your actual data collection.

Current behavior in this repo:
- Camera: optional on-device viewfinder. It does not identify anything. The web preview does not open a camera.
- Local storage: progress, notes, and the demo tier flag stay on the device.
- No analytics, no tracking, no third-party data sharing.
- No location and no purchases. Free / Pro / Elite are local demo flags.

Action:
- When you add any SDKs (analytics, ads, attribution, etc), update the manifest and App Store privacy details accordingly.
