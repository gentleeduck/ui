---
"@gentleduck/motion": patch
---

Fix `files` field to include `src/css/index.css` instead of stale `src/index.css`. The `./css` export pointed to a path that wasn't shipped in the tarball, breaking `import '@gentleduck/motion/css'` in consumer apps.
