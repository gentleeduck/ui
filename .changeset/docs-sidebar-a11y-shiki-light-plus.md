---
"@gentleduck/docs": patch
---

fix(docs-sidebar): add aria-label fallback so the depth-0 group header link in `DocsSidebarNav` always exposes an accessible name even when the section title is empty (the introduction section).

fix(velite): switch the rehype-pretty-code light theme from `github-light` to `light-plus`. The github-light keyword red `#D73A49` failed 4.5:1 contrast against the docs surface in light mode; light-plus uses darker tokens that pass WCAG AA.
