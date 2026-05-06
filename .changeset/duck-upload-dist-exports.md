---
"@gentleduck/upload": patch
---

Point package `exports` at compiled `./dist/*` output instead of `./src/*.ts` source. Add multi-entry build (`index`, `core`, `react`, `strategies`) so subpath imports work for non-bundler consumers (e.g. NestJS via Node CJS). Fixes runtime `SyntaxError` when consumed by apps that don't transpile package source.
