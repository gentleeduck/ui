---
'@gentleduck/registry-ui': patch
---

Performance pass across all Motion components. Extracted inline useMotionPreset option objects to module-level constants. Memoized context provider values in Accordion, Tabs, ToggleGroup, and Collapsible. Extracted inline animate and transition literals to constants in Switch, Tabs, and Progress. Memoized event handlers with useCallback. Converted 47 wildcard barrel exports to named exports for tree-shaking. Migrated all 41 component files from string-based preset lookups to direct preset object imports. Fixed stale event handler closure in CollapsibleTrigger. Fixed MotionSelectTrigger to use LazyMotion plus m.div instead of the heavy motion.div root import. Added sideEffects false to package.json.
