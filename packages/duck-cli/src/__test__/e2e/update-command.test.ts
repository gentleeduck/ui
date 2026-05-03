import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRegistryEntry } from '../helpers/fixtures'
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

describe('updateCommandAction', () => {
  let tmpDir: string
  const originalCwd = process.cwd
  let exitCodes: number[]

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-e2e-update-'))
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

    // Create src/ui directory with installed component (old content)
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })
    fs.writeFileSync(
      path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'),
      'export function Button() { return <div>old</div> }',
    )

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

  it('updates a component with --yes flag', async () => {
    const { updateCommandAction } = await import('~/commands/update/update.libs')

    await expect(updateCommandAction(['button'], { cwd: tmpDir, yes: true, all: false })).rejects.toThrow(
      /process\.exit/,
    )

    expect(exitCodes[0]).toBe(0)

    // Verify the component file was overwritten with registry content
    const content = fs.readFileSync(path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'), 'utf8')
    expect(content).toBe('export function Button() { return null }')
  })

  it('updates all components with --all --yes flags', async () => {
    // Add a second installed component
    fs.mkdirSync(path.join(tmpDir, 'src', 'ui', 'input'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'src', 'ui', 'input', 'input.tsx'), 'old input content')

    // Provide mock registry entries for both
    vi.stubGlobal(
      'fetch',
      createMockFetch({
        '/r/components/input.json': createMockRegistryEntry({
          name: 'input',
          root_folder: 'input',
          files: [
            {
              path: 'input/input.tsx',
              target: 'input/input.tsx',
              type: 'registry:ui',
              content: 'export function Input() { return null }',
            },
          ],
        }),
      }),
    )

    const { updateCommandAction } = await import('~/commands/update/update.libs')

    await expect(updateCommandAction([], { cwd: tmpDir, yes: true, all: true })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(0)

    // Both components should be updated
    const btnContent = fs.readFileSync(path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'), 'utf8')
    expect(btnContent).toBe('export function Button() { return null }')

    const inputContent = fs.readFileSync(path.join(tmpDir, 'src', 'ui', 'input', 'input.tsx'), 'utf8')
    expect(inputContent).toBe('export function Input() { return null }')
  })

  it('fails when specified component is not installed', async () => {
    const { updateCommandAction } = await import('~/commands/update/update.libs')

    await expect(updateCommandAction(['nonexistent'], { cwd: tmpDir, yes: true, all: false })).rejects.toThrow(
      /process\.exit/,
    )

    expect(exitCodes[0]).toBe(1)
  })

  it('exits 1 when no components are installed', async () => {
    fs.rmSync(path.join(tmpDir, 'src', 'ui', 'button'), { recursive: true })

    const { updateCommandAction } = await import('~/commands/update/update.libs')

    await expect(updateCommandAction([], { cwd: tmpDir, yes: true, all: false })).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })

  it('aborts when user declines confirmation', async () => {
    mockPrompts.mockResolvedValue({ confirm: false })

    const { updateCommandAction } = await import('~/commands/update/update.libs')

    await expect(updateCommandAction(['button'], { cwd: tmpDir, yes: false, all: false })).rejects.toThrow(
      /process\.exit/,
    )

    expect(exitCodes[0]).toBe(0)

    // Component should still have old content
    const content = fs.readFileSync(path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx'), 'utf8')
    expect(content).toBe('export function Button() { return <div>old</div> }')
  })

  it('installs npm dependencies after update', async () => {
    vi.stubGlobal(
      'fetch',
      createMockFetch({
        '/r/components/button.json': createMockRegistryEntry({
          name: 'button',
          dependencies: ['class-variance-authority', 'clsx'],
          devDependencies: [],
        }),
      }),
    )

    const { updateCommandAction } = await import('~/commands/update/update.libs')
    const { execa } = await import('execa')

    await expect(updateCommandAction(['button'], { cwd: tmpDir, yes: true, all: false })).rejects.toThrow(
      /process\.exit/,
    )

    expect(exitCodes[0]).toBe(0)
    expect(execa).toHaveBeenCalledWith(
      'npm',
      expect.arrayContaining(['install', 'class-variance-authority', 'clsx']),
      expect.objectContaining({ stdio: 'ignore' }),
    )
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
      'export function Button() { return <div>old</div> }',
    )

    const { updateCommandAction } = await import('~/commands/update/update.libs')

    await expect(
      updateCommandAction(['button'], { cwd: tmpDir, workspace: 'apps/web', yes: true, all: false }),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(0)
    const content = fs.readFileSync(path.join(tmpDir, 'apps', 'web', 'src', 'ui', 'button', 'button.tsx'), 'utf8')
    expect(content).toBe('export function Button() { return null }')
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

    const { updateCommandAction } = await import('~/commands/update/update.libs')

    await expect(
      updateCommandAction(['button'], { cwd: tmpDir, workspace: 'apps/missing', yes: true, all: false }),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })
})
