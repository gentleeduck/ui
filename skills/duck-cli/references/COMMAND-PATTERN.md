# CLI Command Authoring Pattern

## File Structure

```
packages/duck-cli/src/commands/{name}/
├── {name}.ts           # Commander command definition
├── {name}.libs.ts      # Action handler (async function)
├── {name}.dto.ts       # Zod schema for options
└── {name}.constants.ts # Command metadata
```

## {name}.constants.ts

```ts
export const {name}_command_config = {
  name: '{name}',
  description: 'What this command does',
  options: {
    option_1: { flags: '-y, --yes', description: 'Skip prompts.', defaultValue: false },
    option_2: { flags: '-c, --cwd <cwd>', description: 'Working directory.', defaultValue: process.cwd() },
  },
  arguments_: {
    arg_1: { name: '[items...]', description: 'Items to process.', defaultValue: [] },
  },
}
```

## {name}.dto.ts

```ts
import { z } from 'zod'

export const {name}_options_schema = z.object({
  yes: z.boolean().default(false),
  cwd: z.string().default(process.cwd()),
})

export type {Name}Options = z.infer<typeof {name}_options_schema>
```

## {name}.ts — Command Registration

```ts
import { Command } from 'commander'
import { require_config_value } from '~/utils/require-config-value'
import { {name}_command_config } from './{name}.constants'
import { {name}_command_action } from './{name}.libs'

const { name, description, options, arguments_ } = {name}_command_config

export function {name}_command(): Command {
  const cmd = new Command(name)
  cmd
    .description(description)
    .option(options.option_1.flags, options.option_1.description, options.option_1.defaultValue)
    .action({name}_command_action)
  return cmd
}
```

## {name}.libs.ts — Action Handler

```ts
import { {name}_options_schema, type {Name}Options } from './{name}.dto'
import { print_banner } from '~/utils/banner'
import { spinner as Spinner } from '~/utils/spinner'

export async function {name}_command_action(args: string[], opt: {Name}Options) {
  const options = {name}_options_schema.parse(opt)
  print_banner()
  const spinner = Spinner('Processing...').start()
  try {
    // ... implementation
    spinner.succeed('Done.')
    process.exit(0)
  } catch (error) {
    spinner.fail(`Failed: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
```

## Conventions

- Zod for all option validation
- ora spinner for progress feedback
- kleur (via highlighter utility) for terminal colors
- execa for running shell commands
- fs-extra for file operations
- prompts for interactive questions (skip with --yes)
- Always parse options through the zod schema first
- Always use spinner.succeed/fail/warn for status
- Always process.exit(0) on success, process.exit(1) on failure
