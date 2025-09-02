# @gentleduck/libs

This package provides a collection of reusable React hooks for the duck-ui component library.

## Available Hooks

- `use-composed-refs`: A hook to merge multiple refs into a single ref.
- `use-computed-timeout-transition`: A hook to manage timeout-based transitions.
- `use-debounce`: A hook to debounce a value.
- `use-is-mobile`: A hook to detect if the user is on a mobile device.
- `use-media-query`: A hook to use media queries in your components.
- `use-on-open-change`: A hook to handle open/close state changes.
- `use-stable-id`: A hook to generate a stable ID.

## Usage

To use a hook, import it from the corresponding directory:

```typescript
import { useDebounce } from '@gentleduck/libs/use-debounce';

function MyComponent() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  // ...
}
```

## License

[MIT © GentleDuck](./LICENSE)

