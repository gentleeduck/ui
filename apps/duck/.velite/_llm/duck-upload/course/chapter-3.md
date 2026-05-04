## Goal

By the end of this chapter you will have a React upload component with a file dropzone,
progress bars, and completion/error states -- all powered by the `UploadProvider` and
`useUploader` hook.

## Step by Step

  
    **Wrap your app with UploadProvider**

    The `UploadProvider` makes the upload store available to all child components via React
    Context. Pass the client you created in previous chapters:

    ```tsx title="src/App.tsx"
    import { UploadProvider } from '@gentleduck/upload'
    import { uploadClient } from './upload'
    import { PhotoUploader } from './PhotoUploader'

    export function App() {
      return (

      )
    }
    ```

    `UploadProvider` accepts a `store` prop which is your `UploadClient` (or `UploadStore`).
    Any component inside the provider can access it via hooks.
  

  
    **Use the useUploader hook**

    The `useUploader` hook subscribes to the store and returns reactive state plus actions:

    ```tsx title="src/PhotoUploader.tsx"
    import { useUploader } from '@gentleduck/upload'

    export function PhotoUploader() {
      const { items, dispatch, uploading, completed, failed, ready } = useUploader()

      return (
        

          {/* Upload list */}
          
            ))}

      )
    }
    ```
  

  
    **Show upload progress with progress bars**

    Create a row component that displays progress, completion, and error states:

    ```tsx title="src/PhotoUploader.tsx"
    import type { UploadItem, UploadCommand } from '@gentleduck/upload'

    function UploadItemRow({
      item,
      dispatch,
    }: {
      item: UploadItem

          )}

          {item.phase === 'paused' && (
            <>
              
          )}

          {item.phase === 'completing' && 
          )}

          {/* Cancel button (for active uploads) */}
          {!['completed', 'canceled', 'error'].includes(item.phase) && (

  )
}
```

    
  

  
    Full `src/PhotoUploader.tsx`
    

```tsx

export function PhotoUploader() {
  const { items, dispatch, on, uploading, completed, failed } = useUploader()
  const inputRef = useRef

      {/* Bulk actions */}
      {items.length > 0 && (
        
        ))}

  )
}

function UploadItemRow({
  item,
  dispatch,
}: {
  item: UploadItem

      )}

      {item.phase === 'paused' && (
        <>
          
      )}

      {item.phase === 'completing' && 
      )}

      {!['completed', 'canceled', 'error'].includes(item.phase) && (
        <button onClick={() => dispatch({ type: 'cancel', localId: item.localId })}>Cancel</button>
      )}

      {['completed', 'canceled', 'error'].includes(item.phase) && (
        <button onClick={() => dispatch({ type: 'remove', localId: item.localId })}>Remove</button>
      )}

  )
}
```

    
  

---

## Chapter 3 FAQ

  
    Does useUploader re-render on every progress event?
    
      Yes, `useUploader` re-renders when the snapshot changes, which includes progress updates.
      However, the engine throttles progress events via `progressThrottleMs` (default around
      250ms), so you get smooth updates without flooding React. If you need a component that
      does not re-render on progress, use `useUploaderActions` instead -- it only provides
      `dispatch` and `on` without subscribing to state changes.
    
  

  
    Can I have multiple UploadProviders for different upload areas?
    
      Yes. Create separate upload clients with `createUploadClient` and wrap each area with its
      own `UploadProvider`. Alternatively, use a single client with different purposes to
      categorize uploads, and filter by purpose in your UI. Multiple providers are useful when
      you need completely independent upload pipelines (different backends, different strategies).
    
  

  
    Does this work with server-side rendering (Next.js, Remix)?
    
      Both `UploadProvider` and `useUploader` are marked as `'use client'` components. They work
      in client components in Next.js App Router. The upload client should be created in a client
      module. `useSyncExternalStore` provides a server snapshot (the same `getSnapshot`) for SSR
      hydration, so there are no hydration mismatches. Just make sure the upload client module
      is not imported during server rendering.
    
  

  
    Do I have to use UploadProvider?
    
      No. You can pass the store directly to `useUploader(store)`. The provider is a convenience
      for apps where many components need access to the same store. If only one component uses
      uploads, passing the store directly is simpler. You can also use `createUploadFactory` to
      create a typed hook pre-bound to a specific store, which avoids both context and prop
      drilling.
    
  

  
    Why is the failed array items in the 'error' phase, not 'failed'?
    
      The state machine uses `error` as the phase name because it is a state, not an outcome.
      Items in the `error` phase may be retryable -- they are not necessarily "failed" forever.
      The `useUploader` hook exposes them as `failed` for convenience in UI code, but the
      underlying phase is `error`. When you check `item.phase`, use `'error'`, not `'failed'`.
    
  

  
    Should I use a drag-and-drop library?
    
      The native HTML5 drag-and-drop API works well for file uploads and is what we used above.
      Libraries like react-dropzone add niceties like file type filtering via the accept
      attribute, better cross-browser behavior, and accessibility. You can use any library --
      all you need is an array of `File` objects to pass to `dispatch({ type: 'addFiles' })`.
      The upload engine does not care how you obtain the files.
    
  

---

Next: [Chapter 4: Multipart Uploads](/duck-upload/course/chapter-4)