<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/hooks" width="120"/>
</p>

<h1 align="center">@gentleduck/hooks</h1>

<p align="center">
  React hooks for Duck UI.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/hooks"><img src="https://img.shields.io/npm/v/@gentleduck/hooks.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/hooks"><img src="https://img.shields.io/npm/dm/@gentleduck/hooks.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/hooks.svg" alt="MIT"/></a>
</p>

---

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
