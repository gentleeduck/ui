---
"@gentleduck/primitives": patch
---

fix(slot): use cn() with twMerge in mergeProps for className resolution

Raw string join caused conflicting Tailwind utilities (e.g. `inline-flex` vs `flex`, `gap-1` vs `gap-2`) to both appear in the final className, producing non-deterministic CSS and hydration mismatches when Slot clones client components like Next.js Link.
