import { afterEach, describe, expect, mock, test } from 'bun:test'
import { Logger } from '../index'

const originalConsole = {
  error: console.error,
  log: console.log,
  warn: console.warn,
}

afterEach(() => {
  console.log = originalConsole.log
  console.warn = originalConsole.warn
  console.error = originalConsole.error
})

describe('registry-build logger', () => {
  test('success returns a structured success payload', () => {
    console.log = mock(() => undefined) as typeof console.log

    const result = Logger.success('built registry', { files: 4 })

    expect(result).toEqual({
      data: { files: 4 },
      message: 'built registry',
      success: true,
    })
  })

  test('error returns a structured failure payload', () => {
    console.error = mock(() => undefined) as typeof console.error

    const result = Logger.error('missing output directory')

    expect(result).toEqual({
      data: null,
      message: 'missing output directory',
      success: false,
    })
  })

  test('warn logs without throwing', () => {
    console.warn = mock(() => undefined) as typeof console.warn
    expect(Logger.warn('skipping optional asset')).toBeUndefined()
  })

  test('throwFatalError throws the provided message', () => {
    console.error = mock(() => undefined) as typeof console.error

    expect(() => Logger.throwFatalError('registry generation failed')).toThrow('registry generation failed')
  })

  test('success and error payloads remain structurally stable', () => {
    console.log = mock(() => undefined) as typeof console.log
    console.error = mock(() => undefined) as typeof console.error

    const success = Logger.success('done', { files: ['a.ts'] })
    const failure = Logger.error('failed')

    expect(Object.keys(success).sort()).toEqual(['data', 'message', 'success'])
    expect(Object.keys(failure).sort()).toEqual(['data', 'message', 'success'])
    expect(failure.data).toBeNull()
  })
})
