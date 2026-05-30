import { Command } from 'commander'
import { initCommandConfig } from './init.constants'
import { initCommandAction } from './init.libs'

export function initCommand(): Command {
  const { name, description, options, arguments_ } = initCommandConfig
  const { yesOption, cwdOption } = options
  const { componentsArg } = arguments_

  const initCommand = new Command(name)

  initCommand
    .description(description)
    .argument(componentsArg.name, componentsArg.description, componentsArg.defaultValue)
    .option(yesOption.flags, yesOption.description, yesOption.defaultValue)
    .option(cwdOption.flags, cwdOption.description, cwdOption.defaultValue)
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
