import { describe, expect, test } from 'bun:test'
import { clamp } from '../clamp'
import { composeEventHandlers } from '../compose-event-handler'
import { getState } from '../get-state'

describe('duck-primitives utils', () => {
  test('clamp constrains numbers within an inclusive range', () => {
    expect(clamp(5, [1, 10])).toBe(5)
    expect(clamp(-2, [1, 10])).toBe(1)
    expect(clamp(12, [1, 10])).toBe(10)
  })

  test('clamp preserves boundary values', () => {
    expect(clamp(1, [1, 10])).toBe(1)
    expect(clamp(10, [1, 10])).toBe(10)
  })

  test('getState returns Radix-style open and closed strings', () => {
    expect(getState(true)).toBe('open')
    expect(getState(false)).toBe('closed')
  })

  test('composeEventHandlers preserves order and respects defaultPrevented', () => {
    const calls: string[] = []
    const handler = composeEventHandlers(
      (event) => {
        calls.push('original')
        event.defaultPrevented = true
      },
      () => {
        calls.push('ours')
      },
    )

    handler({ defaultPrevented: false })
    expect(calls).toEqual(['original'])
  })

  test('composeEventHandlers returns our handler result when it runs', () => {
    const handler = composeEventHandlers(undefined, () => 'handled')

    expect(handler({ defaultPrevented: false })).toBe('handled')
  })

  test('composeEventHandlers runs our handler when the original does not prevent default', () => {
    const calls: string[] = []
    const handler = composeEventHandlers(
      () => {
        calls.push('original')
      },
      () => {
        calls.push('ours')
      },
    )

    handler({ defaultPrevented: false })
    expect(calls).toEqual(['original', 'ours'])
  })

  test('composeEventHandlers can ignore defaultPrevented checks when requested', () => {
    const calls: string[] = []
    const handler = composeEventHandlers(
      (event) => {
        calls.push('original')
        event.defaultPrevented = true
      },
      () => {
        calls.push('ours')
      },
      { checkForDefaultPrevented: false },
    )

    handler({ defaultPrevented: false })
    expect(calls).toEqual(['original', 'ours'])
  })
})
