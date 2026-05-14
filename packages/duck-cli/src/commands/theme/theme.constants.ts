import type { ThemeCommandConfig } from './theme.types'

export const themeCommandConfig: ThemeCommandConfig = {
  arguments_: {
    arg1: {
      defaultValue: [],
      description: 'theme name',
      name: '[name]',
    },
  },
  description: 'manage theme tokens — list, add, or inspect available themes',
  name: 'theme',
  options: {
    option1: {
      defaultValue: false,
      description: 'output as JSON (list and info subcommands only)',
      flags: '-j, --json',
    },
    option2: {
      defaultValue: '',
      description: 'path to your global stylesheet (defaults to project globals.css)',
      flags: '-c, --css <path>',
    },
  },
}

/** Auto-probe order when `--css` is omitted; first match wins. */
export const DEFAULT_GLOBALS_CANDIDATES = [
  'app/globals.css',
  'src/app/globals.css',
  'src/index.css',
  'src/styles/globals.css',
  'styles/globals.css',
] as const

// Marker pair used by `mergeThemeBlock` to find and replace a previously injected theme.
export const THEME_BLOCK_START = '/* @gentleduck/cli theme:start */'
export const THEME_BLOCK_END = '/* @gentleduck/cli theme:end */'
