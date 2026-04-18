import { Command } from 'commander'
import { requireConfigValue } from '~/utils/require-config-value'
import { initCommandConfig } from './init.constants'
import { initCommandAction } from './init.libs'

const { name, description, options, arguments_ } = initCommandConfig
const option1 = requireConfigValue(options.option1, 'missing init command option1 config')
const option2 = requireConfigValue(options.option2, 'missing init command option2 config')
const arg1 = requireConfigValue(arguments_.arg1, 'missing init command arg1 config')

export function initCommand(): Command {
  const initCommand = new Command(name)

  initCommand
    .description(description)
    .argument(arg1.name, arg1.description, arg1.defaultValue)
    .option(option1.flags, option1.description, option1.defaultValue)
    .option(option2.flags, option2.description, option2.defaultValue)
    .option('-p, --project-type <type>', 'project type (NEXT_JS, VITE, TANSTACK_START, UNKNOWN)')
    .option(
      '-b, --base-color <color>',
      'base color theme (zinc, slate, stone, gray, neutral, red, rose, orange, green, blue, yellow, violet)',
    )
    .option('--alias <alias>', 'import alias (default: ~)')
    .option('--css <path>', 'CSS file path (default: ./src/styles.css)')
    .option('--css-variables', 'use CSS variables (default: true)')
    .option('--no-css-variables', 'do not use CSS variables')
    .option('--no-monorepo', 'force single-project mode even when monorepo signals are detected')
    .option('-w, --workspace <path>', 'workspace where components are installed (implies monorepo)')
    .option('--css-workspace <path>', 'workspace that owns the CSS file (defaults to --workspace; implies monorepo)')
    .option('--prefix <prefix>', 'Tailwind prefix')
    .option('-a, --all', 'install all available components', false)
    .option('-t, --template <name>', 'scaffold a project from a template (e.g., acme)')
    .action(initCommandAction)

  return initCommand
}
