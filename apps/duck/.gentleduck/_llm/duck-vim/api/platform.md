}>
  OS detection and cross-platform **Mod** key resolution. Detects whether the user is on macOS, Windows, or Linux and maps the virtual <Kbd>Mod</Kbd> key to the correct platform modifier.

```ts
import { detectPlatform, resolveMod, isMac } from '@gentleduck/vim/platform'
import type { Platform } from '@gentleduck/vim/platform'
```

## Types

### `Platform`

```ts
type Platform = 'mac' | 'windows' | 'linux'
```

***

## Functions

### `detectPlatform()`

Detects the current operating system by inspecting `navigator.userAgent`. The result is cached after the first call.

Returns `'linux'` when `navigator` is not available (SSR environments).

```ts
function detectPlatform(): Platform
```

**Example:**

```ts
const platform = detectPlatform() // 'mac' | 'windows' | 'linux'
```

}>
  The result is cached after the first call, so subsequent calls are effectively free.

***

### `resolveMod(platform?)`

Returns the platform-specific modifier that the virtual <Kbd>Mod</Kbd> key resolves to.

```ts
function resolveMod(platform?: Platform): 'meta' | 'ctrl'
```

| Platform | Returns |
| --- | --- |
| `'mac'` | `'meta'` |
| `'windows'` | `'ctrl'` |
| `'linux'` | `'ctrl'` |

**Example:**

```ts
resolveMod('mac')   // 'meta'
resolveMod('linux') // 'ctrl'
resolveMod()        // uses detectPlatform() automatically
```

}>
  Use <Kbd>Mod</Kbd> in your key bindings instead of hard-coding <Kbd>Ctrl</Kbd> or <Kbd>Meta</Kbd>. It automatically resolves to the right modifier for the user's OS.

***

### `isMac(platform?)`

Convenience check for macOS.

```ts
function isMac(platform?: Platform): boolean
```

**Example:**

```ts
if (isMac()) {
  console.log('Running on macOS')
}
```

***

### `_resetPlatformCache()`

Clears the cached platform detection result. Only useful for testing.

```ts
function _resetPlatformCache(): void
```

}>
  This is an internal API (prefixed with `_`). Do not use it in production code.