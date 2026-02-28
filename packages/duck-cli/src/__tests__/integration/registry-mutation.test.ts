import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  process_component_dependencies,
  process_component_files,
} from '~/utils/registry-mutation/registry-mutation.lib'
import { createMockRegistryEntry } from '../helpers/fixtures'
import { createMockFetch } from '../helpers/mock-fetch'
import { createMockSpinner } from '../helpers/mock-spinner'

// Mock execa for dependency installation tests
vi.mock('execa', () => ({
  execa: vi.fn().mockResolvedValue({ failed: false, stdout: '', stderr: '' }),
}))

// Mock get_package_manager
vi.mock('~/utils/get-package-manager', () => ({
  get_package_manager: vi.fn().mockResolvedValue('npm'),
}))

// Mock prompts for overwrite tests - use vi.hoisted to avoid hoisting issue
const { mockPrompts } = vi.hoisted(() => ({ mockPrompts: vi.fn() }))
vi.mock('prompts', () => ({ default: mockPrompts }))

describe('process_component_files', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-test-'))
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

    await process_component_files(component, tmpDir, 'src/ui', spinner as any, true)

    const written = fs.readFileSync(path.join(tmpDir, 'button/button.tsx'), 'utf8')
    expect(written).toBe('export function Button() { return null }')
    expect(spinner.succeed).toHaveBeenCalled()
  })

  it('warns when component has no files', async () => {
    const spinner = createMockSpinner()

    const component = createMockRegistryEntry({ files: [] })

    await process_component_files(component, tmpDir, 'src/ui', spinner as any, true)

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

    await process_component_files(component, tmpDir, 'src/ui', spinner as any, true)

    expect(spinner.warn).toHaveBeenCalledWith(expect.stringContaining('no content'))
    expect(fs.existsSync(path.join(tmpDir, 'button/button.tsx'))).toBe(false)
  })

  it('prompts for overwrite when force=false and directory has files', async () => {
    const spinner = createMockSpinner()
    mockPrompts.mockResolvedValue({ overwrite: false })

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

    await process_component_files(component, tmpDir, 'src/ui', spinner as any, false)

    // Should have prompted and skipped since user declined
    expect(mockPrompts).toHaveBeenCalled()
    expect(spinner.warn).toHaveBeenCalledWith(expect.stringContaining('skipping'))
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

    await process_component_files(component, tmpDir, 'src/ui', spinner as any, true)

    expect(fs.readFileSync(path.join(tmpDir, 'button/button.tsx'), 'utf8')).toBe('export function Button() {}')
    expect(fs.readFileSync(path.join(tmpDir, 'button/button.types.ts'), 'utf8')).toBe('export type ButtonProps = {}')
  })
})

describe('install_registry_dependencies', () => {
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
    const { install_registry_dependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()

    const duckConfig = {
      schema: 'https://ui.gentleduck.org/schema.json',
      rsc: true,
      monorepo: false,
      tailwind: { baseColor: 'zinc', css: './src/styles.css', cssVariables: true, prefix: '' },
      aliases: { ui: '~/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    }

    const dependencies = {
      dependencies: [] as string[],
      dev_dependencies: [] as string[],
      registry_dependencies: [] as string[],
    }

    await install_registry_dependencies(dependencies, spinner as any, tmpDir, true, duckConfig as any)
  })

  it('fetches registry deps and filters out null results', async () => {
    const { install_registry_dependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()

    const duckConfig = {
      schema: 'https://ui.gentleduck.org/schema.json',
      rsc: true,
      monorepo: false,
      tailwind: { baseColor: 'zinc', css: './src/styles.css', cssVariables: true, prefix: '' },
      aliases: { ui: '~/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    }

    const dependencies = {
      dependencies: [] as string[],
      dev_dependencies: [] as string[],
      // 'nonexistent' will return null from get_registry_item, should be filtered out
      registry_dependencies: ['button', 'nonexistent'],
    }

    await install_registry_dependencies(dependencies, spinner as any, tmpDir, true, duckConfig as any)

    // Should succeed without crashing on the null result
    expect(spinner.succeed).toHaveBeenCalled()
    expect(dependencies.dependencies).toContain('class-variance-authority')
  })

  it('fetches registry dependencies and collects their deps', async () => {
    const { install_registry_dependencies } = await import('~/utils/registry-mutation/registry-mutation.lib')
    const spinner = createMockSpinner()

    const duckConfig = {
      schema: 'https://ui.gentleduck.org/schema.json',
      rsc: true,
      monorepo: false,
      tailwind: { baseColor: 'zinc', css: './src/styles.css', cssVariables: true, prefix: '' },
      aliases: { ui: '~/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    }

    const dependencies = {
      dependencies: [] as string[],
      dev_dependencies: [] as string[],
      registry_dependencies: ['button'],
    }

    await install_registry_dependencies(dependencies, spinner as any, tmpDir, true, duckConfig as any)

    expect(spinner.succeed).toHaveBeenCalled()
    // Dependencies from the button component should be collected
    expect(dependencies.dependencies).toContain('class-variance-authority')
  })
})

describe('process_component_dependencies', () => {
  it('warns and returns when no dependencies exist', async () => {
    const spinner = createMockSpinner()

    await process_component_dependencies(
      { dependencies: [], dev_dependencies: [], registry_dependencies: [] },
      spinner as any,
      process.cwd(),
    )

    expect(spinner.warn).toHaveBeenCalledWith('No dependencies found')
  })

  it('calls execa with correct npm install command', async () => {
    const { execa } = await import('execa')
    const spinner = createMockSpinner()

    await process_component_dependencies(
      {
        dependencies: ['class-variance-authority', 'clsx'],
        dev_dependencies: [],
        registry_dependencies: [],
      },
      spinner as any,
      process.cwd(),
    )

    expect(execa).toHaveBeenCalledWith(
      'npm',
      expect.arrayContaining(['install', 'class-variance-authority', 'clsx']),
      expect.objectContaining({ stdio: 'ignore' }),
    )
    expect(spinner.succeed).toHaveBeenCalledWith('Successfully installed dependencies')
  })

  it('merges dependencies and devDependencies into single install', async () => {
    const { execa } = await import('execa')
    const spinner = createMockSpinner()

    await process_component_dependencies(
      {
        dependencies: ['clsx'],
        dev_dependencies: ['@types/react'],
        registry_dependencies: [],
      },
      spinner as any,
      process.cwd(),
    )

    expect(execa).toHaveBeenCalledWith(
      'npm',
      expect.arrayContaining(['install', 'clsx', '@types/react']),
      expect.any(Object),
    )
  })
})
