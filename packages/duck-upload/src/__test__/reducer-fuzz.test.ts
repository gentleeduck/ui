import fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import type { Engine } from '../core/engine/engine.types'
import { createReducer, type Reducer } from '../core/engine/reducer'

type Intents = { post: { strategy: 'post'; fileId: string; url: string } }
type Cursors = { post: { offset: number } }
type Purpose = 'avatar'
type Result = { fileId: string; key: string }

const reduce = createReducer<Intents, Cursors, Purpose, Result>()
const TS = 1_700_000_000_000

function makeFile(): File {
  return new File([new Uint8Array(10)], 'a.txt', { type: 'text/plain', lastModified: TS })
}

const fingerprint = { name: 'a.txt', size: 10, type: 'text/plain', lastModified: TS }

/** Arbitrary starting state. Covers every phase a real reducer might see. */
const seedArb: fc.Arbitrary<Reducer.IState<Intents, Cursors, Purpose, Result>> = fc.oneof(
  fc.constant({
    items: new Map<string, Engine.Item<Intents, Cursors, Purpose, Result>>([
      ['a', { phase: 'validating', localId: 'a', purpose: 'avatar', fingerprint, file: makeFile(), createdAt: TS }],
    ]),
  }),
  fc.constant({
    items: new Map<string, Engine.Item<Intents, Cursors, Purpose, Result>>([
      [
        'a',
        {
          phase: 'ready',
          localId: 'a',
          purpose: 'avatar',
          fingerprint,
          file: makeFile(),
          intent: { strategy: 'post', fileId: 'x', url: 'https://x' },
          createdAt: TS,
        },
      ],
    ]),
  }),
  fc.constant({
    items: new Map<string, Engine.Item<Intents, Cursors, Purpose, Result>>([
      [
        'a',
        {
          phase: 'paused',
          localId: 'a',
          purpose: 'avatar',
          fingerprint,
          file: makeFile(),
          intent: { strategy: 'post', fileId: 'x', url: 'https://x' },
          cursor: { strategy: 'post', value: { offset: 5 } },
          progress: { uploadedBytes: 5, totalBytes: 10, pct: 50 },
          pausedAt: TS,
          createdAt: TS,
        },
      ],
    ]),
  }),
  fc.constant({ items: new Map<string, Engine.Item<Intents, Cursors, Purpose, Result>>() }),
)

type Ev = Engine.InternalEvent<Intents, Cursors, Purpose, Result>

const statusArb = fc.integer({ min: 100, max: 599 })
const bytesArb = fc.integer({ min: 0, max: 10 })

const eventArb: fc.Arbitrary<Ev> = fc.oneof(
  fc.constant<Ev>({ type: 'validation.ok', localId: 'a' }),
  fc.constant<Ev>({ type: 'validation.failed', localId: 'a', reason: { code: 'empty_file' } }),
  fc.constant<Ev>({
    type: 'intent.ok',
    localId: 'a',
    intent: { strategy: 'post', fileId: 'x', url: 'https://x' },
  }),
  statusArb.map<Ev>((status) => ({
    type: 'intent.failed',
    localId: 'a',
    error: { code: 'http', status, message: 'down' },
    retryable: status >= 500 || status === 429,
  })),
  fc.constant<Ev>({ type: 'upload.begin', localId: 'a', startedAt: TS }),
  bytesArb.map<Ev>((uploadedBytes) => ({
    type: 'upload.progress',
    localId: 'a',
    uploadedBytes,
    totalBytes: 10,
  })),
  fc.constant<Ev>({ type: 'upload.ok', localId: 'a' }),
  statusArb.map<Ev>((status) => ({
    type: 'upload.failed',
    localId: 'a',
    error: { code: 'http', status, message: 'down' },
    retryable: status >= 500 || status === 429,
  })),
  fc.constant<Ev>({ type: 'complete.ok', localId: 'a', result: { fileId: 'x', key: 'k' } }),
  fc.constant<Ev>({ type: 'canceled', localId: 'a', canceledAt: TS }),
  fc.constant<Ev>({ type: 'paused', localId: 'a', pausedAt: TS, cursor: { strategy: 'post', value: { offset: 5 } } }),
)

describe('reducer fuzz', () => {
  test('reducer never throws on arbitrary event sequences from arbitrary seed states', () => {
    fc.assert(
      fc.property(seedArb, fc.array(eventArb, { minLength: 0, maxLength: 30 }), (initial, events) => {
        let state = initial
        for (const event of events) {
          state = reduce(state, event)
        }
        expect(state.items.size).toBeLessThanOrEqual(1)
      }),
      { numRuns: 300 },
    )
  })

  test('every reduce call produces a state whose items map is a fresh ref OR the same ref', () => {
    // Lazy alloc invariant: if state changed, items is a new Map; if not, the
    // outer state ref is identical (the inner items ref is also therefore
    // identical). Never an in-place mutation of the prior Map.
    fc.assert(
      fc.property(seedArb, fc.array(eventArb, { minLength: 1, maxLength: 20 }), (initial, events) => {
        let state = initial
        for (const event of events) {
          const priorMap = state.items
          const next = reduce(state, event)
          if (next === state) {
            expect(next.items).toBe(priorMap)
          } else {
            expect(next.items).not.toBe(priorMap)
          }
          state = next
        }
      }),
      { numRuns: 200 },
    )
  })
})
