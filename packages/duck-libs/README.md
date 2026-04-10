<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/libs

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
