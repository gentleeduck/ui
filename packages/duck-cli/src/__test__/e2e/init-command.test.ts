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

// Mock preflightConfigs to skip the full preflight checks. The real flow now
// returns the resolved workspace path so init.libs.ts can route writes through
// the correct cwd; the mock mirrors that shape against the test's tmpDir.
const mockPreflightConfigs = vi.fn()
vi.mock('~/utils/preflight-configs', () => ({
  preflightConfigs: mockPreflightConfigs,
}))

// Mock prompts
const mockPrompts = vi.fn()
vi.mock('prompts', () => ({ default: mockPrompts }))

describe('initCommandAction', () => {
  let tmpDir: string
  const originalCwd = process.cwd
  let exitCodes: number[]

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-e2e-init-'))
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

    // Create src directory
    fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true })

    process.cwd = () => tmpDir
    vi.stubGlobal('fetch', createMockFetch())
    // Track exit codes - first call records code, subsequent calls are from error handling
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      exitCodes.push(code ?? 0)
      throw new Error(`process.exit(${code})`)
    }) as never)
    mockPrompts.mockReset()
    mockPreflightConfigs.mockReset()
    mockPreflightConfigs.mockResolvedValue({ workspaceCwd: tmpDir, monorepo: false })
  })

  afterEach(() => {
    process.cwd = originalCwd
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('exits with 0 when user declines component installation', async () => {
    mockPrompts.mockResolvedValue({ install: false })

    const { initCommandAction } = await import('~/commands/init/init.libs')

    await expect(initCommandAction([], { yes: false, cwd: tmpDir, all: false })).rejects.toThrow(/process\.exit/)

    // First exit call should be 0 (user declined)
    expect(exitCodes[0]).toBe(0)
  })

  it('fetches and installs a named component with --yes flag', async () => {
    mockPrompts.mockResolvedValue({ yes: true })

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
              content: 'export function Button() { return null }',
            },
          ],
          dependencies: [],
          devDependencies: [],
          registryDependencies: [],
        }),
      }),
    )

    const { initCommandAction } = await import('~/commands/init/init.libs')

    await expect(initCommandAction(['button'], { yes: true, cwd: tmpDir, all: false })).rejects.toThrow(/process\.exit/)

    // First exit call should be 0 (success)
    expect(exitCodes[0]).toBe(0)

    // Verify the component file was written
    const buttonFile = path.join(tmpDir, 'src', 'ui', 'button', 'button.tsx')
    expect(fs.existsSync(buttonFile)).toBe(true)
    expect(fs.readFileSync(buttonFile, 'utf8')).toBe('export function Button() { return null }')
  })

  it('fails with exit 1 when duck-ui config is missing and components are requested', async () => {
    // Remove the duck-ui config - preflight is mocked so it won't create one
    fs.unlinkSync(path.join(tmpDir, 'duck-ui.config.json'))

    mockPrompts.mockResolvedValue({ yes: true })

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
              content: 'export function Button() { return null }',
            },
          ],
          dependencies: [],
          devDependencies: [],
          registryDependencies: [],
        }),
      }),
    )

    const { initCommandAction } = await import('~/commands/init/init.libs')

    await expect(initCommandAction(['button'], { yes: true, cwd: tmpDir, all: false })).rejects.toThrow(/process\.exit/)

    // Should fail because duck-ui config is missing
    expect(exitCodes[0]).toBe(1)
  })

  it('fails with exit 1 when tsconfig is missing during component install', async () => {
    // Remove tsconfig - needed for write path resolution
    fs.unlinkSync(path.join(tmpDir, 'tsconfig.json'))

    mockPrompts.mockResolvedValue({ yes: true })

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
              content: 'export function Button() { return null }',
            },
          ],
          dependencies: [],
          devDependencies: [],
          registryDependencies: [],
        }),
      }),
    )

    const { initCommandAction } = await import('~/commands/init/init.libs')

    await expect(initCommandAction(['button'], { yes: true, cwd: tmpDir, all: false })).rejects.toThrow(/process\.exit/)

    // Should fail because tsconfig is missing (needed for write path resolution)
    expect(exitCodes[0]).toBe(1)
  })
})
