## Overview

The client layer is the public entry point for creating an upload store. It
normalizes config, wires plugins, sets up the transport, and returns a stable
`UploadStore`.

## Creating a Client

`createUploadClient` is the recommended way to create an upload store:

```typescript title="src/lib/upload-client.ts"

const client = createUploadClient({
  api: uploadApi,
  strategies: strategyRegistry,
  config: {
    maxConcurrentUploads: 3,
    maxAttempts: 3,
    progressThrottleMs: 100,
    autoStart: ["avatar"],
    maxItems: 100,
    validation: {
      avatar: { maxSizeBytes: 5 * 1024 * 1024, allowedTypes: ["image/*"] },
    },
  },
})
```

`createUploadClient` is a thin alias for `createUploadStore`. Both return the same
`UploadStore` interface.

## Configuration

All config fields are optional. `resolveUploadConfig()` applies defaults at
construction time:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `maxConcurrentUploads` | `number` | `3` | Maximum simultaneous uploads |
| `progressThrottleMs` | `number` | `100` | Minimum interval between progress updates (ms) |
| `maxAttempts` | `number` | `3` | Maximum retry attempts per upload |
| `maxItems` | `number` | `100` | Maximum items in state before cleanup |
| `autoStart` | `P[] \| (purpose: P) => boolean` | `undefined` | Auto-start uploads for matching purposes |
| `validation` | `Partial<Record<P, UploadValidationRules>>` | `{}` | Per-purpose validation rules |
| `retryPolicy` | `(ctx) => RetryDecision` | `undefined` | Custom retry decision function |
| `completedItemTTL` | `number` | `undefined` | Auto-remove completed items after N ms |

### Validation Rules

Validation rules are keyed by purpose and run during the `addFiles` command:

```typescript title="src/lib/upload-config.ts"
const config = {
  validation: {
    avatar: {
      maxFiles: 1,
      maxSizeBytes: 5 * 1024 * 1024,
      minSizeBytes: 1024,
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    },
    document: {
      maxSizeBytes: 100 * 1024 * 1024,
      allowedTypes: ["application/pdf"],
    },
  },
}
```

Files that fail validation are rejected with a `RejectReason` and emitted as
`file.rejected` events. They never enter the state machine.

### Retry Policy

Default behavior retries up to `maxAttempts` with exponential backoff. Override with a
custom `retryPolicy`:

```typescript title="src/lib/retry-policy.ts"
const config = {
  retryPolicy: ({ phase, attempt, error }) => {
    // Never retry auth errors
    if (error.code === "auth") return { retryable: false }

    // Respect rate limit headers
    if (error.code === "rate_limit" && error.retryAfterMs) {
      return { retryable: true, delayMs: error.retryAfterMs }
    }

    // Exponential backoff with cap
    const delayMs = Math.min(500 * 2 ** (attempt - 1), 10_000)
    return { retryable: true, delayMs }
  },
}
```

The `RetryDecision` type is either `{ retryable: false }` or `{ retryable: true; delayMs: number }`.

## Store Options

The `StoreOptions` interface holds everything needed to build the store runtime:

| Option | Required | Description |
| --- | --- | --- |
| `api` | Yes | Backend API implementing `UploadApi` |
| `strategies` | Yes | Strategy registry with registered strategies |
| `config` | No | Upload configuration (defaults applied) |
| `transport` | No | HTTP transport (defaults to `createXHRTransport()`) |
| `persistence` | No | Persistence adapter and options |
| `plugins` | No | Array of plugins |
| `hooks` | No | Lifecycle hooks |
| `fingerprint` | No | Custom file fingerprinting function |
| `validateFile` | No | Custom validation function (runs after built-in rules) |
| `errorNormalizer` | No | Custom error normalizer for raw errors |
| `initialState` | No | Pre-hydrated state (e.g., from persistence) |

## Plugins

Plugins extend the store's behavior without forking the engine. Each plugin gets a
minimal proxy with `on`, `dispatch`, and `getSnapshot` — enough to observe events and
drive behavior, not enough to break internal state.

```typescript title="src/lib/plugins/analytics.ts"

const analyticsPlugin: UploadPlugin<MyIntents, MyCursors, Purpose, MyResult> = {
  name: "analytics",
  setup({ on, getSnapshot }) {
    on("upload.completed", ({ localId, result }) => {
      const item = getSnapshot().items.get(localId)
      trackEvent("upload_completed", {
        fileId: result.fileId,
        purpose: item?.purpose,
      })
    })

    on("upload.error", ({ localId, error }) => {
      trackEvent("upload_error", {
        code: error.code,
        message: error.message,
      })
    })
  },
}

const client = createUploadClient({
  api: uploadApi,
  strategies,
  plugins: [analyticsPlugin],
})
```

### Plugin Guidelines

- Plugins should be read-only — don't mutate state directly.
- Use `dispatch` only for well-defined side effects (e.g. auto-retry).
- Plugin `setup` errors are caught and logged in development mode.
- Plugin names are for debugging — keep them descriptive.

## Hooks

Hooks are a lower-level observation point than plugins. `onInternalEvent` fires after
each internal event, giving full fidelity into engine behavior:

```typescript title="src/lib/devtools.ts"
const client = createUploadClient({
  api: uploadApi,
  strategies,
  hooks: {
    onInternalEvent(event, state) {
      console.log("[upload]", event.type, event)
    },
  },
})
```

## Custom Fingerprinting

The engine fingerprints files using name, size, type, and lastModified by default.
Provide a custom function for stronger identity (e.g. a checksum):

```typescript title="src/lib/upload-client.ts"
const client = createUploadClient({
  api: uploadApi,
  strategies,
  fingerprint: (file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    checksum: computeSHA256(file), // must be synchronous
  }),
})
```

The fingerprint function must be synchronous to keep `addFiles` fast.

## Next Steps

- [Engine](/docs/core/engine) — state machine, scheduling, and retry details.
- [Contracts](/docs/core/contracts) — the UploadApi, transport, and strategy interfaces.
- [Persistence](/docs/core/persistence) — configure state persistence.

---

## Client FAQ

  
    What is the difference between createUploadClient and createUploadStore?
    
      They are the same function.
      <code className="rounded bg-muted px-2 py-1">createUploadClient</code> is a thin alias around
      <code className="rounded bg-muted px-2 py-1">createUploadStore</code> to match the "upload
      client" mental model.
    
  

  
    When are config defaults applied?
    
      Defaults are applied once at construction time by
      <code className="rounded bg-muted px-2 py-1">resolveUploadConfig()</code>. After construction,
      the runtime always has fully-specified config -- no optional fields to check at runtime.
    
  

  
    What happens if a plugin throws during setup?
    
      The error is caught and logged to console in development mode. The store continues to
      function normally. Other plugins are still initialized. A failing plugin never breaks the
      upload engine.
    
  

  
    When should I provide a custom transport?
    
      The default XHR transport works for most browser use cases. Provide a custom transport
      when you need fetch-based uploads, Node.js compatibility, testing with mock transports,
      or custom header/authentication handling.
    
  

  
    How does custom validation work alongside built-in rules?
    
      The <code className="rounded bg-muted px-2 py-1">validateFile</code> function runs after
      built-in config validation (size, type, extension, count). If the built-in rules pass but
      your custom function returns a
      <code className="rounded bg-muted px-2 py-1">RejectReason</code>, the file is still rejected.
      Return <code className="rounded bg-muted px-2 py-1">null</code> to accept the file.
    
  

  
    What is the errorNormalizer for?
    
      The <code className="rounded bg-muted px-2 py-1">errorNormalizer</code> converts raw errors
      (from fetch, XHR, or your API) into the engine's
      <code className="rounded bg-muted px-2 py-1">UploadError</code> shape. This lets you map
      your backend's error format into consistent error codes that the retry policy can reason
      about.