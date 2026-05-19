import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createXHRTransport } from '../core/contracts/transport'
import { UploadAbortError } from '../core/contracts/transport/transport.libs'

/**
 * Minimal `XMLHttpRequest` mock. Captures method/url/headers/body and exposes
 * hooks to simulate `onload` / `onerror` / `onabort` and per-progress events.
 */
class MockXHR {
  static instances: MockXHR[] = []

  method = ''
  url = ''
  body: unknown = null
  headers: Record<string, string> = {}
  status = 0
  upload = { onprogress: null as ((e: ProgressEvent) => void) | null }
  onload: ((e: Event) => void) | null = null
  onerror: ((e: Event) => void) | null = null
  onabort: ((e: Event) => void) | null = null
  responseHeadersRaw = ''
  responseHeaders: Record<string, string> = {}

  constructor() {
    MockXHR.instances.push(this)
  }

  open(method: string, url: string) {
    this.method = method
    this.url = url
  }

  setRequestHeader(name: string, value: string) {
    this.headers[name.toLowerCase()] = value
  }

  send(body: unknown) {
    this.body = body
  }

  abort() {
    this.onabort?.(new Event('abort'))
  }

  getResponseHeader(name: string): string | null {
    return this.responseHeaders[name.toLowerCase()] ?? null
  }

  getAllResponseHeaders(): string {
    return this.responseHeadersRaw
  }

  // Test helpers
  fireSuccess(status: number, headers: Record<string, string> = {}) {
    this.status = status
    this.responseHeaders = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
    this.responseHeadersRaw = Object.entries(headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\r\n')
    this.onload?.(new Event('load'))
  }

  fireError(status = 0) {
    this.status = status
    this.onerror?.(new Event('error'))
  }
}

const originalXHR = (globalThis as { XMLHttpRequest?: unknown }).XMLHttpRequest

beforeEach(() => {
  MockXHR.instances = []
  ;(globalThis as unknown as { XMLHttpRequest: typeof MockXHR }).XMLHttpRequest = MockXHR
})

afterEach(() => {
  if (originalXHR) (globalThis as { XMLHttpRequest?: unknown }).XMLHttpRequest = originalXHR
  else delete (globalThis as { XMLHttpRequest?: unknown }).XMLHttpRequest
})

describe('createXHRTransport.put', () => {
  test('resolves on 2xx and parses ETag', async () => {
    const t = createXHRTransport()
    const ctl = new AbortController()
    const promise = t.put({
      url: 'https://example.com/part',
      body: new Blob(['x']),
      signal: ctl.signal,
      headers: { 'x-foo': 'bar' },
    })

    const xhr = MockXHR.instances[0]
    expect(xhr.method).toBe('PUT')
    expect(xhr.url).toBe('https://example.com/part')
    expect(xhr.headers['x-foo']).toBe('bar')

    xhr.fireSuccess(200, { ETag: '"abc"' })
    const result = await promise
    expect(result.etag).toBe('abc')
  })

  test('rejects with a status-tagged Error on non-2xx status', async () => {
    const t = createXHRTransport()
    const ctl = new AbortController()
    const promise = t.put({ url: 'https://example.com/part', body: new Blob(['x']), signal: ctl.signal })

    const xhr = MockXHR.instances[0]
    xhr.fireSuccess(503)
    await expect(promise).rejects.toThrow(/status 503/)
  })

  test('rejects with a CORS-tagged Error when status=0', async () => {
    const t = createXHRTransport()
    const ctl = new AbortController()
    const promise = t.put({ url: 'https://example.com/part', body: new Blob(['x']), signal: ctl.signal })

    const xhr = MockXHR.instances[0]
    xhr.fireError(0)
    await expect(promise).rejects.toThrow(/CORS/)
  })

  test('rejects with UploadAbortError when the signal aborts', async () => {
    const t = createXHRTransport()
    const ctl = new AbortController()
    const promise = t.put({ url: 'https://example.com/part', body: new Blob(['x']), signal: ctl.signal })

    ctl.abort('cancel')
    await expect(promise).rejects.toBeInstanceOf(UploadAbortError)
    await expect(promise).rejects.toMatchObject({ code: 'aborted', reason: 'cancel' })
  })

  test('rejects non-absolute URLs', async () => {
    const t = createXHRTransport()
    const ctl = new AbortController()
    await expect(t.put({ url: '/relative/path', body: new Blob(['x']), signal: ctl.signal })).rejects.toThrow(
      /absolute URL/,
    )
  })

  test('forwards upload progress events', async () => {
    const t = createXHRTransport()
    const ctl = new AbortController()
    const onProgress = vi.fn()
    const promise = t.put({
      url: 'https://example.com/part',
      body: new Blob(['x']),
      signal: ctl.signal,
      onProgress,
    })

    const xhr = MockXHR.instances[0]
    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 5, total: 10 } as ProgressEvent)
    expect(onProgress).toHaveBeenCalledWith(5, 10)

    xhr.fireSuccess(200)
    await promise
  })
})

describe('createXHRTransport.postForm', () => {
  test('builds FormData with fields + file and POSTs', async () => {
    const t = createXHRTransport()
    const ctl = new AbortController()
    const file = new File(['payload'], 'a.txt')
    const promise = t.postForm({
      url: 'https://example.com/upload',
      fields: { key: 'avatar/a.txt', acl: 'private' },
      file,
      signal: ctl.signal,
    })

    const xhr = MockXHR.instances[0]
    expect(xhr.method).toBe('POST')
    expect(xhr.body).toBeInstanceOf(FormData)
    const form = xhr.body as FormData
    expect(form.get('key')).toBe('avatar/a.txt')
    expect(form.get('acl')).toBe('private')

    xhr.fireSuccess(204)
    await promise
  })
})
