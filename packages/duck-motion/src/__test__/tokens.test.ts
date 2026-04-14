import { describe, expect, test } from 'bun:test'
import { duckDuration, duckEasing, duckMotionCssVar } from '../tokens'

describe('duckEasing', () => {
  test('standard is a valid cubic-bezier value', () => {
    expect(duckEasing.standard).toMatch(/^cubic-bezier\(\s*[\d.]+,\s*[\d.]+,\s*[\d.]+,\s*[\d.]+\s*\)$/)
  })

  test('spring is a valid cubic-bezier value', () => {
    expect(duckEasing.spring).toMatch(/^cubic-bezier\(\s*[-\d.]+,\s*[-\d.]+,\s*[-\d.]+,\s*[-\d.]+\s*\)$/)
  })

  test('standard uses values within typical range', () => {
    const match = duckEasing.standard.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/)
    expect(match).not.toBeNull()
    const [, x1, y1, x2, y2] = match!.map(Number)
    // x values must be 0-1 for valid CSS
    expect(x1).toBeGreaterThanOrEqual(0)
    expect(x1).toBeLessThanOrEqual(1)
    expect(x2).toBeGreaterThanOrEqual(0)
    expect(x2).toBeLessThanOrEqual(1)
  })

  test('standard is exactly cubic-bezier(0.4, 0, 0.2, 1)', () => {
    expect(duckEasing.standard).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
  })

  test('spring is exactly cubic-bezier(1, 0.23995, 0, 1.65)', () => {
    expect(duckEasing.spring).toBe('cubic-bezier(1, 0.23995, 0, 1.65)')
  })

  test('has exactly two easing presets', () => {
    expect(Object.keys(duckEasing)).toEqual(['standard', 'spring'])
  })

  test('spring y-values exceed 0-1 range for overshoot effect', () => {
    const match = duckEasing.spring.match(/cubic-bezier\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\)/)
    expect(match).not.toBeNull()
    const y2 = Number(match![4])
    expect(y2).toBeGreaterThan(1)
  })
})

describe('duckDuration', () => {
  test('all duration values are non-negative numbers', () => {
    for (const [, value] of Object.entries(duckDuration)) {
      expect(typeof value).toBe('number')
      expect(value).toBeGreaterThanOrEqual(0)
    }
  })

  test('instant is zero', () => {
    expect(duckDuration.instant).toBe(0)
  })

  test('durations are ordered: instant < fast < normal < slow', () => {
    expect(duckDuration.instant).toBeLessThan(duckDuration.fast)
    expect(duckDuration.fast).toBeLessThan(duckDuration.normal)
    expect(duckDuration.normal).toBeLessThan(duckDuration.slow)
  })

  test('fast is 150ms', () => {
    expect(duckDuration.fast).toBe(150)
  })

  test('normal is 200ms', () => {
    expect(duckDuration.normal).toBe(200)
  })

  test('slow is 300ms', () => {
    expect(duckDuration.slow).toBe(300)
  })

  test('has exactly four duration tokens', () => {
    expect(Object.keys(duckDuration)).toEqual(['instant', 'fast', 'normal', 'slow'])
  })

  test('all durations are integers', () => {
    for (const [, value] of Object.entries(duckDuration)) {
      expect(Number.isInteger(value)).toBe(true)
    }
  })
})

describe('duckMotionCssVar', () => {
  test('duration uses a valid CSS var() with fallback', () => {
    expect(duckMotionCssVar.duration).toMatch(/^var\(--[\w-]+,\s*.+\)$/)
  })

  test('easing uses a valid CSS var() with fallback', () => {
    expect(duckMotionCssVar.easing).toMatch(/^var\(--[\w-]+,\s*.+\)$/)
  })

  test('duration var name starts with --duck-motion-', () => {
    expect(duckMotionCssVar.duration).toContain('--gentleduck-motion-dur')
  })

  test('easing var name starts with --duck-motion-', () => {
    expect(duckMotionCssVar.easing).toContain('--gentleduck-motion-ease')
  })

  test('duration fallback includes ms unit', () => {
    const fallback = duckMotionCssVar.duration.match(/,\s*(.+)\)$/)?.[1]
    expect(fallback).toMatch(/\d+ms$/)
  })

  test('easing fallback is a cubic-bezier', () => {
    const fallback = duckMotionCssVar.easing.match(/,\s*(.+)\)$/)?.[1]
    expect(fallback).toMatch(/^cubic-bezier\(/)
  })

  test('duration is exactly var(--gentleduck-motion-dur, 150ms)', () => {
    expect(duckMotionCssVar.duration).toBe('var(--gentleduck-motion-dur, 150ms)')
  })

  test('easing is exactly var(--gentleduck-motion-ease, cubic-bezier(0.4, 0, 0.2, 1))', () => {
    expect(duckMotionCssVar.easing).toBe('var(--gentleduck-motion-ease, cubic-bezier(0.4, 0, 0.2, 1))')
  })

  test('duration fallback matches duckDuration.fast', () => {
    const fallback = duckMotionCssVar.duration.match(/,\s*(\d+)ms\)$/)?.[1]
    expect(Number(fallback)).toBe(duckDuration.fast)
  })

  test('easing fallback matches duckEasing.standard', () => {
    const fallback = duckMotionCssVar.easing.match(/,\s*(.+)\)$/)?.[1]
    expect(fallback).toBe(duckEasing.standard)
  })

  test('has exactly two CSS variable entries', () => {
    expect(Object.keys(duckMotionCssVar)).toEqual(['duration', 'easing'])
  })
})
