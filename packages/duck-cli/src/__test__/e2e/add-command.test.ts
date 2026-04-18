import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execa } from 'execa'
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

describe('addCommandAction', () => {
  let tmpDir: string
  const originalCwd = process.cwd
  let exitCodes: number[]

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-e2e-add-'))
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

    // Create src directory structure
    fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true })

    process.cwd = () => tmpDir
    vi.stubGlobal('fetch', createMockFetch())
    vi.mocked(execa).mockClear()
    // Track exit codes - first call records the intended exit code
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      exitCodes.push(code ?? 0)
      throw new Error(`process.exit(${code})`)
    }) as never)
    mockPrompts.mockReset()
    mockPrompts.mockResolvedValue({ yes: true })
  })

  afterEach(() => {
    process.cwd = originalCwd
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('adds a component with --yes --force flags', async () => {
    const { addCommandAction } = await import('~/commands/add/add.libs')

    await expect(addCommandAction(['button'], { cwd: tmpDir, yes: true, force: true, all: false })).rejects.toThrow(
      /process\.exit/,
    )

    // First exit call should be 0 (success)
    expect(exitCodes[0]).toBe(0)

    // Verify the component file was written
    const buttonFile = path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx')
    expect(fs.existsSync(buttonFile)).toBe(true)
  })

  it('handles nonexistent component gracefully', async () => {
    const { addCommandAction } = await import('~/commands/add/add.libs')

    await expect(
      addCommandAction(['nonexistent'], { cwd: tmpDir, yes: true, force: true, all: false }),
    ).rejects.toThrow(/process\.exit/)

    // resolveComponents calls process.exit(0) when no components found
    expect(exitCodes[0]).toBe(0)
  })

  it('adds component with registry dependencies', async () => {
    // card depends on button via registryDependencies
    vi.stubGlobal(
      'fetch',
      createMockFetch({
        '/r/components/card.json': createMockRegistryEntry({
          name: 'card',
          root_folder: 'card',
          files: [
            {
              path: 'card/card.tsx',
              target: 'card/card.tsx',
              type: 'registry:ui',
              content: 'export function Card() { return null }',
            },
          ],
          dependencies: [],
          devDependencies: [],
          registryDependencies: ['button'],
        }),
      }),
    )

    const { addCommandAction } = await import('~/commands/add/add.libs')

    await expect(addCommandAction(['card'], { cwd: tmpDir, yes: true, force: true, all: false })).rejects.toThrow(
      /process\.exit/,
    )

    // First exit should be 0 (success)
    expect(exitCodes[0]).toBe(0)

    // Card component should be installed
    const cardFile = path.join(tmpDir, 'src', 'ui', 'card', 'card.tsx')
    expect(fs.existsSync(cardFile)).toBe(true)

    // Button (registry dependency) should also be installed
    const buttonFile = path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx')
    expect(fs.existsSync(buttonFile)).toBe(true)
  })

  it('installs npm dependencies via execa', async () => {
    vi.stubGlobal(
      'fetch',
      createMockFetch({
        '/r/components/button.json': createMockRegistryEntry({
          name: 'button',
          root_folder: 'button',
          files: [
            {
              path: 'button/button.tsx',
              target: 'button/button.tsx',
              type: 'registry:ui',
              content: 'export function Button() {}',
            },
          ],
          dependencies: ['class-variance-authority', 'clsx'],
          devDependencies: [],
          registryDependencies: [],
        }),
      }),
    )

    const { addCommandAction } = await import('~/commands/add/add.libs')
    const { execa } = await import('execa')

    await expect(addCommandAction(['button'], { cwd: tmpDir, yes: true, force: true, all: false })).rejects.toThrow(
      /process\.exit/,
    )

    // First exit should be 0 (success)
    expect(exitCodes[0]).toBe(0)

    // Verify execa was called to install dependencies
    expect(execa).toHaveBeenCalledWith(
      'npm',
      expect.arrayContaining(['install', 'class-variance-authority', 'clsx']),
      expect.objectContaining({ cwd: tmpDir, reject: false }),
    )
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

    fs.mkdirSync(path.join(tmpDir, 'apps', 'web', 'src'), { recursive: true })
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

    const { addCommandAction } = await import('~/commands/add/add.libs')

    await expect(
      addCommandAction(['button'], { cwd: tmpDir, workspace: 'apps/web', yes: true, force: true, all: false }),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(0)
    expect(fs.existsSync(path.join(tmpDir, 'apps', 'web', 'src', 'ui', 'button', 'button.tsx'))).toBe(true)
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

    const { addCommandAction } = await import('~/commands/add/add.libs')

    await expect(
      addCommandAction(['button'], { cwd: tmpDir, workspace: 'apps/missing', yes: true, force: true, all: false }),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })

  it('infers workspace from cwd when running inside a monorepo workspace', async () => {
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

    fs.mkdirSync(path.join(tmpDir, 'apps', 'web', 'src', 'pages'), { recursive: true })
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

    process.cwd = () => path.join(tmpDir, 'apps', 'web', 'src', 'pages')

    const { addCommandAction } = await import('~/commands/add/add.libs')

    await expect(
      addCommandAction(['button'], { cwd: process.cwd(), yes: true, force: true, all: false }),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(0)
    expect(fs.existsSync(path.join(tmpDir, 'apps', 'web', 'src', 'ui', 'button', 'button.tsx'))).toBe(true)
  })
})
