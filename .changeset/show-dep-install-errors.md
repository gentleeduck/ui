---
"@gentleduck/cli": patch
---

fix: show actual error output when dependency installation fails

Previously stderr was suppressed with stdio:'ignore', making it impossible to diagnose install failures. Now the actual package manager error is included in the failure message.
