import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { printBanner } from '~/utils/banner'
import { getRegistryTheme, getRegistryThemesIndex } from '~/utils/get-registry'
import type { Registry } from '~/utils/get-registry/get-registry.dto'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { isVerbose } from '~/utils/verbose'
import { DEFAULT_GLOBALS_CANDIDATES, THEME_BLOCK_END, THEME_BLOCK_START } from './theme.constants'
import { type ThemeOptions, themeOptionsSchema } from './theme.dto'

export async function themeListAction(opts: ThemeOptions) {
  const options = themeOptionsSchema.parse(opts)

  printBanner()
  const spinner = Spinner('Fetching theme registry...').start()
  try {
    const themes = await getRegistryThemesIndex()
    if (!themes || themes.length === 0) {
      spinner.fail('No themes found in registry.')
      process.exit(1)
    }

    spinner.stop()

    if (options.json) {
      console.log(JSON.stringify(themes, null, 2))
    } else {
      console.log(`\nAvailable themes (${themes.length}):\n`)
      for (const theme of themes) {
        const label = theme.label ?? theme.name
        console.log(`  ${highlighter.info(theme.name)}  ${label}`)
      }
      console.log(`\nApply one with: ${highlighter.info('duck-cli theme add <name>')}\n`)
    }

    process.exit(0)
  } catch (error) {
    spinner.fail(`Failed to list themes: ${error instanceof Error ? error.message : String(error)}`)
    if (isVerbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

export async function themeInfoAction(name: string | undefined, opts: ThemeOptions) {
  const options = themeOptionsSchema.parse(opts)

  if (!name) {
    console.error(highlighter.error('Theme name required. Usage: duck-cli theme info <name>'))
    process.exit(1)
  }

  printBanner()
  const spinner = Spinner(`Fetching theme "${name}"...`).start()
  try {
    const theme = await getRegistryTheme(name)
    if (!theme) {
      spinner.fail(`Theme "${highlighter.info(name)}" not found in registry.`)
      process.exit(1)
    }

    spinner.stop()

    if (options.json) {
      console.log(JSON.stringify(theme, null, 2))
    } else {
      console.log(`\n${highlighter.info(theme.label ?? theme.name)} (${theme.name})\n`)
      console.log(highlighter.info('  light:'))
      for (const [key, value] of Object.entries(theme.light)) {
        console.log(`    --${key}: ${value}`)
      }
      console.log(highlighter.info('\n  dark:'))
      for (const [key, value] of Object.entries(theme.dark)) {
        console.log(`    --${key}: ${value}`)
      }
      console.log()
    }

    process.exit(0)
  } catch (error) {
    spinner.fail(`Failed to fetch theme: ${error instanceof Error ? error.message : String(error)}`)
    if (isVerbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

export async function themeAddAction(name: string | undefined, opts: ThemeOptions) {
  const options = themeOptionsSchema.parse(opts)

  if (!name) {
    console.error(highlighter.error('Theme name required. Usage: duck-cli theme add <name>'))
    process.exit(1)
  }

  printBanner()
  const spinner = Spinner(`Fetching theme "${name}"...`).start()
  try {
    const theme = await getRegistryTheme(name)
    if (!theme) {
      spinner.fail(`Theme "${highlighter.info(name)}" not found in registry.`)
      process.exit(1)
    }

    const cssPath = resolveCssPath(options.css)
    if (!cssPath) {
      spinner.fail(
        'Could not locate globals.css. Pass --css <path> or run inside a project with one of: ' +
          DEFAULT_GLOBALS_CANDIDATES.join(', '),
      )
      process.exit(1)
    }

    spinner.text = `Applying theme to ${cssPath}...`
    const block = renderThemeBlock(theme)
    const existing = await readFile(cssPath, 'utf8').catch(() => '')
    const next = mergeThemeBlock(existing, block)
    await writeFile(cssPath, next, 'utf8')

    spinner.succeed(`Applied theme ${highlighter.info(theme.name)} to ${cssPath}`)
    process.exit(0)
  } catch (error) {
    spinner.fail(`Failed to apply theme: ${error instanceof Error ? error.message : String(error)}`)
    if (isVerbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

/** Explicit `--css` short-circuits the auto-probe of `DEFAULT_GLOBALS_CANDIDATES`. */
export function resolveCssPath(explicit: string, cwd: string = process.cwd()): string | null {
  if (explicit) {
    const resolved = resolve(cwd, explicit)
    return existsSync(resolved) ? resolved : null
  }
  for (const candidate of DEFAULT_GLOBALS_CANDIDATES) {
    const resolved = resolve(cwd, candidate)
    if (existsSync(resolved)) return resolved
  }
  return null
}

/** Emits `:root` for `light` tokens and `.dark` for `dark` tokens, wrapped by the marker pair. */
export function renderThemeBlock(theme: Registry.Theme): string {
  const lightLines = Object.entries(theme.light)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n')
  const darkLines = Object.entries(theme.dark)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n')

  return [
    THEME_BLOCK_START,
    `/* theme: ${theme.name}${theme.label ? ` (${theme.label})` : ''} */`,
    ':root {',
    lightLines,
    '}',
    '',
    '.dark {',
    darkLines,
    '}',
    THEME_BLOCK_END,
  ].join('\n')
}

/** Idempotent: replaces a previously inserted block (between markers) or appends if absent. */
export function mergeThemeBlock(existing: string, block: string): string {
  const startIdx = existing.indexOf(THEME_BLOCK_START)
  const endIdx = existing.indexOf(THEME_BLOCK_END)
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = existing.slice(0, startIdx).replace(/\s*$/, '')
    const after = existing.slice(endIdx + THEME_BLOCK_END.length).replace(/^\s*/, '')
    const middle = before ? `${before}\n\n` : ''
    return `${middle}${block}${after ? `\n\n${after}` : '\n'}`
  }
  if (existing.trim()) {
    return `${existing.replace(/\s*$/, '')}\n\n${block}\n`
  }
  return `${block}\n`
}
