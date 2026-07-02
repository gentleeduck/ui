## Goal

Add the multipart strategy for large files: extend your type maps, register
`multipartStrategy`, implement the `signPart`/`completeMultipart` backend methods, and see how
concurrent parts and cursors give you resume.

## Step by step

**Extend the type maps**

Add `multipart` to the intent and cursor maps. `MultipartStrategy` is the type namespace
that pairs with the `multipartStrategy` function.

```typescript title="src/upload.ts"
import type { PostStrategy, MultipartStrategy } from '@gentleduck/upload/strategies'

type PhotoIntents = {
  post: PostStrategy.Intent
  multipart: MultipartStrategy.Intent
}
type PhotoCursors = {
  post?: PostStrategy.Cursor
  multipart?: MultipartStrategy.Cursor
}
```

The intent your backend returns for large files:

```typescript
// MultipartStrategy.Intent
{
  strategy: 'multipart'
  fileId: string
  uploadId: string   // S3/GCS multipart session id
  partSize: number   // bytes per part (S3 min 5 MB, except the last)
  partCount: number  // total parts
  parts?: Array<{ partNumber: number; url: string; headers?: Record<string, string> }>
}
```

The resume cursor tracks completed parts:

```typescript
// MultipartStrategy.Cursor
{
  done: Array<{ partNumber: number; etag: string; size: number }>
  completed?: true // set after completeMultipart, so resume won't re-finalize
}
```

The cursor map holds the **raw** cursor type. The engine wraps it as
`{ strategy: 'multipart', value }` when it surfaces through events and persistence.

**Register multipartStrategy**

```typescript title="src/upload.ts"
import { PostStrategy, multipartStrategy, createStrategyRegistry } from '@gentleduck/upload/strategies'

const strategies = createStrategyRegistry<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>()
strategies.set(PostStrategy())
strategies.set(multipartStrategy({ maxPartConcurrency: 4 }))
```

`MultipartStrategy.Config`:

| Option | Default | Description |
| --- | --- | --- |
| `maxPartConcurrency` | `4` | Parts uploaded at once |
| `allowedHosts` | — | Host allow-list for signed part URLs |
| `allowPrivateHosts` | `false` | Allow private/loopback IPs in signed URLs |

Set `allowedHosts` in production — otherwise the strategy warns once that signed URLs are
host-unrestricted.

**Implement the multipart backend methods**

The strategy calls `api.multipart.signPart` and `api.multipart.completeMultipart` (each with
`args` and `ctx`):

```typescript title="src/upload.ts"
const api: Contracts.Api.Me<PhotoIntents, PhotoPurpose, PhotoResult> = {
  async createIntent({ purpose, contentType, size, filename }, ctx) {
    const res = await fetch('/api/uploads/create-intent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ purpose, contentType, size, filename }),
      signal: ctx.signal,
    })
    if (!res.ok) throw new Error(`create-intent failed: ${res.status}`)
    // Backend chooses: small -> PostStrategy.Intent, large -> MultipartStrategy.Intent
    return res.json()
  },
  async complete({ fileId, filename, contentType, size }, ctx) {
    const res = await fetch('/api/uploads/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fileId, filename, contentType, size }),
      signal: ctx.signal,
    })
    if (!res.ok) throw new Error(`complete failed: ${res.status}`)
    return res.json()
  },
  multipart: {
    async signPart({ fileId, uploadId, partNumber }, ctx) {
      const res = await fetch('/api/uploads/sign-part', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fileId, uploadId, partNumber }),
        signal: ctx.signal,
      })
      if (!res.ok) throw new Error(`sign-part ${partNumber} failed: ${res.status}`)
      return res.json() // { url: string; headers?: Record<string, string> }
    },
    async completeMultipart({ fileId, uploadId, parts }, ctx) {
      const res = await fetch('/api/uploads/complete-multipart', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fileId, uploadId, parts }), // parts: { partNumber, etag }[]
        signal: ctx.signal,
      })
      if (!res.ok) throw new Error(`complete-multipart failed: ${res.status}`)
      return res.json()
    },
  },
}
```

Per part: the strategy calls `signPart` for a presigned PUT URL, PUTs the slice, reads the
`ETag`, and after all parts calls `completeMultipart` with `{ partNumber, etag }[]`.

**Part size comes from the backend**

`createIntent` returns `partSize` and `partCount`:

```typescript
// 200 MB with 10 MB parts
{ strategy: 'multipart', fileId: 'abc', uploadId: 'upl-xyz', partSize: 10 * 1024 * 1024, partCount: 20 }
```

| File size | Part size | Notes |
| --- | --- | --- |
| \< ~100 MB | — | Use POST |
| 100 MB – 1 GB | 10 MB | Good balance |
| 1 – 5 GB | 50 MB | Fewer requests |
| 5 GB+ | 100 MB | S3 caps at 10,000 parts |

S3 requires a 5 MB minimum per part (except the last).

**Upload and track progress**

From the UI, large files behave like any other upload:

```typescript title="src/main.ts"
store.on('upload.progress', ({ localId, pct, uploadedBytes, totalBytes }) => {
  const mb = (b: number) => (b / 1024 / 1024).toFixed(1)
  console.log(`${localId}: ${pct.toFixed(1)}% (${mb(uploadedBytes)}/${mb(totalBytes)} MB)`)
})

// Multipart resume state surfaces as a wrapped cursor.
store.on('upload.cursor', ({ localId, cursor }) => {
  if (cursor.strategy === 'multipart' && cursor.value) {
    console.log(`${localId}: ${cursor.value.done.length} parts done`)
  }
})
```

Progress aggregates finished-part bytes plus in-flight bytes for one smooth percentage.

## How concurrent parts work

Part-level concurrency (`maxPartConcurrency`) is separate from file-level concurrency
(`maxConcurrentUploads`).

1. **Queue** parts, skipping those already in `cursor.done`.
2. **Upload** up to `maxPartConcurrency` at a time; sign each on demand.
3. **Collect ETags** — expose them via CORS (`Access-Control-Expose-Headers: ETag`) or the
   strategy throws "missing ETag".
4. **Persist the cursor** after each part.
5. **Finalize** with `completeMultipart`, then mark the cursor `completed`.
6. **Retry transient part failures** (network/timeout/5xx) up to 3× with backoff (500 ms, 1 s,
   2 s).

## The legacy `parts` array

If `intent.parts` is present, the strategy uses those pre-signed URLs and skips `signPart`.
On-demand signing is preferred: URLs stay fresh, fewer up-front calls, and only the parts you
actually need get signed.

## Pause and resume

`resumable: true`. Pausing aborts in-flight PUTs; the cursor already has every completed part.
On resume the strategy reads `cursor.done`, skips those parts, and continues. If the cursor is
`completed`, it also skips `completeMultipart` — no double assembly.

## Checkpoint

Full `src/upload.ts`

```typescript
import type { Contracts } from '@gentleduck/upload/core'
import { createUploadStore } from '@gentleduck/upload/core'
import {
  PostStrategy,
  multipartStrategy,
  createStrategyRegistry,
  type MultipartStrategy,
} from '@gentleduck/upload/strategies'

type PhotoIntents = { post: PostStrategy.Intent; multipart: MultipartStrategy.Intent }
type PhotoCursors = { post?: PostStrategy.Cursor; multipart?: MultipartStrategy.Cursor }
type PhotoPurpose = 'photo'
type PhotoResult = Contracts.Result.Base & { url: string }

const api: Contracts.Api.Me<PhotoIntents, PhotoPurpose, PhotoResult> = {
  async createIntent({ purpose, contentType, size, filename }, ctx) {
    const res = await fetch('/api/uploads/create-intent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ purpose, contentType, size, filename }),
      signal: ctx.signal,
    })
    if (!res.ok) throw new Error(`create-intent failed: ${res.status}`)
    return res.json()
  },
  async complete({ fileId, filename, contentType, size }, ctx) {
    const res = await fetch('/api/uploads/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fileId, filename, contentType, size }),
      signal: ctx.signal,
    })
    if (!res.ok) throw new Error(`complete failed: ${res.status}`)
    return res.json()
  },
  multipart: {
    async signPart({ fileId, uploadId, partNumber }, ctx) {
      const res = await fetch('/api/uploads/sign-part', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fileId, uploadId, partNumber }),
        signal: ctx.signal,
      })
      if (!res.ok) throw new Error(`sign-part ${partNumber} failed: ${res.status}`)
      return res.json()
    },
    async completeMultipart({ fileId, uploadId, parts }, ctx) {
      const res = await fetch('/api/uploads/complete-multipart', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fileId, uploadId, parts }),
        signal: ctx.signal,
      })
      if (!res.ok) throw new Error(`complete-multipart failed: ${res.status}`)
      return res.json()
    },
  },
}

const strategies = createStrategyRegistry<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>()
strategies.set(PostStrategy())
strategies.set(multipartStrategy({ maxPartConcurrency: 4, allowedHosts: ['my-bucket.s3.us-east-1.amazonaws.com'] }))

export const store = createUploadStore<PhotoIntents, PhotoCursors, PhotoPurpose, PhotoResult>({
  api,
  strategies,
  config: { maxConcurrentUploads: 3, autoStart: ['photo'] },
})
```

***

## Chapter 4 FAQ

When multipart over POST?

For large files (~100 MB+). Multipart is resumable — a dropped connection loses one part,
not the whole file — and parallel parts saturate fast links. The backend decides per file
in `createIntent`.

"Missing ETag" errors?

Browsers only expose headers listed in `Access-Control-Expose-Headers`. Add
`Access-Control-Expose-Headers: ETag` to your S3/MinIO CORS so the strategy can read each
part's ETag. This is the most common multipart gotcha.

maxPartConcurrency vs maxConcurrentUploads?

`maxConcurrentUploads` is files at once (engine). `maxPartConcurrency` is parts within one
multipart upload (strategy). With 3 and 4, you could have up to 12 in-flight requests.

Why sign parts on demand?

Presigned URLs expire. Signing all parts up front risks later parts expiring mid-upload.
On-demand signing keeps each URL fresh and only signs parts that still need uploading.

What about abandoned multipart uploads on the server?

Orphaned parts sit in S3 and cost storage. Add an S3 lifecycle rule to abort incomplete
multipart uploads after N days, and optionally implement `api.multipart.abort` to clean up
immediately on cancel.

***

Next: [Chapter 5: Pause, Resume & Retry](/duck-upload/course/chapter-5)