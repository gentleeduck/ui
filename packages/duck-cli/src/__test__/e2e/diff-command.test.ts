import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockFetch } from '../helpers/mock-fetch'

// Mock ora to return a silent spinner
vi.mock('ora', () => ({
  default: () => ({
    fail: vi.fn().mockReturnThis(),
    info: vi.fn().mockReturnThis(),
    start: vi.fn().mockReturnThis(),
    stop: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    warn: vi.fn().mockReturnThis(),
    text: '',
  }),
}))

// Mock execa
vi.mock('execa', () => ({
  execa: vi.fn().mockResolvedValue({ failed: false, stdout: '', stderr: '' }),
}))

// Mock getPackageManager
vi.mock('~/utils/get-package-manager', () => ({
  getPackageManager: vi.fn().mockResolvedValue('npm'),
}))

// Mock prompts
const mockPrompts = vi.fn()
vi.mock('prompts', () => ({ default: mockPrompts }))

describe('diffCommandAction', () => {
  let tmpDir: string
  const originalCwd = process.cwd
  let exitCodes: number[]

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-e2e-diff-'))
    exitCodes = []

    // Create fixture files in tmpDir
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'test-project', version: '1.0.0' }))
    fs.writeFileSync(
      path.join(tmpDir, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          baseUrl: '.',
          paths: { '~/*': ['./src/*'] },
        },
      }),
    )
    fs.writeFileSync(
      path.join(tmpDir, 'duck-ui.config.json'),
      JSON.stringify({
        schema: 'https://gentleduck.org/schema.json',
        rsc: false,
        monorepo: false,
        workspace: {
          root: '.',
          project: '.',
        },
        tailwind: { baseColor: 'zinc', css: './src/styles.css', cssVariables: true, prefix: '' },
        aliases: { ui: '~/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
      }),
    )

    // Create src/ui directory
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui'), { recursive: true })

    process.cwd = () => tmpDir
    vi.stubGlobal('fetch', createMockFetch())
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      exitCodes.push(code ?? 0)
      throw new Error(`process.exit(${code})`)
    }) as never)
    mockPrompts.mockReset()
  })

  afterEach(() => {
    process.cwd = originalCwd
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('exits 0 when component is identical to registry', async () => {
    // Create local component matching the registry mock exactly
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'), 'export function Button() { return null }')

    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction(['button'], { cwd: tmpDir, gui: false })).rejects.toThrow(/process\.exit/)

    // Exit code 0 means identical
    expect(exitCodes[0]).toBe(0)
  })

  it('exits 1 when component differs from registry', async () => {
    // Create local component with modified content
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })
    fs.writeFileSync(
      path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'),
      'export function Button() { return <div>modified</div> }',
    )

    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction(['button'], { cwd: tmpDir, gui: false })).rejects.toThrow(/process\.exit/)

    // Exit code 1 means diffs found
    expect(exitCodes[0]).toBe(1)
  })

  it('fails when specified component is not installed', async () => {
    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction(['nonexistent'], { cwd: tmpDir, gui: false })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })

  it('exits 1 when no components are installed', async () => {
    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction([], { cwd: tmpDir, gui: false })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })

  it('exits 1 when component has extra local files', async () => {
    // Create component with extra file not in registry
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'), 'export function Button() { return null }')
    fs.writeFileSync(
      path.join(tmpDir, 'src', 'ui', 'button', 'custom-variant.tsx'),
      'export function CustomVariant() {}',
    )

    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction(['button'], { cwd: tmpDir, gui: false })).rejects.toThrow(/process\.exit/)

    // Extra local file means not identical
    expect(exitCodes[0]).toBe(1)
  })

  it('exits 1 when component is missing a registry file', async () => {
    // Create component directory but without the expected file
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })

    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction(['button'], { cwd: tmpDir, gui: false })).rejects.toThrow(/process\.exit/)

    // Missing file means not identical
    expect(exitCodes[0]).toBe(1)
  })

  it('handles multiple components with mixed identical and modified', async () => {
    // button is identical
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'), 'export function Button() { return null }')

    // input is modified
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'input'), { recursive: true })
    fs.writeFileSync(
      path.join(tmpDir, 'src', 'ui', 'input', 'input.tsx'),
      'export function Input() { return <div>custom</div> }',
    )

    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction(['button', 'input'], { cwd: tmpDir, gui: false })).rejects.toThrow(/process\.exit/)

    // Any diff means exit code 1
    expect(exitCodes[0]).toBe(1)
  })

  it('supports --workspace override in monorepo mode', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'duck-ui.config.json'),
      JSON.stringify({
        schema: 'https://gentleduck.org/schema.json',
        rsc: false,
        monorepo: true,
        workspace: {
          root: '.',
          project: 'apps/default',
        },
        tailwind: { baseColor: 'zinc', css: './src/styles.css', cssVariables: true, prefix: '' },
        aliases: { ui: '~/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
      }),
    )

    fs.mkdirSync(path.join(tmpDir, 'apps', 'web', 'src', 'ui', 'button'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps', 'web', 'package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(
      path.join(tmpDir, 'apps', 'web', 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          baseUrl: '.',
          paths: { '~/*': ['./src/*'] },
        },
      }),
    )
    fs.writeFileSync(
      path.join(tmpDir, 'apps', 'web', 'src', 'ui', 'button', 'button.tsx'),
      'export function Button() { return null }',
    )

    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction(['button'], { cwd: tmpDir, workspace: 'apps/web', gui: false })).rejects.toThrow(
      /process\.exit/,
    )

    // Identical component in selected workspace
    expect(exitCodes[0]).toBe(0)
  })

  it('fails when --workspace points to invalid target', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'duck-ui.config.json'),
      JSON.stringify({
        schema: 'https://gentleduck.org/schema.json',
        rsc: false,
        monorepo: true,
        workspace: {
          root: '.',
          project: 'apps/default',
        },
        tailwind: { baseColor: 'zinc', css: './src/styles.css', cssVariables: true, prefix: '' },
        aliases: { ui: '~/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
      }),
    )

    const { diffCommandAction } = await import('~/commands/diff/diff.libs')

    await expect(diffCommandAction(['button'], { cwd: tmpDir, workspace: 'apps/missing', gui: false })).rejects.toThrow(
      /process\.exit/,
    )

    expect(exitCodes[0]).toBe(1)
  })
})
