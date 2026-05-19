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
| `filteredObject` | `@gentleduck/libs/filtered-object` | Pick/omit keys from an object |
| `groupArray` | `@gentleduck/libs/group-array` | Group array items by key or function |
| `groupDataByNumbers` | `@gentleduck/libs/group-data-by-numbers` | Bucket numbers into ranges |
| `parseDate` | `@gentleduck/libs/parse-date` | Parse values into Date objects |

Each utility is tree-shakeable via its own subpath export. Zero framework dependencies.

## License

MIT
