---
"@gentleduck/gen": patch
---

Mark `@gentleduck/gen` as deprecated. Add `deprecated` field to `package.json`, prominent warning in `README.md`, and a deprecation Callout at the top of the docs intro page.

Recommended replacements:

- **[nestia](https://nestia.io/)** — typed `@TypedRoute` / `@TypedBody` / `@TypedQuery` / `@TypedParam` decorators, automatic SDK generation, Swagger.
- **[typia](https://typia.io/)** — runtime validators, serializers, JSON schema generation via a TypeScript transformer plugin.

After this version publishes, run `npm deprecate "@gentleduck/gen" "Use nestia (https://nestia.io) and typia (https://typia.io) instead"` to mark every existing version on the npm registry as deprecated.
