import path from 'node:path'
import { execa } from 'execa'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { get_package_manager } from '~/utils/get-package-manager'
import { IGNORED_DIRECTORIES } from '~/utils/get-project-info'
import { get_registry_base_color } from '~/utils/get-registry'
import {
  generateThemeCSS,
  default_duckui_config,
} from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.libs'
import type { DuckuiPrompts } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.dto'
import {
  tailwindcss_boilerplate,
  post_css_nextjs,
  tailwindcss_vite,
} from '~/utils/preflight-configs/preflight-tailwindcss/preflight-tailwindcss.constants'
import { tailwindcss_dependencies } from '~/utils/preflight-configs/preflight-tailwindcss/preflight-tailwindcss.lib'
import {
  ts_config_nextjs,
  ts_config_generic,
  typescript_dependencies,
} from '~/utils/preflight-configs/preflight-typescript/preflight-typescript.constants'
import type { ProgressCallback, ServiceResult } from '../app.types'

// -- TypeScript --

export async function check_typescript_installed(cwd: string): Promise<boolean> {
  return fs.pathExists(path.resolve(cwd, 'tsconfig.json'))
}

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

export async function run_install_tailwindcss(
  cwd: string,
  projectType: string,
  cssPath: string,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    onProgress?.('Detecting package manager...')
    const packageManager = await get_package_manager(cwd)

    onProgress?.('Writing TailwindCSS config files...')
    const deps = tailwindcss_dependencies(projectType as any, cssPath, cwd)

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

export function check_duckui_config_exists(cwd: string): boolean {
  const files = fg.sync(['duck-ui.config.json'], {
    cwd,
    deep: 1,
    ignore: IGNORED_DIRECTORIES,
  })
  return files.length > 0
}

export async function run_init_duckui_config(
  cwd: string,
  options: DuckuiPrompts,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    onProgress?.('Fetching theme...')
    const theme = await get_registry_base_color(options.base_color)

    if (theme) {
      onProgress?.('Generating theme CSS...')
      const css = generateThemeCSS(theme)

      const cssPath = path.join(cwd, options.css)
      const cssExists = fs.existsSync(cssPath)

      if (cssExists) {
        const old = await fs.readFile(cssPath, 'utf-8')
        if (old.length <= 50) {
          await fs.writeFile(cssPath, css)
        }
        // If content exists and is > 50 chars, the GUI screen should have asked for overwrite
      } else {
        await fs.mkdirSync(path.dirname(cssPath), { recursive: true })
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

export async function read_duckui_config(cwd: string): Promise<ServiceResult<any>> {
  try {
    const files = fg.sync(['duck-ui.config.json'], { cwd, deep: 1, ignore: IGNORED_DIRECTORIES })
    if (!files.length) {
      return { ok: false, error: 'duck-ui.config.json not found' }
    }
    const raw = await fs.readFile(path.join(cwd, 'duck-ui.config.json'), 'utf8')
    return { ok: true, data: JSON.parse(raw) }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function read_ts_config(cwd: string): Promise<ServiceResult<any>> {
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
