import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

// Mock execa to avoid real installs
vi.mock('execa', () => ({
  execa: vi.fn().mockResolvedValue({ failed: false, stdout: '', stderr: '' }),
}))

// Mock package manager detection
vi.mock('~/utils/get-package-manager', () => ({
  getPackageManager: vi.fn().mockResolvedValue('npm'),
}))

describe('initCommandAction workspace validation', () => {
  let tmpDir: string
  const originalCwd = process.cwd
  let exitCodes: number[]

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-e2e-init-workspace-'))
    exitCodes = []

    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'test-project', version: '1.0.0' }))

    process.cwd = () => tmpDir
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      exitCodes.push(code ?? 0)
      throw new Error(`process.exit(${code})`)
    }) as never)
  })

  afterEach(() => {
    process.cwd = originalCwd
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('exits 1 for invalid --workspace during preflight', async () => {
    const { initCommandAction } = await import('~/commands/init/init.libs')

    await expect(
      initCommandAction([], {
        all: false,
        cwd: tmpDir,
        workspace: 'apps/missing',
        yes: true,
      }),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCodes[0]).toBe(1)
  })
})
