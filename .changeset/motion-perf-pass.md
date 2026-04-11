---
'@gentleduck/motion': minor
---

Performance and tree-shaking improvements for the motion library.

useMotionPreset now accepts either a preset name string or a preset object directly. The object form enables tree-shaking since unused presets are never imported. Exported MotionProvider from the barrel. Removed deprecated motion-tokens module. Extracted shared preset utilities into presets/_utils.ts. Moved TAP_SCALE_TRANSITION and standardEase to transitions/tweens.ts as shared constants. Added sideEffects false to enable bundler tree-shaking.
