import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createMockSpinner } from '../helpers/mock-spinner'

describe('init_duckui_config', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-preflight-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('writes duck-ui.config.json to the specified directory', async () => {
    const { init_duckui_config } = await import('~/utils/preflight-configs/preflight-duckui/preflight-duckui.libs')
    const spinner = createMockSpinner()

    await init_duckui_config(tmpDir, spinner as any, {
      project_type: 'NEXT_JS',
      monorepo: false,
      workspace: {
        root: '.',
        project: '.',
      },
      css: './src/styles.css',
      prefix: '',
      alias: '~',
      base_color: 'zinc',
      css_variables: true,
    })

    const configPath = path.join(tmpDir, 'duck-ui.config.json')
    expect(fs.existsSync(configPath)).toBe(true)

    const content = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    expect(content.rsc).toBe(true)
    expect(content.aliases.ui).toBe('~/ui')
    expect(content.tailwind.baseColor).toBe('zinc')
    expect(spinner.succeed).toHaveBeenCalled()
  })

  it('sets rsc=false for non-NEXT_JS projects', async () => {
    const { init_duckui_config } = await import('~/utils/preflight-configs/preflight-duckui/preflight-duckui.libs')
    const spinner = createMockSpinner()

    await init_duckui_config(tmpDir, spinner as any, {
      project_type: 'VITE',
      monorepo: false,
      workspace: {
        root: '.',
        project: '.',
      },
      css: './src/styles.css',
      prefix: 'dk',
      alias: '@',
      base_color: 'slate',
      css_variables: true,
    })

    const content = JSON.parse(fs.readFileSync(path.join(tmpDir, 'duck-ui.config.json'), 'utf8'))
    expect(content.rsc).toBe(false)
    expect(content.aliases.ui).toBe('@/ui')
    expect(content.tailwind.prefix).toBe('dk')
  })
})

describe('generateThemeCSS with real theme structure', () => {
  it('produces correct CSS from a full theme object', async () => {
    const { generateThemeCSS } = await import('~/utils/preflight-configs/preflight-duckui/preflight-duckui.libs')

    const cssVars = {
      light: {
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.145 0.017 285.823)',
        primary: 'oklch(0.205 0.017 285.823)',
        radius: '0.625rem',
      },
      dark: {
        background: 'oklch(0.145 0.017 285.823)',
        foreground: 'oklch(0.985 0.002 247.839)',
        primary: 'oklch(0.985 0.002 247.839)',
        radius: '0.625rem',
      },
    }

    const css = generateThemeCSS('zinc', cssVars as any)

    // Check structure
    expect(css).toContain(':root {')
    expect(css).toContain('.dark {')
    expect(css).toContain('@theme inline {')

    // Check light vars are in :root
    expect(css).toContain('--background: oklch(1 0 0);')
    expect(css).toContain('--foreground: oklch(0.145 0.017 285.823);')

    // Check dark vars are in .dark
    expect(css).toContain('--background: oklch(0.145 0.017 285.823);')

    // Check oklch values use --color- prefix in @theme inline
    expect(css).toContain('--color-background: var(--background);')
    expect(css).toContain('--color-foreground: var(--foreground);')

    // Check radius is in :root but not duplicated in @theme inline as --radius: var(--radius)
    expect(css).toContain('--radius: 0.625rem;')

    // Check radius calculations
    expect(css).toContain('--radius-sm: calc(var(--radius) - 4px);')
    expect(css).toContain('--radius-lg: var(--radius);')

    // Check breakpoints
    expect(css).toContain('--breakpoint-3xl: 1600px;')
    expect(css).toContain('--breakpoint-4xl: 2000px;')

    // Check theme name in comment
    expect(css).toContain('/* zinc theme */')
  })
})
