Multipart uploads are resumable and suit large files. The backend signs each part on
demand, enabling S3/MinIO-style chunked uploads.

## Intent Shape

Your backend's `createIntent` should return this shape for multipart uploads:

```ts
type MultipartIntent = {
  strategy: 'multipart'
  fileId: string
  uploadId: string
  partSize: number
  partCount: number
  parts?: Array<{
    partNumber: number
    url: string
    headers?: Record<string, string>
  }>
}
```

## Cursor Shape

The strategy tracks progress with a cursor persisted after each part:

```ts
type MultipartCursor = {
  done: Array<{
    partNumber: number
    etag: string
    size: number
  }>
  completed?: true
}
```

## Behavior

- Each part uploads individually using signed URLs from the backend.
- The cursor persists after each part, so uploads resume.
- The `completed` flag prevents double completion on resume.
- The strategy handles basic per-part retries internally.
- Abort signals check between parts for pause and cancel.

## When to Use

Use multipart when:

- File size exceeds the POST strategy limit.
- Resumability matters (large files, unreliable connections).
- Concurrent part uploads improve throughput.