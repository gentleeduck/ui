---
"@gentleduck/docs": minor
---

feat: migrate from @shikijs/compat to shiki v2 and resolve mermaid locally

Replaced @shikijs/compat with native shiki v2 createHighlighter. Improved
rehype-mermaid to resolve mermaid from node_modules instead of CDN, and
added --allow-file-access-from-files for local rendering.
