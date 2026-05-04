## Goal

PhotoDuck users upload large photos over unreliable connections. A 50 MB file on a spotty
train Wi-Fi needs to pause when signal drops and resume when it comes back. You will add
**pause, resume, cancel** controls and configure **automatic retry** with exponential backoff.

## Dispatch Pause and Resume Commands

  
    **Pause an active upload**

    The store accepts commands through `dispatch()`. To pause an upload that is currently
    in the `uploading` phase, dispatch a `pause` command with its `localId`:

    ```typescript title="src/components/UploadControls.tsx"
    import { useUploader } from '@gentleduck/upload/react'

    function UploadControls({ localId }: { localId: string }) {
      const { store } = useUploader()

      const handlePause = () => {
        store.dispatch({ type: 'pause', localId })
      }

      return 
              
          )}

          {item.phase === 'paused' && (
            

Key transitions to understand:

1. **Pause during upload**: When you dispatch `pause`, the store sets `inflightUpload.mode = 'pause'`
   and calls `controller.abort()`. The strategy catches the abort, records the cursor position, and
   the engine emits `{ type: 'paused', cursor, pausedAt }`. The reducer moves the item to `paused`
   with the cursor intact.

2. **Resume after pause**: The `resume` command checks that `item.file` exists (File objects cannot
   survive persistence). If the file is present, the item goes to `queued`. The scheduler starts the
   strategy with the stored cursor so it resumes from the last byte.

3. **Error to retry**: The `retry` command inspects the item to decide where to re-enter:
   - No `intent`: back to `creating_intent` (attempt incremented)
   - Has `intent`, progress < 100%: back to `ready` (re-queued for upload)
   - Has `intent`, progress = 100%: back to `completing` (only retry finalization)

4. **Automatic retry**: When `retryPolicy` returns `{ retryable: true, delayMs: 1000 }`, the engine
   schedules `dispatch({ type: 'retry', localId })` after the delay. The UI sees the item in `error`
   phase briefly, then it transitions automatically. If you want manual-only retry, return
   `{ retryable: false }` from the policy and let the user click retry.

## Checkpoint

Full upload controls component with pause, resume, cancel, retry, and batch operations:

```tsx title="src/components/PhotoUploader.tsx"

type Purpose = 'photo'

function PhotoUploader() {
  const { store } = useUploader()
  const snapshot = store.getSnapshot()
  const items = Array.from(snapshot.items.values())

  const activeCount = items.filter(
    (i) => i.phase === 'uploading' || i.phase === 'queued'
  ).length

  return (

        ))}

  )
}

function UploadRow({ item }: { item: UploadItem }) {
  const { store } = useUploader()

  const phaseLabel: Record
      )}

      {item.phase === 'paused' && 'progress' in item && (
        <span className="text-sm">{Math.round(item.progress.pct)}% paused</span>
      )}

        {item.phase === 'ready' && (
          <button onClick={() => store.dispatch({ type: 'start', localId: item.localId })}>
            Start

        )}

        {item.phase === 'uploading' && (
          <button onClick={() => store.dispatch({ type: 'pause', localId: item.localId })}>
            Pause

        )}

        {item.phase === 'paused' && (
          <button onClick={() => store.dispatch({ type: 'resume', localId: item.localId })}>
            Resume

        )}

        {item.phase === 'error' && item.retryable && (
          <button onClick={() => store.dispatch({ type: 'retry', localId: item.localId })}>
            Retry ({item.attempt})

        )}

        {item.phase !== 'completed' && item.phase !== 'canceled' && (
          <button onClick={() => store.dispatch({ type: 'cancel', localId: item.localId })}>
            Cancel

        )}

        {(item.phase === 'completed' || item.phase === 'canceled' || item.phase === 'error') && (
          <button onClick={() => store.dispatch({ type: 'remove', localId: item.localId })}>
            Remove

        )}

  )
}
```

---

## Chapter 5 FAQ

  
    What happens if I pause a queued item?
    
      If the item is in the `queued` phase (waiting for a concurrency slot but not yet
      uploading), the reducer moves it back to `ready`. No network request is aborted
      because none was started. You can `start` it again later.
    
  

  
    Why does resume require a file reference?
    
      Browser `File` objects cannot be serialized. After a page refresh, paused items
      restored from persistence have `file: undefined`. The `resume` command checks for
      `item.file` and is a no-op if it is missing. Use the `rebind` command to re-attach
      the file first: `store.dispatch({ type: 'rebind', localId, file })`. The engine
      verifies the fingerprint matches before accepting the rebind. See Chapter 6 for the
      full persistence and rebind workflow.
    
  

  
    How does retry know where to re-enter the pipeline?
    
      The reducer inspects the failed item's state. If `item.intent` is `undefined`, the
      failure was during intent creation, so retry goes to `creating_intent`. If an intent
      exists and progress is at 100%, the failure was during completion, so retry goes to
      `completing`. Otherwise the upload itself failed, so retry goes to `ready` to be
      re-queued. This means retry never re-uploads bytes that were already confirmed.
    
  

  
    Can I have automatic retry for some errors and manual for others?
    
      Yes. Your `retryPolicy` function decides per-error. Return `{ retryable: true, delayMs }`
      for transient errors (network, timeout, rate limit) and `{ retryable: false }` for
      permanent errors (auth, validation). When you return retryable false, the item stays in
      the `error` phase with `retryable: false`, and the retry button is hidden. The user
      can still `remove` or `cancel` it.
    
  

  
    What is a cursor and how does it enable resumable uploads?
    
      A cursor is a strategy-specific checkpoint that records how far an upload has progressed.
      For a multipart strategy, the cursor tracks which parts have been uploaded and their ETags.
      For a TUS strategy, the cursor tracks the byte offset. When the strategy resumes, it
      reads the cursor and skips already-uploaded segments. The cursor is updated via
      `cursor.updated` internal events during the upload and is persisted alongside the item.
    
  

  
    Does cancel clean up server-side resources?
    
      The `cancel` command only affects client-side state. It aborts the in-flight request and
      transitions the item to `canceled`. Server-side cleanup (like aborting a multipart upload)
      depends on your backend. If your `UploadApi` has `multipart.abort()`, you can call it in
      an event listener: `store.on('upload.canceled', ({ localId }) => { ... })`. Most cloud
      providers also have lifecycle policies that auto-clean incomplete multipart uploads after
      a configurable period.
    
  

---

Next: [Chapter 6: Persistence & Offline](/docs/course/chapter-6)