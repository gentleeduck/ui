import { describe, expect, test } from 'vitest'
import type { Engine } from '../core/engine/engine.types'
import { createReducer, type Reducer } from '../core/engine/reducer'

type Intents = { post: { strategy: 'post'; fileId: string; url: string } }
type Cursors = { post: { offset: number } }
type Purpose = 'avatar'
type Result = { fileId: string; key: string }

const reduce = createReducer<Intents, Cursors, Purpose, Result>()

const ts = 1_700_000_000_000

function makeFile(name = 'a.txt', size = 10): File {
  return new File([new Uint8Array(size)], name, { type: 'text/plain', lastModified: ts })
}

function emptyState(): Reducer.IState<Intents, Cursors, Purpose, Result> {
  return { items: new Map() }
}

function withItem(
  item: Engine.Item<Intents, Cursors, Purpose, Result>,
): Reducer.IState<Intents, Cursors, Purpose, Result> {
  return { items: new Map([[item.localId, item]]) }
}

type ValidatingItem = Extract<Engine.Item<Intents, Cursors, Purpose, Result>, { phase: 'validating' }>
type CreatingIntentItem = Extract<Engine.Item<Intents, Cursors, Purpose, Result>, { phase: 'creating_intent' }>

function validating(): ValidatingItem {
  return {
    phase: 'validating',
    localId: 'a',
    purpose: 'avatar',
    fingerprint: { name: 'a.txt', size: 10, type: 'text/plain', lastModified: ts },
    file: makeFile(),
    createdAt: ts,
  }
}

function creatingIntent(attempt = 1): CreatingIntentItem {
  const base = validating()
  return {
    phase: 'creating_intent',
    localId: base.localId,
    purpose: base.purpose,
    fingerprint: base.fingerprint,
    file: base.file,
    attempt,
    createdAt: base.createdAt,
  }
}

type ReadyItem = Extract<Engine.Item<Intents, Cursors, Purpose, Result>, { phase: 'ready' }>
type UploadingItem = Extract<Engine.Item<Intents, Cursors, Purpose, Result>, { phase: 'uploading' }>

function ready(): ReadyItem {
  const base = validating()
  return {
    phase: 'ready',
    localId: base.localId,
    purpose: base.purpose,
    fingerprint: base.fingerprint,
    file: base.file,
    intent: { strategy: 'post', fileId: 'fid', url: 'https://x' },
    createdAt: base.createdAt,
  }
}

function uploading(attempt?: number): UploadingItem {
  const r = ready()
  return {
    phase: 'uploading',
    localId: r.localId,
    purpose: r.purpose,
    fingerprint: r.fingerprint,
    file: r.file,
    intent: r.intent,
    startedAt: ts,
    progress: { uploadedBytes: 0, totalBytes: 10, pct: 0 },
    createdAt: r.createdAt,
    attempt,
  }
}

describe('reducer commands', () => {
  test('start: ready -> queued', () => {
    const next = reduce(withItem(ready()), { type: 'start', localId: 'a' })
    expect(next.items.get('a')?.phase).toBe('queued')
  })

  test('start: noop unless phase=ready', () => {
    const next = reduce(withItem(uploading()), { type: 'start', localId: 'a' })
    expect(next.items.get('a')?.phase).toBe('uploading')
  })

  test('pause: queued -> ready', () => {
    const queued: Engine.Item<Intents, Cursors, Purpose, Result> = {
      phase: 'queued',
      localId: 'a',
      purpose: 'avatar',
      fingerprint: ready().fingerprint,
      file: ready().file,
      intent: ready().intent,
      requestedAt: ts,
      createdAt: ts,
    }
    const next = reduce(withItem(queued), { type: 'pause', localId: 'a' })
    expect(next.items.get('a')?.phase).toBe('ready')
  })

  test('cancel: maps any non-terminal to canceled', () => {
    const next = reduce(withItem(uploading()), { type: 'cancel', localId: 'a' })
    expect(next.items.get('a')?.phase).toBe('canceled')
  })

  test('cancel: skips already-completed', () => {
    const completed: Engine.Item<Intents, Cursors, Purpose, Result> = {
      phase: 'completed',
      localId: 'a',
      purpose: 'avatar',
      fingerprint: ready().fingerprint,
      file: ready().file,
      intent: ready().intent,
      completedBy: 'upload',
      result: { fileId: 'x', key: 'k' },
      completedAt: ts,
      createdAt: ts,
    }
    const next = reduce(withItem(completed), { type: 'cancel', localId: 'a' })
    expect(next.items.get('a')?.phase).toBe('completed')
  })

  test('remove: deletes the item', () => {
    const next = reduce(withItem(ready()), { type: 'remove', localId: 'a' })
    expect(next.items.has('a')).toBe(false)
  })

  test('retry on intent-creation failure bumps attempt and moves to creating_intent', () => {
    const errored: Engine.Item<Intents, Cursors, Purpose, Result> = {
      phase: 'error',
      localId: 'a',
      purpose: 'avatar',
      fingerprint: ready().fingerprint,
      file: ready().file,
      error: { code: 'network', message: 'x' },
      retryable: true,
      attempt: 1,
      failedAt: ts,
      createdAt: ts,
    }
    const next = reduce(withItem(errored), { type: 'retry', localId: 'a' })
    const item = next.items.get('a')
    expect(item?.phase).toBe('creating_intent')
    if (item?.phase === 'creating_intent') expect(item.attempt).toBe(2)
  })
})

describe('reducer internal events', () => {
  test('files.added inserts new items', () => {
    const next = reduce(emptyState(), {
      type: 'files.added',
      items: [
        {
          localId: 'a',
          purpose: 'avatar',
          file: makeFile(),
          fingerprint: ready().fingerprint,
          createdAt: ts,
        },
      ],
    })
    expect(next.items.get('a')?.phase).toBe('validating')
  })

  test('validation.ok: validating -> creating_intent attempt=1', () => {
    const next = reduce(withItem(validating()), { type: 'validation.ok', localId: 'a' })
    const item = next.items.get('a')
    expect(item?.phase).toBe('creating_intent')
    if (item?.phase === 'creating_intent') expect(item.attempt).toBe(1)
  })

  test('validation.failed: validating -> error', () => {
    const next = reduce(withItem(validating()), {
      type: 'validation.failed',
      localId: 'a',
      reason: { code: 'empty_file' },
    })
    expect(next.items.get('a')?.phase).toBe('error')
  })

  test('intent.ok: creating_intent -> ready with intent', () => {
    const next = reduce(withItem(creatingIntent()), {
      type: 'intent.ok',
      localId: 'a',
      intent: { strategy: 'post', fileId: 'f', url: 'u' },
    })
    const item = next.items.get('a')
    expect(item?.phase).toBe('ready')
    if (item?.phase === 'ready') expect(item.intent.fileId).toBe('f')
  })

  test('upload.begin: queued -> uploading', () => {
    const queued: Engine.Item<Intents, Cursors, Purpose, Result> = {
      phase: 'queued',
      localId: 'a',
      purpose: 'avatar',
      fingerprint: ready().fingerprint,
      file: ready().file,
      intent: ready().intent,
      requestedAt: ts,
      createdAt: ts,
    }
    const next = reduce(withItem(queued), { type: 'upload.begin', localId: 'a', startedAt: ts })
    expect(next.items.get('a')?.phase).toBe('uploading')
  })

  test('upload.progress: updates progress and pct', () => {
    const next = reduce(withItem(uploading()), {
      type: 'upload.progress',
      localId: 'a',
      uploadedBytes: 5,
      totalBytes: 10,
    })
    const item = next.items.get('a')
    if (item?.phase === 'uploading') {
      expect(item.progress.pct).toBe(50)
      expect(item.progress.uploadedBytes).toBe(5)
    } else expect.fail('expected uploading')
  })

  test('upload.ok: uploading -> completing with full progress', () => {
    const next = reduce(withItem(uploading()), { type: 'upload.ok', localId: 'a' })
    const item = next.items.get('a')
    if (item?.phase === 'completing') {
      expect(item.progress.pct).toBe(100)
      expect(item.progress.uploadedBytes).toBe(10)
    } else expect.fail('expected completing')
  })

  test('dedupe.ok: validating -> completed by dedupe', () => {
    const next = reduce(withItem(validating()), {
      type: 'dedupe.ok',
      localId: 'a',
      result: { fileId: 'x', key: 'k' },
    })
    const item = next.items.get('a')
    if (item?.phase === 'completed') expect(item.completedBy).toBe('dedupe')
    else expect.fail('expected completed')
  })

  test('complete.failed: bumps attempt and marks error', () => {
    const completing: Engine.Item<Intents, Cursors, Purpose, Result> = {
      phase: 'completing',
      localId: 'a',
      purpose: 'avatar',
      fingerprint: ready().fingerprint,
      file: ready().file,
      intent: ready().intent,
      progress: { uploadedBytes: 10, totalBytes: 10, pct: 100 },
      completingAt: ts,
      createdAt: ts,
      attempt: 2,
    }
    const next = reduce(withItem(completing), {
      type: 'complete.failed',
      localId: 'a',
      error: { code: 'http', status: 500, message: 'down' },
      retryable: true,
    })
    const item = next.items.get('a')
    if (item?.phase === 'error') expect(item.attempt).toBe(3)
    else expect.fail('expected error')
  })
})
