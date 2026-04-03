import { describe, expect, test } from 'bun:test'
import { duckMotionDuration, duckMotionEasing, duckMotionTransition } from '../motion-tokens'
import { duckDuration } from '../tokens'

describe('duckMotionDuration', () => {
  test('instant is 0', () => {
    expect(duckMotionDuration.instant).toBe(0)
  })

  test('fast matches duckDuration.fast / 1000', () => {
    expect(duckMotionDuration.fast).toBe(duckDuration.fast / 1000)
  })

  test('normal matches duckDuration.normal / 1000', () => {
    expect(duckMotionDuration.normal).toBe(duckDuration.normal / 1000)
  })

  test('slow matches duckDuration.slow / 1000', () => {
    expect(duckMotionDuration.slow).toBe(duckDuration.slow / 1000)
  })

  test('has exactly four duration keys', () => {
    expect(Object.keys(duckMotionDuration)).toEqual(['instant', 'fast', 'normal', 'slow'])
  })
})

describe('duckMotionEasing', () => {
  test('standard is [0.4, 0, 0.2, 1]', () => {
    expect([...duckMotionEasing.standard]).toEqual([0.4, 0, 0.2, 1])
  })

  test('spring is [1, 0.23995, 0, 1.65]', () => {
    expect([...duckMotionEasing.spring]).toEqual([1, 0.23995, 0, 1.65])
  })

  test('has exactly two easing keys', () => {
    expect(Object.keys(duckMotionEasing)).toEqual(['standard', 'spring'])
  })
})

describe('duckMotionTransition', () => {
  test('has five transition presets', () => {
    expect(Object.keys(duckMotionTransition)).toEqual(['instant', 'fast', 'normal', 'slow', 'spring'])
  })

  test('instant has duration 0 and no ease', () => {
    expect(duckMotionTransition.instant.duration).toBe(0)
    expect('ease' in duckMotionTransition.instant).toBe(false)
  })

  test('fast has duration 0.15 with standard ease', () => {
    expect(duckMotionTransition.fast.duration).toBe(0.15)
    expect(duckMotionTransition.fast.ease).toEqual([0.4, 0, 0.2, 1])
  })

  test('normal has duration 0.2 with standard ease', () => {
    expect(duckMotionTransition.normal.duration).toBe(0.2)
    expect(duckMotionTransition.normal.ease).toEqual([0.4, 0, 0.2, 1])
  })

  test('slow has duration 0.3 with standard ease', () => {
    expect(duckMotionTransition.slow.duration).toBe(0.3)
    expect(duckMotionTransition.slow.ease).toEqual([0.4, 0, 0.2, 1])
  })

  test('spring uses spring easing with normal duration', () => {
    expect(duckMotionTransition.spring.duration).toBe(0.2)
    expect(duckMotionTransition.spring.ease).toEqual([1, 0.23995, 0, 1.65])
  })
})
