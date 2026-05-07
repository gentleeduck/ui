import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_GLOBALS_CANDIDATES, THEME_BLOCK_END, THEME_BLOCK_START } from '../theme.constants'
import { mergeThemeBlock, renderThemeBlock, resolveCssPath } from '../theme.libs'

describe('renderThemeBlock', () => {
  it('emits :root + .dark with all token entries', () => {
    const block = renderThemeBlock({
      name: 'zinc',
      label: 'Zinc',
      light: { background: 'oklch(1 0 0)', primary: 'oklch(0.21 0 0)' },
      dark: { background: 'oklch(0.145 0 0)', primary: 'oklch(0.985 0 0)' },
    })

    expect(block).toContain(THEME_BLOCK_START)
    expect(block).toContain(THEME_BLOCK_END)
    expect(block).toContain('/* theme: zinc (Zinc) */')
    expect(block).toContain(':root {')
    expect(block).toContain('--background: oklch(1 0 0);')
    expect(block).toContain('--primary: oklch(0.21 0 0);')
    expect(block).toContain('.dark {')
    expect(block).toContain('--background: oklch(0.145 0 0);')
  })

  it('renders without label when omitted', () => {
    const block = renderThemeBlock({
      name: 'plain',
      light: { foreground: 'oklch(0 0 0)' },
      dark: { foreground: 'oklch(1 0 0)' },
    })
    expect(block).toContain('/* theme: plain */')
    expect(block).not.toContain('(undefined)')
  })
})

describe('mergeThemeBlock', () => {
  const sampleBlock = renderThemeBlock({
    name: 'zinc',
    light: { background: 'oklch(1 0 0)' },
    dark: { background: 'oklch(0.145 0 0)' },
  })

  it('appends to empty file', () => {
    const out = mergeThemeBlock('', sampleBlock)
    expect(out).toContain(THEME_BLOCK_START)
    expect(out).toContain(THEME_BLOCK_END)
  })

  it('appends after existing CSS that has no markers', () => {
    const existing = '@import "tailwindcss";\n\nhtml { font-family: sans-serif; }\n'
    const out = mergeThemeBlock(existing, sampleBlock)
    expect(out.startsWith('@import "tailwindcss";')).toBe(true)
    expect(out).toContain(sampleBlock)
  })

  it('replaces an existing theme block in place', () => {
    const oldBlock = renderThemeBlock({
      name: 'rose',
      light: { primary: 'oklch(0.65 0.25 16)' },
      dark: { primary: 'oklch(0.65 0.25 16)' },
    })
    const existing = `@import "tailwindcss";\n\n${oldBlock}\n\nbody { margin: 0; }\n`

    const out = mergeThemeBlock(existing, sampleBlock)
    expect(out).toContain('--background: oklch(1 0 0);')
    expect(out).not.toContain('--primary: oklch(0.65 0.25 16)')
    expect(out).toContain('body { margin: 0; }')
    // Only one theme block — markers should not appear twice
    const startCount = out.split(THEME_BLOCK_START).length - 1
    const endCount = out.split(THEME_BLOCK_END).length - 1
    expect(startCount).toBe(1)
    expect(endCount).toBe(1)
  })

  it('preserves leading content when replacing block at top', () => {
    const existing = `${sampleBlock}\n\nhtml { color: red; }\n`
    const newBlock = renderThemeBlock({
      name: 'rose',
      light: { primary: 'oklch(0.65 0.25 16)' },
      dark: { primary: 'oklch(0.65 0.25 16)' },
    })
    const out = mergeThemeBlock(existing, newBlock)
    expect(out).toContain('--primary: oklch(0.65 0.25 16);')
    expect(out).toContain('html { color: red; }')
  })
})

describe('resolveCssPath', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'duck-cli-theme-test-'))
  })

  afterEach(() => {
    rmSync(tmp, { force: true, recursive: true })
  })

  it('returns the explicit path when it exists', () => {
    const file = join(tmp, 'my.css')
    writeFileSync(file, '')
    const out = resolveCssPath('my.css', tmp)
    expect(out).toBe(file)
  })

  it('returns null when explicit path is missing', () => {
    const out = resolveCssPath('does-not-exist.css', tmp)
    expect(out).toBeNull()
  })

  it('falls back to default candidates', () => {
    const candidatePath = join(tmp, DEFAULT_GLOBALS_CANDIDATES[0])
    const dir = candidatePath.slice(0, candidatePath.lastIndexOf('/'))
    require('node:fs').mkdirSync(dir, { recursive: true })
    writeFileSync(candidatePath, '')

    const out = resolveCssPath('', tmp)
    expect(out).toBe(candidatePath)
  })

  it('returns null when no candidates exist', () => {
    const out = resolveCssPath('', tmp)
    expect(out).toBeNull()
  })
})

describe('integration: write+read roundtrip', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'duck-cli-theme-roundtrip-'))
  })

  afterEach(() => {
    rmSync(tmp, { force: true, recursive: true })
  })

  it('writes a theme block, replaces it on second apply', () => {
    const cssPath = join(tmp, 'globals.css')
    writeFileSync(cssPath, '@import "tailwindcss";\n')

    // First apply
    let css = readFileSync(cssPath, 'utf8')
    css = mergeThemeBlock(
      css,
      renderThemeBlock({
        name: 'zinc',
        light: { background: 'oklch(1 0 0)' },
        dark: { background: 'oklch(0.145 0 0)' },
      }),
    )
    writeFileSync(cssPath, css)
    expect(readFileSync(cssPath, 'utf8')).toContain('theme: zinc')

    // Second apply replaces
    css = readFileSync(cssPath, 'utf8')
    css = mergeThemeBlock(
      css,
      renderThemeBlock({
        name: 'rose',
        light: { primary: 'oklch(0.65 0.25 16)' },
        dark: { primary: 'oklch(0.65 0.25 16)' },
      }),
    )
    writeFileSync(cssPath, css)
    const final = readFileSync(cssPath, 'utf8')
    expect(final).toContain('theme: rose')
    expect(final).not.toContain('theme: zinc')
  })
})
