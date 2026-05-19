<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/upload

Headless, framework-agnostic file-upload engine with a typed state machine, pluggable strategies, and React bindings.

Pure-reducer core, persistence-aware, resume-after-refresh, bounded effect concurrency, and zero coupling to a specific backend or UI library.

## Quick Start

```ts
import { createUploadStore } from '@gentleduck/upload/core'
import { createStrategyRegistry } from '@gentleduck/upload/strategies'

type Intents = { post: { strategy: 'post'; fileId: string; url: string; fields: Record<string, string> } }
type Cursors = { post: { offset: number } }
type Purpose = 'attachment'
type Result = { fileId: string; key: string }

const strategies = createStrategyRegistry<Intents, Cursors, Purpose, Result>()
strategies.set({
  id: 'post',
  resumable: false,
  async start({ file, intent, transport, signal, reportProgress }) {
    // your upload logic (PUT/POST/multipart/tus)
    reportProgress({ uploadedBytes: file.size, totalBytes: file.size })
  },
})

const store = createUploadStore<Intents, Cursors, Purpose, Result>({
  strategies,
  api: {
    async createIntent({ filename }) {
      return { strategy: 'post', fileId: filename, url: '/sign', fields: {} }
    },
    async complete({ fileId }) {
      return { fileId, key: `attachments/${fileId}` }
    },
  },
  config: { maxConcurrentUploads: 3, autoStart: ['attachment'] },
})

store.dispatch({ type: 'addFiles', files, purpose: 'attachment' })
```

## React

```tsx
import { UploadProvider, useUploader, createUploadFactory } from '@gentleduck/upload/react'

const useUploads = createUploadFactory(store)

function FileList() {
  const { items, uploading, dispatch } = useUploads()
  return (
    <UploadProvider store={store}>
      {items.map(item => (
        <Row key={item.localId} item={item} onCancel={() => dispatch({ type: 'cancel', localId: item.localId })} />
      ))}
    </UploadProvider>
  )
}
```

A full working demo lives at `packages/registry-examples/src/upload/upload-1.tsx`.

## Features

- **Pure reducer**  -  command/event-driven state machine; effects are isolated
- **Typed end-to-end**  -  intents, cursors, purposes, and results are quad-generics threaded through the engine
- **Strategy registry**  -  ship POST/multipart out of the box, add TUS or your own
- **Resume after refresh**  -  IndexedDB / LocalStorage / Memory persistence adapters; cursor-aware re-binding
- **Retry policy**  -  exponential backoff with attempt escalation per phase (intent / upload / complete)
- **Bounded effect concurrency**  -  `effectConcurrency` separates side-effect parallelism from upload-byte parallelism
- **Batched bulk dispatch**  -  `startAll` / `pauseAll` / `cancelAll` collapse into a single reducer pass and notification
- **Rebind**  -  rebind a paused, persisted item to a fresh `File` after refresh, with fingerprint validation
- **Plugins + hooks**  -  `onInternalEvent`, `onPersistenceError`, custom plugins
- **No DOM coupling**  -  works in Workers, Node 22+, or the browser

## Subpath Exports

```ts
import { createUploadStore } from '@gentleduck/upload/core'
import { UploadProvider, useUploader } from '@gentleduck/upload/react'
import { createStrategyRegistry } from '@gentleduck/upload/strategies'
```

## Persistence

```ts
import { createIndexedDBAdapter } from '@gentleduck/upload/core'

createUploadStore({
  persistence: {
    key: 'app:uploads',
    version: 1,
    adapter: createIndexedDBAdapter(),
    isPurpose,
    isIntent,
  },
  hooks: { onPersistenceError: (err) => toast.error(err.message) },
  ...
})
```

Use `createIndexedDBAdapter()` / `createMemoryAdapter()` factories so each store owns its own connection.

Adapters throw a typed `PersistenceError` on failure (`quota_exceeded`, `unavailable`, `serialization_failed`, `transaction_failed`, `unknown`) that is routed to the optional `onPersistenceError` hook.

### Cross-tab IndexedDB contract

When a second tab opens the same database at a higher `persistence.version`, the existing tab's connection receives `onversionchange` and closes. The adapter resets its memoized handle so the next call reopens -- but at the OLD version. IndexedDB rejects that with `VersionError`, which the adapter surfaces as `PersistenceError('unavailable', operation, ...)`.

Application policy:

- Bump `persistence.version` in every tab/deployment in lockstep.
- Treat `onPersistenceError({ code: 'unavailable' })` after a known multi-tab scenario as a signal to reload the tab. The adapter is fixed at construction; the store does not support runtime adapter swap. If you want graceful fallback to in-memory persistence, the consumer must tear the store down and reconstruct with `createMemoryAdapter()`.
- Snapshot version mismatches at load time also surface as `PersistenceError('unavailable')` (via `deserializeSnapshot`'s `expectedVersion` fence).

### Handling persistence errors

```ts
import { createIndexedDBAdapter, type PersistenceError } from '@gentleduck/upload/core'

createUploadStore({
  persistence: { key: 'app:uploads', version: 1, adapter: createIndexedDBAdapter(), isPurpose, isIntent },
  hooks: {
    onPersistenceError(err: PersistenceError) {
      switch (err.code) {
        case 'quota_exceeded':
          toast.error('Storage full -- drop some uploads and try again.')
          break
        case 'unavailable':
          // Private mode / SecurityError / no IndexedDB. Fall back to memory.
          telemetry.warn('upload.persistence.unavailable', { op: err.operation })
          break
        case 'serialization_failed':
          // Snapshot was tampered with; drop the bad key and start over.
          adapter.clear('app:uploads').catch(() => undefined)
          break
        case 'transaction_failed':
        case 'unknown':
          telemetry.error('upload.persistence.error', { op: err.operation, message: err.message })
          break
      }
    },
  },
  ...
})
```

The engine never aborts uploads on a persistence error -- it continues operating in-memory. Use the hook to surface the failure to the user or to swap adapters at runtime.

The hook may be sync or `async`; the engine tracks the returned promise and keeps the re-entrancy guard active until it settles, so dispatches issued inside an async hook cannot loop the failure path.

## Effect concurrency and watchdog

Side-effects (intent creation, finalize, checksum, retry sleep, multipart abort) run in a bounded worker pool:

```ts
createUploadStore({
  config: {
    effectConcurrency: 8,    // default: 8. Set to 1 for strict-sequential.
    effectTimeoutMs: 60_000, // default: 60s per effect. 0 disables the watchdog.
  },
  ...
})
```

Every effect receives an `AbortSignal`. When the watchdog fires the signal is aborted so well-behaved effects can exit cleanly. Effects that ignore the signal keep running in the background; the slot is released either way so the pool keeps draining. Retry-sleep effects that get cut short by the watchdog still dispatch the retry as long as the item is still in `error` -- the watchdog cannot strand an item permanently.

## Writing a custom strategy

A strategy is the thin layer that knows how to actually move bytes from a `File` to your storage using the intent shape your backend returns. Every strategy implements one `start()` and shares the same `Strategy.ICtx` contract:

```ts
import type { Strategy } from '@gentleduck/upload/core'

type Intents = { tus: { strategy: 'tus'; fileId: string; uploadUrl: string } }
type Cursors = { tus: { offset: number } }
type Purpose = 'attachment'
type Result = { fileId: string; key: string }

export const tusStrategy: Strategy.IStrategy<Intents, Cursors, Purpose, Result, 'tus'> = {
  id: 'tus',
  resumable: true,
  async start({ file, intent, signal, transport, readCursor, persistCursor, reportProgress }) {
    // 1. Resume from the last persisted cursor if there is one.
    let offset = readCursor()?.offset ?? 0

    while (offset < file.size) {
      if (signal.aborted) throw { code: 'aborted', reason: signal.reason }

      const chunk = file.slice(offset, offset + 1024 * 1024)
      const res = await transport.send({
        url: intent.uploadUrl,
        method: 'PATCH',
        headers: {
          'Upload-Offset': String(offset),
          'Content-Type': 'application/offset+octet-stream',
        },
        body: chunk,
        signal,
        onProgress: ({ uploadedBytes }) => {
          reportProgress({ uploadedBytes: offset + uploadedBytes, totalBytes: file.size })
        },
      })

      offset += chunk.size

      // 2. Persist resumable progress so a refresh can rebind + resume.
      persistCursor({ offset })

      if (!res.ok) throw new Error(`TUS PATCH failed: ${res.status}`)
    }
  },
}
```

Contract:

- **`id`** must match the `intent.strategy` your backend returns.
- **`resumable`** is metadata for UIs; the engine doesn't enforce it.
- **`start()`** is awaited; resolve normally → engine transitions to `completing`. Throw → engine routes the error through `errorNormalizer` + `retryPolicy`.
- Honor **`signal`** -- abort cleanly when it fires (throw `{ code: 'aborted', reason: signal.reason }`).
- Call **`reportProgress`** as often as makes sense; it is throttled by `config.progressThrottleMs`.
- Call **`persistCursor`** at every safe resume boundary; the value is restored on the next `rebind` after refresh.
- Use **`api`** for backend round-trips that depend on the intent (e.g. multipart `signPart` / `completeMultipart`).

Register the strategy and reference it from `createIntent`:

```ts
const strategies = createStrategyRegistry<Intents, Cursors, Purpose, Result>()
strategies.set(tusStrategy)
```

## Architecture

```
@gentleduck/upload
├── core/
│   ├── client/         -  Client.IUploadConfig, Client.IUploadHooks, Client.IUploadPlugin
│   ├── contracts/      -  intents, cursors, transport, errors, strategy
│   ├── engine/         -  reducer + commands + internal events
│   │   └── store/      -  runtime, dispatch, scheduler, handlers
│   ├── persistence/    -  Memory / LocalStorage / IndexedDB adapters + serializer
│   └── utils/          -  emitter, id, fingerprint, guards, async
├── strategies/
│   ├── post/           -  single-PUT/POST strategy
│   ├── multipart/      -  S3-style multipart with partSize + ETag tracking
│   └── registry/       -  createStrategyRegistry
└── react/              -  UploadProvider, useUploader, createUploadFactory
```

## Commands

| Command | Purpose |
|---|---|
| `addFiles` | Validate + insert; schedules checksum + intent |
| `start` / `startAll` | Move ready items to queued (batched) |
| `pause` / `pauseAll` | Abort inflight, persist cursor (batched) |
| `resume` | Re-queue a paused item |
| `cancel` / `cancelAll` | Abort everything and mark canceled (batched) |
| `retry` | Re-attempt the failed phase, bumping the attempt counter |
| `rebind` | Re-attach a fresh `File` after refresh (validated by fingerprint) |
| `remove` | Drop the item from state |

## Events

Subscribe via `store.on(type, cb)`. Highlights:

- `file.added`, `file.rejected`
- `validation.ok`, `validation.failed`
- `intent.creating`, `intent.created`, `intent.failed`
- `upload.queued`, `upload.started`, `upload.progress`, `upload.cursor`
- `upload.paused`, `upload.canceled`, `upload.completing`, `upload.completed`, `upload.error`
- `rebind.ok`, `rebind.failed`

## Bundler requirement

The engine references `process.env.NODE_ENV` to gate dev-only invariant
warnings (reducer no-op check, listener-throw fallback logging, strategy-
overwrite warn). Vite / Webpack / Rspack / esbuild / Rollup replace this at
build time and ship a single branch into production. Pure-ESM consumers that
load the source directly without a bundler must polyfill
`globalThis.process = { env: { NODE_ENV: 'production' } }` before importing
the package, otherwise `process` is undefined at module load.

## Tests

```bash
bun run test
```

Vitest suite covers the reducer state machine, the persistence layer, all utility modules, the rebind handler, and a full smoke upload through the React-less store API.

## License

MIT
