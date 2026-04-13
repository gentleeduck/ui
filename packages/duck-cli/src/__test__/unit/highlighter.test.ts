import { describe, expect, it } from 'vitest'
import { highlighter } from '~/utils/text-styling/highlighter'

describe('highlighter', () => {
  it('has all expected color methods', () => {
    expect(typeof highlighter.error).toBe('function')
    expect(typeof highlighter.info).toBe('function')
    expect(typeof highlighter.success).toBe('function')
    expect(typeof highlighter.warn).toBe('function')
    expect(typeof highlighter.bgError).toBe('function')
    expect(typeof highlighter.bgInfo).toBe('function')
    expect(typeof highlighter.bgSuccess).toBe('function')
    expect(typeof highlighter.bgWarn).toBe('function')
  })

  it('returns strings from each method', () => {
    expect(typeof highlighter.error('test')).toBe('string')
    expect(typeof highlighter.info('test')).toBe('string')
    expect(typeof highlighter.success('test')).toBe('string')
    expect(typeof highlighter.warn('test')).toBe('string')
  })

  it('includes the input text in output', () => {
    expect(highlighter.info('hello')).toContain('hello')
    expect(highlighter.error('oops')).toContain('oops')
  })
})
