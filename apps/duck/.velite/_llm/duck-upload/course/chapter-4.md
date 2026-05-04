## Goal

By the end of this chapter you will configure the multipart strategy for large file uploads,
implement the multipart backend API methods (`signPart`, `completeMultipart`), track per-part
progress, and understand how concurrent chunk uploads work.

200MB"] --> B["createIntent"]
    B -->|"MultipartIntent"| C["multipartStrategy"]
    C --> D["Part 1signPart + PUT"]
    C --> E["Part 2signPart + PUT"]
    C --> F["Part 3signPart + PUT"]
    C --> G["..."]
    D --> H["completeMultipart"]
    E --> H
    F --> H
    G --> H`} />

## Step by Step

  
    **Update your types to include the multipart strategy**

    Add `MultipartIntent` and `MultipartCursor` to your intent and cursor maps:

    ```typescript title="src/upload.ts"
    import {
      PostIntent, PostCursor,
      MultipartIntent, MultipartCursor,
    } from '@gentleduck/upload'
    import type { UploadApi, UploadResultBase } from '@gentleduck/upload'

    // Now supports both POST (small files) and multipart (large files)
    type PhotoIntentMap = {
      post: PostIntent
      multipart: MultipartIntent
    }

    type PhotoCursorMap = {
      post: PostCursor
      multipart: MultipartCursor
    }

    type PhotoPurpose = 'photo'

    type PhotoResult = UploadResultBase & {
      url: string
    }
    ```

    The `MultipartIntent` type defines what your backend returns for multipart uploads:

    ```typescript
    type MultipartIntent = {
      strategy: 'multipart'   // discriminant
      fileId: string          // backend file identifier
      uploadId: string        // S3 multipart upload ID
      partSize: number        // size of each part in bytes
      partCount: number       // total number of parts
    }
    ```

    The `MultipartCursor` tracks which parts have been uploaded (for resume):

    ```typescript
    type MultipartCursor = {
      done: Array<{
        partNumber: number
        etag: string
        size: number
      }>
      completed?: true  // marks the multipart session as assembled
    }
    ```
  

  
    **Register the multipart strategy**

    ```typescript title="src/upload.ts"
    import {
      createUploadClient,
      createStrategyRegistry,
      PostStrategy,
      multipartStrategy,
      createXHRTransport,
    } from '@gentleduck/upload'

    const strategies = createStrategyRegistry

1. **Build the queue** -- The strategy calculates which parts need uploading. It reads the
   cursor (`ctx.readCursor()`) to skip parts that were already uploaded in a previous session.

2. **Concurrent upload loop** -- The strategy maintains a pool of up to `maxPartConcurrency`
   concurrent uploads. As each part finishes, the next one from the queue starts.

3. **Per-part signing** -- For each part, the strategy calls `api.multipart.signPart()` to get
   a presigned PUT URL. This is a "sign on demand" pattern -- you do not need to pre-sign all
   parts upfront.

4. **ETag collection** -- After each successful PUT, S3 returns an `ETag` header. The strategy
   collects these. If S3/MinIO is behind a proxy, make sure CORS exposes the `ETag` header:
   `Access-Control-Expose-Headers: ETag`.

5. **Cursor persistence** -- After each part, the strategy calls `ctx.persistCursor()` with the
   updated list of completed parts. If the upload is paused or the browser crashes, the cursor
   is available on resume.

6. **Completion** -- Once all parts are uploaded, the strategy calls
   `api.multipart.completeMultipart()` with the full list of `{ partNumber, etag }`. S3
   assembles the parts into the final object.

7. **Per-part retry** -- If a part fails due to a network error, the strategy retries it up to
   3 times with exponential backoff (500ms, 1s, 2s). Only network-ish errors are retried
   (network failures, timeouts, 5xx responses).

## The Legacy Parts Array

The `MultipartIntent` has an optional `parts` field for backends that provide all presigned
URLs upfront:

```typescript
type MultipartIntent = {
  strategy: 'multipart'
  fileId: string
  uploadId: string
  partSize: number
  partCount: number

  // Optional: all part URLs provided upfront
  parts?: Array<{
    partNumber: number
    url: string
    headers?: Record<string, string>
  }>
}
```

If `parts` is provided, the strategy uses those URLs directly instead of calling `signPart`.
This is the "legacy" mode -- the on-demand `signPart` approach is preferred because:
- URLs do not expire before they are needed
- Fewer upfront API calls for large files
- Better for resumable uploads (only sign parts you need)

## Pausing and Resuming Multipart Uploads

The multipart strategy is resumable (`resumable: true`). When a user pauses:

1. The engine sets the abort signal, which cancels in-flight PUT requests
2. The strategy's cursor already has all completed parts persisted
3. The item moves to the `paused` phase

When the user resumes:

1. The item moves back to `queued`, then `uploading`
2. The strategy calls `ctx.readCursor()` to get the list of already-completed parts
3. It skips those parts and only uploads the remaining ones
4. Progress resumes from where it left off

If the `completed` flag is set in the cursor, the strategy skips the `completeMultipart` call
too -- this prevents duplicate assembly requests if the upload was interrupted after completion
but before the engine finalized.

## Checkpoint

Your project should look like this:

```
photoduck/
  src/
    upload.ts         -- types with multipart + api with signPart/completeMultipart
    App.tsx           -- UploadProvider wrapper
    PhotoUploader.tsx -- dropzone + progress bars + controls
  package.json
  tsconfig.json
```

  
    Full `src/upload.ts`
    

```typescript

  createUploadClient,
  createStrategyRegistry,
  PostStrategy,
  multipartStrategy,
  createXHRTransport,
} from '@gentleduck/upload'

  PostIntent, PostCursor,
  MultipartIntent, MultipartCursor,
} from '@gentleduck/upload'

// --- Types ---

type PhotoIntentMap = {
  post: PostIntent
  multipart: MultipartIntent
}

type PhotoCursorMap = {
  post: PostCursor
  multipart: MultipartCursor
}

type PhotoPurpose = 'photo'

type PhotoResult = UploadResultBase & {
  url: string
}

// --- Backend API ---

const api: UploadApi<PhotoIntentMap, PhotoPurpose, PhotoResult> = {
  async createIntent({ purpose, contentType, size, filename }) {
    const res = await fetch('/api/uploads/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purpose, contentType, size, filename }),
    })

    if (!res.ok) throw new Error(`Failed to create intent: ${res.status}`)
    return res.json()
  },

  async complete({ fileId }) {
    const res = await fetch('/api/uploads/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    })

    if (!res.ok) throw new Error(`Failed to complete upload: ${res.status}`)
    return res.json()
  },

  multipart: {
    async signPart({ fileId, uploadId, partNumber }) {
      const res = await fetch('/api/uploads/sign-part', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, uploadId, partNumber }),
      })

      if (!res.ok) throw new Error(`Failed to sign part ${partNumber}: ${res.status}`)
      return res.json()
    },

    async completeMultipart({ fileId, uploadId, parts }) {
      const res = await fetch('/api/uploads/complete-multipart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, uploadId, parts }),
      })

      if (!res.ok) throw new Error(`Failed to complete multipart: ${res.status}`)
      return res.json()
    },
  },
}

// --- Upload Client ---

const strategies = createStrategyRegistry<PhotoIntentMap, PhotoCursorMap, PhotoPurpose, PhotoResult>()
strategies.set(PostStrategy<PhotoIntentMap, PhotoCursorMap, PhotoPurpose, PhotoResult>())
strategies.set(multipartStrategy<PhotoIntentMap, PhotoCursorMap, PhotoPurpose, PhotoResult>({
  maxPartConcurrency: 4,
}))

export const uploadClient = createUploadClient<PhotoIntentMap, PhotoCursorMap, PhotoPurpose, PhotoResult>({
  api,
  strategies,
  transport: createXHRTransport(),
  config: {
    maxConcurrentUploads: 3,
    autoStart: ['photo'],
  },
})
```

    
  

---

## Chapter 4 FAQ

  
    When should I use multipart instead of POST?
    
      Use multipart for files larger than ~100MB. Multipart uploads are resumable, so if the
      connection drops, only the current part is lost -- not the entire file. They also enable
      parallel part transfers which can saturate high-bandwidth connections better than a single
      stream. The decision is typically made on the backend in `createIntent` based on file size.
    
  

  
    I am getting "Missing ETag" errors. What is wrong?
    
      S3/MinIO returns the `ETag` header on part uploads, but browsers only expose headers
      listed in `Access-Control-Expose-Headers`. Configure your S3/MinIO CORS to include:
      `Access-Control-Expose-Headers: ETag`. Without this, the XHR response cannot read the
      ETag and the multipart strategy throws an error. This is the most common gotcha with
      multipart uploads.
    
  

  
    How do I choose the right part size?
    
      Part size is a tradeoff between resumability and overhead. Smaller parts (5-10MB) mean
      less data is lost on failure and more granular progress, but more HTTP requests. Larger
      parts (50-100MB) mean fewer requests but coarser progress and more data to re-upload on
      failure. S3 requires minimum 5MB per part (except the last) and maximum 10,000 parts per
      upload. A common pattern is to use 10MB parts up to 1GB files, then increase part size for
      larger files.
    
  

  
    How does maxPartConcurrency interact with maxConcurrentUploads?
    
      They operate at different levels. `maxConcurrentUploads` controls how many files can upload
      at the same time (engine level). `maxPartConcurrency` controls how many parts of a single
      multipart upload transfer simultaneously (strategy level). So if you have
      `maxConcurrentUploads: 3` and `maxPartConcurrency: 4`, you could have up to 3 multipart
      files each with 4 concurrent parts, for a total of 12 concurrent HTTP requests.
    
  

  
    Why sign parts on demand instead of upfront?
    
      Presigned URLs expire. If you sign all 100 parts of a large file upfront and the upload
      takes 30 minutes, later parts might expire before they are needed. Signing on demand means
      each URL is fresh. It also reduces the initial API call payload and is better for resumable
      uploads -- you only sign parts that actually need uploading.
    
  

  
    What happens to incomplete multipart uploads on the server?
    
      If a multipart upload is abandoned, the uploaded parts remain in S3 and incur storage
      costs. You should configure an S3 lifecycle rule to automatically abort incomplete multipart
      uploads after a period (e.g., 7 days). The `UploadApi` also has an optional
      `multipart.abort` method you can implement to explicitly abort the multipart upload on
      cancel, which immediately cleans up the parts.
    
  

  
    Does the strategy retry failed parts automatically?
    
      Yes. The multipart strategy has built-in retry logic for network-ish failures (network
      errors, timeouts, 5xx responses). It retries up to 3 times per part with exponential
      backoff (500ms, 1s, 2s). If a part still fails after retries, the entire upload moves to
      the `error` phase. The user can then retry the upload, which resumes from the last
      persisted cursor (skipping already-uploaded parts).
    
  

  
    How does progress work with concurrent parts?
    
      The strategy tracks two things: `finishedBytes` (total bytes from fully uploaded parts)
      and `inflightBytes` (bytes transferred so far in currently uploading parts). The progress
      reported to the engine is `finishedBytes + inflightBytes` out of `totalBytes`. This gives
      you smooth continuous progress even though multiple parts upload in parallel. The engine
      throttles these reports via `progressThrottleMs` before sending them to your UI.
    
  

---

Next: [Chapter 5: Validation & Rejection](/duck-upload/course/chapter-5)