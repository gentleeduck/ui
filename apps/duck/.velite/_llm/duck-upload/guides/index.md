## Quick Start Guide

A basic file upload, from scratch.

### Step 1: Set Up the Store

```ts

// Register the POST strategy for simple uploads
const strategies = createStrategyRegistry()
strategies.set(PostStrategy())

// Define your backend adapter
const api = {
  createIntent: async ({ file, purpose }) => {
    const res = await fetch('/api/uploads/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, size: file.size, purpose }),
    })
    return res.json()
  },
  complete: async ({ fileId }) => {
    const res = await fetch(`/api/uploads/${fileId}/complete`, { method: 'POST' })
    return res.json()
  },
}

const store = createUploadStore({ api, strategies })
```

### Step 2: Add Files

```ts
// From a file input or drag-and-drop
store.dispatch({
  type: 'addFiles',
  files: selectedFiles,
  purpose: 'document',
})
```

### Step 3: Start Uploads

Without `autoStart`, start uploads manually:

```ts
store.dispatch({ type: 'start', localId: 'some-local-id' })
```

### Step 4: Listen for Completion

```ts
store.on('upload.completed', ({ localId, result }) => {
  console.log(`Upload ${localId} completed:`, result)
})
```

---

## React Quick Start

### Wrap Your App

```tsx

function App() {
  return (

  )
}
```

### Build an Upload Component

```tsx

function UploadPage() {
  const { items, dispatch, on } = useUploader()

  React.useEffect(() => {
    return on('upload.completed', ({ localId, result }) => {
      console.log('Done:', localId, result)
    })
  }, [on])

  const handleFiles = (e: React.ChangeEvent

        {items.map((item) => (

            {item.file?.name} — {item.phase}
            {item.phase === 'uploading' && ` (${Math.round(item.progress ?? 0)}%)`}

        ))}

  )
}
```

---

## Large File Uploads with Multipart

For resumable uploads, use the multipart strategy:

```ts

const strategies = createStrategyRegistry()
strategies.set(PostStrategy())
strategies.set(multipartStrategy())
```

Have the backend's `createIntent` return a multipart intent for large files:

```ts
const api = {
  createIntent: async ({ file, purpose }) => {
    const strategy = file.size > 10 * 1024 * 1024 ? 'multipart' : 'post'
    // Call your backend which returns the correct intent shape
    const res = await fetch('/api/uploads/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, size: file.size, purpose, strategy }),
    })
    return res.json()
  },
  complete: async ({ fileId }) => {
    const res = await fetch(`/api/uploads/${fileId}/complete`, { method: 'POST' })
    return res.json()
  },
}
```

The engine picks the strategy from the `strategy` field on the returned intent.

---

## Enabling Persistence

To resume uploads after a page refresh:

```ts

const store = createUploadStore({
  api,
  strategies,
  persistence: {
    key: 'uploads',
    version: 1,
    adapter: LocalStorageAdapter,
    isPurpose: (value) => value === 'avatar' || value === 'document',
    isIntent: (value) =>
      typeof value === 'object' && value !== null && 'strategy' in value && 'fileId' in value,
  },
})
```

Restored items come back `paused` without a `file` reference. Use the `rebind`
command to attach the file before resuming.