import { describe, expect, test } from 'vitest'
import { parseDate } from '../parse-date'

describe('parseDate', () => {
  test('parses "today" to current date', () => {
    const result = parseDate('today')
    expect(result).toBeInstanceOf(Date)
    const now = new Date()
    expect(result!.getFullYear()).toBe(now.getFullYear())
    expect(result!.getMonth()).toBe(now.getMonth())
    expect(result!.getDate()).toBe(now.getDate())
  })

  test('parses "tomorrow" to next day', () => {
    const result = parseDate('tomorrow')
    expect(result).toBeInstanceOf(Date)
    const expected = new Date()
    expected.setDate(expected.getDate() + 1)
    expect(result!.getDate()).toBe(expected.getDate())
  })

  test('parses "next week" to 7 days from now', () => {
    const result = parseDate('next week')
    expect(result).toBeInstanceOf(Date)
    const expected = new Date()
    expected.setDate(expected.getDate() + 7)
    expect(result!.getDate()).toBe(expected.getDate())
    expect(result!.getMonth()).toBe(expected.getMonth())
  })

  test('parses "in X days" format', () => {
    const result = parseDate('in 3 days')
    expect(result).toBeInstanceOf(Date)
    const expected = new Date()
    expected.setDate(expected.getDate() + 3)
    expect(result!.getDate()).toBe(expected.getDate())
  })

  test('parses "in 1 day" (singular)', () => {
    const result = parseDate('in 1 day')
    expect(result).toBeInstanceOf(Date)
    const expected = new Date()
    expected.setDate(expected.getDate() + 1)
    expect(result!.getDate()).toBe(expected.getDate())
  })

  test('parses natural date strings', () => {
    const result = parseDate('August 10, 2025')
    expect(result).toBeInstanceOf(Date)
    expect(result!.getFullYear()).toBe(2025)
    expect(result!.getMonth()).toBe(7) // August is month 7 (0-indexed)
    expect(result!.getDate()).toBe(10)
  })

  test('parses ISO date strings', () => {
    const result = parseDate('2025-01-15')
    expect(result).toBeInstanceOf(Date)
    expect(result!.getFullYear()).toBe(2025)
  })

  test('returns null for invalid input', () => {
    expect(parseDate('not a date')).toBeNull()
    expect(parseDate('xyz')).toBeNull()
  })

  test('handles case insensitivity', () => {
    expect(parseDate('TODAY')).toBeInstanceOf(Date)
    expect(parseDate('Tomorrow')).toBeInstanceOf(Date)
    expect(parseDate('NEXT WEEK')).toBeInstanceOf(Date)
  })

  test('handles leading/trailing whitespace', () => {
    expect(parseDate('  today  ')).toBeInstanceOf(Date)
    expect(parseDate('  tomorrow  ')).toBeInstanceOf(Date)
  })
})
