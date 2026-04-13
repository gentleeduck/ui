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

// Mock execa to prevent actual package installations
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

describe('removeCommandAction', () => {
  let tmpDir: string
  const originalCwd = process.cwd
  let exitCodes: number[]

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-e2e-remove-'))
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
        schema: 'https://ui.gentleduck.org/schema.json',
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

    // Create src/ui directory with installed components
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'), 'export function Button() { return null }')
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'input'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'src', 'ui', 'input', 'input.tsx'), 'export function Input() { return null }')

    process.cwd = () => tmpDir
    vi.stubGlobal('fetch', createMockFetch())
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      exitCodes.push(code ?? 0)
      throw new Error(`process.exit(${code})`)
    }) as never)
    mockPrompts.mockReset()
    mockPrompts.mockResolvedValue({ confirm: true })
  })

  afterEach(() => {
    process.cwd = originalCwd
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('removes a component with --yes flag', async () => {
    const { removeCommandAction } = await import('~/commands/remove/remove.libs')

    await expect(removeCommandAction(['button'], { cwd: tmpDir, yes: true })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(0)

    // Verify the component directory was deleted
    expect(fs.existsSync(path.join(tmpDir, 'src', 'ui', 'button'))).toBe(false)
    // Other components should remain
    expect(fs.existsSync(path.join(tmpDir, 'src', 'ui', 'input'))).toBe(true)
  })

  it('removes multiple components with --yes flag', async () => {
    const { removeCommandAction } = await import('~/commands/remove/remove.libs')

    await expect(removeCommandAction(['button', 'input'], { cwd: tmpDir, yes: true })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(0)

    expect(fs.existsSync(path.join(tmpDir, 'src', 'ui', 'button'))).toBe(false)
    expect(fs.existsSync(path.join(tmpDir, 'src', 'ui', 'input'))).toBe(false)
  })

  it('fails when specified component is not installed', async () => {
    const { removeCommandAction } = await import('~/commands/remove/remove.libs')

    await expect(removeCommandAction(['nonexistent'], { cwd: tmpDir, yes: true })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })

  it('exits 1 when no components are installed', async () => {
    // Remove all installed components first
    fs.rmSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })
    fs.rmSync(path.join(tmpDir, 'src', 'ui', 'input'), { recursive: true })

    const { removeCommandAction } = await import('~/commands/remove/remove.libs')

    await expect(removeCommandAction([], { cwd: tmpDir, yes: true })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })

  it('aborts when user declines confirmation', async () => {
    mockPrompts.mockResolvedValue({ confirm: false })

    const { removeCommandAction } = await import('~/commands/remove/remove.libs')

    await expect(removeCommandAction(['button'], { cwd: tmpDir, yes: false })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(0)
    // Component should still exist
    expect(fs.existsSync(path.join(tmpDir, 'src', 'ui', 'button'))).toBe(true)
  })

  it('case-insensitive component name matching', async () => {
    const { removeCommandAction } = await import('~/commands/remove/remove.libs')

    await expect(removeCommandAction(['Button'], { cwd: tmpDir, yes: true })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(0)
    expect(fs.existsSync(path.join(tmpDir, 'src', 'ui', 'button'))).toBe(false)
  })

  it('supports --workspace override in monorepo mode', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'duck-ui.config.json'),
      JSON.stringify({
        schema: 'https://ui.gentleduck.org/schema.json',
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

    const { removeCommandAction } = await import('~/commands/remove/remove.libs')

    await expect(removeCommandAction(['button'], { cwd: tmpDir, workspace: 'apps/web', yes: true })).rejects.toThrow(
      /process\.exit/,
    )

    expect(exitCodes[0]).toBe(0)
    expect(fs.existsSync(path.join(tmpDir, 'apps', 'web', 'src', 'ui', 'button'))).toBe(false)
  })

  it('fails when --workspace points to invalid target', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'duck-ui.config.json'),
      JSON.stringify({
        schema: 'https://ui.gentleduck.org/schema.json',
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

    const { removeCommandAction } = await import('~/commands/remove/remove.libs')

    await expect(
      removeCommandAction(['button'], { cwd: tmpDir, workspace: 'apps/missing', yes: true }),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })
})
