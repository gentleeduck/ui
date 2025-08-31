---
"@gentleduck/ttest": minor
---

---

## 'duck-ttest': minor

- Refactor SQL schema inference to:
  - Treat `AUTO_INCREMENT` columns as always non-nullable
  - Extract `ENUM(...)` columns into proper TypeScript union types
  - Honor `DEFAULT`, `NOT NULL`, `PRIMARY KEY`, and `REFERENCES` rules
- Add comprehensive battle-test suite (users, FKs, enums, DECIMAL, BLOB, JSON)
