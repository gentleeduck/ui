import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import oraDefault from 'ora'
import { preflight_duckui_resolve_workspace } from '~/utils/preflight-configs/preflight-duckui'

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

const { mockPrompts } = vi.hoisted(() => ({ mockPrompts: vi.fn() }))
vi.mock('prompts', () => ({ default: mockPrompts }))

function makeSpinner() {
  return (oraDefault as unknown as () => ReturnType<typeof vi.fn>)()
}

describe('preflight_duckui_resolve_workspace', () => {
  let tmpDir: string
  let exitCalls: number[]

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-resolve-ws-'))
    exitCalls = []
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      exitCalls.push(code ?? 0)
      throw new Error(`process.exit(${code})`)
    }) as never)
    mockPrompts.mockReset()
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('asks the monorepo question FIRST, before any workspace selection', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }),
    )
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'apps/api'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'apps/api/package.json'), JSON.stringify({ name: 'api' }))

    // First call: monorepo confirm. Second call: workspace pick (only fires when 2+ workspaces).
    mockPrompts
      .mockResolvedValueOnce({ monorepo: true })
      .mockResolvedValueOnce({ workspace_project: 'apps/web' })

    const spinner = makeSpinner()
    const resolution = await preflight_duckui_resolve_workspace(
      { all: false, cwd: tmpDir, yes: false },
      spinner as never,
    )

    expect(mockPrompts).toHaveBeenCalledTimes(2)
    const first_call = mockPrompts.mock.calls[0]?.[0]
    expect(first_call?.name).toBe('monorepo')

    const second_call = mockPrompts.mock.calls[1]?.[0]
    expect(second_call?.name).toBe('workspace_project')

    expect(resolution.monorepo).toBe(true)
    expect(resolution.workspace_cwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })

  it('seeds the monorepo prompt default to Yes when a monorepo signal is present', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo' }))
    fs.writeFileSync(path.join(tmpDir, 'turbo.json'), '{}')

    mockPrompts.mockResolvedValueOnce({ monorepo: false })

    const spinner = makeSpinner()
    await preflight_duckui_resolve_workspace(
      { all: false, cwd: tmpDir, yes: false },
      spinner as never,
    )

    const prompt = mockPrompts.mock.calls[0]?.[0]
    expect(prompt?.initial).toBe(true)
    expect(prompt?.message).toContain('turbo.json')
  })

  it('seeds the monorepo prompt default to No when nothing is detected', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'plain' }))

    mockPrompts.mockResolvedValueOnce({ monorepo: false })

    const spinner = makeSpinner()
    const resolution = await preflight_duckui_resolve_workspace(
      { all: false, cwd: tmpDir, yes: false },
      spinner as never,
    )

    const prompt = mockPrompts.mock.calls[0]?.[0]
    expect(prompt?.initial).toBe(false)
    expect(resolution.monorepo).toBe(false)
    expect(resolution.workspace_cwd).toBe(path.resolve(tmpDir))
  })

  it('skips both prompts when --monorepo --workspace flags are passed', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }),
    )
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))

    const spinner = makeSpinner()
    const resolution = await preflight_duckui_resolve_workspace(
      { all: false, cwd: tmpDir, monorepo: true, workspace: 'apps/web', yes: false },
      spinner as never,
    )

    expect(mockPrompts).not.toHaveBeenCalled()
    expect(resolution.monorepo).toBe(true)
    expect(resolution.workspace_cwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })

  it('treats a bare --workspace flag as monorepo intent', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }),
    )
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))

    const spinner = makeSpinner()
    const resolution = await preflight_duckui_resolve_workspace(
      { all: false, cwd: tmpDir, workspace: 'apps/web', yes: false },
      spinner as never,
    )

    expect(mockPrompts).not.toHaveBeenCalled()
    expect(resolution.monorepo).toBe(true)
    expect(resolution.workspace_cwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })

  it('honors --no-monorepo even with auto-detection signals', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }),
    )
    fs.writeFileSync(path.join(tmpDir, 'turbo.json'), '{}')

    const spinner = makeSpinner()
    const resolution = await preflight_duckui_resolve_workspace(
      { all: false, cwd: tmpDir, monorepo: false, yes: false },
      spinner as never,
    )

    expect(mockPrompts).not.toHaveBeenCalled()
    expect(resolution.monorepo).toBe(false)
    expect(resolution.workspace_cwd).toBe(path.resolve(tmpDir))
  })

  it('exits 1 when the picked workspace path has no package.json', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }),
    )

    const spinner = makeSpinner()
    await expect(
      preflight_duckui_resolve_workspace(
        { all: false, cwd: tmpDir, monorepo: true, workspace: 'apps/missing', yes: false },
        spinner as never,
      ),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCalls[0]).toBe(1)
  })

  it('uses auto-detection in --yes mode without prompting', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }),
    )
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'apps/web/tsconfig.json'), JSON.stringify({}))

    const spinner = makeSpinner()
    const resolution = await preflight_duckui_resolve_workspace(
      { all: false, cwd: tmpDir, yes: true },
      spinner as never,
    )

    expect(mockPrompts).not.toHaveBeenCalled()
    expect(resolution.monorepo).toBe(true)
    expect(resolution.workspace_cwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })
})
