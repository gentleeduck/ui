import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  detectMonorepoKind,
  findDuckuiRootCwd,
  findWorkspaceProjects,
  formatMonorepoKind,
  pickDefaultWorkspace,
  readPnpmWorkspacePackages,
  resolveProjectCwd,
  validateWorkspaceTarget,
} from '~/utils/workspace'

describe('workspace utils', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-workspace-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('finds workspace projects from package.json workspaces', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({
        name: 'repo',
        private: true,
        workspaces: ['apps/*', 'packages/*'],
      }),
    )
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'packages/ui'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'packages/ui/package.json'), JSON.stringify({ name: 'ui' }))

    const projects = await findWorkspaceProjects(tmpDir)
    expect(projects).toContain('apps/web')
    expect(projects).toContain('packages/ui')
  })

  it('prefers workspace with tsconfig when picking default', () => {
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'packages/ui'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/tsconfig.json'), JSON.stringify({ compilerOptions: {} }))

    const selected = pickDefaultWorkspace(tmpDir, ['packages/ui', 'apps/web'])
    expect(selected).toBe('apps/web')
  })

  it('resolves project cwd for monorepo configs', () => {
    const projectCwd = resolveProjectCwd(tmpDir, {
      aliases: {
        hooks: '~/hooks',
        layouts: '~/layouts',
        libs: '~/libs',
        pages: '~/pages',
        ui: '~/ui',
      },
      monorepo: true,
      rsc: false,
      schema: 'https://gentleduck.org/schema.json',
      tailwind: {
        baseColor: 'zinc',
        css: './src/styles.css',
        cssVariables: true,
        prefix: '',
      },
      workspace: {
        root: '.',
        project: 'apps/web',
      },
    })

    expect(projectCwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })

  it('finds duck-ui root from nested directories', () => {
    fs.mkdirSync(path.join(tmpDir, 'apps/web/src'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'duck-ui.config.json'), '{}')

    const root = findDuckuiRootCwd(path.join(tmpDir, 'apps/web/src'))
    expect(root).toBe(tmpDir)
  })

  it('applies workspace override relative to monorepo root', () => {
    fs.mkdirSync(path.join(tmpDir, 'apps/web/src'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'duck-ui.config.json'), '{}')

    const projectCwd = resolveProjectCwd(
      path.join(tmpDir, 'apps/web/src'),
      {
        aliases: {
          hooks: '~/hooks',
          layouts: '~/layouts',
          libs: '~/libs',
          pages: '~/pages',
          ui: '~/ui',
        },
        monorepo: true,
        rsc: false,
        schema: 'https://gentleduck.org/schema.json',
        tailwind: {
          baseColor: 'zinc',
          css: './src/styles.css',
          cssVariables: true,
          prefix: '',
        },
        workspace: {
          root: '.',
          project: 'apps/default',
        },
      },
      'packages/cli-app',
    )

    expect(projectCwd).toBe(path.resolve(tmpDir, 'packages/cli-app'))
  })

  it('validates workspace target package and tsconfig', () => {
    const ws = path.join(tmpDir, 'apps/web')
    fs.mkdirSync(ws, { recursive: true })
    fs.writeFileSync(path.join(ws, 'package.json'), JSON.stringify({ name: 'web' }))

    expect(validateWorkspaceTarget(ws, true)).toContain('tsconfig.json')

    fs.writeFileSync(path.join(ws, 'tsconfig.json'), JSON.stringify({ compilerOptions: {} }))
    expect(validateWorkspaceTarget(ws, true)).toBeNull()
  })

  it('infers workspace from current nested directory when no override is provided', () => {
    fs.mkdirSync(path.join(tmpDir, 'apps/web/src/routes'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'duck-ui.config.json'), '{}')
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))

    const projectCwd = resolveProjectCwd(path.join(tmpDir, 'apps/web/src/routes'), {
      aliases: {
        hooks: '~/hooks',
        layouts: '~/layouts',
        libs: '~/libs',
        pages: '~/pages',
        ui: '~/ui',
      },
      monorepo: true,
      rsc: false,
      schema: 'https://gentleduck.org/schema.json',
      tailwind: {
        baseColor: 'zinc',
        css: './src/styles.css',
        cssVariables: true,
        prefix: '',
      },
      workspace: {
        root: '.',
        project: 'apps/default',
      },
    })

    expect(projectCwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })
})

describe('detectMonorepoKind', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-detect-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('returns null for a plain project', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'plain' }))
    expect(detectMonorepoKind(tmpDir)).toBeNull()
  })

  it('detects package.json workspaces', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }))
    expect(detectMonorepoKind(tmpDir)).toBe('package-json-workspaces')
  })

  it('detects pnpm-workspace.yaml', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo' }))
    fs.writeFileSync(path.join(tmpDir, 'pnpm-workspace.yaml'), 'packages:\n  - "apps/*"\n')
    expect(detectMonorepoKind(tmpDir)).toBe('pnpm')
  })

  it('detects turbo.json', () => {
    fs.writeFileSync(path.join(tmpDir, 'turbo.json'), '{}')
    expect(detectMonorepoKind(tmpDir)).toBe('turbo')
  })

  it('detects nx.json', () => {
    fs.writeFileSync(path.join(tmpDir, 'nx.json'), '{}')
    expect(detectMonorepoKind(tmpDir)).toBe('nx')
  })

  it('detects lerna.json', () => {
    fs.writeFileSync(path.join(tmpDir, 'lerna.json'), '{}')
    expect(detectMonorepoKind(tmpDir)).toBe('lerna')
  })

  it('detects rush.json', () => {
    fs.writeFileSync(path.join(tmpDir, 'rush.json'), '{}')
    expect(detectMonorepoKind(tmpDir)).toBe('rush')
  })

  it('prefers package.json workspaces over orchestrator configs when both are present', () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['apps/*'] }))
    fs.writeFileSync(path.join(tmpDir, 'turbo.json'), '{}')
    expect(detectMonorepoKind(tmpDir)).toBe('package-json-workspaces')
  })

  it('formatMonorepoKind produces a human label', () => {
    expect(formatMonorepoKind('pnpm')).toBe('pnpm-workspace.yaml')
    expect(formatMonorepoKind('turbo')).toBe('turbo.json')
    expect(formatMonorepoKind('package-json-workspaces')).toBe('package.json workspaces')
  })
})

describe('readPnpmWorkspacePackages', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-pnpm-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('parses a simple packages list', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'pnpm-workspace.yaml'),
      ['packages:', '  - "apps/*"', '  - "packages/*"', ''].join('\n'),
    )
    expect(readPnpmWorkspacePackages(tmpDir)).toEqual(['apps/*', 'packages/*'])
  })

  it('handles single quotes and unquoted entries', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'pnpm-workspace.yaml'),
      ['packages:', "  - 'apps/*'", '  - tooling/*', ''].join('\n'),
    )
    expect(readPnpmWorkspacePackages(tmpDir)).toEqual(['apps/*', 'tooling/*'])
  })

  it('strips comments and ignores other top-level keys', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'pnpm-workspace.yaml'),
      [
        '# pnpm config',
        'packages:',
        '  - "apps/*" # frontends',
        '  - "packages/*"',
        'shared-workspace-lockfile: true',
        '',
      ].join('\n'),
    )
    expect(readPnpmWorkspacePackages(tmpDir)).toEqual(['apps/*', 'packages/*'])
  })

  it('returns empty array when file is missing', () => {
    expect(readPnpmWorkspacePackages(tmpDir)).toEqual([])
  })
})

describe('findWorkspaceProjects pnpm fallback', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-cli-pnpm-fallback-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('falls back to pnpm-workspace.yaml when package.json has no workspaces', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo' }))
    fs.writeFileSync(path.join(tmpDir, 'pnpm-workspace.yaml'), 'packages:\n  - "apps/*"\n')
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'apps/api'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'apps/api/package.json'), JSON.stringify({ name: 'api' }))

    const projects = await findWorkspaceProjects(tmpDir)
    expect(projects).toContain('apps/web')
    expect(projects).toContain('apps/api')
  })

  it('still prefers package.json workspaces when both sources exist', async () => {
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'repo', workspaces: ['packages/*'] }))
    fs.writeFileSync(path.join(tmpDir, 'pnpm-workspace.yaml'), 'packages:\n  - "apps/*"\n')
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'packages/ui'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))
    fs.writeFileSync(path.join(tmpDir, 'packages/ui/package.json'), JSON.stringify({ name: 'ui' }))

    const projects = await findWorkspaceProjects(tmpDir)
    expect(projects).toContain('packages/ui')
    expect(projects).not.toContain('apps/web')
  })
})
