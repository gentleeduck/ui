import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execa } from 'execa'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  processComponentDependencies,
  processComponentFiles,
} from '~/utils/registry-mutation/registry-mutation.lib'
import { createMockDuckUIConfig, createMockRegistryEntry } from '../helpers/fixtures'
import { createMockFetch } from '../helpers/mock-fetch'
import { createMockSpinner } from '../helpers/mock-spinner'

// Mock execa for dependency installation tests
vi.mock('execa', () => ({
  execa: vi.fn().mockResolvedValue({ failed: false, stdout: '', stderr: '' }),
}))

// Mock getPackageManager
vi.mock('~/utils/get-package-manager', () => ({
  getPackageManager: vi.fn().mockResolvedValue('npm'),
}))

// Mock prompts for overwrite tests - use vi.hoisted to avoid hoisting issue
const { mockPrompts } = vi.hoisted(() => ({ mockPrompts: vi.fn() }))
vi.mock('prompts', () => ({ default: mockPrompts }))

describe('processComponentFiles', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-test-'))
    mockPrompts.mockReset()
    vi.mocked(execa).mockClear()
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('writes component files to disk', async () => {
    const spinner = createMockSpinner()

    const component = createMockRegistryEntry({
      files: [
        {
          path: 'button/button.tsx',
          target: 'button/button.tsx',
          type: 'registry:ui',
          content: 'export function Button() { return null }',
        },
      ],
    })

    // Create the required subdirectory
    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })

    await processComponentFiles(component, tmpDir, 'src/ui', spinner, true)

    const written = fs.readFileSync(path.join(tmpDir, 'button/button.tsx'), 'utf8')
    expect(written).toBe('export function Button() { return null }')
    expect(spinner.succeed).toHaveBeenCalled()
  })

  it('warns when component has no files', async () => {
    const spinner = createMockSpinner()

    const component = createMockRegistryEntry({ files: [] })

    await processComponentFiles(component, tmpDir, 'src/ui', spinner, true)

    expect(spinner.warn).toHaveBeenCalled()
  })

  it('skips files with no content', async () => {
    const spinner = createMockSpinner()

    const component = createMockRegistryEntry({
      files: [
        {
          path: 'button/button.tsx',
          target: 'button/button.tsx',
          type: 'registry:ui',
          content: undefined,
        },
      ],
    })

    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })

    await processComponentFiles(component, tmpDir, 'src/ui', spinner, true)

    expect(spinner.warn).toHaveBeenCalledWith(expect.stringContaining('no content'))
    expect(fs.existsSync(path.join(tmpDir, 'button/button.tsx'))).toBe(false)
  })

  it('prompts for overwrite when force=false and directory has files', async () => {
    const spinner = createMockSpinner()
    mockPrompts.mockResolvedValue({ action: 'skip' })

    const component = createMockRegistryEntry({
      files: [
        {
          path: 'button/button.tsx',
          target: 'button/button.tsx',
          type: 'registry:ui',
          content: 'new content',
        },
      ],
    })

    // Create existing file in the component directory
    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'button/existing.tsx'), 'old content')

    await processComponentFiles(component, tmpDir, 'src/ui', spinner, false)

    // Should have prompted and skipped since user declined
    expect(mockPrompts).toHaveBeenCalled()
    expect(spinner.warn).toHaveBeenCalledWith(expect.stringContaining('skipping'))
  })

  it('does not prompt when directory exists but is empty (first install)', async () => {
    const spinner = createMockSpinner()

    const component = createMockRegistryEntry({
      files: [
        {
          path: 'button/button.tsx',
          target: 'button/button.tsx',
          type: 'registry:ui',
          content: 'export function Button() { return null }',
        },
      ],
    })

    // Create an empty directory (simulates first install where mkdir ran first)
    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })

    await processComponentFiles(component, tmpDir, 'src/ui', spinner, false)

    // Should NOT have prompted since directory is empty
    expect(mockPrompts).not.toHaveBeenCalled()
    // Should have written the file
    const written = fs.readFileSync(path.join(tmpDir, 'button/button.tsx'), 'utf8')
    expect(written).toBe('export function Button() { return null }')
  })

  it('overwrites files when user selects overwrite action', async () => {
    const spinner = createMockSpinner()
    mockPrompts.mockResolvedValue({ action: 'overwrite' })

    const component = createMockRegistryEntry({
      files: [
        {
          path: 'button/button.tsx',
          target: 'button/button.tsx',
          type: 'registry:ui',
          content: 'new content',
        },
      ],
    })

    // Create existing file in the component directory
    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'button/existing.tsx'), 'old content')

    await processComponentFiles(component, tmpDir, 'src/ui', spinner, false)

    // Should have prompted
    expect(mockPrompts).toHaveBeenCalled()
    // Should have written the new file (overwrite)
    const written = fs.readFileSync(path.join(tmpDir, 'button/button.tsx'), 'utf8')
    expect(written).toBe('new content')
  })

  it('force=true bypasses overwrite prompt even with existing files', async () => {
    const spinner = createMockSpinner()

    const component = createMockRegistryEntry({
      files: [
        {
          path: 'button/button.tsx',
          target: 'button/button.tsx',
          type: 'registry:ui',
          content: 'forced new content',
        },
      ],
    })

    // Create existing file in the component directory
    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'button/existing.tsx'), 'old content')

    await processComponentFiles(component, tmpDir, 'src/ui', spinner, true)

    // Should NOT have prompted since force=true
    expect(mockPrompts).not.toHaveBeenCalled()
    // Should have written the file
    const written = fs.readFileSync(path.join(tmpDir, 'button/button.tsx'), 'utf8')
    expect(written).toBe('forced new content')
  })

  it('writes multiple files for a component', async () => {
    const spinner = createMockSpinner()

    const component = createMockRegistryEntry({
      files: [
        {
          path: 'button/button.tsx',
          target: 'button/button.tsx',
          type: 'registry:ui',
          content: 'export function Button() {}',
        },
        {
          path: 'button/button.types.ts',
          target: 'button/button.types.ts',
          type: 'registry:ui',
          content: 'export type ButtonProps = {}',
        },
      ],
    })

    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })

    await processComponentFiles(component, tmpDir, 'src/ui', spinner, true)

    expect(fs.readFileSync(path.join(tmpDir, 'button/button.tsx'), 'utf8')).toBe('export function Button() {}')
    expect(fs.readFileSync(path.join(tmpDir, 'button/button.types.ts'), 'utf8')).toBe('export type ButtonProps = {}')
  })
})

describe('installRegistryDependencies', () => {
  let tmpDir: string
  let originalFetch: typeof globalThis.fetch

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-test-'))
    originalFetch = globalThis.fetch
    vi.stubGlobal('fetch', createMockFetch())
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('handles empty registry dependencies without error', async () => {
    const { installRegistryDependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()

    const duckConfig = createMockDuckUIConfig()

    const dependencies = {
      dependencies: [] as string[],
      devDependencies: [] as string[],
      registryDependencies: [] as string[],
    }

    await installRegistryDependencies(dependencies, spinner, tmpDir, true, duckConfig)
  })

  it('fetches registry deps and filters out null results', async () => {
    const { installRegistryDependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()

    const duckConfig = createMockDuckUIConfig()

    const dependencies = {
      dependencies: [] as string[],
      devDependencies: [] as string[],
      // 'nonexistent' will return null from getRegistryItem, should be filtered out
      registryDependencies: ['button', 'nonexistent'],
    }

    await installRegistryDependencies(dependencies, spinner, tmpDir, true, duckConfig)

    // Should succeed without crashing on the null result
    expect(spinner.succeed).toHaveBeenCalled()
    expect(dependencies.dependencies).toContain('class-variance-authority')
  })

  it('fetches registry dependencies and collects their deps', async () => {
    const { installRegistryDependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()

    const duckConfig = createMockDuckUIConfig()

    const dependencies = {
      dependencies: [] as string[],
      devDependencies: [] as string[],
      registryDependencies: ['button'],
    }

    await installRegistryDependencies(dependencies, spinner, tmpDir, true, duckConfig)

    expect(spinner.succeed).toHaveBeenCalled()
    // Dependencies from the button component should be collected
    expect(dependencies.dependencies).toContain('class-variance-authority')
  })

  it('skips registry deps already in the exclude set (top-level components)', async () => {
    const { installRegistryDependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()
    const mockFetch = createMockFetch()
    vi.stubGlobal('fetch', mockFetch)

    const duckConfig = createMockDuckUIConfig()

    const dependencies = {
      dependencies: [] as string[],
      devDependencies: [] as string[],
      // "button" listed as registry dep, but also in exclude set
      registryDependencies: ['button'],
    }

    // Exclude "button" (simulating it was already installed as a top-level component)
    const exclude = new Set(['button'])

    await installRegistryDependencies(dependencies, spinner, tmpDir, true, duckConfig, exclude)

    // "button" should NOT have been fetched since it is in the exclude set
    const fetchedUrls = mockFetch.mock.calls.map((call: [string, ...unknown[]]) => call[0])
    const buttonFetches = fetchedUrls.filter((url: string) => url.includes('button'))
    expect(buttonFetches).toHaveLength(0)
  })

  it('does not re-fetch duplicate entries in registryDependencies', async () => {
    const { installRegistryDependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()
    const mockFetch = createMockFetch()
    vi.stubGlobal('fetch', mockFetch)

    const duckConfig = createMockDuckUIConfig()

    const dependencies = {
      dependencies: [] as string[],
      devDependencies: [] as string[],
      // "button" listed multiple times (from different components' registryDependencies)
      registryDependencies: ['button', 'button', 'Button', 'BUTTON'],
    }

    await installRegistryDependencies(dependencies, spinner, tmpDir, true, duckConfig)

    // "button" should only be fetched once despite appearing multiple times
    const fetchedUrls = mockFetch.mock.calls.map((call: [string, ...unknown[]]) => call[0])
    const buttonFetches = fetchedUrls.filter((url: string) => url.includes('/components/button.json'))
    expect(buttonFetches).toHaveLength(1)
  })

  it('resolves transitive registry deps without re-fetching parent', async () => {
    const { installRegistryDependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()
    const mockFetch = createMockFetch()
    vi.stubGlobal('fetch', mockFetch)

    const duckConfig = createMockDuckUIConfig()

    const dependencies = {
      dependencies: [] as string[],
      devDependencies: [] as string[],
      // "card" depends on "button" via registryDependencies
      registryDependencies: ['card'],
    }

    await installRegistryDependencies(dependencies, spinner, tmpDir, true, duckConfig)

    // Both card and button should be fetched
    const fetchedUrls = mockFetch.mock.calls.map((call: [string, ...unknown[]]) => call[0])
    expect(fetchedUrls.some((url: string) => url.includes('/components/card.json'))).toBe(true)
    expect(fetchedUrls.some((url: string) => url.includes('/components/button.json'))).toBe(true)

    // But button should only be fetched once (transitive, not duplicated)
    const buttonFetches = fetchedUrls.filter((url: string) => url.includes('/components/button.json'))
    expect(buttonFetches).toHaveLength(1)

    // Dependencies from both components should be collected
    expect(dependencies.dependencies).toContain('class-variance-authority')
  })
})

describe('processComponentDependencies', () => {
  beforeEach(() => {
    vi.mocked(execa).mockClear()
  })

  it('warns and returns when no dependencies exist', async () => {
    const spinner = createMockSpinner()

    await processComponentDependencies(
      { dependencies: [], devDependencies: [], registryDependencies: [] },
      spinner,
      process.cwd(),
    )

    expect(spinner.warn).toHaveBeenCalledWith('No dependencies found')
  })

  it('calls execa with correct npm install command', async () => {
    const { execa } = await import('execa')
    const spinner = createMockSpinner()

    await processComponentDependencies(
      {
        dependencies: ['class-variance-authority', 'clsx'],
        devDependencies: [],
        registryDependencies: [],
      },
      spinner,
      process.cwd(),
    )

    expect(execa).toHaveBeenCalledWith(
      'npm',
      expect.arrayContaining(['install', 'class-variance-authority', 'clsx']),
      expect.objectContaining({ cwd: process.cwd(), reject: false }),
    )
    expect(spinner.succeed).toHaveBeenCalledWith('Successfully installed dependencies')
  })

  it('merges dependencies and devDependencies into single install', async () => {
    const { execa } = await import('execa')
    const spinner = createMockSpinner()

    await processComponentDependencies(
      {
        dependencies: ['clsx'],
        devDependencies: ['@types/react'],
        registryDependencies: [],
      },
      spinner,
      process.cwd(),
    )

    expect(execa).toHaveBeenCalledWith(
      'npm',
      expect.arrayContaining(['install', 'clsx', '@types/react']),
      expect.objectContaining({ cwd: process.cwd(), reject: false }),
    )
  })

  it('deduplicates identical dependencies before installing', async () => {
    const { execa } = await import('execa')
    const spinner = createMockSpinner()

    await processComponentDependencies(
      {
        // Simulate multiple components pushing the same dependency
        dependencies: [
          '@gentleduck/libs',
          '@gentleduck/variants',
          '@gentleduck/libs',
          '@gentleduck/libs',
          'lucide-react',
          '@gentleduck/variants',
        ],
        devDependencies: [],
        registryDependencies: [],
      },
      spinner,
      process.cwd(),
    )

    const callArgs = (execa as ReturnType<typeof vi.fn>).mock.calls[0]
    const installedPackages = callArgs[1].slice(1) // remove 'install' prefix

    // Should have no duplicates
    expect(installedPackages).toHaveLength(new Set(installedPackages).size)
    expect(installedPackages).toContain('@gentleduck/libs')
    expect(installedPackages).toContain('@gentleduck/variants')
    expect(installedPackages).toContain('lucide-react')
    expect(installedPackages).toHaveLength(3)
  })

  it('deduplicates packages appearing in both dependencies and devDependencies', async () => {
    const { execa } = await import('execa')
    const spinner = createMockSpinner()

    await processComponentDependencies(
      {
        dependencies: ['@gentleduck/libs', 'clsx'],
        devDependencies: ['@gentleduck/libs', '@types/react'],
        registryDependencies: [],
      },
      spinner,
      process.cwd(),
    )

    const callArgs = (execa as ReturnType<typeof vi.fn>).mock.calls[0]
    const installedPackages = callArgs[1].slice(1) // remove 'install' prefix

    // '@gentleduck/libs' should appear only once even though it was in both arrays
    const libsCount = installedPackages.filter((p: string) => p === '@gentleduck/libs').length
    expect(libsCount).toBe(1)
    expect(installedPackages).toHaveLength(3) // @gentleduck/libs, clsx, @types/react
  })
})
