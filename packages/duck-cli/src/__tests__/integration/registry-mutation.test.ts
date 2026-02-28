import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { process_component_files } from '~/utils/registry-mutation/registry-mutation.lib'
import { createMockFetch } from '../helpers/mock-fetch'
import { createMockRegistryEntry } from '../helpers/fixtures'
import { createMockSpinner } from '../helpers/mock-spinner'

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
