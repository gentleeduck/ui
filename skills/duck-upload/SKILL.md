---
name: duck-upload
description: >-
  Activate when the user is working with @gentleduck/upload — the file upload
  engine for React. Covers creating upload clients, configuring strategies
  (multipart, POST), implementing the UploadApi backend contract, wiring React
  hooks (useUploader, UploadProvider), progress tracking, persistence, and
  the upload state machine phases.
allowed-tools: Read Grep Glob
---

# @gentleduck/upload

A type-safe, strategy-based file upload engine for React with resumable uploads,
progress tracking, persistence, and a pluggable backend contract.

## Package exports

```ts
import { ... } from '@gentleduck/upload'           // everything
import { ... } from '@gentleduck/upload/core'       // engine, store, contracts, persistence, utils
import { ... } from '@gentleduck/upload/react'      // UploadProvider, useUploader, useUploaderActions, createUploadFactory
import { ... } from '@gentleduck/upload/strategies'  // multipartStrategy, PostStrategy, createStrategyRegistry
```

## Architecture overview

```
createUploadClient(opts)
  -> createUploadStore(opts)
       -> StoreRuntime { state, reducer, emitter, scheduler, effect queue }
            -> dispatch(cmd: UploadCommand) -> reducer -> effects -> notify listeners
```

### Core concepts

| Concept | Description |
|---|---|
| **UploadClient** | Alias for `UploadStore`. Created via `createUploadClient(opts)`. |
| **UploadStore** | Minimal surface: `getSnapshot()`, `subscribe()`, `dispatch()`, `on()`, `off()`, `waitFor()`. |
| **UploadCommand** | User intent dispatched to the store (discriminated union on `type`). |
| **UploadItem** | Discriminated union on `phase` — the state of a single upload. |
| **UploadPhase** | `validating -> creating_intent -> ready -> queued -> uploading -> completing -> completed`. Also: `paused`, `error`, `canceled`. |
| **IntentMap** | Maps strategy keys to intent types (backend-provided upload instructions). |
| **CursorMap** | Maps strategy keys to cursor types (resume state, e.g. completed parts). |
| **UploadStrategy** | `{ id, resumable, start(ctx) }` — executes the actual file transfer. |
| **StrategyRegistry** | `get(id)`, `has(id)`, `set(strategy)` — holds registered strategies. |
| **UploadApi** | Backend contract: `createIntent()`, `complete()`, optional `multipart.*`, `tus.*`. |
| **UploadTransport** | Network layer: `put()`, `postForm()`, `patch()`. Default: XHR-based (`createXHRTransport()`). |
| **Persistence** | Optional adapter (localStorage, IndexedDB, memory) for surviving page reloads. |

## Upload commands

```ts
type UploadCommand<P extends string> =
  | { type: 'addFiles'; files: File[]; purpose: P }
  | { type: 'start'; localId: string }
  | { type: 'startAll'; purpose?: P }
  | { type: 'pause'; localId: string }
  | { type: 'pauseAll'; purpose?: P }
  | { type: 'resume'; localId: string }
  | { type: 'cancel'; localId: string }
  | { type: 'cancelAll'; purpose?: P }
  | { type: 'retry'; localId: string }
  | { type: 'rebind'; localId: string; file: File }
  | { type: 'remove'; localId: string }
```

## Setting up a client

```ts
import { createUploadClient, createXHRTransport } from '@gentleduck/upload/core'
import { createStrategyRegistry, multipartStrategy, PostStrategy } from '@gentleduck/upload/strategies'

// 1. Define your intent and cursor maps
type MyIntentMap = {
  multipart: MultipartIntent
  post: PostIntent
}

type MyCursorMap = {
  multipart?: MultipartCursor
  post?: PostCursor
}

type Purpose = 'avatar' | 'document'

// 2. Create strategy registry
const strategies = createStrategyRegistry<MyIntentMap, MyCursorMap, Purpose>()
strategies.set(multipartStrategy())
strategies.set(PostStrategy())

// 3. Create the client
const uploadClient = createUploadClient<MyIntentMap, MyCursorMap, Purpose>({
  strategies,
  transport: createXHRTransport(),
  api: {
    createIntent: async (args, opts) => {
      // POST to your backend, return the intent
      const res = await fetch('/api/uploads/intent', {
        method: 'POST',
        body: JSON.stringify(args),
        signal: opts?.signal,
      })
      return res.json()
    },
    complete: async (args, opts) => {
      const res = await fetch(`/api/uploads/${args.fileId}/complete`, {
        method: 'POST',
        signal: opts?.signal,
      })
      return res.json()
    },
    multipart: {
      signPart: async (args, opts) => { /* ... */ },
      completeMultipart: async (args, opts) => { /* ... */ },
    },
  },
  config: {
    maxConcurrentUploads: 3,
    progressThrottleMs: 100,
    maxAttempts: 3,
    maxItems: 100,
    autoStart: ['avatar'], // auto-start for specific purposes
    validation: {
      avatar: { maxSize: 5 * 1024 * 1024, allowedTypes: ['image/*'] },
    },
  },
})
```

## React integration

### UploadProvider

```tsx
import { UploadProvider } from '@gentleduck/upload/react'

function App() {
  return (
    <UploadProvider store={uploadClient}>
      <UploadDropzone />
    </UploadProvider>
  )
}
```

### useUploader hook

Returns reactive state and dispatch. Works with context or explicit store.

```tsx
import { useUploader } from '@gentleduck/upload/react'

function UploadDropzone() {
  const { items, uploading, completed, failed, ready, paused, dispatch, on, off } = useUploader()

  const handleFiles = (files: File[]) => {
    dispatch({ type: 'addFiles', files, purpose: 'avatar' })
  }

  // items: UploadItem[] — all items
  // uploading/completed/failed/ready/paused — filtered by phase
  // dispatch — send commands
  // on/off — subscribe to typed events
}
```

### useUploaderActions hook

Stable imperative surface (no reactive state). Good for callbacks.

```tsx
import { useUploaderActions } from '@gentleduck/upload/react'

function UploadButton() {
  const { dispatch, on, store } = useUploaderActions()
  // dispatch and on are stable refs
}
```

### createUploadFactory

Creates a typed hook bound to a specific store instance.

```tsx
import { createUploadFactory } from '@gentleduck/upload/react'

const useMyUploader = createUploadFactory(uploadClient)

function Component() {
  const { items, dispatch } = useMyUploader()
}
```

## Events

Subscribe via `store.on()` or the `on` from `useUploader()`:

```ts
const unsub = store.on('upload.progress', ({ localId, pct, uploadedBytes, totalBytes }) => {
  console.log(`${localId}: ${pct.toFixed(1)}%`)
})
```

Event types:
- `file.added`, `file.rejected`
- `validation.ok`, `validation.failed`
- `intent.creating`, `intent.created`, `intent.failed`
- `upload.queued`, `upload.resumed`, `upload.started`, `upload.progress`
- `upload.cursor`, `upload.paused`, `upload.canceled`
- `upload.completing`, `upload.completed`, `upload.error`

## Strategies

### Multipart (S3/MinIO style, resumable)

```ts
import { multipartStrategy } from '@gentleduck/upload/strategies'

const strategy = multipartStrategy({ maxPartConcurrency: 4 })
// id: 'multipart', resumable: true
```

Requires `api.multipart.signPart()` and `api.multipart.completeMultipart()`.
Cursor tracks completed parts with ETags for resume.

### POST (presigned form, non-resumable)

```ts
import { PostStrategy } from '@gentleduck/upload/strategies'

const strategy = PostStrategy()
// id: 'post', resumable: false
```

Uses `transport.postForm()` with presigned URL and form fields from the intent.

### Custom strategy

```ts
const myStrategy: UploadStrategy<MyIntentMap, MyCursorMap, Purpose, MyResult, 'custom'> = {
  id: 'custom',
  resumable: false,
  async start(ctx) {
    // ctx.file, ctx.intent, ctx.signal, ctx.transport, ctx.api
    // ctx.reportProgress({ uploadedBytes, totalBytes })
    // ctx.readCursor(), ctx.persistCursor(cursor)
    await ctx.transport.put({
      url: ctx.intent.uploadUrl,
      body: ctx.file,
      signal: ctx.signal,
      onProgress: (loaded, total) => ctx.reportProgress({ uploadedBytes: loaded, totalBytes: total }),
    })
  },
}
```

## UploadApi contract

The backend must implement this interface:

```ts
interface UploadApi<M extends IntentMap, P extends string, R extends UploadResultBase> {
  createIntent(args: {
    purpose: P
    contentType: string
    size: number
    filename: string
    checksum?: string
  }, opts?: WithSignal): Promise<M[keyof M]>

  complete(args: { fileId: string }, opts?: WithSignal): Promise<R>

  // Optional
  getSignedPreviewUrl?(args: { fileId: string; key: string; purpose: P }, opts?: WithSignal): Promise<string>
  findByChecksum?(args: { checksum: string; purpose: P }, opts?: WithSignal): Promise<R | null>

  multipart?: {
    signPart(args: { fileId: string; uploadId: string; partNumber: number; checksum?: string }, opts?: WithSignal): Promise<{ url: string; headers?: Record<string, string> }>
    completeMultipart(args: { fileId: string; uploadId: string; parts: Array<{ partNumber: number; etag: string }> }, opts?: WithSignal): Promise<unknown>
    listParts?(args: { fileId: string; uploadId: string }, opts?: WithSignal): Promise<Array<{ partNumber: number; etag?: string; size?: number }>>
    abort?(args: { fileId: string; uploadId: string }, opts?: WithSignal): Promise<void>
  }

  tus?: {
    create(args: { fileId: string; size: number; filename: string; contentType: string }, opts?: WithSignal): Promise<{ uploadUrl: string }>
    getOffset(args: { uploadUrl: string }, opts?: WithSignal): Promise<{ offset: number }>
  }
}
```

`UploadResultBase` is `{ fileId: string; key: string }`. Extend it for your app.

## Persistence

```ts
import { LocalStorageAdapter, IndexedDBAdapter, MemoryAdapter } from '@gentleduck/upload/core'

const client = createUploadClient({
  // ...
  persistence: {
    key: 'my-uploads',
    version: 1,
    debounceMs: 200,
    adapter: LocalStorageAdapter, // or IndexedDBAdapter, MemoryAdapter
  },
})
```

Paused items survive page reloads. Use `rebind` command to re-attach the `File` object after restore.

## Plugins

```ts
const debugPlugin: UploadPlugin<MyIntentMap, MyCursorMap, Purpose> = {
  name: 'debug',
  setup(ctx) {
    ctx.on('upload.progress', (e) => console.log(e))
    ctx.on('upload.completed', (e) => console.log('Done:', e.localId))
  },
}

const client = createUploadClient({
  // ...
  plugins: [debugPlugin],
})
```

## Progress tracking

`UploadProgress` shape on every uploading item:

```ts
type UploadProgress = {
  uploadedBytes: number
  totalBytes: number
  pct: number // 0..100
}
```

Access via `item.progress` or listen to `upload.progress` events.
Throttled by `config.progressThrottleMs` (default 100ms).

## waitFor

```ts
const outcomes = await store.waitFor(['id1', 'id2'])
// UploadOutcome[] — each is { localId, status: 'completed' | 'error' | 'canceled' | 'missing', ... }
```

## Configuration defaults

| Option | Default |
|---|---|
| `maxConcurrentUploads` | 3 |
| `progressThrottleMs` | 100 |
| `maxAttempts` | 3 |
| `maxItems` | 100 |
| `completedItemTTL` | undefined (keep forever) |

## Coding style

- **Formatter**: Biome — single quotes, no semicolons, 2-space indent, 120 line width, trailing commas
- **Imports**: Use `import type` for type-only imports (enforced by Biome `useImportType`)
- **Generics**: 4 type params everywhere: `M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase`
- **Files**: kebab-case, types in `.types.ts` files, strategy per directory
- **No classes**: Pure functions and object literals
- **React**: `'use client'` directive on React files, `React.useSyncExternalStore` for store binding
- **Exports**: Barrel files (`index.ts`) re-export with `export * from`

## Do not

- Do NOT use `class` for strategies or stores — use factory functions returning plain objects
- Do NOT import from internal paths like `core/engine/store/store.runtime` — use the public exports
- Do NOT mutate state directly — always dispatch commands
- Do NOT skip the `UploadApi` contract — the engine requires `createIntent` and `complete`
- Do NOT assume `File` is always present on paused items — it may be `undefined` after persistence restore
- Do NOT use `fetch` for upload transport in browsers — XHR is required for upload progress events
- Do NOT hardcode strategy IDs — use the `IntentMap` type system
