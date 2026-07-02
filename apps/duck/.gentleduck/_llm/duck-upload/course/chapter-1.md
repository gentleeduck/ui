## Goal

Stand up a working upload pipeline: define the four type parameters, implement a mock backend
contract, build the store with `createUploadStore`, add a file, and watch it flow through the
phases while progress and completion events fire.

## Step by step

**Install**

```bash
npm install @gentleduck/upload
```

One package: core engine, React bindings, and built-in strategies.

**Define the four type parameters**

Create `src/upload.ts`. Describe the pipeline with an intent map (`M`), cursor map (`C`),
purpose (`P`), and result (`R`).

```typescript title="src/upload.ts"
import type { Contracts } from '@gentleduck/upload/core'
import type { PostStrategy } from '@gentleduck/upload/strategies'

// M — which strategies exist and the intent each returns
type PhotoIntents = { post: PostStrategy.Intent }

// C — resume state per strategy (POST has none)
type PhotoCursors = { post?: PostStrategy.Cursor }

// P — the kinds of uploads in the app
type PhotoPurpose = 'photo'

// R — what your backend returns from complete()
type PhotoResult = Contracts.Result.Base & { url: string }
```

`Contracts.Result.Base` is `{ fileId: string; key: string }`. `PostStrategy.Intent` and
`PostStrategy.Cursor` come from the strategy's type namespace (the same `PostStrategy` you
call as a function).

**Implement the backend contract**

The contract type is `Contracts.Api.Me

| Phase | Meaning |
| --- | --- |
| `validating` | Checking against per-purpose rules |
| `creating_intent` | Calling `api.createIntent()` |
| `ready` | Intent received; waiting for `start`/`autoStart` |
| `queued` | Wants a slot (concurrency cap reached) |
| `uploading` | Transferring bytes |
| `completing` | Calling `api.complete()` |
| `completed` | Done and finalized |
| `error` | Failed (possibly retryable) |
| `paused` / `canceled` | Paused (resumable) / canceled |

On `addFiles` the engine assigns a `localId`, computes a fingerprint, validates, then calls
`createIntent` and lands in `ready`. On `startAll`, `ready` → `queued` → (scheduler) →
`uploading` → `completing` → `completed`.

## Commands

Every action goes through `dispatch`. The command type is `Engine.Command<P>`:

| Command | Effect |
| --- | --- |
| `{ type: 'addFiles', files, purpose, meta? }` | Register files |
| `{ type: 'start', localId }` / `{ type: 'startAll', purpose? }` | Begin upload(s) |
| `{ type: 'pause', localId }` / `{ type: 'pauseAll', purpose? }` | Pause |
| `{ type: 'resume', localId }` | Resume a paused item |
| `{ type: 'cancel', localId }` / `{ type: 'cancelAll', purpose? }` | Cancel |
| `{ type: 'retry', localId }` | Retry a failed item |
| `{ type: 'rebind', localId, file }` | Re-attach a `File` after persistence restore |
| `{ type: 'remove', localId }` | Drop an item from state |

## Events

Subscribe with `store.on(name, cb)`. It returns an unsubscribe function:

```typescript
const unsub = store.on('upload.progress', ({ pct }) => console.log(pct))
unsub()
```

Common events: `file.added`, `file.rejected`, `intent.creating`, `intent.created`,
`upload.started`, `upload.progress`, `upload.paused`, `upload.canceled`, `upload.completing`,
`upload.completed`, `upload.error`.

## Reading state

`getSnapshot()` returns immutable state with `items: Map<string, Engine.Item>`. Because
`Engine.Item` is a discriminated union over `phase`, narrowing unlocks phase-specific fields:

```typescript
for (const item of store.getSnapshot().items.values()) {
  if (item.phase === 'uploading') console.log(item.progress.pct)
  if (item.phase === 'error') console.log(item.error.message, item.retryable)
}
```

## Awaiting an upload

`waitFor` resolves once items reach a terminal phase:

```typescript
store.dispatch({ type: 'addFiles', files: [file], purpose: 'photo' })
const localId = Array.from(store.getSnapshot().items.keys())[0]!
store.dispatch({ type: 'start', localId })

const [outcome] = await store.waitFor([localId])
if (outcome.status === 'completed') console.log('done', outcome.result)
else if (outcome.status === 'error') console.log('failed', outcome.error)
```

## Checkpoint

```
photoduck/
  src/
    upload.ts   -- types + api + store
    main.ts     -- dispatch + event listeners
```

Full `src/upload.ts`

```typescript
import type { Contracts } from '@gentleduck/upload/core'
import { createUploadStore } from '@gentleduck/upload/core'
import { PostStrategy, createStrategyRegistry } from '@gentleduck/upload/strategies'

type PhotoIntents = { post: PostStrategy.Intent }
type PhotoCursors = { post?: PostStrategy.Cursor }
type PhotoPurpose = 'photo'
type PhotoResult = Contracts.Result.Base & { url: string }

const api: Contracts.Api.Me<PhotoIntents, PhotoPurpose, PhotoResult> = {
  async createIntent({ purpose, contentType, size, filename }, ctx) {
    return {
      strategy: 'post',
      fileId: `file-${Date.now()}`,
      url: 'https://your-bucket.s3.amazonaws.com',
      fields: { key: `uploads/${filename}`, 'Content-Type': contentType },
    }
  },
  async complete({ fileId }, ctx) {
    return { fileId, key: `uploads/${fileId}`, url: `https://cdn.example.com/${fileId}` }
  },
}

const strategies = createStrategyRegistry<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>()
strategies.set(PostStrategy())

export const store = createUploadStore<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>({
  api,
  strategies,
})
```

***

## Chapter 1 FAQ

Why dispatch instead of methods like store.addFiles()?

One command pipeline (command → reducer → new state → effects → events) makes the engine
predictable, testable, and race-free. Plugins observe every command in one place, and the
engine can batch and schedule work without conflicts.

What is a "purpose"?

A string that categorizes an upload. It drives per-purpose validation rules, `autoStart`,
and the optional filter on batch commands (`startAll`, `cancelAll`). Define it as a string
union (`P`) for type safety.

localId vs fileId?

`localId` is a client id generated on `addFiles` and used for all client commands. `fileId`
comes from your backend inside the intent and identifies the file server-side.

Can uploads start without startAll?

Yes — set `config.autoStart`, either an array (`autoStart: ['photo']`) or a predicate
(`autoStart: (p) => p !== 'draft'`). Matching files upload as soon as their intent is
created.

subscribe() vs on()?

`subscribe(listener)` fires on any state change (React uses it via `useSyncExternalStore`).
`on(name, cb)` fires for a specific typed event. Use `subscribe` for rendering, `on` for
side effects.

***

Next: [Chapter 2: Strategies & Backends](/duck-upload/course/chapter-2)