import path from 'node:path'
import { execa } from 'execa'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { get_package_manager } from '~/utils/get-package-manager'
import { IGNORED_DIRECTORIES, type TsConfig } from '~/utils/get-project-info'
import { get_registry_base_color } from '~/utils/get-registry'
import { duck_ui_schema } from '~/utils/preflight-configs/preflight-duckui'
import type { PROJECT_TYPE } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.constants'
import type { DuckUI, DuckuiPrompts } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.dto'
import {
  default_duckui_config,
  generateThemeCSS,
} from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.libs'
import { tailwindcss_dependencies } from '~/utils/preflight-configs/preflight-tailwindcss/preflight-tailwindcss.lib'
import {
  ts_config_generic,
  ts_config_nextjs,
  typescript_dependencies,
} from '~/utils/preflight-configs/preflight-typescript/preflight-typescript.constants'
import { find_duckui_root_cwd } from '~/utils/workspace'
import type { ProgressCallback, ServiceResult } from './service.types'

// -- TypeScript --

/** Check if tsconfig.json exists at the project root. */
export async function check_typescript_installed(cwd: string): Promise<boolean> {
  return fs.pathExists(path.resolve(cwd, 'tsconfig.json'))
}

/** Install TypeScript and write a starter tsconfig.json (Next.js or generic). */
export async function run_install_typescript(
  cwd: string,
  projectType?: string,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    onProgress?.('Detecting package manager...')
    const packageManager = await get_package_manager(cwd)

    onProgress?.('Installing TypeScript...')
    const { failed } = await execa(
      packageManager,
      [packageManager === 'npm' ? 'install' : 'add', ...typescript_dependencies, '-D'],
      { cwd },
    )
    if (failed) {
      return { ok: false, error: 'Failed to install TypeScript dependencies' }
    }

    onProgress?.('Writing tsconfig.json...')
    const template = projectType === 'NEXT_JS' ? ts_config_nextjs : ts_config_generic
    await fs.writeFile(path.join(cwd, 'tsconfig.json'), template, 'utf-8')

    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// -- TailwindCSS --

/** Detect TailwindCSS by scanning CSS files for the @import 'tailwindcss' directive. */
export async function check_tailwind_installed(cwd: string): Promise<boolean> {
  try {
    const css_files = await fg.async('**.css', {
      cwd,
      deep: 3,
      globstar: true,
      ignore: IGNORED_DIRECTORIES,
      objectMode: true,
    })

    for (const file of css_files) {
      const content = await fs.readFile(path.join(cwd, file.path), 'utf-8')
      if (content.includes('@import "tailwindcss"')) {
        return true
      }
    }

    return false
  } catch {
    return false
  }
}

/** Install TailwindCSS and its dependencies via the detected package manager. */
export async function run_install_tailwindcss(
  cwd: string,
  projectType: (typeof PROJECT_TYPE)[number],
  cssPath: string,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    onProgress?.('Detecting package manager...')
    const packageManager = await get_package_manager(cwd)

    onProgress?.('Writing TailwindCSS config files...')
    const deps = tailwindcss_dependencies(projectType, cssPath, cwd)

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

// -- Duck-UI Config --

/** Check if duck-ui.config.json exists in the current directory. */
export function check_duckui_config_exists(cwd: string): boolean {
  const files = fg.sync(['duck-ui.config.json'], {
    cwd,
    deep: 1,
    ignore: IGNORED_DIRECTORIES,
  })
  return files.length > 0
}

/**
 * Initialize duck-ui configuration: fetch theme from registry,
 * generate CSS custom properties, and write duck-ui.config.json.
 */
export async function run_init_duckui_config(
  cwd: string,
  options: DuckuiPrompts,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    onProgress?.('Fetching theme...')
    const theme = await get_registry_base_color(options.base_color)

    if (theme?.light && theme?.dark) {
      onProgress?.('Generating theme CSS...')
      const css = generateThemeCSS(options.base_color, theme)

      const cssPath = path.join(cwd, options.css)
      const cssExists = fs.existsSync(cssPath)

      if (cssExists) {
        const old = await fs.readFile(cssPath, 'utf-8')
        if (old.length <= 50) {
          // Small file, safe to replace with theme
          const trimmed = old.trim()
          await fs.writeFile(cssPath, trimmed ? `${trimmed}\n\n${css}` : css)
        } else {
          // Keep existing @ imports (tailwind imports, etc.) and append theme
          const at_imports = old
            .split('\n')
            .filter((l) => l.startsWith('@'))
            .join('\n')
          await fs.writeFile(cssPath, at_imports ? `${at_imports}\n\n${css}` : css)
        }
      } else {
        fs.mkdirSync(path.dirname(cssPath), { recursive: true })
        await fs.writeFile(cssPath, css)
      }
    }

    onProgress?.('Writing duck-ui.config.json...')
    await fs.writeFile(path.join(cwd, 'duck-ui.config.json'), default_duckui_config(options), 'utf-8')

    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// -- Config Reading --

/**
 * Read and validate duck-ui.config.json.
 * Detects legacy config format (pre-workspace field) and provides a migration hint.
 */
export async function read_duckui_config(cwd: string): Promise<ServiceResult<DuckUI>> {
  try {
    const config_root = find_duckui_root_cwd(cwd)
    if (!config_root) {
      return { ok: false, error: 'duck-ui.config.json not found' }
    }
    const raw = await fs.readFile(path.join(config_root, 'duck-ui.config.json'), 'utf8')
    const parsed_result = duck_ui_schema.safeParse(JSON.parse(raw))
    if (!parsed_result.success) {
      const is_legacy_config = parsed_result.error.issues.some(
        (issue) => issue.path[0] === 'workspace' && issue.code === 'invalid_type',
      )
      if (is_legacy_config) {
        return {
          ok: false,
          error: 'Legacy duck-ui.config.json detected (missing workspace). Re-run @gentleduck/cli init to migrate.',
        }
      }
      return { ok: false, error: 'duck-ui.config.json has invalid schema' }
    }

    return { ok: true, data: parsed_result.data }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Read and parse tsconfig.json from the project directory. */
export async function read_ts_config(cwd: string): Promise<ServiceResult<TsConfig>> {
  try {
    const files = fg.sync(['tsconfig.json'], { cwd, deep: 1, ignore: IGNORED_DIRECTORIES })
    if (!files.length) {
      return { ok: false, error: 'tsconfig.json not found' }
    }
    const raw = await fs.readFile(path.join(cwd, 'tsconfig.json'), 'utf8')
    return { ok: true, data: JSON.parse(raw) }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}
