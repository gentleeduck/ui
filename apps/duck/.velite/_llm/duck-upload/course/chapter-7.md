## Goal

PhotoDuck should reject invalid files before wasting bandwidth. A 200 MB video should not
even start uploading when the limit is 10 MB. A `.exe` file has no place in a photo gallery.
You will configure **validation rules** per purpose and build **plugins** that extend the
upload engine without forking it.

maxSizeBytes, allowedTypes,maxFiles, allowedExtensions"]
    end

    subgraph Output["Results"]
        OK["sunset.jpg -> creating_intent"]
        R1["malware.exe -> error (type_not_allowed)"]
        R2["video.mp4 -> error (file_too_large)"]
    end

    Input --> Validation
    Validation --> OK
    Validation --> R1
    Validation --> R2`} />

## Configure Validation Rules

  
    **Define per-purpose validation rules**

    Validation rules are configured in the store's `config.validation` object, keyed by
    purpose. Each purpose can have its own limits:

    ```typescript title="src/lib/upload-client.ts"
    import { createUploadStore } from '@gentleduck/upload'

    type Purpose = 'photo' | 'avatar' | 'document'

    const store = createUploadStore(if checksum + API supports it)"}
    DEDUPEOK["phase: completedcompletedBy: 'dedupe'"]
    VALIDATE["Validate against rules:maxSizeBytes, allowedTypes,maxFiles, allowedExtensions"]
    CUSTOM["Run validateFile callback(if provided)"]
    OK["phase: creating_intent"]
    FAIL["phase: errorcode: validation_failedretryable: false"]

    ADD --> FP --> DEDUPE
    DEDUPE -- "match found" --> DEDUPEOK
    DEDUPE -- "no match / not configured" --> VALIDATE
    VALIDATE -- "passes" --> CUSTOM
    VALIDATE -- "fails" --> FAIL
    CUSTOM -- "returns null" --> OK
    CUSTOM -- "returns reason" --> FAIL`} />

1. **Files added**: Each file gets a `localId` and enters `validating` phase
2. **Fingerprint computed**: `name`, `size`, `type`, `lastModified` are extracted (synchronous)
3. **Deduplication check**: If your API implements `findByChecksum()` and the file has a
   checksum, the engine checks for an existing upload. If found, the item jumps straight
   to `completed` with `completedBy: 'dedupe'`
4. **Built-in validation**: `maxSizeBytes`, `minSizeBytes`, `allowedTypes`, `allowedExtensions`,
   `maxFiles` are checked against the purpose's rules
5. **Custom validation**: Your `validateFile` callback runs if provided
6. **Result**: Valid files move to `creating_intent`. Invalid files move to `error` with
   `retryable: false`

The `maxFiles` check counts existing items for the same purpose. If you have 18 photos and
the limit is 20, adding 5 files will accept 2 and reject 3 with `{ code: 'too_many_files', max: 20 }`.

### MIME Type Matching

The `allowedTypes` array supports both exact matches and wildcard prefixes:

| Pattern | Matches | Does Not Match |
| --- | --- | --- |
| `'image/jpeg'` | `image/jpeg` | `image/png`, `image/webp` |
| `'image/*'` | `image/jpeg`, `image/png`, `image/webp` | `video/mp4`, `application/pdf` |
| `'application/pdf'` | `application/pdf` | `application/json` |

The wildcard `image/*` strips the `/*` and checks if the file's MIME type starts with
`image/`. This is a prefix match, not a glob.

## Checkpoint

Full validation and plugin setup for PhotoDuck:

```typescript title="src/lib/upload-client.ts"

type Purpose = 'photo' | 'avatar' | 'document'

// Analytics plugin
const analyticsPlugin = {
  name: 'analytics',
  setup({ on }) {
    on('upload.completed', ({ localId, result, completedBy }) => {
      fetch('/api/metrics', {
        method: 'POST',
        body: JSON.stringify({
          event: 'upload_completed',
          fileId: result.fileId,
          completedBy,
        }),
      })
    })

    on('upload.error', ({ localId, error }) => {
      fetch('/api/metrics', {
        method: 'POST',
        body: JSON.stringify({
          event: 'upload_error',
          code: error.code,
          message: error.message,
        }),
      })
    })
  },
}

// Auto-cleanup plugin: remove completed items after 10 seconds
const autoCleanupPlugin = {
  name: 'auto-cleanup',
  setup({ on, dispatch }) {
    on('upload.completed', ({ localId }) => {
      setTimeout(() => {
        dispatch({ type: 'remove', localId })
      }, 10_000)
    })
  },
}

export const uploadStore = createUploadStore({
  api: photoDuckApi,
  strategies: photoDuckStrategies,
  config: {
    maxConcurrentUploads: 3,
    maxAttempts: 5,
    validation: {
      photo: {
        maxFiles: 50,
        maxSizeBytes: 10 * 1024 * 1024,
        allowedTypes: ['image/*'],
        allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif'],
      },
      avatar: {
        maxFiles: 1,
        maxSizeBytes: 2 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
      document: {
        maxFiles: 10,
        maxSizeBytes: 50 * 1024 * 1024,
        allowedTypes: ['application/pdf'],
        allowedExtensions: ['pdf'],
      },
    },
    retryPolicy: ({ attempt, error }) => {
      if (error.code === 'auth' || error.code === 'validation_failed') {
        return { retryable: false }
      }
      return { retryable: true, delayMs: Math.min(1000 * 2 ** (attempt - 1), 30_000) }
    },
  },
  plugins: [analyticsPlugin, autoCleanupPlugin],
  persistence: {
    key: 'photoduck-uploads',
    version: 1,
    adapter: IndexedDBAdapter,
  },
  validateFile: (file, purpose) => {
    // Reject files with suspicious double extensions
    const parts = file.name.split('.')
    if (parts.length > 2) {
      const lastExt = parts[parts.length - 1]?.toLowerCase()
      if (['exe', 'bat', 'sh', 'cmd', 'msi'].includes(lastExt ?? '')) {
        return { code: 'type_not_allowed', allowed: [], got: file.name }
      }
    }
    return null
  },
})
```

```tsx title="src/components/PhotoUploader.tsx"

function PhotoUploader() {
  const { store } = useUploader()
  const snapshot = store.getSnapshot()
  const items = Array.from(snapshot.items.values())

  const rejected = items.filter(
    (i) => i.phase === 'error' && i.error.code === 'validation_failed'
  )

  return (
    

      {rejected.length > 0 && (

          {rejected.map((item) => (

              <span>{item.fingerprint.name}</span>

                {item.error.code === 'validation_failed' && item.error.reason.code}

              <button onClick={() => store.dispatch({ type: 'remove', localId: item.localId })}>
                Dismiss

          ))}

      )}

      {items
        .filter((i) => i.phase !== 'error')
        .map((item) => (

            {item.fingerprint.name} -- {item.phase}
            {'progress' in item && item.progress && (
              <span> ({Math.round(item.progress.pct)}%)</span>
            )}

        ))}

  )
}
```

---

## Chapter 7 FAQ

  
    When exactly does validation run?
    
      Validation runs immediately when you dispatch `addFiles`. Each file enters the
      `validating` phase and is synchronously checked against the built-in rules for its
      purpose. The `validateFile` callback runs after the built-in rules. Files that fail
      validation transition to the `error` phase with `retryable: false` before any network
      request is made.
    
  

  
    What happens if I do not define validation rules for a purpose?
    
      If no rules exist for a purpose in `config.validation`, all built-in checks are
      skipped for that purpose. The `validateFile` callback still runs if provided. This
      means every file is accepted unless your custom validator rejects it. To enforce
      rules, always define at least `maxSizeBytes` for each purpose.
    
  

  
    Should I use allowedTypes or allowedExtensions?
    
      Use both for defense in depth. MIME types are checked against `file.type` (which
      the browser sets based on the file's content header). Extensions are checked against
      the filename. Both can be spoofed. When both are specified, a file passes if it
      matches **either** (OR logic). For maximum security, validate on the server as well.
    
  

  
    Does plugin order matter?
    
      Plugins are set up in array order. Each plugin's `setup` function runs sequentially,
      but event listeners are called in registration order. If plugin A and plugin B both
      listen to `upload.completed`, A's listener fires first. If plugin B dispatches a
      command that triggers an event plugin A listens to, A will see it. In practice, order
      rarely matters because plugins should be independent.
    
  

  
    When should I use a plugin vs a hook?
    
      Use **hooks** for passive observation: logging, debugging, devtools, analytics that
      only reads state. Use **plugins** when you need to react to events by dispatching
      commands: auto-retry, auto-cleanup, notification triggers, or workflow orchestration.
      Plugins get `dispatch` access; hooks do not.
    
  

  
    How does maxFiles count existing items?
    
      The `maxFiles` check counts all existing items in state that match the same purpose,
      regardless of their phase. If you have 18 photos (including completed, errored, and
      active ones) and the limit is 20, adding 5 files will accept 2 and reject 3. Use the
      `remove` command to clear completed or canceled items and free up slots.
    
  

---

Next: [Chapter 8: Production Patterns](/duck-upload/course/chapter-8)