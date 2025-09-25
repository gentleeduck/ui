# @gentleduck/libs

A collection of tiny, framework-agnostic React libs. Each hook lives in its own folder and can be imported individually or all together.

## Installation

```bash
npm install @gentleduck/libs
````

or with yarn:

```bash
yarn add @gentleduck/libs
```

## Available Hooks

* `cn` – Utility for conditional className merging.
* `filtered-object` – Create a new object with only selected keys or values.
* `group-array` – Group array items by a given key or function.
* `group-data-by-numbers` – Group numbers into ranges or buckets.
* `parse-date` – Parse strings or values into valid Date objects.
* `index.ts` – Barrel file that re-exports utilities.

## Usage

```tsx
import { useDebounce } from '@gentleduck/libs'

function SearchInput() {
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 300)

  useEffect(() => {
    // trigger API search with `debounced`
  }, [debounced])

  return <input value={value} onChange={e => setValue(e.target.value)} />
}
```

## License

[MIT © GentleDuck](./LICENSE)
