import path from 'node:path'
import { execa } from 'execa'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import { get_package_manager } from '../../get-package-manager'
import { IGNORED_DIRECTORIES } from '../../get-project-info'
import { highlighter } from '../../text-styling'
import { duckui_prompts_schema, type PROJECT_TYPE } from '../preflight-duckui'

type ProjectType = (typeof PROJECT_TYPE)[number]

import {
  post_css_nextjs,
  tailwindcss_boilerplate,
  tailwindcss_install_prompts,
  tailwindcss_vite,
} from './preflight-tailwindcss.constants'

export async function checkTailwindCssInstalled(cwd: string, spinner: Ora) {
  try {
    spinner.text = `${highlighter.info('Checking for TailwindCss...')}`

    const styles_files = await fg.async('**.css', {
      cwd,
      deep: 3,
      globstar: true,
      ignore: IGNORED_DIRECTORIES,
      objectMode: true,
    })

    for (let i = 0; i < styles_files.length; i++) {
      const file = styles_files[i]
      const content = await fs.readFile(path.join(cwd, file.path), 'utf-8')
      if (content.includes('@import "tailwindcss"')) {
        spinner.text = `${highlighter.info('TailwindCss is already installed...')}`
        return true
      }
    }

    return false
  } catch (error) {
    spinner.fail(
      `${highlighter.error('TailwindCss is not installed...')}${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    process.exit(1)
  }
}

export async function install_tailwindcss(
  cwd: string,
  spinner: Ora,
  presetProjectType?: ProjectType,
  presetCss?: string,
) {
  spinner.text = `${highlighter.info('Installing TailwindCSS...')}`

  let project_type: ProjectType | undefined = presetProjectType
  let css: string | undefined = presetCss

  if (!project_type || !css) {
    spinner.stop()
    const options = await prompts(tailwindcss_install_prompts)
    const parsed = duckui_prompts_schema.pick({ css: true, project_type: true }).parse(options)
    project_type = project_type || parsed.project_type
    css = css || parsed.css
    spinner.start()
  }

  if (!project_type || !css) {
    spinner.fail(`${highlighter.error('No project type selected...')}`)
    return
  }

  const packageManager = await get_package_manager(cwd)
  const { failed: installation_step_1 } = await execa(
    packageManager,
    [packageManager === 'npm' ? 'install' : 'add', ...tailwindcss_dependencies(project_type, css, cwd)],
    {
      cwd,
    },
  )

  if (installation_step_1) {
    spinner.fail('Failed to install TailwindCSS dependencies')
    return
  }

  spinner.text = `${highlighter.info('TailwindCSS is installed...')}`
}

export const tailwindcss_dependencies = (project_type: ProjectType, css_path: string, cwd: string) => {
  try {
    let cssFile: string

    // Check if css_path ends with .css (file path) or not (directory)
    if (css_path.endsWith('.css')) {
      cssFile = path.join(cwd, css_path)
      fs.mkdirSync(path.dirname(cssFile), { recursive: true })
    } else {
      const cssDir = path.join(cwd, css_path)
      fs.mkdirSync(cssDir, { recursive: true })
      cssFile = path.join(cssDir, 'styles.css')
    }

    switch (project_type) {
      case 'NEXT_JS':
        write_postcss_config(cwd)
        write_css_file(cssFile)
        return ['tailwindcss', 'postcss', '@tailwindcss/postcss', 'tw-animate-css']

      case 'VITE':
      case 'TANSTACK_START':
        write_vite_config(cwd)
        write_css_file(cssFile)
        return ['tailwindcss', '@tailwindcss/vite', 'tw-animate-css']

      default:
        write_css_file(cssFile)
        return ['tailwindcss', 'tw-animate-css']
    }
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

/**
 * Write the CSS file with Tailwind imports.
 * - If the file already has `@import "tailwindcss"`, skip entirely.
 * - If the file exists with other content, prepend the Tailwind imports.
 * - If the file does not exist, create it with the boilerplate.
 */
function write_css_file(cssFile: string) {
  if (fs.existsSync(cssFile)) {
    const existing = fs.readFileSync(cssFile, 'utf-8')
    if (existing.includes('@import "tailwindcss"')) {
      return
    }
    // Prepend the Tailwind boilerplate before existing content
    fs.writeFileSync(cssFile, `${tailwindcss_boilerplate}\n${existing}`)
    return
  }
  fs.writeFileSync(cssFile, tailwindcss_boilerplate)
}

/**
 * Write postcss.config.mjs for Next.js projects.
 * - If it already exists and has `@tailwindcss/postcss`, skip.
 * - If it already exists without it, inject the plugin.
 * - If it does not exist, create it.
 */
function write_postcss_config(cwd: string) {
  const config_path = find_config_file(cwd, ['postcss.config.mjs', 'postcss.config.js', 'postcss.config.cjs'])

  if (config_path) {
    const existing = fs.readFileSync(config_path, 'utf-8')
    if (existing.includes('@tailwindcss/postcss')) {
      return
    }
    // Existing postcss config without tailwind - inject the plugin
    const injected = inject_postcss_plugin(existing)
    if (injected) {
      fs.writeFileSync(config_path, injected)
      return
    }
  }
  // No config found, create fresh
  fs.writeFileSync(path.join(cwd, 'postcss.config.mjs'), post_css_nextjs)
}

/**
 * Write vite.config.ts for Vite/TanStack projects.
 * - If it already exists and has `@tailwindcss/vite`, skip.
 * - If it already exists without it, inject the import + plugin.
 * - If it does not exist, create it.
 */
function write_vite_config(cwd: string) {
  const config_path = find_config_file(cwd, ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs'])

  if (config_path) {
    const existing = fs.readFileSync(config_path, 'utf-8')
    if (existing.includes('@tailwindcss/vite') || existing.includes('tailwindcss')) {
      return
    }
    // Existing vite config without tailwind - inject the plugin
    const injected = inject_vite_tailwind_plugin(existing)
    if (injected) {
      fs.writeFileSync(config_path, injected)
      return
    }
  }
  // No config found, create fresh
  fs.writeFileSync(path.join(cwd, 'vite.config.ts'), tailwindcss_vite)
}

/**
 * Find the first config file that exists from a list of candidates.
 */
function find_config_file(cwd: string, candidates: string[]): string | null {
  for (const name of candidates) {
    const full = path.join(cwd, name)
    if (fs.existsSync(full)) {
      return full
    }
  }
  return null
}

/**
 * Inject `@tailwindcss/postcss` into an existing PostCSS config.
 * Looks for a `plugins` object and adds the entry.
 */
function inject_postcss_plugin(content: string): string | null {
  // Find the plugins object and add our plugin
  const plugins_match = content.match(/plugins\s*:\s*\{/)
  if (!plugins_match || plugins_match.index === undefined) {
    return null
  }
  const insert_pos = plugins_match.index + plugins_match[0].length
  const before = content.slice(0, insert_pos)
  const after = content.slice(insert_pos)
  return `${before}\n    "@tailwindcss/postcss": {},${after}`
}

/**
 * Inject the Tailwind CSS Vite plugin into an existing vite config.
 * Adds the import at the top and the plugin in the plugins array.
 */
function inject_vite_tailwind_plugin(content: string): string | null {
  // Add import at top (after last import statement)
  const import_lines = content.split('\n')
  let last_import_index = -1
  for (let i = 0; i < import_lines.length; i++) {
    if (import_lines[i].trimStart().startsWith('import ')) {
      last_import_index = i
    }
  }

  const import_statement = "import tailwindcss from '@tailwindcss/vite'"
  if (last_import_index >= 0) {
    import_lines.splice(last_import_index + 1, 0, import_statement)
  } else {
    import_lines.unshift(import_statement)
  }

  let updated = import_lines.join('\n')

  // Add plugin to plugins array
  const plugins_match = updated.match(/plugins\s*:\s*\[/)
  if (!plugins_match || plugins_match.index === undefined) {
    return null
  }
  const insert_pos = plugins_match.index + plugins_match[0].length
  const before = updated.slice(0, insert_pos)
  const after = updated.slice(insert_pos)
  updated = `${before}\n      tailwindcss(),${after}`

  return updated
}
