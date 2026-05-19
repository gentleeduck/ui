import { describe, expect, test } from 'vitest'
import type { UploadState } from '../core/engine/reducer'
import { MemoryAdapter } from '../core/persistence'
import { deserializeSnapshot, serializeSnapshot } from '../core/persistence/persistence'
import type { PersistedSnapshot } from '../core/persistence/persistence.types'

type Intents = { post: { strategy: 'post'; fileId: string; url: string } }
type Cursors = { post: { offset: number } }
type Purpose = 'avatar'
type Result = { fileId: string; key: string }

const isPurpose = (v: string): v is Purpose => v === 'avatar'
const isIntent = (v: unknown): v is Intents[keyof Intents] => {
  return (
    typeof v === 'object' &&
    v !== null &&
    (v as { strategy?: unknown }).strategy === 'post' &&
    typeof (v as { fileId?: unknown }).fileId === 'string'
  )
}
const hasStrategy = (s: string) => s === 'post'

describe('serializeSnapshot', () => {
  test('skips items without intents and terminal states', () => {
    const state: UploadState<Intents, Cursors, Purpose, Result> = {
      items: new Map([
        [
          'a',
          {
            phase: 'validating',
            localId: 'a',
            purpose: 'avatar',
            fingerprint: { name: 'a', size: 1, type: 't', lastModified: 0 },
            file: new File(['a'], 'a'),
            createdAt: 0,
          },
        ],
        [
          'b',
          {
            phase: 'completed',
            localId: 'b',
            purpose: 'avatar',
            fingerprint: { name: 'b', size: 1, type: 't', lastModified: 0 },
            file: new File(['b'], 'b'),
            intent: { strategy: 'post', fileId: 'b', url: 'x' },
            completedBy: 'upload',
            result: { fileId: 'b', key: 'k/b' },
            completedAt: 0,
            createdAt: 0,
          },
        ],
        [
          'c',
          {
            phase: 'uploading',
            localId: 'c',
            purpose: 'avatar',
            fingerprint: { name: 'c', size: 10, type: 't', lastModified: 0 },
            file: new File(['c'], 'c'),
            intent: { strategy: 'post', fileId: 'c', url: 'x' },
            startedAt: 0,
            progress: { uploadedBytes: 5, totalBytes: 10, pct: 50 },
            createdAt: 0,
            cursor: { strategy: 'post', value: { offset: 5 } },
          },
        ],
      ]),
    }

    const snap = serializeSnapshot(state, 1)
    expect(Object.keys(snap.items)).toEqual(['c'])
    expect(snap.version).toBe(1)
  })
})

describe('deserializeSnapshot', () => {
  test('restores resumable items into the paused phase', () => {
    const snap: PersistedSnapshot<Intents, Cursors, Purpose> = {
      version: 1,
      createdAt: 100,
      items: {
        c: {
          id: 'c',
          purpose: 'avatar',
          status: 'uploading',
          file: { name: 'c', size: 10, type: 't', lastModified: 0 },
          intent: { strategy: 'post', fileId: 'c', url: 'x' },
          cursor: { strategy: 'post', value: { offset: 5 } },
          progress: { uploadedBytes: 5, totalBytes: 10, pct: 50 },
        },
      },
    }

    const out = deserializeSnapshot<Intents, Cursors, Purpose, Result>(snap, {
      isPurpose,
      isIntent,
      hasStrategy,
    })
    expect(out).not.toBeNull()
    const item = out?.items.get('c')
    expect(item?.phase).toBe('paused')
    if (item?.phase === 'paused') {
      expect(item.cursor).toEqual({ strategy: 'post', value: { offset: 5 } })
      expect(item.progress.pct).toBe(50)
    }
  })

  test('drops items missing a cursor', () => {
    const snap: PersistedSnapshot<Intents, Cursors, Purpose> = {
      version: 1,
      createdAt: 100,
      items: {
        c: {
          id: 'c',
          purpose: 'avatar',
          status: 'uploading',
          file: { name: 'c', size: 10, type: 't', lastModified: 0 },
          intent: { strategy: 'post', fileId: 'c', url: 'x' },
        },
      },
    }
    const out = deserializeSnapshot<Intents, Cursors, Purpose, Result>(snap, {
      isPurpose,
      isIntent,
      hasStrategy,
    })
    expect(out?.items.size).toBe(0)
  })

  test('returns null without guards', () => {
    const snap: PersistedSnapshot<Intents, Cursors, Purpose> = { version: 1, createdAt: 0, items: {} }
    const out = deserializeSnapshot<Intents, Cursors, Purpose, Result>(snap, { hasStrategy })
    expect(out).toBeNull()
  })

  test('accepts snapshots and ignores unrecognized version when not enforced', () => {
    const snap: PersistedSnapshot<Intents, Cursors, Purpose> = { version: 1, createdAt: 0, items: {} }
    const out = deserializeSnapshot<Intents, Cursors, Purpose, Result>(snap, {
      isPurpose,
      isIntent,
      hasStrategy,
    })
    expect(out).not.toBeNull()
    expect(out?.items.size).toBe(0)
  })
})

describe('MemoryAdapter', () => {
  test('round-trips a value', async () => {
    await MemoryAdapter.save('k', { a: 1 })
    expect(await MemoryAdapter.load('k')).toEqual({ a: 1 })
    await MemoryAdapter.clear('k')
    expect(await MemoryAdapter.load('k')).toBeNull()
  })
})
