import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveWithinBase } from '~/utils/safe-path'

const base = path.resolve('/tmp/project/components')

describe('resolveWithinBase', () => {
  it('allows a nested but contained path', () => {
    const resolved = resolveWithinBase(base, 'ui/button.tsx')
    expect(resolved).toBe(path.join(base, 'ui', 'button.tsx'))
  })

  it('allows the base directory itself', () => {
    expect(resolveWithinBase(base, '.')).toBe(base)
  })

  it('rejects a "../" traversal escape', () => {
    expect(() => resolveWithinBase(base, '../../../../etc/passwd')).toThrow(/\.\.|escapes/)
  })

  it('rejects a traversal segment hidden inside a path', () => {
    expect(() => resolveWithinBase(base, 'ui/../../escape.txt')).toThrow(/\.\./)
  })

  it('rejects an absolute path', () => {
    expect(() => resolveWithinBase(base, '/etc/something')).toThrow(/absolute/)
  })

  it('rejects an empty path', () => {
    expect(() => resolveWithinBase(base, '')).toThrow(/empty|invalid/)
  })
})
