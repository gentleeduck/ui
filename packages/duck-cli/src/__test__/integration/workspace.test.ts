import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  find_duckui_root_cwd,
  find_workspace_projects,
  pick_default_workspace,
  resolve_project_cwd,
  validate_workspace_target,
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

    const projects = await find_workspace_projects(tmpDir)
    expect(projects).toContain('apps/web')
    expect(projects).toContain('packages/ui')
  })

  it('prefers workspace with tsconfig when picking default', () => {
    fs.mkdirSync(path.join(tmpDir, 'apps/web'), { recursive: true })
    fs.mkdirSync(path.join(tmpDir, 'packages/ui'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'apps/web/tsconfig.json'), JSON.stringify({ compilerOptions: {} }))

    const selected = pick_default_workspace(tmpDir, ['packages/ui', 'apps/web'])
    expect(selected).toBe('apps/web')
  })

  it('resolves project cwd for monorepo configs', () => {
    const project_cwd = resolve_project_cwd(tmpDir, {
      aliases: {
        hooks: '~/hooks',
        layouts: '~/layouts',
        libs: '~/libs',
        pages: '~/pages',
        ui: '~/ui',
      },
      monorepo: true,
      rsc: false,
      schema: 'https://ui.gentleduck.org/schema.json',
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

    expect(project_cwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })

  it('finds duck-ui root from nested directories', () => {
    fs.mkdirSync(path.join(tmpDir, 'apps/web/src'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'duck-ui.config.json'), '{}')

    const root = find_duckui_root_cwd(path.join(tmpDir, 'apps/web/src'))
    expect(root).toBe(tmpDir)
  })

  it('applies workspace override relative to monorepo root', () => {
    fs.mkdirSync(path.join(tmpDir, 'apps/web/src'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'duck-ui.config.json'), '{}')

    const project_cwd = resolve_project_cwd(
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
        schema: 'https://ui.gentleduck.org/schema.json',
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

    expect(project_cwd).toBe(path.resolve(tmpDir, 'packages/cli-app'))
  })

  it('validates workspace target package and tsconfig', () => {
    const ws = path.join(tmpDir, 'apps/web')
    fs.mkdirSync(ws, { recursive: true })
    fs.writeFileSync(path.join(ws, 'package.json'), JSON.stringify({ name: 'web' }))

    expect(validate_workspace_target(ws, true)).toContain('tsconfig.json')

    fs.writeFileSync(path.join(ws, 'tsconfig.json'), JSON.stringify({ compilerOptions: {} }))
    expect(validate_workspace_target(ws, true)).toBeNull()
  })

  it('infers workspace from current nested directory when no override is provided', () => {
    fs.mkdirSync(path.join(tmpDir, 'apps/web/src/routes'), { recursive: true })
    fs.writeFileSync(path.join(tmpDir, 'duck-ui.config.json'), '{}')
    fs.writeFileSync(path.join(tmpDir, 'apps/web/package.json'), JSON.stringify({ name: 'web' }))

    const project_cwd = resolve_project_cwd(path.join(tmpDir, 'apps/web/src/routes'), {
      aliases: {
        hooks: '~/hooks',
        layouts: '~/layouts',
        libs: '~/libs',
        pages: '~/pages',
        ui: '~/ui',
      },
      monorepo: true,
      rsc: false,
      schema: 'https://ui.gentleduck.org/schema.json',
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

    expect(project_cwd).toBe(path.resolve(tmpDir, 'apps/web'))
  })
})
