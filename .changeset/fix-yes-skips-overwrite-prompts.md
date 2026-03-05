---
"@gentleduck/cli": patch
---

fix: --yes flag now skips per-component overwrite prompts

Previously only --force skipped overwrite prompts. Now --yes (non-interactive mode) also skips them, since the user explicitly opted out of interactive prompts.
