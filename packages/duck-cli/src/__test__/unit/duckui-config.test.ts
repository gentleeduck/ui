import { describe, expect, it } from 'vitest'
import type { ThemeResponse } from '~/utils/get-registry/get-registry.dto'
import { defaultDuckuiConfig, generateThemeCSS } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.libs'

describe('defaultDuckuiConfig', () => {
  const baseInput = {
    projectType: 'NEXT_JS' as const,
    monorepo: false,
    workspace: {
      root: '.',
      project: '.',
    },
    css: './src/styles.css',
    prefix: '',
    alias: '~',
    baseColor: 'zinc' as const,
    cssVariables: true,
  }

  it('generates valid JSON', () => {
    const result = defaultDuckuiConfig(baseInput)
    expect(() => JSON.parse(result)).not.toThrow()
  })

  it('sets rsc to true for NEXT_JS projects', () => {
    const result = JSON.parse(defaultDuckuiConfig(baseInput))
    expect(result.rsc).toBe(true)
  })

  it('sets rsc to false for non-NEXT_JS projects', () => {
    const result = JSON.parse(defaultDuckuiConfig({ ...baseInput, projectType: 'VITE' as const }))
    expect(result.rsc).toBe(false)
  })

  it('includes correct aliases based on alias prefix', () => {
    const result = JSON.parse(defaultDuckuiConfig({ ...baseInput, alias: '@' }))
    expect(result.aliases.ui).toBe('@/ui')
    expect(result.aliases.libs).toBe('@/libs')
    expect(result.aliases.hooks).toBe('@/hooks')
    expect(result.aliases.pages).toBe('@/pages')
    expect(result.aliases.layouts).toBe('@/layouts')
  })

  it('includes tailwind config with base color', () => {
    const result = JSON.parse(defaultDuckuiConfig(baseInput))
    expect(result.tailwind.baseColor).toBe('zinc')
    expect(result.tailwind.css).toBe('./src/styles.css')
    expect(result.tailwind.cssVariables).toBe(true)
    expect(result.tailwind.prefix).toBe('')
  })

  it('handles special characters in values safely', () => {
    const result = defaultDuckuiConfig({
      ...baseInput,
      css: './src/my "quoted" styles.css',
    })
    expect(() => JSON.parse(result)).not.toThrow()
    const parsed = JSON.parse(result)
    expect(parsed.tailwind.css).toBe('./src/my "quoted" styles.css')
  })

  it('includes schema URL', () => {
    const result = JSON.parse(defaultDuckuiConfig(baseInput))
    expect(result.schema).toBe('https://gentleduck.org/schema.json')
  })

  it('includes workspace target when provided', () => {
    const result = JSON.parse(
      defaultDuckuiConfig(baseInput, {
        root: '.',
        project: 'apps/web',
      }),
    )
    expect(result.workspace).toEqual({ root: '.', project: 'apps/web' })
  })

  it('omits tailwind.cssWorkspace when no css workspace is provided', () => {
    const result = JSON.parse(defaultDuckuiConfig(baseInput))
    expect(result.tailwind).not.toHaveProperty('cssWorkspace')
  })

  it('writes tailwind.cssWorkspace when a separate css workspace is provided', () => {
    const result = JSON.parse(defaultDuckuiConfig(baseInput, { root: '.', project: '.' }, '../../packages/styles'))
    expect(result.tailwind.cssWorkspace).toBe('../../packages/styles')
  })
})

describe('generateThemeCSS', () => {
  const mockCssVars: ThemeResponse = {
    name: 'zinc',
    light: {
      radius: '0.5rem',
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      primary: 'oklch(0.21 0.006 285.75)',
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      primary: 'oklch(0.985 0 0)',
    },
  }

  it('generates :root block with light variables', () => {
    const result = generateThemeCSS('zinc', mockCssVars)
    expect(result).toContain(':root {')
    expect(result).toContain('--background: 0 0% 100%;')
    expect(result).toContain('--foreground: 240 10% 3.9%;')
  })

  it('generates .dark block with dark variables', () => {
    const result = generateThemeCSS('zinc', mockCssVars)
    expect(result).toContain('.dark {')
    expect(result).toContain('--background: 240 10% 3.9%;')
  })

  it('generates @theme inline block', () => {
    const result = generateThemeCSS('zinc', mockCssVars)
    expect(result).toContain('@theme inline {')
    expect(result).toContain('--breakpoint-3xl: 1600px;')
    expect(result).toContain('--radius-sm: calc(var(--radius) - 4px);')
  })

  it('uses --color- prefix for oklch values in tailwind vars', () => {
    const result = generateThemeCSS('zinc', mockCssVars)
    expect(result).toContain('--color-primary: var(--primary);')
  })

  it('uses plain var reference for non-oklch values in tailwind vars', () => {
    const result = generateThemeCSS('zinc', mockCssVars)
    expect(result).toContain('--background: var(--background);')
  })

  it('includes theme name in comment', () => {
    const result = generateThemeCSS('zinc', mockCssVars)
    expect(result).toContain('/* zinc theme */')
  })

  it('extracts radius from light vars', () => {
    const result = generateThemeCSS('zinc', mockCssVars)
    expect(result).toContain('--radius: 0.5rem;')
    // radius should not appear as a regular CSS variable
    expect(result).not.toContain('--radius: var(--radius);')
  })
})
