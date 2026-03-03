---
"@gentleduck/cli": patch
---

fix: align ThemeResponse type with updated registry API response shape

The theme registry endpoint now returns `light`, `dark`, and `radius` at the top level instead of nesting them under `cssVars`. Updated all consumers to match the new response shape.
