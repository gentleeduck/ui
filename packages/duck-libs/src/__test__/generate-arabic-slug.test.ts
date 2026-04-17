import { describe, expect, test } from 'vitest'
import { generateArabicSlug } from '../index'

describe('generateArabicSlug', () => {
  test('converts spaces to hyphens', () => {
    expect(generateArabicSlug('hello world')).toBe('hello-world')
  })

  test('handles Arabic text', () => {
    expect(generateArabicSlug('مرحبا بالعالم')).toBe('مرحبا-بالعالم')
  })

  test('removes special characters', () => {
    expect(generateArabicSlug('hello! @world#')).toBe('hello-world')
  })

  test('trims whitespace', () => {
    expect(generateArabicSlug('  hello world  ')).toBe('hello-world')
  })

  test('collapses multiple spaces into single hyphen', () => {
    expect(generateArabicSlug('hello   world')).toBe('hello-world')
  })

  test('handles empty string', () => {
    expect(generateArabicSlug('')).toBe('')
  })

  test('preserves alphanumeric characters', () => {
    expect(generateArabicSlug('abc123')).toBe('abc123')
  })

  test('handles mixed Arabic and Latin text', () => {
    expect(generateArabicSlug('مرحبا hello')).toBe('مرحبا-hello')
  })

  test('handles string with only special characters', () => {
    expect(generateArabicSlug('!@#$%')).toBe('')
  })

  test('preserves hyphens', () => {
    expect(generateArabicSlug('hello-world')).toBe('hello-world')
  })
})
