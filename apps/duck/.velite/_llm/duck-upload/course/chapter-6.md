## Goal

A user drags 20 photos into PhotoDuck, walks away, and the browser tab crashes. When they
reopen the page, the uploads should still be there -- paused, with progress intact, ready
to resume. You will configure **persistence** so uploads survive page refreshes and browser
crashes.

## Choose a Persistence Adapter

  
    **Pick the right adapter for your use case**

    The upload engine ships three persistence adapters:

    ```typescript title="src/lib/upload-client.ts"
    import { IndexedDBAdapter } from '@gentleduck/upload/persistence/indexeddb'
    import { LocalStorageAdapter } from '@gentleduck/upload/persistence/local'
    import { MemoryAdapter } from '@gentleduck/upload/persistence/memory'
    ```

    | Adapter | Storage Limit | Async | Best For |
    | --- | --- | --- | --- |
    | `IndexedDBAdapter` | ~hundreds of MB | Yes | Production apps, large files |
    | `LocalStorageAdapter` | ~5 MB | No | Simple apps, few uploads |
    | `MemoryAdapter` | RAM only | No | Testing, SSR |

    All adapters implement the same `PersistenceAdapter` interface:

    ```typescript
    interface PersistenceAdapter {
      load(key: string): unknown | null | Promise

      )
    }
    ```

    The `rebind` command validates the file by computing its fingerprint and comparing it
    to the stored `item.fingerprint`. The match checks `name`, `size`, `type`, and
    `lastModified`. If the fingerprint does not match (wrong file selected), the rebind
    is silently rejected.

    After a successful rebind, `item.file` is set and you can dispatch `resume`:

    ```typescript
    // Listen for successful rebinds
    store.on('file.added', ({ localId }) => {
      // Auto-resume after rebind if desired
      const item = store.getSnapshot().items.get(localId)
      if (item?.phase === 'paused' && item.file) {
        store.dispatch({ type: 'resume', localId })
      }
    })
    ```
  

  
    **Handle stale uploads and cleanup**

    Not all persisted uploads should be restored. Set up cleanup for stale items:

    ```typescript title="src/lib/upload-client.ts"
    const store = createUploadStore({
      api: photoDuckApi,
      strategies: photoDuckStrategies,
      config: {
        maxAttempts: 5,
        maxItems: 100,
        completedItemTTL: 60_000, // auto-remove completed items after 60s
      },
      persistence: {
        key: 'photoduck-uploads',
        version: 1,
        adapter: IndexedDBAdapter,
      },
    })
    ```

    The built-in serializer only persists items that have an intent and are in a
    non-terminal phase. Items in `completed`, `canceled`, or `error` phases are excluded
    from the snapshot. This means:

    - Completed uploads disappear after refresh (they are done)
    - Canceled uploads disappear after refresh (the user dismissed them)
    - Failed non-retryable uploads disappear after refresh

    For manual cleanup, you can clear the persistence entirely:

    ```typescript
    // Clear all persisted uploads
    IndexedDBAdapter.clear('photoduck-uploads')
    ```
  

## What Gets Persisted (and What Does Not)

The serializer walks each item in state and produces a `PersistedSnapshot`:

```typescript
type PersistedSnapshot = {
  version: number           // schema version for migrations
  createdAt: number         // timestamp of the snapshot
  items: Record

      )}

      {canResume.length > 0 && (

          <button onClick={() => store.dispatch({ type: 'startAll' })}>
            Resume All ({canResume.length})

      )}

        {items.map((item) => (

            <span>{item.fingerprint.name}</span>
            <span className="text-sm text-muted-foreground">{item.phase}</span>
            {'progress' in item && item.progress && (
              <span className="text-sm">{Math.round(item.progress.pct)}%</span>
            )}
            {item.phase === 'paused' && !item.file && (
              <span className="text-xs text-yellow-600">needs file</span>
            )}

        ))}

  )
}
```

---

## Chapter 6 FAQ

  
    When is the snapshot written to persistence?
    
      After every state change, debounced by `debounceMs` (default 200ms). The engine
      subscribes to internal state changes and schedules a debounced write. During rapid
      progress updates, only the last state within the debounce window is written. The
      snapshot is also written immediately on the `beforeunload` event (if possible) to
      capture the latest state before the page closes.
    
  

  
    What happens if the schema version changes?
    
      The default deserializer checks the `version` field in the snapshot. If you change
      your persistence version, provide a custom `deserialize` function that handles
      migration from old versions. If the version does not match and no custom deserializer
      handles it, the snapshot is discarded and the store starts fresh. Bump the version
      when your intent or cursor shape changes.
    
  

  
    Can I use LocalStorageAdapter for production?
    
      You can, but be aware of the ~5 MB limit. Each persisted item includes the full
      intent (which may contain URLs and fields) and cursor data. For a small app with a
      handful of uploads, localStorage works fine. For apps with many concurrent uploads
      or large intent payloads, use IndexedDBAdapter to avoid hitting the quota.
    
  

  
    What if the user selects the wrong file for rebind?
    
      The `rebind` command computes the fingerprint of the provided file and compares it
      to the stored `item.fingerprint`. It checks `name`, `size`, `type`, and
      `lastModified`. If any field does not match, the rebind is silently ignored. The
      item stays in `paused` with `file: undefined`. Your UI should inform the user that
      the file did not match and ask them to try again.
    
  

  
    What about expired presigned URLs after a long pause?
    
      Presigned URLs from your backend (in the intent) typically expire after 1-24 hours.
      If a user resumes a day later, the upload will fail with an HTTP 403 error. Your
      `retryPolicy` should mark this as retryable. On retry, the engine can re-create the
      intent if needed. Alternatively, your backend can issue long-lived URLs or your API's
      `createIntent` can refresh them. The cursor (byte offset, completed parts) remains
      valid even if URLs change.
    
  

  
    How do I handle persistence in SSR / server components?
    
      IndexedDB and localStorage are browser-only APIs. Both adapters check for
      `typeof indexedDB === 'undefined'` / `typeof localStorage === 'undefined'` and
      return `null` on the server. Use the `MemoryAdapter` for SSR or testing where
      persistence is not needed. The store works fine without persistence -- it just starts
      empty on every page load.
    
  

---

Next: [Chapter 7: Validation & Plugins](/docs/course/chapter-7)