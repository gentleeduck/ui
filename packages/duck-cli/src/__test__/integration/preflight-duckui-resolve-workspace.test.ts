import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import oraDefault from 'ora'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { preflightDuckuiResolveWorkspace } from '~/utils/preflight-configs/preflight-duckui'

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

describe('preflightDuckuiResolveWorkspace', () => {
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

  it('asks prompts in order: monorepo → component workspace → CSS workspace', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }))
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'apps/api'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'apps/api/package.json'), JSON.stringify({ name: 'api' }))

    // Three sequential prompts. The third (CSS workspace) defaults to "same as components".
    mockPrompts
      .mockResolvedValueOnce({ monorepo: true })
      .mockResolvedValueOnce({ workspaceProject: 'apps/web' })
      .mockResolvedValueOnce({ cssWorkspace: '__same__' })

    const spinner = makeSpinner()
    const resolution = await preflightDuckuiResolveWorkspace({ all: false, cwd: tmpDir, yes: false }, spinner as never)

    expect(mockPrompts).toHaveBeenCalledTimes(3)
    expect(mockPrompts.mock.calls[0]?.[0]?.name).toBe('monorepo')
    expect(mockPrompts.mock.calls[1]?.[0]?.name).toBe('workspaceProject')
    expect(mockPrompts.mock.calls[2]?.[0]?.name).toBe('cssWorkspace')

    expect(resolution.monorepo).toBe(true)
    expect(resolution.workspaceCwd).toBe(path.resolve(tmpDir, 'apps/web'))
    expect(resolution.cssWorkspaceCwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })

  it('seeds the monorepo prompt default to Yes when a monorepo signal is present', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo' }))
    fs.writeFileSync(path.join(tmpDir, 'turbo.json'), '{}')

    mockPrompts.mockResolvedValueOnce({ monorepo: false })

    const spinner = makeSpinner()
    await preflightDuckuiResolveWorkspace({ all: false, cwd: tmpDir, yes: false }, spinner as never)

    const prompt = mockPrompts.mock.calls[0]?.[0]
    expect(prompt?.initial).toBe(true)
    expect(prompt?.message).toContain('turbo.json')
  })

  it('seeds the monorepo prompt default to No when nothing is detected', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'plain' }))

    mockPrompts.mockResolvedValueOnce({ monorepo: false })

    const spinner = makeSpinner()
    const resolution = await preflightDuckuiResolveWorkspace({ all: false, cwd: tmpDir, yes: false }, spinner as never)

    const prompt = mockPrompts.mock.calls[0]?.[0]
    expect(prompt?.initial).toBe(false)
    expect(resolution.monorepo).toBe(false)
    expect(resolution.workspaceCwd).toBe(path.resolve(tmpDir))
  })

  it('a bare --workspace flag implies monorepo and skips all prompts', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }))
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))

    const spinner = makeSpinner()
    const resolution = await preflightDuckuiResolveWorkspace(
      { all: false, cwd: tmpDir, workspace: 'apps/web', yes: false },
      spinner as never,
    )

    expect(mockPrompts).not.toHaveBeenCalled()
    expect(resolution.monorepo).toBe(true)
    expect(resolution.workspaceCwd).toBe(path.resolve(tmpDir, 'apps/web'))
    expect(resolution.cssWorkspaceCwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })

  it('--workspace + --css-workspace routes CSS to a separate package', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'repo', workspaces: ['apps/*', 'packages/*'] }),
    )
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'packages/styles'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'packages/styles/package.json'), JSON.stringify({ name: 'styles' }))

    const spinner = makeSpinner()
    const resolution = await preflightDuckuiResolveWorkspace(
      { all: false, cwd: tmpDir, cssWorkspace: 'packages/styles', workspace: 'apps/web', yes: false },
      spinner as never,
    )

    expect(mockPrompts).not.toHaveBeenCalled()
    expect(resolution.workspaceCwd).toBe(path.resolve(tmpDir, 'apps/web'))
    expect(resolution.cssWorkspaceCwd).toBe(path.resolve(tmpDir, 'packages/styles'))
  })

  it('CSS workspace picker offers "Same as components" plus the other workspaces', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'repo', workspaces: ['apps/*', 'packages/*'] }),
    )
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'packages/styles'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'packages/styles/package.json'), JSON.stringify({ name: 'styles' }))

    mockPrompts
      .mockResolvedValueOnce({ monorepo: true })
      .mockResolvedValueOnce({ workspaceProject: 'apps/web' })
      .mockResolvedValueOnce({ cssWorkspace: 'packages/styles' })

    const spinner = makeSpinner()
    const resolution = await preflightDuckuiResolveWorkspace({ all: false, cwd: tmpDir, yes: false }, spinner as never)

    expect(mockPrompts).toHaveBeenCalledTimes(3)
    const cssPrompt = mockPrompts.mock.calls[2]?.[0]
    expect(cssPrompt?.name).toBe('cssWorkspace')
    const choices = cssPrompt?.choices as Array<{ value: string; title: string }>
    expect(choices[0]?.value).toBe('__same__')
    expect(choices[0]?.title).toContain('apps/web')
    expect(choices.slice(1).map((c) => c.value)).toEqual(['packages/styles'])

    expect(resolution.workspaceCwd).toBe(path.resolve(tmpDir, 'apps/web'))
    expect(resolution.cssWorkspaceCwd).toBe(path.resolve(tmpDir, 'packages/styles'))
  })

  it('does not ask the CSS workspace picker when there is only one workspace', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }))
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))

    mockPrompts.mockResolvedValueOnce({ monorepo: true })

    const spinner = makeSpinner()
    const resolution = await preflightDuckuiResolveWorkspace({ all: false, cwd: tmpDir, yes: false }, spinner as never)

    expect(mockPrompts).toHaveBeenCalledTimes(1)
    expect(resolution.cssWorkspaceCwd).toBe(resolution.workspaceCwd)
  })

  it('honors --no-monorepo even with auto-detection signals', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }))
    fs.writeFileSync(path.join(tmpDir, 'turbo.json'), '{}')

    const spinner = makeSpinner()
    const resolution = await preflightDuckuiResolveWorkspace(
      { all: false, cwd: tmpDir, monorepo: false, yes: false },
      spinner as never,
    )

    expect(mockPrompts).not.toHaveBeenCalled()
    expect(resolution.monorepo).toBe(false)
    expect(resolution.workspaceCwd).toBe(path.resolve(tmpDir))
  })

  it('exits 1 when the picked workspace path has no package.json', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }))

    const spinner = makeSpinner()
    await expect(
      preflightDuckuiResolveWorkspace(
        { all: false, cwd: tmpDir, workspace: 'apps/missing', yes: false },
        spinner as never,
      ),
    ).rejects.toThrow(/process\.exit/)

    expect(exitCalls[0]).toBe(1)
  })

  it('uses auto-detection in --yes mode without prompting', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }))
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'apps/web/tsconfig.json'), JSON.stringify({}))

    const spinner = makeSpinner()
    const resolution = await preflightDuckuiResolveWorkspace({ all: false, cwd: tmpDir, yes: true }, spinner as never)

    expect(mockPrompts).not.toHaveBeenCalled()
    expect(resolution.monorepo).toBe(true)
    expect(resolution.workspaceCwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })
})
