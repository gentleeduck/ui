import { describe, expect, test } from 'bun:test'
import { MotionProvider } from '../motion-provider'

describe('MotionProvider', () => {
  test('is a function component', () => {
    expect(typeof MotionProvider).toBe('function')
  })

  test('has displayName', () => {
    expect(MotionProvider.displayName).toBe('MotionProvider')
  })
})
