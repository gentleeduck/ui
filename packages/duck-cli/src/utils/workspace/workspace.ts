import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { PackageJson } from 'type-fest'
import { IGNORED_DIRECTORIES } from '~/utils/get-project-info'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'

export namespace Workspace {
  export interface Target {
    root: string
    project: string
  }

  export type MonorepoKind = 'package-json-workspaces' | 'pnpm' | 'turbo' | 'nx' | 'lerna' | 'rush'
}

const MONOREPO_KIND_LABELS: Record<Workspace.MonorepoKind, string> = {
  lerna: 'lerna.json',
  nx: 'nx.json',
  'package-json-workspaces': 'package.json workspaces',
  pnpm: 'pnpm-workspace.yaml',
  rush: 'rush.json',
  turbo: 'turbo.json',
}

export function formatMonorepoKind(kind: Workspace.MonorepoKind): string {
  return MONOREPO_KIND_LABELS[kind]
}

export function findUpwardDirWithFile(startCwd: string, fileName: string): string | null {
  let current = path.resolve(startCwd)

  while (true) {
    if (fs.existsSync(path.join(current, fileName))) {
      return current
    }

    const parent = path.dirname(current)
    if (parent === current) {
      return null
    }
    current = parent
  }
}

export function findDuckuiRootCwd(cwd: string): string | null {
  return findUpwardDirWithFile(cwd, 'duck-ui.config.json')
}

function isWithinDir(target: string, parent: string): boolean {
  const relative = path.relative(parent, target)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function findNearestPackageDirWithin(startCwd: string, boundaryDir: string): string | null {
  let current = path.resolve(startCwd)
  const boundary = path.resolve(boundaryDir)

  if (!isWithinDir(current, boundary)) {
    return null
  }

  while (true) {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      return current
    }

    if (current === boundary) {
      return null
    }

    const parent = path.dirname(current)
    if (!isWithinDir(parent, boundary)) {
      return null
    }
    current = parent
  }
}

function getWorkspacePatterns(pkg: PackageJson): string[] {
  const workspaces = pkg.workspaces
  if (Array.isArray(workspaces)) return workspaces
  if (workspaces && typeof workspaces === 'object' && Array.isArray(workspaces.packages)) {
    return workspaces.packages
  }
  return []
}

// Minimal parser for the `packages:` list in pnpm-workspace.yaml. We avoid a
// YAML dependency because the field has a stable, simple shape in practice.
export function readPnpmWorkspacePackages(cwd: string): string[] {
  const yamlPath = path.join(cwd, 'pnpm-workspace.yaml')
  if (!fs.existsSync(yamlPath)) return []

  const content = fs.readFileSync(yamlPath, 'utf-8')
  const lines = content.split(/\r?\n/)
  const patterns: string[] = []
  let inPackages = false

  for (const raw of lines) {
    const line = raw.replace(/#.*$/, '').replace(/\s+$/, '')
    if (!line.trim()) continue

    if (/^packages\s*:\s*$/.test(line)) {
      inPackages = true
      continue
    }

    if (inPackages) {
      const item = line.match(/^\s*-\s*['"]?(.+?)['"]?\s*$/)
      if (item?.[1]) {
        patterns.push(item[1])
        continue
      }
      // A non-list, non-indented line means we've left the packages block.
      if (/^\S/.test(line)) {
        inPackages = false
      }
    }
  }

  return patterns
}

export function detectMonorepoKind(cwd: string): Workspace.MonorepoKind | null {
  const pkgPath = path.join(cwd, 'package.json')
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = fs.readJsonSync(pkgPath) as PackageJson
      if (getWorkspacePatterns(pkg).length > 0) return 'package-json-workspaces'
    } catch {
      // ignore malformed package.json
    }
  }
  if (fs.existsSync(path.join(cwd, 'pnpm-workspace.yaml'))) return 'pnpm'
  if (fs.existsSync(path.join(cwd, 'turbo.json'))) return 'turbo'
  if (fs.existsSync(path.join(cwd, 'nx.json'))) return 'nx'
  if (fs.existsSync(path.join(cwd, 'lerna.json'))) return 'lerna'
  if (fs.existsSync(path.join(cwd, 'rush.json'))) return 'rush'
  return null
}

export async function findWorkspaceProjects(cwd: string): Promise<string[]> {
  let patterns: string[] = []

  const packageJsonPath = path.join(cwd, 'package.json')
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = (await fs.readJson(packageJsonPath)) as PackageJson
    patterns = getWorkspacePatterns(packageJson)
  }

  if (!patterns.length) {
    patterns = readPnpmWorkspacePackages(cwd)
  }

  if (!patterns.length) return []

  const packageFiles = fg.sync(
    patterns.map((pattern) => `${pattern}/package.json`),
    {
      cwd,
      onlyFiles: true,
      ignore: IGNORED_DIRECTORIES,
    },
  )

  return Array.from(new Set(packageFiles.map((file) => path.dirname(file)))).sort()
}

export function pickDefaultWorkspace(cwd: string, projects: string[]): string | null {
  if (!projects.length) return null

  const withTsconfig = projects.find((project) => fs.existsSync(path.join(cwd, project, 'tsconfig.json')))
  return withTsconfig ?? projects[0] ?? null
}

export function resolveProjectCwd(cwd: string, duckConfig: DuckUI, workspaceOverride?: string): string {
  const configRoot = findDuckuiRootCwd(cwd) ?? path.resolve(cwd)
  const workspaceRoot = path.resolve(configRoot, duckConfig.workspace.root)

  if (workspaceOverride) {
    return path.isAbsolute(workspaceOverride)
      ? path.normalize(workspaceOverride)
      : path.resolve(workspaceRoot, workspaceOverride)
  }

  const inferredWorkspace = findNearestPackageDirWithin(cwd, workspaceRoot)
  if (inferredWorkspace && inferredWorkspace !== workspaceRoot) {
    return inferredWorkspace
  }

  return path.resolve(workspaceRoot, duckConfig.workspace.project)
}

export function validateWorkspaceTarget(projectCwd: string, requireTsConfig: boolean): string | null {
  if (!fs.existsSync(projectCwd)) {
    return `Workspace path does not exist: ${projectCwd}`
  }

  if (!fs.existsSync(path.join(projectCwd, 'package.json'))) {
    return `Workspace is missing package.json: ${projectCwd}`
  }

  if (requireTsConfig && !fs.existsSync(path.join(projectCwd, 'tsconfig.json'))) {
    return `Workspace is missing tsconfig.json: ${projectCwd}`
  }

  return null
}
