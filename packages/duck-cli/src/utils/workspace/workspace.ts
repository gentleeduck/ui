import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { PackageJson } from 'type-fest'
import { IGNORED_DIRECTORIES } from '~/utils/get-project-info'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'

export type WorkspaceTarget = {
  root: string
  project: string
}

export function find_upward_dir_with_file(startCwd: string, fileName: string): string | null {
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

export function find_duckui_root_cwd(cwd: string): string | null {
  return find_upward_dir_with_file(cwd, 'duck-ui.config.json')
}

function is_within_dir(target: string, parent: string): boolean {
  const relative = path.relative(parent, target)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function find_nearest_package_dir_within(startCwd: string, boundaryDir: string): string | null {
  let current = path.resolve(startCwd)
  const boundary = path.resolve(boundaryDir)

  if (!is_within_dir(current, boundary)) {
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
    if (!is_within_dir(parent, boundary)) {
      return null
    }
    current = parent
  }
}

function get_workspace_patterns(pkg: PackageJson): string[] {
  const workspaces = pkg.workspaces
  if (Array.isArray(workspaces)) return workspaces
  if (workspaces && typeof workspaces === 'object' && Array.isArray(workspaces.packages)) {
    return workspaces.packages
  }
  return []
}

export async function find_workspace_projects(cwd: string): Promise<string[]> {
  const package_json_path = path.join(cwd, 'package.json')
  if (!(await fs.pathExists(package_json_path))) {
    return []
  }

  const package_json = (await fs.readJson(package_json_path)) as PackageJson
  const patterns = get_workspace_patterns(package_json)
  if (!patterns.length) return []

  const package_files = fg.sync(
    patterns.map((pattern) => `${pattern}/package.json`),
    {
      cwd,
      onlyFiles: true,
      ignore: IGNORED_DIRECTORIES,
    },
  )

  return Array.from(new Set(package_files.map((file) => path.dirname(file)))).sort()
}

export function pick_default_workspace(cwd: string, projects: string[]): string | null {
  if (!projects.length) return null

  const with_tsconfig = projects.find((project) => fs.existsSync(path.join(cwd, project, 'tsconfig.json')))
  return with_tsconfig ?? projects[0] ?? null
}

export function resolve_project_cwd(cwd: string, duck_config: DuckUI, workspaceOverride?: string): string {
  const config_root = find_duckui_root_cwd(cwd) ?? path.resolve(cwd)
  const workspace_root = path.resolve(config_root, duck_config.workspace.root)

  if (workspaceOverride) {
    return path.isAbsolute(workspaceOverride)
      ? path.normalize(workspaceOverride)
      : path.resolve(workspace_root, workspaceOverride)
  }

  const inferred_workspace = find_nearest_package_dir_within(cwd, workspace_root)
  if (inferred_workspace && inferred_workspace !== workspace_root) {
    return inferred_workspace
  }

  return path.resolve(workspace_root, duck_config.workspace.project)
}

export function validate_workspace_target(projectCwd: string, requireTsConfig: boolean): string | null {
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
