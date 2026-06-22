duck-upload throws `UploadEngineError` from intent, upload, and
finalize handlers. Errors carry a stable `code` and a **static
message** that's safe to render directly. Tainted, attacker-controlled
values (filename, fileId, server response strings) live on the
structured `context` field - never in the message.

```typescript
import { UploadEngineError } from '@gentleduck/upload/core'
```

## Why static messages

Filenames are attacker-controlled. A naive error like
``new Error(`upload of ${file.name} failed`)`` invites filenames
such as `<img src=x onerror=alert(1)>.png` to slip into your UI when
the host app renders `error.message` with `dangerouslySetInnerHTML`
or `innerHTML`.

`UploadEngineError` keeps a constant message per `code`:

```typescript
intent_failed   -> 'upload intent request failed'
upload_failed   -> 'upload transfer failed'
complete_failed -> 'upload finalize failed'
```

You can safely pipe `err.message` into a toast, `<div>{err.message}</div>`,
or even `dangerouslySetInnerHTML` - the value is a string the library
controls.

## Reading tainted values

Filenames, fileIds, response bodies, and other inputs supplied by
your backend or end users live on `err.context`:

```typescript
try {
  await client.upload(file)
} catch (err) {
  if (err instanceof UploadEngineError) {
    // Safe: static, attacker-cannot-influence string.
    toast(err.message)

    // Tainted: escape before HTML rendering!
    log({ filename: err.context?.filename })
  }
}
```

When you render `err.context.*` in HTML you MUST escape it -
`textContent`, React children (which auto-escape), or a sanitizer.
Direct `innerHTML` injection of `context` values is an XSS bug.

## Discriminating on `code`

`code` is a stable, machine-readable string. Branch on it for typed
recovery:

```tsx
if (err instanceof UploadEngineError) {
  switch (err.code) {
    case 'intent_failed':
      // Your backend rejected the createIntent call. Show "try again later".
      return <RetryToast />
    case 'upload_failed':
      // Bytes failed to reach storage. Resume is usually possible.
      return <ResumeButton fileId={err.context?.fileId as string} />
    case 'complete_failed':
      // All bytes uploaded but finalize/assemble failed. Manual recovery.
      return <ContactSupport />
    default:
      return <GenericError />
  }
}
```

Always treat `err.context?.fileId` and similar as `unknown` at the
boundary - the discriminated cast above is intentional. The error
context shape is open per `code`, so a stricter typing has to come
from your app's error policy.

## ES2022 `cause`

When `UploadEngineError` wraps an underlying error (HTTP fetch, JSON
parse, backend handler throw), the original lives on `err.cause`:

```typescript
if (err instanceof UploadEngineError && err.cause instanceof Response) {
  console.error('HTTP', err.cause.status, await err.cause.text())
}
```

`cause` carries whatever the engine caught; treat it as `unknown`.

## Common error patterns

| Pattern | What it means |
|---|---|
| `intent_failed` with `cause` = `Response` | Your backend returned non-2xx on `createIntent`. Inspect `cause.status` and `cause.text()`. |
| `upload_failed` with `context.fileId` set | The transport (strategy) gave up after retries. The fileId is safe to pass back to resume. |
| `upload_failed` with `cause` = `DOMException` | Network abort - usually the user cancelled or the page navigated. Don't escalate. |
| `complete_failed` with `context.uploadId` set | Multipart assembly failed server-side. All bytes are uploaded; manual recovery via the backend is usually possible. |

## See also

* [Contracts](/duck-upload/core/contracts) - the `Contracts.Error` discriminated union for the typed engine-result errors (a separate, broader surface).
* [Engine](/duck-upload/core/engine) - where these errors originate.