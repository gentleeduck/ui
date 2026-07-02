## Goal

PhotoDuck users upload big photos on flaky connections. Add **pause / resume / cancel** controls
and an **automatic retry** policy with exponential backoff.

## The hook returns commands, not the store

`useUploader` returns `items`, the phase buckets, and `dispatch`/`on`/`off`. It does **not**
return the store object. When you need the raw store (for `getSnapshot` or `waitFor`), use
`useUploaderActions`, which returns `{ dispatch, on, store }`.

```tsx
import { useUploader, useUploaderActions } from '@gentleduck/upload/react'

const { items, dispatch } = useUploader<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>()
const { store } = useUploaderActions<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>()
```

## Lifecycle commands

**Pause**

```tsx
dispatch({ type: 'pause', localId })
```

On `pause` the engine sets the in-flight upload's mode to `'pause'` and aborts its
`AbortController`. The strategy catches the abort, its cursor is already persisted, and the
item transitions `uploading` → `paused`. Pausing a `queued` item just reverts it to `ready`
(no network was in flight).

**Resume**

```tsx
dispatch({ type: 'resume', localId })
```

`paused` → `queued`; the scheduler restarts the strategy, which reads the cursor and
continues from the last checkpoint. Resume requires a `file`. After a reload the `File` is
gone, so resume is a no-op until you `rebind` (Chapter 6).

**Cancel and remove**

```tsx
dispatch({ type: 'cancel', localId }) // aborts + moves to canceled (final)
dispatch({ type: 'remove', localId }) // drops the item from state
```

Cancel aborts any in-flight request with mode `'cancel'` and is terminal. `remove` deletes
the item entirely — handy for clearing terminal rows from the UI.

**Automatic retry policy**

```typescript title="src/upload.ts"
export const store = createUploadStore<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>({
  api,
  strategies,
  config: {
    maxAttempts: 5,
    retryPolicy: ({ phase, attempt, error }) => {
      if (error.code === 'auth') return { retryable: false }
      if (error.code === 'validation_failed') return { retryable: false }
      const delayMs = Math.min(1000 * 2 ** (attempt - 1), 30_000) // 1s,2s,4s,8s,16s
      return { retryable: true, delayMs }
    },
  },
})
```

`retryPolicy` runs whenever a phase fails. It receives `phase` (`'intent' | 'upload' |
    'complete'`), the `attempt` number, and the `UploadError`, and returns an
`Engine.RetryDecision`. `maxAttempts` is the hard cap even when the policy says retryable.

**Retry UI**

```tsx title="src/UploadRow.tsx"
import type { Engine } from '@gentleduck/upload/core'

type Item = Engine.Item<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>

function UploadRow({ item, dispatch }: {
  item: Item
  dispatch: (cmd: Engine.Command<PhotoPurpose>) => void
}) {
  if (item.phase === 'error') {
    return (
      <div>
        <span style={{ color: '#dc2626' }}>{item.error.message}</span>
        {item.retryable && (
          <button onClick={() => dispatch({ type: 'retry', localId: item.localId })}>
            Retry (attempt {item.attempt})
          </button>
        )}
        <button onClick={() => dispatch({ type: 'remove', localId: item.localId })}>Dismiss</button>
      </div>
    )
  }
  return (
    <div>
      {item.phase === 'uploading' && (
        <>
          <progress value={item.progress.pct} max={100} />
          <button onClick={() => dispatch({ type: 'pause', localId: item.localId })}>Pause</button>
        </>
      )}
      {item.phase === 'paused' && (
        <button onClick={() => dispatch({ type: 'resume', localId: item.localId })}>Resume</button>
      )}
      <button onClick={() => dispatch({ type: 'cancel', localId: item.localId })}>Cancel</button>
    </div>
  )
}
```

`retry` is only accepted from the `error` phase. Where it re-enters depends on how far the
item got:

* no intent yet → `creating_intent`
* has intent, bytes pending → `ready` (re-queued)
* failed while finalizing → `completing` (retries only the finalize call)

## Batch operations

`startAll`, `pauseAll`, and `cancelAll` apply to every matching item; pass a `purpose` to scope:

```tsx
dispatch({ type: 'startAll' })
dispatch({ type: 'pauseAll' })
dispatch({ type: 'cancelAll' })
dispatch({ type: 'startAll', purpose: 'photo' }) // only photos
```

| Command | Valid from |
| --- | --- |
| `start` / `startAll` | `ready` |
| `pause` / `pauseAll` | `uploading`, `queued` |
| `resume` | `paused` (needs `file`) |
| `cancel` / `cancelAll` | any non-terminal |
| `retry` | `error` (needs `retryable`) |
| `remove` | any |
| `rebind` | `paused` without `file` |

## Full transition map

## Checkpoint

A full controls component. Read items from `useUploader`; grab `store` from `useUploaderActions`
only if you need `getSnapshot`/`waitFor`.

```tsx title="src/PhotoUploader.tsx"
import { useUploader } from '@gentleduck/upload/react'

export function PhotoUploader() {
  const { items, dispatch } = useUploader<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>()
  const active = items.filter((i) => i.phase === 'uploading' || i.phase === 'queued').length

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          if (files.length) dispatch({ type: 'addFiles', files, purpose: 'photo' })
        }}
      />
      <div>
        <button onClick={() => dispatch({ type: 'startAll' })}>Start all</button>
        <button onClick={() => dispatch({ type: 'pauseAll' })}>Pause all</button>
        <button onClick={() => dispatch({ type: 'cancelAll' })}>Cancel all</button>
        <span>{active} active</span>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.localId}>
            {item.fingerprint.name} — {item.phase}
            {'progress' in item && item.progress && ` (${Math.round(item.progress.pct)}%)`}
            {item.phase === 'uploading' && (
              <button onClick={() => dispatch({ type: 'pause', localId: item.localId })}>Pause</button>
            )}
            {item.phase === 'paused' && (
              <button onClick={() => dispatch({ type: 'resume', localId: item.localId })}>Resume</button>
            )}
            {item.phase === 'error' && item.retryable && (
              <button onClick={() => dispatch({ type: 'retry', localId: item.localId })}>Retry</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

***

## Chapter 5 FAQ

What happens if I pause a queued item?

It reverts to `ready` — no request is aborted because none started. Start it again later.

Why does resume need a file?

`File` objects can't be serialized, so items restored from persistence have
`file: undefined`. Resume is a no-op without a file. Use `rebind` first — it checks the new
file's fingerprint matches. Chapter 6 covers the flow.

How does retry know where to re-enter?

It inspects the failed item: no `intent` → `creating_intent`; has intent, bytes pending →
`ready`; failed while finalizing → `completing`. Confirmed bytes are never re-uploaded.

Auto retry for some errors, manual for others?

Decide per-error in `retryPolicy`. Return `{ retryable: true, delayMs }` for transient
errors and `{ retryable: false }` for permanent ones. Non-retryable items stay in `error`
with `retryable: false`; hide the retry button and let the user `remove` them.

What is a cursor?

A strategy-specific checkpoint. For multipart it's the completed parts and their ETags. On
resume the strategy reads it and skips finished work. It's updated during the upload and
persisted with the item.

***

Next: [Chapter 6: Persistence & Offline](/duck-upload/course/chapter-6)