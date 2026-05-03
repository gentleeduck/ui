## Install the Package

Pick a package manager:

```package-install
@gentleduck/upload
```

Or install manually:

```bash tab="bun"
bun add @gentleduck/upload
```

```bash tab="npm"
npm install @gentleduck/upload
```

```bash tab="pnpm"
pnpm add @gentleduck/upload
```

## Basic Setup

### 1. Create a Strategy Registry

Register the strategies the app needs:

```ts

const strategies = createStrategyRegistry()
strategies.set(PostStrategy())
strategies.set(multipartStrategy())
```

### 2. Implement the Upload API

The backend adapter implements `UploadApi`:

```ts

const api: UploadApi = {
  createIntent: async ({ file, purpose }) => {
    // Call your backend to create an upload intent
    const res = await fetch('/api/uploads/intent', {
      method: 'POST',
      body: JSON.stringify({ fileName: file.name, purpose }),
    })
    return res.json()
  },
  complete: async ({ fileId }) => {
    // Notify your backend that the upload finished
    const res = await fetch(`/api/uploads/${fileId}/complete`, { method: 'POST' })
    return res.json()
  },
}
```

### 3. Create the Upload Store

```ts

const store = createUploadStore({
  api,
  strategies,
  config: {
    maxConcurrentUploads: 3,
    autoStart: (purpose) => purpose === 'avatar',
  },
})
```

### 4. Connect to React (Optional)

For React, wrap the app in `UploadProvider`:

```tsx

function App() {
  return (

  )
}
```

Use `useUploader` inside components:

```tsx

function UploadList() {
  const { items, dispatch } = useUploader()

  return (
    
      {items.map((item) => (
        <div key={item.localId}>{item.file?.name} - {item.phase}</div>
      ))}

  )
}
```

## Import Paths

The package has three entry points:

| Import | Description |
| --- | --- |
| `@gentleduck/upload/core` | Engine, contracts, persistence, utilities |
| `@gentleduck/upload/strategies` | Strategy implementations and registry |
| `@gentleduck/upload/react` | React provider and hooks |