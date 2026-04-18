import path from 'node:path'
import { execa } from 'execa'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import { getPackageManager } from '../../get-package-manager'
import { IGNORED_DIRECTORIES } from '../../get-project-info'
import { highlighter } from '../../text-styling'
import { duckuiPromptsSchema, type PROJECT_TYPE } from '../preflight-duckui'

type ProjectType = (typeof PROJECT_TYPE)[number]

import {
  POST_CSS_NEXTJS,
  TAILWINDCSS_BOILERPLATE,
  TAILWINDCSS_VITE,
  tailwindcssInstallPrompts,
} from './preflight-tailwindcss.constants'

export async function checkTailwindCssInstalled(cwd: string, spinner: Ora) {
  try {
    spinner.text = `${highlighter.info('Checking for TailwindCss...')}`

    const stylesFiles = await fg.async('**.css', {
      cwd,
      deep: 3,
      globstar: true,
      ignore: IGNORED_DIRECTORIES,
      objectMode: true,
    })

    for (const file of stylesFiles) {
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

export async function installTailwindcss(
  cwd: string,
  spinner: Ora,
  presetProjectType?: ProjectType,
  presetCss?: string,
) {
  spinner.text = `${highlighter.info('Installing TailwindCSS...')}`

  let projectType: ProjectType | undefined = presetProjectType
  let css: string | undefined = presetCss

  if (!projectType || !css) {
    spinner.stop()
    const options = await prompts(tailwindcssInstallPrompts)
    const parsed = duckuiPromptsSchema.pick({ css: true, projectType: true }).parse(options)
    projectType = projectType || parsed.projectType
    css = css || parsed.css
    spinner.start()
  }

  if (!projectType || !css) {
    spinner.fail(`${highlighter.error('No project type selected...')}`)
    return
  }

  const packageManager = await getPackageManager(cwd)
  const { failed: installationStep1 } = await execa(
    packageManager,
    [packageManager === 'npm' ? 'install' : 'add', ...tailwindcssDependencies(projectType, css, cwd)],
    {
      cwd,
    },
  )

  if (installationStep1) {
    spinner.fail('Failed to install TailwindCSS dependencies')
    return
  }

  spinner.text = `${highlighter.info('TailwindCSS is installed...')}`
}

export const tailwindcssDependencies = (projectType: ProjectType, cssPath: string, cwd: string) => {
  try {
    let cssFile: string

    // Check if cssPath ends with .css (file path) or not (directory)
    if (cssPath.endsWith('.css')) {
      cssFile = path.join(cwd, cssPath)
      fs.mkdirSync(path.dirname(cssFile), { recursive: true })
    } else {
      const cssDir = path.join(cwd, cssPath)
      fs.mkdirSync(cssDir, { recursive: true })
      cssFile = path.join(cssDir, 'styles.css')
    }

    switch (projectType) {
      case 'NEXT_JS':
        writePostcssConfig(cwd)
        writeCssFile(cssFile)
        return ['tailwindcss', 'postcss', '@tailwindcss/postcss', 'tw-animate-css']

      case 'VITE':
      case 'TANSTACK_START':
        writeViteConfig(cwd)
        writeCssFile(cssFile)
        return ['tailwindcss', '@tailwindcss/vite', 'tw-animate-css']

      default:
        writeCssFile(cssFile)
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
function writeCssFile(cssFile: string) {
  if (fs.existsSync(cssFile)) {
    const existing = fs.readFileSync(cssFile, 'utf-8')
    if (existing.includes('@import "tailwindcss"')) {
      return
    }
    // Prepend the Tailwind boilerplate before existing content
    fs.writeFileSync(cssFile, `${TAILWINDCSS_BOILERPLATE}\n${existing}`)
    return
  }
  fs.writeFileSync(cssFile, TAILWINDCSS_BOILERPLATE)
}

/**
 * Write postcss.config.mjs for Next.js projects.
 * - If it already exists and has `@tailwindcss/postcss`, skip.
 * - If it already exists without it, inject the plugin.
 * - If it does not exist, create it.
 */
function writePostcssConfig(cwd: string) {
  const configPath = findConfigFile(cwd, ['postcss.config.mjs', 'postcss.config.js', 'postcss.config.cjs'])

  if (configPath) {
    const existing = fs.readFileSync(configPath, 'utf-8')
    if (existing.includes('@tailwindcss/postcss')) {
      return
    }
    // Existing postcss config without tailwind - inject the plugin
    const injected = injectPostcssPlugin(existing)
    if (injected) {
      fs.writeFileSync(configPath, injected)
      return
    }
  }
  // No config found, create fresh
  fs.writeFileSync(path.join(cwd, 'postcss.config.mjs'), POST_CSS_NEXTJS)
}

/**
 * Write vite.config.ts for Vite/TanStack projects.
 * - If it already exists and has `@tailwindcss/vite`, skip.
 * - If it already exists without it, inject the import + plugin.
 * - If it does not exist, create it.
 */
function writeViteConfig(cwd: string) {
  const configPath = findConfigFile(cwd, ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs'])

  if (configPath) {
    const existing = fs.readFileSync(configPath, 'utf-8')
    if (existing.includes('@tailwindcss/vite') || existing.includes('tailwindcss')) {
      return
    }
    // Existing vite config without tailwind - inject the plugin
    const injected = injectViteTailwindPlugin(existing)
    if (injected) {
      fs.writeFileSync(configPath, injected)
      return
    }
  }
  // No config found, create fresh
  fs.writeFileSync(path.join(cwd, 'vite.config.ts'), TAILWINDCSS_VITE)
}

/**
 * Find the first config file that exists from a list of candidates.
 */
function findConfigFile(cwd: string, candidates: string[]): string | null {
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
function injectPostcssPlugin(content: string): string | null {
  // Find the plugins object and add our plugin
  const pluginsMatch = content.match(/plugins\s*:\s*\{/)
  if (!pluginsMatch || pluginsMatch.index === undefined) {
    return null
  }
  const insertPos = pluginsMatch.index + pluginsMatch[0].length
  const before = content.slice(0, insertPos)
  const after = content.slice(insertPos)
  return `${before}\n    "@tailwindcss/postcss": {},${after}`
}

/**
 * Inject the Tailwind CSS Vite plugin into an existing vite config.
 * Adds the import at the top and the plugin in the plugins array.
 */
function injectViteTailwindPlugin(content: string): string | null {
  // Add import at top (after last import statement)
  const importLines = content.split('\n')
  let lastImportIndex = -1
  for (const [index, line] of importLines.entries()) {
    if (line.trimStart().startsWith('import ')) {
      lastImportIndex = index
    }
  }

  const importStatement = "import tailwindcss from '@tailwindcss/vite'"
  if (lastImportIndex >= 0) {
    importLines.splice(lastImportIndex + 1, 0, importStatement)
  } else {
    importLines.unshift(importStatement)
  }

  let updated = importLines.join('\n')

  // Add plugin to plugins array
  const pluginsMatch = updated.match(/plugins\s*:\s*\[/)
  if (!pluginsMatch || pluginsMatch.index === undefined) {
    return null
  }
  const insertPos = pluginsMatch.index + pluginsMatch[0].length
  const before = updated.slice(0, insertPos)
  const after = updated.slice(insertPos)
  updated = `${before}\n      tailwindcss(),${after}`

  return updated
}
