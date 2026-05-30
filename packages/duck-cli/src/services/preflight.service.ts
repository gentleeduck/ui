import path from 'node:path'
import { execa } from 'execa'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { getPackageManager } from '~/utils/get-package-manager'
import { IGNORED_DIRECTORIES, type TsConfig } from '~/utils/get-project-info'
import { getRegistryBaseColor } from '~/utils/get-registry'
import { duckUiSchema } from '~/utils/preflight-configs/preflight-duckui'
import type { PROJECT_TYPE } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.constants'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.dto'
import { defaultDuckuiConfig, generateThemeCSS } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.libs'
import { tailwindcssDependencies } from '~/utils/preflight-configs/preflight-tailwindcss/preflight-tailwindcss.lib'
import {
  TYPESCRIPT_DEPENDENCIES,
  tsConfigGeneric,
  tsConfigNextjs,
} from '~/utils/preflight-configs/preflight-typescript/preflight-typescript.constants'
import { findDuckuiRootCwd } from '~/utils/workspace'
import type { ProgressCallback, ServiceResult } from './service.types'

export async function checkTypescriptInstalled(cwd: string): Promise<boolean> {
  return fs.pathExists(path.resolve(cwd, 'tsconfig.json'))
}

/** Picks the Next.js tsconfig template when `projectType === 'NEXT_JS'`, otherwise generic. */
export async function runInstallTypescript(
  cwd: string,
  projectType?: string,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    onProgress?.('Detecting package manager...')
    const packageManager = await getPackageManager(cwd)

    onProgress?.('Installing TypeScript...')
    const { failed } = await execa(
      packageManager,
      [packageManager === 'npm' ? 'install' : 'add', ...TYPESCRIPT_DEPENDENCIES, '-D'],
      { cwd },
    )
    if (failed) {
      return { ok: false, error: 'Failed to install TypeScript dependencies' }
    }

    onProgress?.('Writing tsconfig.json...')
    const template = projectType === 'NEXT_JS' ? tsConfigNextjs : tsConfigGeneric
    await fs.writeFile(path.join(cwd, 'tsconfig.json'), template, 'utf-8')

    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Tailwind v4 has no config file: detect by scanning CSS for `@import "tailwindcss"`. */
export async function checkTailwindInstalled(cwd: string): Promise<boolean> {
  try {
    const cssFiles = await fg.async('**.css', {
      cwd,
      deep: 3,
      globstar: true,
      ignore: IGNORED_DIRECTORIES,
      objectMode: true,
    })

    // Parallel read; serial loop dominates startup in monorepos with many CSS files.
    const results = await Promise.all(cssFiles.map((file) => fs.readFile(path.join(cwd, file.path), 'utf-8')))
    return results.some((content) => content.includes('@import "tailwindcss"'))
  } catch {
    return false
  }
}

export async function runInstallTailwindcss(
  cwd: string,
  projectType: (typeof PROJECT_TYPE)[number],
  cssPath: string,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    onProgress?.('Detecting package manager...')
    const packageManager = await getPackageManager(cwd)

    onProgress?.('Writing TailwindCSS config files...')
    const deps = tailwindcssDependencies(projectType, cssPath, cwd)

    onProgress?.('Installing TailwindCSS dependencies...')
    const { failed } = await execa(packageManager, [packageManager === 'npm' ? 'install' : 'add', ...deps], { cwd })
    if (failed) {
      return { ok: false, error: 'Failed to install TailwindCSS dependencies' }
    }

    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export function checkDuckuiConfigExists(cwd: string): boolean {
  const files = fg.sync(['duck-ui.config.json'], {
    cwd,
    deep: 1,
    ignore: IGNORED_DIRECTORIES,
  })
  return files.length > 0
}

export async function runInitDuckuiConfig(
  cwd: string,
  options: DuckUI.Prompts,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    onProgress?.('Fetching theme...')
    const theme = await getRegistryBaseColor(options.baseColor)

    if (theme?.light && theme?.dark) {
      onProgress?.('Generating theme CSS...')
      const css = generateThemeCSS(options.baseColor, theme)

      const cssPath = path.join(cwd, options.css)
      const cssExists = fs.existsSync(cssPath)

      if (cssExists) {
        const old = await fs.readFile(cssPath, 'utf-8')
        if (old.length <= 50) {
          // Treat tiny files as scaffolding-only and replace; preserves content but avoids surprise overwrites.
          const trimmed = old.trim()
          await fs.writeFile(cssPath, trimmed ? `${trimmed}\n\n${css}` : css)
        } else {
          // Preserve only `@`-prefixed lines (tailwind imports, layers) and drop the rest before appending theme.
          const atImports = old
            .split('\n')
            .filter((l) => l.startsWith('@'))
            .join('\n')
          await fs.writeFile(cssPath, atImports ? `${atImports}\n\n${css}` : css)
        }
      } else {
        fs.mkdirSync(path.dirname(cssPath), { recursive: true })
        await fs.writeFile(cssPath, css)
      }
    }

    onProgress?.('Writing duck-ui.config.json...')
    await fs.writeFile(path.join(cwd, 'duck-ui.config.json'), defaultDuckuiConfig(options), 'utf-8')

    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Surfaces a migration error for legacy configs missing the `workspace` field added post-monorepo. */
export async function readDuckuiConfig(cwd: string): Promise<ServiceResult<DuckUI>> {
  try {
    const configRoot = findDuckuiRootCwd(cwd)
    if (!configRoot) {
      return { ok: false, error: 'duck-ui.config.json not found' }
    }
    const raw = await fs.readFile(path.join(configRoot, 'duck-ui.config.json'), 'utf8')
    let json: unknown
    try {
      json = JSON.parse(raw)
    } catch {
      return { ok: false, error: 'duck-ui.config.json is not valid JSON' }
    }
    const parsedResult = duckUiSchema.safeParse(json)
    if (!parsedResult.success) {
      const isLegacyConfig = parsedResult.error.issues.some(
        (issue) => issue.path[0] === 'workspace' && issue.code === 'invalid_type',
      )
      if (isLegacyConfig) {
        return {
          ok: false,
          error: 'Legacy duck-ui.config.json detected (missing workspace). Re-run @gentleduck/cli init to migrate.',
        }
      }
      return { ok: false, error: 'duck-ui.config.json has invalid schema' }
    }

    return { ok: true, data: parsedResult.data }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function readTsConfig(cwd: string): Promise<ServiceResult<TsConfig>> {
  try {
    const files = fg.sync(['tsconfig.json'], { cwd, deep: 1, ignore: IGNORED_DIRECTORIES })
    if (!files.length) {
      return { ok: false, error: 'tsconfig.json not found' }
    }
    const raw = await fs.readFile(path.join(cwd, 'tsconfig.json'), 'utf8')
    try {
      return { ok: true, data: JSON.parse(raw) as TsConfig }
    } catch {
      return { ok: false, error: 'tsconfig.json is not valid JSON' }
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}
