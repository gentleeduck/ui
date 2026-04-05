<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/hooks

React utility hooks.

## Quick Start

```bash
bun add @gentleduck/hooks
```

```tsx
import { useDebounce } from '@gentleduck/hooks/use-debounce'

function Search() {
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 300)

  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}
```

## Hooks

| Hook | Import | Description |
| --- | --- | --- |
| `useComposedRefs` | `@gentleduck/hooks/use-composed-refs` | Merge multiple refs into one |
| `useComputedTimeoutTransition` | `@gentleduck/hooks/use-computed-timeout-transition` | Timeout-based transitions |
| `useCopyToClipboard` | `@gentleduck/hooks/use-copy-to-clipboard` | Copy text to clipboard |
| `useDebounce` | `@gentleduck/hooks/use-debounce` | Debounce a value |
| `useIsMobile` | `@gentleduck/hooks/use-is-mobile` | Detect mobile viewport |
| `useMediaQuery` | `@gentleduck/hooks/use-media-query` | Subscribe to media queries |
| `useOnOpenChange` | `@gentleduck/hooks/use-on-open-change` | Handle open/close state |
| `useStableId` | `@gentleduck/hooks/use-stable-id` | Generate a stable ID |

Each hook is tree-shakeable via its own subpath export.

## License

MIT
