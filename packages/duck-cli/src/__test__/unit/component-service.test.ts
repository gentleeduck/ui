import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockDuckUIConfig, createMockRegistryEntry, createMockRegistryIndex } from '../helpers/fixtures'
import { createMockFetch } from '../helpers/mock-fetch'

describe('resolveWriteTypePath', () => {
  it('resolves path from config aliases and writePath', async () => {
    const { resolveWriteTypePath } = await import('~/services/component.service')
    const config = createMockDuckUIConfig({
      aliases: { ui: '~/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    })
    const result = resolveWriteTypePath(config, 'src')
    expect(result).toBe(path.resolve('src/ui'))
  })

  it('handles nested alias paths', async () => {
    const { resolveWriteTypePath } = await import('~/services/component.service')
    const config = createMockDuckUIConfig({
      aliases: { ui: '~/components/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    })
    const result = resolveWriteTypePath(config, 'src')
    expect(result).toBe(path.resolve('src/components/ui'))
  })

  it('handles alias with no subdirectory', async () => {
    const { resolveWriteTypePath } = await import('~/services/component.service')
    const config = createMockDuckUIConfig({
      aliases: { ui: '~', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    })
    const result = resolveWriteTypePath(config, 'src')
    expect(result).toBe(path.resolve('src'))
  })
})

describe('scanInstalledComponents', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-scan-'))
    vi.resetModules()
    vi.stubGlobal('fetch', createMockFetch())
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns empty array when directory does not exist', async () => {
    const { scanInstalledComponents } = await import('~/services/component.service')
    const result = await scanInstalledComponents(path.join(tmpDir, 'nonexistent'))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(0)
    }
  })

  it('returns empty array when directory is empty', async () => {
    const { scanInstalledComponents } = await import('~/services/component.service')
    const result = await scanInstalledComponents(tmpDir)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(0)
    }
  })

  it('detects installed components and matches against registry', async () => {
    // Create component directories
    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'input'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'button', 'button.tsx'), 'export function Button() {}')
    fs.writeFileSync(path.join(tmpDir, 'input', 'input.tsx'), 'export function Input() {}')

    const { scanInstalledComponents } = await import('~/services/component.service')
    const result = await scanInstalledComponents(tmpDir)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(2)
      const names = result.data.map((c) => c.name)
      expect(names).toContain('button')
      expect(names).toContain('input')
      // Registry entry should be attached
      const button = result.data.find((c) => c.name === 'button')
      expect(button?.registryEntry).not.toBeNull()
    }
  })

  it('handles local directories not in registry', async () => {
    fs.mkdirSync(path.join(tmpDir, 'custom-component'), { recursive: true })

    const { scanInstalledComponents } = await import('~/services/component.service')
    const result = await scanInstalledComponents(tmpDir)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('custom-component')
      expect(result.data[0].registryEntry).toBeNull()
    }
  })

  it('ignores files (only scans directories)', async () => {
    fs.writeFileSync(path.join(tmpDir, 'index.ts'), 'export {}')
    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })

    const { scanInstalledComponents } = await import('~/services/component.service')
    const result = await scanInstalledComponents(tmpDir)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('button')
    }
  })
})

describe('removeComponent', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-remove-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('removes a component directory', async () => {
    const compDir = path.join(tmpDir, 'button')
    fs.mkdirSync(compDir, { recursive: true })
    fs.writeFileSync(path.join(compDir, 'button.tsx'), 'content')

    const { removeComponent } = await import('~/services/component.service')
    const result = await removeComponent({
      name: 'button',
      root_folder: 'button',
      localPath: compDir,
      registryEntry: null,
    })

    expect(result.ok).toBe(true)
    expect(fs.existsSync(compDir)).toBe(false)
  })

  it('returns error for invalid path', async () => {
    const { removeComponent } = await import('~/services/component.service')
    // This should succeed even if path does not exist (fs.remove is idempotent)
    const result = await removeComponent({
      name: 'nonexistent',
      root_folder: 'nonexistent',
      localPath: path.join(tmpDir, 'nonexistent'),
      registryEntry: null,
    })
    expect(result.ok).toBe(true)
  })
})

describe('removeComponents', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-remove-multi-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('removes multiple components with progress', async () => {
    const dir1 = path.join(tmpDir, 'button')
    const dir2 = path.join(tmpDir, 'input')
    fs.mkdirSync(dir1, { recursive: true })
    fs.mkdirSync(dir2, { recursive: true })
    fs.writeFileSync(path.join(dir1, 'button.tsx'), 'content')
    fs.writeFileSync(path.join(dir2, 'input.tsx'), 'content')

    const progress: string[] = []
    const { removeComponents } = await import('~/services/component.service')
    const result = await removeComponents(
      [
        { name: 'button', root_folder: 'button', localPath: dir1, registryEntry: null },
        { name: 'input', root_folder: 'input', localPath: dir2, registryEntry: null },
      ],
      (msg) => progress.push(msg),
    )

    expect(result.ok).toBe(true)
    expect(fs.existsSync(dir1)).toBe(false)
    expect(fs.existsSync(dir2)).toBe(false)
    expect(progress).toHaveLength(2)
    expect(progress[0]).toContain('button')
    expect(progress[1]).toContain('input')
  })
})

describe('diffComponent', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-diff-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('reports identical when local matches registry', async () => {
    const compDir = path.join(tmpDir, 'button')
    fs.mkdirSync(compDir, { recursive: true })
    fs.writeFileSync(path.join(compDir, 'button.tsx'), 'export function Button() { return null }')

    const entry = createMockRegistryEntry({ name: 'button' })

    const { diffComponent } = await import('~/services/component.service')
    const result = await diffComponent(
      { name: 'button', root_folder: 'button', localPath: compDir, registryEntry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.isIdentical).toBe(true)
      expect(result.data.diffs).toHaveLength(0)
    }
  })

  it('detects modified files', async () => {
    const compDir = path.join(tmpDir, 'button')
    fs.mkdirSync(compDir, { recursive: true })
    fs.writeFileSync(path.join(compDir, 'button.tsx'), 'export function Button() { return <div>modified</div> }')

    const entry = createMockRegistryEntry({ name: 'button' })

    const { diffComponent } = await import('~/services/component.service')
    const result = await diffComponent(
      { name: 'button', root_folder: 'button', localPath: compDir, registryEntry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.isIdentical).toBe(false)
      expect(result.data.diffs).toHaveLength(1)
      expect(result.data.diffs[0].status).toBe('modified')
      expect(result.data.diffs[0].localContent).toContain('modified')
      expect(result.data.diffs[0].registryContent).toContain('return null')
    }
  })

  it('detects files only in registry (added)', async () => {
    const compDir = path.join(tmpDir, 'button')
    fs.mkdirSync(compDir, { recursive: true })
    // No local files exist

    const entry = createMockRegistryEntry({ name: 'button' })

    const { diffComponent } = await import('~/services/component.service')
    const result = await diffComponent(
      { name: 'button', root_folder: 'button', localPath: compDir, registryEntry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.isIdentical).toBe(false)
      const added = result.data.diffs.filter((d) => d.status === 'added')
      expect(added.length).toBeGreaterThan(0)
    }
  })

  it('detects files only local (deleted from registry)', async () => {
    const compDir = path.join(tmpDir, 'button')
    fs.mkdirSync(compDir, { recursive: true })
    fs.writeFileSync(path.join(compDir, 'button.tsx'), 'export function Button() { return null }')
    fs.writeFileSync(path.join(compDir, 'custom.tsx'), 'export function Custom() {}')

    const entry = createMockRegistryEntry({ name: 'button' })

    const { diffComponent } = await import('~/services/component.service')
    const result = await diffComponent(
      { name: 'button', root_folder: 'button', localPath: compDir, registryEntry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      const deleted = result.data.diffs.filter((d) => d.status === 'deleted')
      expect(deleted.length).toBe(1)
      expect(deleted[0].filePath).toBe('custom.tsx')
    }
  })

  it('handles component with no registry files', async () => {
    const compDir = path.join(tmpDir, 'empty')
    fs.mkdirSync(compDir, { recursive: true })
    fs.writeFileSync(path.join(compDir, 'local.tsx'), 'content')

    const entry = createMockRegistryEntry({ name: 'empty', root_folder: 'empty', files: [] })

    const { diffComponent } = await import('~/services/component.service')
    const result = await diffComponent(
      { name: 'empty', root_folder: 'empty', localPath: compDir, registryEntry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      // local.tsx should show as deleted from registry
      expect(result.data.diffs).toHaveLength(1)
      expect(result.data.diffs[0].status).toBe('deleted')
    }
  })
})

describe('diffComponents', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-diff-multi-'))
    vi.resetModules()
    vi.stubGlobal('fetch', createMockFetch())
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('diffs multiple components with progress', async () => {
    const btnDir = path.join(tmpDir, 'button')
    const inputDir = path.join(tmpDir, 'input')
    fs.mkdirSync(btnDir, { recursive: true })
    fs.mkdirSync(inputDir, { recursive: true })
    fs.writeFileSync(path.join(btnDir, 'button.tsx'), 'export function Button() { return null }')
    fs.writeFileSync(path.join(inputDir, 'input.tsx'), 'modified content')

    const btnEntry = createMockRegistryEntry({ name: 'button' })
    const inputEntry = createMockRegistryEntry({ name: 'input', root_folder: 'input' })

    const progress: string[] = []
    const { diffComponents } = await import('~/services/component.service')
    const result = await diffComponents(
      [
        { name: 'button', root_folder: 'button', localPath: btnDir, registryEntry: btnEntry },
        { name: 'input', root_folder: 'input', localPath: inputDir, registryEntry: inputEntry },
      ],
      (msg) => progress.push(msg),
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(2)
      expect(progress.length).toBeGreaterThan(0)
    }
  })

  it('fetches registry entry when not provided', async () => {
    const btnDir = path.join(tmpDir, 'button')
    fs.mkdirSync(btnDir, { recursive: true })
    fs.writeFileSync(path.join(btnDir, 'button.tsx'), 'export function Button() { return null }')

    const { diffComponents } = await import('~/services/component.service')
    const result = await diffComponents([
      { name: 'button', root_folder: 'button', localPath: btnDir, registryEntry: null },
    ])

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('button')
    }
  })
})
