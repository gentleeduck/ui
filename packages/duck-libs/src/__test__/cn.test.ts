import { describe, expect, test } from 'vitest'
import { cn } from '../cn'

describe('cn', () => {
  test('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  test('handles conditional classes via clsx', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
    expect(cn('base', true && 'active')).toBe('base active')
  })

  test('resolves tailwind conflicts (last wins)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('bg-red-100', 'bg-blue-200')).toBe('bg-blue-200')
  })

  test('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  test('handles objects of classes', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  test('returns empty string for no input', () => {
    expect(cn()).toBe('')
  })

  test('ignores falsy values', () => {
    expect(cn(null, undefined, false, '', 0, 'valid')).toBe('valid')
  })

  test('merges complex tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    expect(cn('text-sm font-bold', 'text-lg')).toBe('font-bold text-lg')
  })
})
