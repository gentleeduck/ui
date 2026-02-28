import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { get_duckui_config, get_package_json, get_ts_config } from '~/utils/get-project-info'
import { FIXTURES_DIR } from '../helpers/fixtures'
import { createMockSpinner } from '../helpers/mock-spinner'

// Save original cwd
const originalCwd = process.cwd

describe('get_package_json', () => {
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
    const result = get_package_json()
    expect(result).toBeDefined()
    expect(result).toHaveProperty('name')
  })

  it('calls process.exit(1) when package.json is missing', () => {
    process.cwd = () => '/tmp/nonexistent-dir-for-test'
    expect(() => get_package_json()).toThrow('process.exit(1)')
  })
})

describe('get_duckui_config', () => {
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
    const config = await get_duckui_config(FIXTURES_DIR, spinner as any)
    expect(config).toBeDefined()
    expect(config).toHaveProperty('aliases')
    expect(config).toHaveProperty('tailwind')
  })

  it('calls process.exit when config file is missing', async () => {
    const spinner = createMockSpinner()
    await expect(get_duckui_config('/tmp/nonexistent-dir-for-test', spinner as any)).rejects.toThrow(/process\.exit/)
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
      await expect(get_duckui_config(tmpDir, spinner as any)).rejects.toThrow('process.exit(1)')
      expect(spinner.fail).toHaveBeenCalled()
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})

describe('get_ts_config', () => {
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
    const config = await get_ts_config(FIXTURES_DIR, spinner as any)
    expect(config).toBeDefined()
    expect(config).toHaveProperty('compilerOptions')
  })

  it('calls process.exit when tsconfig is missing', async () => {
    const spinner = createMockSpinner()
    await expect(get_ts_config('/tmp/nonexistent-dir-for-test', spinner as any)).rejects.toThrow(/process\.exit/)
    expect(spinner.fail).toHaveBeenCalled()
  })
})
