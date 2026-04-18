import { describe, expect, test } from 'vitest'
import { getTodayDate } from '../get-today-date'

describe('getTodayDate', () => {
  test('returns a string', () => {
    expect(typeof getTodayDate()).toBe('string')
  })

  test('matches YYYY-MM-DD format', () => {
    expect(getTodayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('matches the current date', () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    expect(getTodayDate()).toBe(`${year}-${month}-${day}`)
  })

  test('month is zero-padded', () => {
    const [, month] = getTodayDate().split('-')
    expect(month).toHaveLength(2)
  })

  test('day is zero-padded', () => {
    const [, , day] = getTodayDate().split('-')
    expect(day).toHaveLength(2)
  })
})
