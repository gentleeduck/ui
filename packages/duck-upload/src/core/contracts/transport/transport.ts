import { abortReason, createNetworkError, makeAbortError, parseHeaders } from './transport.libs'
import type { UploadTransport } from './transport.types'

type XhrCommonArgs = {
  url: string
  signal?: AbortSignal
  headers?: Record<string, string>
  onProgress?: (loaded: number, total: number) => void
}

function isAbsoluteHttpUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

function readEtag(xhr: XMLHttpRequest) {
  // Needs CORS expose: Access-Control-Expose-Headers: ETag
  const raw = xhr.getResponseHeader('ETag') ?? xhr.getResponseHeader('etag')
  if (!raw) return undefined
  return raw.replace(/"/g, '')
}

function xhrRequest(args: {
  method: 'POST' | 'PUT' | 'PATCH'
  url: string
  body: Document | BodyInit | null
  signal?: AbortSignal
  headers?: Record<string, string>
  onProgress?: (loaded: number, total: number) => void
}) {
  return new Promise<{ headers: Record<string, string>; etag?: string }>((resolve, reject) => {
    if (!args.url || typeof args.url !== 'string') {
      reject(new Error(`UploadTransport: missing url`))
      return
    }
    if (!isAbsoluteHttpUrl(args.url)) {
      reject(new Error(`UploadTransport: expected absolute URL, got: ${String(args.url)}`))
      return
    }

    const xhr = new XMLHttpRequest()
    let settled = false

    const settle = (fn: () => void) => {
      if (settled) return
      settled = true
      cleanup()
      fn()
    }

    const onAbort = () => {
      try {
        xhr.abort()
      } finally {
        settle(() => reject(makeAbortError(abortReason(args.signal))))
      }
    }

    const cleanup = () => {
      if (args.signal) args.signal.removeEventListener('abort', onAbort)

      xhr.upload.onprogress = null
      xhr.onload = null
      xhr.onerror = null
      xhr.onabort = null
    }

    if (args.signal?.aborted) {
      settle(() => reject(makeAbortError(abortReason(args.signal))))
      return
    }

    if (args.signal) args.signal.addEventListener('abort', onAbort, { once: true })

    if (args.onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) args.onProgress?.(e.loaded, e.total)
      }
    }

    xhr.onload = () => {
      const status = xhr.status
      // S3 multipart UploadPart returns 200, tus PATCH returns 204 typically.
      if (status >= 200 && status < 300) {
        settle(() =>
          resolve({
            headers: parseHeaders(xhr),
            etag: readEtag(xhr),
          }),
        )
      } else {
        settle(() => reject(new Error(`Upload failed with status ${status}`)))
      }
    }

    xhr.onerror = () => settle(() => reject(createNetworkError(xhr, 'Network error during upload')))

    xhr.onabort = () =>
      settle(() => reject(makeAbortError(args.signal?.aborted ? abortReason(args.signal) : 'unknown')))

    xhr.open(args.method, args.url)

    if (args.headers) {
      for (const [k, v] of Object.entries(args.headers)) {
        xhr.setRequestHeader(k, v)
      }
    }

    xhr.send(args.body as XMLHttpRequestBodyInit | Document | null)
  })
}

/**
 * Creates a browser-native XHR transport.
 * We use XMLHttpRequest instead of fetch because fetch does not yet support
 * upload progress events in a standard cross-browser way.
 */
export function createXHRTransport(): UploadTransport & {
  // Optional: for tus strategies (PATCH)
  patch?: (args: XhrCommonArgs & { body: Blob | ArrayBuffer }) => Promise<{ headers: Record<string, string> }>
} {
  return {
    async postForm(args) {
      // Note: presigned POST is usually absolute already (MinIO/S3 URL)
      const form = new FormData()
      for (const [k, v] of Object.entries(args.fields)) form.append(k, v)
      form.append('file', args.file, args.filename ?? 'file')

      const out = await xhrRequest({
        method: 'POST',
        url: args.url,
        body: form,
        signal: args.signal,
        onProgress: args.onProgress,
      })

      return { headers: out.headers }
    },

    async put(args) {
      const out = await xhrRequest({
        method: 'PUT',
        url: args.url,
        body: args.body,
        signal: args.signal,
        headers: args.headers,
        onProgress: args.onProgress,
      })

      // multipart needs ETag from each part
      return { headers: out.headers, etag: out.etag }
    },

    // Optional for tus strategy (PATCH)
    async patch(args) {
      const out = await xhrRequest({
        method: 'PATCH',
        url: args.url,
        body: args.body,
        signal: args.signal,
        headers: args.headers,
        onProgress: args.onProgress,
      })
      return { headers: out.headers }
    },
  }
}
