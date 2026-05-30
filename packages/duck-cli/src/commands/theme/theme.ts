import { Command } from 'commander'
import { themeCommandConfig } from './theme.constants'
import { themeAddAction, themeInfoAction, themeListAction } from './theme.libs'

/** Umbrella command grouping `theme list`, `theme info <name>`, `theme add <name>`. */
export function themeCommand(): Command {
  const { name, description, options } = themeCommandConfig
  const { jsonOption, cssOption } = options

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
