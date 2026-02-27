# @gentleduck/libs

A collection of tiny, framework-agnostic utilities. Each utility lives in its own folder and can be imported individually or all together.

## Installation

```bash
npm install @gentleduck/libs
```

or with yarn:

```bash
yarn add @gentleduck/libs
```

## Available Utilities

* `cn` - Utility for conditional className merging.
* `filtered-object` - Create a new object with only selected keys or values.
* `group-array` - Group array items by a given key or function.
* `group-data-by-numbers` - Group numbers into ranges or buckets.
* `parse-date` - Parse strings or values into valid Date objects.
* `index.ts` - Barrel file that re-exports utilities.

## Usage

```tsx
import { cn } from '@gentleduck/libs'

function MyComponent({ active }: { active: boolean }) {
  return <div className={cn('base', active && 'active')} />
}
```

## License

[MIT (c) gentleduck](./LICENSE)
