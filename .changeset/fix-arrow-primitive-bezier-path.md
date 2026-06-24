---
"@gentleduck/primitives": patch
---

Fix arrow base component to use smooth bezier curve path instead of polygon. Correct `TooltipArrow` and `PopoverArrow` to use `PopperArrow` primitive instead of `PopperAnchor` (was rendering invisible). Fix `asChild` propagation to `Primitive.svg` that caused SVG to become a Slot and eject children.
