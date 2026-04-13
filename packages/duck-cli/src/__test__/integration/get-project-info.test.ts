import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDuckuiConfig, getPackageJson, getTsConfig } from '~/utils/get-project-info'
import { FIXTURES_DIR } from '../helpers/fixtures'
import { createMockSpinner } from '../helpers/mock-spinner'

// Save original cwd
const originalCwd = process.cwd

describe('getPackageJson', () => {
  beforeEach(() => {
    process.cwd = () => FIXTURES_DIR
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`process.exit(${code})`)
    }) as never)
  })

  afterEach(() => {
    process.cwd = originalCwd
    vi.restoreAllMocks()
  })

  it('reads package.json from fixture dir', () => {
    const result = getPackageJson()
    expect(result).toBeDefined()
    expect(result).toHaveProperty('name')
  })

  it('calls process.exit(1) when package.json is missing', () => {
    process.cwd = () => '/tmp/nonexistent-dir-for-test'
    expect(() => getPackageJson()).toThrow('process.exit(1)')
  })
})

describe('getDuckuiConfig', () => {
  beforeEach(() => {
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`process.exit(${code})`)
    }) as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads valid config from fixture', async () => {
    const spinner = createMockSpinner()
    const config = await getDuckuiConfig(FIXTURES_DIR, spinner)
    expect(config).toBeDefined()
    expect(config).toHaveProperty('aliases')
    expect(config).toHaveProperty('tailwind')
  })

  it('reads config by searching parent directories', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-parent-config-'))
    try {
      const nested = path.join(tmpDir, 'apps/web/src')
      fs.mkdirSync(nested, { recursive: true })
      fs.writeFileSync(
        path.join(tmpDir, 'duck-ui.config.json'),
        JSON.stringify({
          schema: 'https://ui.gentleduck.org/schema.json',
          monorepo: true,
          workspace: { root: '.', project: 'apps/web' },
          rsc: false,
          tailwind: { baseColor: 'zinc', css: './src/styles.css', cssVariables: true, prefix: '' },
          aliases: { hooks: '~/hooks', layouts: '~/layouts', libs: '~/libs', pages: '~/pages', ui: '~/ui' },
        }),
      )

      const spinner = createMockSpinner()
      const config = await getDuckuiConfig(nested, spinner)
      expect(config.monorepo).toBe(true)
      expect(config.workspace.project).toBe('apps/web')
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  it('calls process.exit when config file is missing', async () => {
    const spinner = createMockSpinner()
    await expect(getDuckuiConfig('/tmp/nonexistent-dir-for-test', spinner)).rejects.toThrow(/process\.exit/)
    expect(spinner.fail).toHaveBeenCalled()
  })

  it('calls process.exit(1) when config has invalid schema', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-invalid-config-'))
    try {
      // Write an invalid config (missing required fields, invalid schema URL)
      fs.writeFileSync(
        path.join(tmpDir, 'duck-ui.config.json'),
        JSON.stringify({ rsc: 'not-a-boolean', schema: 'not-a-url' }),
      )
      const spinner = createMockSpinner()
      await expect(getDuckuiConfig(tmpDir, spinner)).rejects.toThrow('process.exit(1)')
      expect(spinner.fail).toHaveBeenCalled()
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  it('shows migration error for legacy config missing workspace', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-legacy-config-'))
    try {
      fs.writeFileSync(
        path.join(tmpDir, 'duck-ui.config.json'),
        JSON.stringify({
          schema: 'https://ui.gentleduck.org/schema.json',
          monorepo: false,
          rsc: true,
          tailwind: { baseColor: 'zinc', css: './src/styles.css', cssVariables: true, prefix: '' },
          aliases: { hooks: '~/hooks', layouts: '~/layouts', libs: '~/libs', pages: '~/pages', ui: '~/ui' },
        }),
      )
      const spinner = createMockSpinner()
      await expect(getDuckuiConfig(tmpDir, spinner)).rejects.toThrow('process.exit(1)')
      expect(spinner.fail).toHaveBeenCalledWith(expect.stringContaining('Legacy'))
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})

describe('getTsConfig', () => {
  beforeEach(() => {
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`process.exit(${code})`)
    }) as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads valid tsconfig from fixture', async () => {
    const spinner = createMockSpinner()
    const config = await getTsConfig(FIXTURES_DIR, spinner)
    expect(config).toBeDefined()
    expect(config).toHaveProperty('compilerOptions')
  })

  it('calls process.exit when tsconfig is missing', async () => {
    const spinner = createMockSpinner()
    await expect(getTsConfig('/tmp/nonexistent-dir-for-test', spinner)).rejects.toThrow(/process\.exit/)
    expect(spinner.fail).toHaveBeenCalled()
  })
})
