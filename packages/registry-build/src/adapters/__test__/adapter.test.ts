import { describe, expect, test } from 'bun:test'
import { getComponentIndexAdapter } from '../..'

describe('getComponentIndexAdapter', () => {
  test('returns nextjs adapter for "nextjs" framework', () => {
    const adapter = getComponentIndexAdapter('nextjs')

    expect(adapter).toBeDefined()
    expect(adapter.defaultHeader).toContain('dynamic')
  })

  test('returns vite adapter for "vite" framework', () => {
    const adapter = getComponentIndexAdapter('vite')

    expect(adapter).toBeDefined()
    expect(adapter.defaultHeader).toContain('React')
  })

  test('returns custom adapter for "custom" framework', () => {
    const adapter = getComponentIndexAdapter('custom')

    expect(adapter).toBeDefined()
    expect(adapter.defaultHeader).toBe('')
  })

  test('nextjs adapter renderImport contains "dynamic"', () => {
    const adapter = getComponentIndexAdapter('nextjs')
    const result = adapter.renderImport({ componentPath: './button', id: 'Button', ssr: false })

    expect(result).toContain('dynamic')
  })

  test('vite adapter renderImport contains "lazy"', () => {
    const adapter = getComponentIndexAdapter('vite')
    const result = adapter.renderImport({ componentPath: './button', id: 'Button', ssr: false })

    expect(result).toContain('lazy')
  })

  test('custom adapter renderImport returns empty string', () => {
    const adapter = getComponentIndexAdapter('custom')
    const result = adapter.renderImport({ componentPath: './button', id: 'Button', ssr: false })

    expect(result).toBe('')
  })
})
