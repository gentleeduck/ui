import { describe, expect, it } from 'vitest'
import type { EngineTypes } from '../../../core/engine/engine.types'
import { createMetricsAggregator } from '../index'

function fakeEvent(durationMs: number, allowed = true): EngineTypes.IMetricsEvent {
  return {
    subjectId: 'u',
    action: 'read',
    resource: 'post',
    allowed,
    durationMs,
    mode: 'production',
  }
}

describe('createMetricsAggregator', () => {
  it('counts allow / deny verdicts', () => {
    const m = createMetricsAggregator()
    for (let i = 0; i < 7; i++) m.record(fakeEvent(1, true))
    for (let i = 0; i < 3; i++) m.record(fakeEvent(1, false))
    const s = m.snapshot()
    expect(s.total).toBe(10)
    expect(s.allow).toBe(7)
    expect(s.deny).toBe(3)
  })

  it('computes p50 / p95 / p99 over the rolling window', () => {
    const m = createMetricsAggregator()
    for (let i = 1; i <= 100; i++) m.record(fakeEvent(i))
    const s = m.snapshot()
    expect(s.p50).toBeGreaterThanOrEqual(49)
    expect(s.p50).toBeLessThanOrEqual(51)
    expect(s.p95).toBeGreaterThanOrEqual(94)
    expect(s.p95).toBeLessThanOrEqual(96)
    expect(s.p99).toBeGreaterThanOrEqual(98)
    expect(s.p99).toBeLessThanOrEqual(100)
    expect(s.max).toBe(100)
    expect(s.samples).toBe(100)
  })

  it('evicts oldest samples beyond sampleSize', () => {
    const m = createMetricsAggregator({ sampleSize: 10 })
    for (let i = 1; i <= 100; i++) m.record(fakeEvent(i))
    const s = m.snapshot()
    expect(s.samples).toBe(10)
    expect(s.total).toBe(100)
    // After 100 events with cap 10, only durations 91..100 remain - max is 100, p50 ~95.
    expect(s.max).toBe(100)
    expect(s.p50).toBeGreaterThanOrEqual(94)
  })

  it('reset zeroes counters but keeps the buffer allocation', () => {
    const m = createMetricsAggregator()
    m.record(fakeEvent(5))
    m.reset()
    const s = m.snapshot()
    expect(s.total).toBe(0)
    expect(s.allow).toBe(0)
    expect(s.deny).toBe(0)
    expect(s.samples).toBe(0)
  })

  it('returns zeros on empty window', () => {
    const m = createMetricsAggregator()
    const s = m.snapshot()
    expect(s).toEqual({ total: 0, allow: 0, deny: 0, p50: 0, p95: 0, p99: 0, max: 0, samples: 0 })
  })
})
