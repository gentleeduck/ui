import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockDuckUIConfig, createMockRegistryEntry, createMockRegistryIndex } from '../helpers/fixtures'
import { createMockFetch } from '../helpers/mock-fetch'

describe('resolve_write_type_path', () => {
  it('resolves path from config aliases and write_path', async () => {
    const { resolve_write_type_path } = await import('~/services/component.service')
    const config = createMockDuckUIConfig({
      aliases: { ui: '~/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    })
    const result = resolve_write_type_path(config, 'src')
    expect(result).toBe(path.resolve('src/ui'))
  })

  it('handles nested alias paths', async () => {
    const { resolve_write_type_path } = await import('~/services/component.service')
    const config = createMockDuckUIConfig({
      aliases: { ui: '~/components/ui', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    })
    const result = resolve_write_type_path(config, 'src')
    expect(result).toBe(path.resolve('src/components/ui'))
  })

  it('handles alias with no subdirectory', async () => {
    const { resolve_write_type_path } = await import('~/services/component.service')
    const config = createMockDuckUIConfig({
      aliases: { ui: '~', libs: '~/libs', hooks: '~/hooks', pages: '~/pages', layouts: '~/layouts' },
    })
    const result = resolve_write_type_path(config, 'src')
    expect(result).toBe(path.resolve('src'))
  })
})

describe('scan_installed_components', () => {
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
    const { scan_installed_components } = await import('~/services/component.service')
    const result = await scan_installed_components(path.join(tmpDir, 'nonexistent'))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(0)
    }
  })

  it('returns empty array when directory is empty', async () => {
    const { scan_installed_components } = await import('~/services/component.service')
    const result = await scan_installed_components(tmpDir)
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

    const { scan_installed_components } = await import('~/services/component.service')
    const result = await scan_installed_components(tmpDir)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(2)
      const names = result.data.map((c) => c.name)
      expect(names).toContain('button')
      expect(names).toContain('input')
      // Registry entry should be attached
      const button = result.data.find((c) => c.name === 'button')
      expect(button?.registry_entry).not.toBeNull()
    }
  })

  it('handles local directories not in registry', async () => {
    fs.mkdirSync(path.join(tmpDir, 'custom-component'), { recursive: true })

    const { scan_installed_components } = await import('~/services/component.service')
    const result = await scan_installed_components(tmpDir)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('custom-component')
      expect(result.data[0].registry_entry).toBeNull()
    }
  })

  it('ignores files (only scans directories)', async () => {
    fs.writeFileSync(path.join(tmpDir, 'index.ts'), 'export {}')
    fs.mkdirSync(path.join(tmpDir, 'button'), { recursive: true })

    const { scan_installed_components } = await import('~/services/component.service')
    const result = await scan_installed_components(tmpDir)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('button')
    }
  })
})

describe('remove_component', () => {
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

    const { remove_component } = await import('~/services/component.service')
    const result = await remove_component({
      name: 'button',
      root_folder: 'button',
      local_path: compDir,
      registry_entry: null,
    })

    expect(result.ok).toBe(true)
    expect(fs.existsSync(compDir)).toBe(false)
  })

  it('returns error for invalid path', async () => {
    const { remove_component } = await import('~/services/component.service')
    // This should succeed even if path does not exist (fs.remove is idempotent)
    const result = await remove_component({
      name: 'nonexistent',
      root_folder: 'nonexistent',
      local_path: path.join(tmpDir, 'nonexistent'),
      registry_entry: null,
    })
    expect(result.ok).toBe(true)
  })
})

describe('remove_components', () => {
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
    const { remove_components } = await import('~/services/component.service')
    const result = await remove_components(
      [
        { name: 'button', root_folder: 'button', local_path: dir1, registry_entry: null },
        { name: 'input', root_folder: 'input', local_path: dir2, registry_entry: null },
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

describe('diff_component', () => {
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

    const { diff_component } = await import('~/services/component.service')
    const result = await diff_component(
      { name: 'button', root_folder: 'button', local_path: compDir, registry_entry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.is_identical).toBe(true)
      expect(result.data.diffs).toHaveLength(0)
    }
  })

  it('detects modified files', async () => {
    const compDir = path.join(tmpDir, 'button')
    fs.mkdirSync(compDir, { recursive: true })
    fs.writeFileSync(path.join(compDir, 'button.tsx'), 'export function Button() { return <div>modified</div> }')

    const entry = createMockRegistryEntry({ name: 'button' })

    const { diff_component } = await import('~/services/component.service')
    const result = await diff_component(
      { name: 'button', root_folder: 'button', local_path: compDir, registry_entry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.is_identical).toBe(false)
      expect(result.data.diffs).toHaveLength(1)
      expect(result.data.diffs[0].status).toBe('modified')
      expect(result.data.diffs[0].local_content).toContain('modified')
      expect(result.data.diffs[0].registry_content).toContain('return null')
    }
  })

  it('detects files only in registry (added)', async () => {
    const compDir = path.join(tmpDir, 'button')
    fs.mkdirSync(compDir, { recursive: true })
    // No local files exist

    const entry = createMockRegistryEntry({ name: 'button' })

    const { diff_component } = await import('~/services/component.service')
    const result = await diff_component(
      { name: 'button', root_folder: 'button', local_path: compDir, registry_entry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.is_identical).toBe(false)
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

    const { diff_component } = await import('~/services/component.service')
    const result = await diff_component(
      { name: 'button', root_folder: 'button', local_path: compDir, registry_entry: entry },
      entry,
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      const deleted = result.data.diffs.filter((d) => d.status === 'deleted')
      expect(deleted.length).toBe(1)
      expect(deleted[0].file_path).toBe('custom.tsx')
    }
  })

  it('handles component with no registry files', async () => {
    const compDir = path.join(tmpDir, 'empty')
    fs.mkdirSync(compDir, { recursive: true })
    fs.writeFileSync(path.join(compDir, 'local.tsx'), 'content')

    const entry = createMockRegistryEntry({ name: 'empty', root_folder: 'empty', files: [] })

    const { diff_component } = await import('~/services/component.service')
    const result = await diff_component(
      { name: 'empty', root_folder: 'empty', local_path: compDir, registry_entry: entry },
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

describe('diff_components', () => {
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
    const { diff_components } = await import('~/services/component.service')
    const result = await diff_components(
      [
        { name: 'button', root_folder: 'button', local_path: btnDir, registry_entry: btnEntry },
        { name: 'input', root_folder: 'input', local_path: inputDir, registry_entry: inputEntry },
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

    const { diff_components } = await import('~/services/component.service')
    const result = await diff_components([
      { name: 'button', root_folder: 'button', local_path: btnDir, registry_entry: null },
    ])

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('button')
    }
  })
})
