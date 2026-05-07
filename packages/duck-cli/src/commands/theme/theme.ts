import { Command } from 'commander'
import { requireConfigValue } from '~/utils/require-config-value'
import { themeCommandConfig } from './theme.constants'
import { themeAddAction, themeInfoAction, themeListAction } from './theme.libs'

const { name, description, options } = themeCommandConfig
const jsonOption = requireConfigValue(options['option1'], 'missing theme command json option config')
const cssOption = requireConfigValue(options['option2'], 'missing theme command css option config')

/**
 * `duck-cli theme` — umbrella command with three subcommands:
 *
 * - `theme list`             list every theme available in the registry
 * - `theme info <name>`      print one theme's color tokens (--json supported)
 * - `theme add <name>`       inject the theme into your globals.css (--css path)
 */
export function themeCommand(): Command {
  const cmd = new Command(name).description(description)

  cmd
    .command('list')
    .description('list available themes from the registry')
    .option(jsonOption.flags, jsonOption.description, jsonOption.defaultValue)
    .action((opts) => themeListAction(opts))

  cmd
    .command('info')
    .description('show color tokens for a single theme')
    .argument('<name>', 'theme name (e.g. zinc)')
    .option(jsonOption.flags, jsonOption.description, jsonOption.defaultValue)
    .action((themeName, opts) => themeInfoAction(themeName, opts))

  cmd
    .command('add')
    .description('install a theme into your project globals.css')
    .argument('<name>', 'theme name (e.g. zinc)')
    .option(cssOption.flags, cssOption.description, cssOption.defaultValue)
    .action((themeName, opts) => themeAddAction(themeName, opts))

  return cmd
}
