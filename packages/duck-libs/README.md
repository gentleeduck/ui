<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/libs" width="120"/>
</p>

<h1 align="center">@gentleduck/libs</h1>

<p align="center">
  Tiny, framework-agnostic utility functions for gentleduck/ui.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/libs"><img src="https://img.shields.io/npm/v/@gentleduck/libs.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/libs"><img src="https://img.shields.io/npm/dm/@gentleduck/libs.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/libs.svg" alt="MIT"/></a>
</p>

---

Shared utilities for the gentleduck ecosystem.

## Quick Start

```bash
bun add @gentleduck/libs
```

```tsx
import { cn } from '@gentleduck/libs/cn'

<div className={cn('base', active && 'bg-blue-500')} />
```

## Utilities

| Utility | Import | Description |
| --- | --- | --- |
| `cn` | `@gentleduck/libs/cn` | Conditional className merging (clsx + tailwind-merge) |
| `cnMemo` | `@gentleduck/libs/cn` | Memoized `cn` for stable class-string inputs |
| `chunkByCounts` | `@gentleduck/libs/chunk-by-counts` | Partition an array into consecutive groups by given sizes |
| `filteredObject` | `@gentleduck/libs/filtered-object` | Type-safe shallow `Omit<T, K>` |
| `generateArabicSlug` | `@gentleduck/libs/generate-arabic-slug` | URL-safe slug retaining Arabic script + Latin + digits |
| `getTodayDate` | `@gentleduck/libs/get-today-date` | Today as `YYYY-MM-DD` in the local timezone |
| `groupArrays` | `@gentleduck/libs/group-array` | **Deprecated.** Alias for `chunkByCounts` (reversed params) |
| `groupDataByNumbers` | `@gentleduck/libs/group-data-by-numbers` | **Deprecated.** Alias for `chunkByCounts` |
| `parseDate` | `@gentleduck/libs/parse-date` | Parse `"today"`, `"in N days"`, ISO-8601, or long-form date to `Date` |

Each utility is tree-shakeable via its own subpath export. Zero framework dependencies.

### Performance notes

- `cn()` allocates a fresh array on every call and walks the `tailwind-merge`
  trie on every invocation. With 1000+ import sites monorepo-wide this is the
  hottest className path. Hoist stable class strings out of render bodies, or
  use `cnMemo` when the inputs are stable primitive strings.
- `cnMemo` keys its cache by the joined input. Do not feed it dynamic
  booleans / arrays / objects — that leaks memory without payoff.

### Deprecations

`groupArrays` and `groupDataByNumbers` were byte-identical implementations
with reversed parameter order. Both are now thin aliases over `chunkByCounts`
and will be removed in the next major. Migrate to:

```ts
import { chunkByCounts } from '@gentleduck/libs/chunk-by-counts'

chunkByCounts(['a', 'b', 'c', 'd', 'e'], [2, 3])
// => [['a', 'b'], ['c', 'd', 'e']]
```

## License

MIT
