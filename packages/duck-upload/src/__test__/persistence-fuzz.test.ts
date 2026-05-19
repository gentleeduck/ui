import fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import type { Engine } from '../core/engine/engine.types'
import type { Reducer } from '../core/engine/reducer'
import { deserializeSnapshot, serializeSnapshot } from '../core/persistence/persistence'

type Intents = { post: { strategy: 'post'; fileId: string; url: string } }
type Cursors = { post: { offset: number } }
type Purpose = 'avatar'
type Result = { fileId: string; key: string }

const TS = 1_700_000_000_000

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

/**
 * Arbitrary `paused` item -- the only phase `serializeSnapshot` rebuilds
 * losslessly on `deserializeSnapshot` (it strips `file` and pins phase to
 * `paused`). Other phases are intentionally dropped on the load side.
 */
const pausedItemArb: fc.Arbitrary<Engine.Item<Intents, Cursors, Purpose, Result>> = fc
  .record({
    localId: fc.string({ minLength: 1, maxLength: 12 }),
    fileName: fc.string({ minLength: 1, maxLength: 32 }),
    fileSize: fc.integer({ min: 1, max: 10_000_000 }),
    fileType: fc.constantFrom('text/plain', 'image/png', 'application/octet-stream'),
    cursorOffset: fc.integer({ min: 0, max: 10_000_000 }),
    progressUp: fc.integer({ min: 0, max: 10_000_000 }),
  })
  .map(({ localId, fileName, fileSize, fileType, cursorOffset, progressUp }) => ({
    phase: 'paused' as const,
    localId,
    purpose: 'avatar' as Purpose,
    fingerprint: { name: fileName, size: fileSize, type: fileType, lastModified: TS },
    intent: { strategy: 'post' as const, fileId: 'srv-' + localId, url: 'https://example.com/upload' },
    cursor: { strategy: 'post' as const, value: { offset: cursorOffset } },
    progress: {
      uploadedBytes: Math.min(progressUp, fileSize),
      totalBytes: fileSize,
      pct: Math.min(100, (Math.min(progressUp, fileSize) / fileSize) * 100),
    },
    pausedAt: TS,
    createdAt: TS,
    file: undefined,
  }))

describe('serialize/deserialize round-trip', () => {
  test('paused items survive round-trip through JSON serialization', () => {
    fc.assert(
      fc.property(fc.array(pausedItemArb, { minLength: 0, maxLength: 5 }), (items) => {
        // Dedupe localIds; uniqueness is the consumer's contract.
        const map = new Map<string, Engine.Item<Intents, Cursors, Purpose, Result>>()
        for (const item of items) map.set(item.localId, item)
        const state: Reducer.IState<Intents, Cursors, Purpose, Result> = { items: map }

        const snap = serializeSnapshot(state, 1)
        // JSON-roundtrip the snapshot to simulate adapter behavior.
        const wired = JSON.parse(JSON.stringify(snap))
        const restored = deserializeSnapshot<Intents, Cursors, Purpose, Result>(wired, {
          isPurpose,
          isIntent,
          hasStrategy,
          expectedVersion: 1,
        })

        expect(restored).not.toBeNull()
        if (!restored) return

        expect(restored.items.size).toBe(map.size)
        for (const [id, original] of map) {
          const got = restored.items.get(id)
          expect(got).toBeDefined()
          if (!got) continue
          // `file` is stripped on deserialize; everything else must match.
          expect(got.phase).toBe('paused')
          expect(got.fingerprint.name).toBe(original.fingerprint.name)
          expect(got.fingerprint.size).toBe(original.fingerprint.size)
          expect(got.fingerprint.type).toBe(original.fingerprint.type)
          if (got.phase === 'paused' && original.phase === 'paused') {
            expect(got.intent.fileId).toBe(original.intent.fileId)
            expect(got.intent.url).toBe(original.intent.url)
            expect(got.cursor).toEqual(original.cursor)
          }
        }
      }),
      { numRuns: 100 },
    )
  })
})
