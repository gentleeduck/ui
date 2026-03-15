# CLI Command Authoring Pattern

All examples below are taken from the real `init` command.

## File Structure

```
packages/duck-cli/src/commands/{name}/
├── {name}.ts           # Commander command definition
├── {name}.libs.ts      # Action handler (async function)
├── {name}.dto.ts       # Zod schema for options and arguments
├── {name}.constants.ts # Command metadata (name, description, flags)
└── {name}.types.ts     # Re-exports CommandConfig from shared.types.ts
```

Plus the shared type definitions at `commands/shared.types.ts`:

```ts
export type OptionType = {
  flags: `-${string}, --${string}`
  description: string
  defaultValue: boolean | string
}

export type CommandConfig = {
  name: string
  description: string
  options: Record<`option_${number}`, OptionType>
  arguments_: Record<`arg_${number}`, { name: string; description: string; defaultValue: string[] }>
}
```

## Step-by-Step: Adding a New Command

1. Create `src/commands/{name}/` with the five files below.
2. Register in `src/main/main.ts` via `duck_ui.addCommand({name}_command())`.
3. Re-export from `src/commands/{name}/index.ts` (barrel file).
4. Run `bun run build && bun run test` to verify.
5. Update the snapshot: `bun run test -- -u` if the help output changed.

## {name}.types.ts

Re-exports the shared config type with a command-specific alias:

```ts
export type { CommandConfig as MyCommandConfig, OptionType } from '../shared.types'
```

## {name}.constants.ts -- Command Metadata

Real example from `init.constants.ts`:

```ts
import type { InitCommandConfig } from './init.types'

export const init_command_config: InitCommandConfig = {
  arguments_: {
    arg_1: {
      defaultValue: [],
      description:
        'names, url or local path to component to install when you do not provide this you will be directed to a list of the components to select from',
      name: '[components...]',
    },
  },
  description: 'init the project',
  name: 'init',
  options: {
    option_1: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    option_2: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
  },
}
```

Options use sequential keys (`option_1`, `option_2`, ...). Arguments use `arg_1`, `arg_2`, etc. Only common options (`-y`, `-c`) go in constants; command-specific options are added inline in the `.ts` file.

## {name}.dto.ts -- Zod Schema

Real example from `init.dto.ts`:

```ts
import { z } from 'zod'
import { BASE_COLORS, PROJECT_TYPE } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.constants'

export const init_options_schema = z.object({
  alias: z.string().optional(),
  all: z.boolean().default(false),
  baseColor: z.enum(BASE_COLORS).optional(),
  css: z.string().optional(),
  cssVariables: z.boolean().optional(),
  cwd: z.string().default(process.cwd()),
  monorepo: z.boolean().optional(),
  workspace: z.string().optional(),
  prefix: z.string().optional(),
  projectType: z.enum(PROJECT_TYPE).optional(),
  template: z.string().optional(),
  yes: z.boolean().default(false),
})

export const init_arguments_schema = z.array(z.string()).default([])

export type InitOptions = z.infer<typeof init_options_schema>
```

Key rules:
- Schema field names use camelCase (Commander auto-converts `--base-color` to `baseColor`).
- Arguments (positional) get their own schema separate from options.
- Every field defined as a Commander `.option()` must have a matching Zod field.

## {name}.ts -- Command Registration

Real example from `init.ts`:

```ts
import { Command } from 'commander'
import { require_config_value } from '~/utils/require-config-value'
import { init_command_config } from './init.constants'
import { init_command_action } from './init.libs'

const { name, description, options, arguments_ } = init_command_config
const option_1 = require_config_value(options.option_1, 'missing init command option_1 config')
const option_2 = require_config_value(options.option_2, 'missing init command option_2 config')
const arg_1 = require_config_value(arguments_.arg_1, 'missing init command arg_1 config')

export function init_command(): Command {
  const init_command = new Command(name)

  init_command
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .option('-p, --project-type <type>', 'project type (NEXT_JS, VITE, TANSTACK_START, UNKNOWN)')
    // ... additional inline options ...
    .action(init_command_action)

  return init_command
}
```

Key details:
- `require_config_value` validates that each config entry exists at module load time; throws immediately if missing.
- Common options (`-y`, `-c`) come from constants; command-specific options are added inline via `.option()`.
- `.argument()` is for positional args (e.g., `[components...]`); `.option()` is for flags.

## {name}.libs.ts -- Action Handler

Real example from `init.libs.ts` (simplified):

```ts
import { type InitOptions, init_arguments_schema, init_options_schema } from './init.dto'
import { print_banner } from '~/utils/banner'
import { spinner as Spinner } from '~/utils/spinner'
import { is_verbose } from '~/utils/verbose'

export async function init_command_action(args: string[], opt: InitOptions) {
  const options = init_options_schema.parse(opt)
  const component_names = init_arguments_schema.parse(args)

  print_banner()
  const spinner = Spinner('Initializing...').start()
  try {
    // ... implementation ...
    spinner.succeed('Done.')
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (is_verbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
```

Key details:
- Parse both options and arguments through Zod schemas immediately on entry.
- Call `print_banner()` before starting the spinner.
- The action handler signature is `(args: string[], opt: OptionsType)` when the command has `.argument()`; it is `(opt: OptionsType)` when the command has no positional arguments.
- Use `is_verbose()` to conditionally print stack traces in the catch block.
- Always `process.exit(0)` on success, `process.exit(1)` on failure.

## Registration in main.ts

After creating the command, register it in `src/main/main.ts`:

```ts
import { my_command } from '~/commands/{name}'
// ...
duck_ui.addCommand(my_command())
```

All six commands are registered in order: init, add, update, remove, diff, list.

## Adding a New Utility

To add a utility under `src/utils/`:

1. Create `src/utils/{name}/` with `{name}.ts` and `index.ts` (barrel).
2. Optionally add `{name}.constants.ts` and `{name}.types.ts`.
3. Export from `src/utils/index.ts` if the utility is used across commands.
4. For simple single-file utilities (like `spinner.ts`), place directly in `src/utils/`.

## Testing

Tests live in `src/__test__/` with three tiers:

- **unit/** -- isolated tests (command help snapshots, schemas, highlighter, verbose flag)
- **integration/** -- tests that hit registry or file system (get-registry, workspace, preflight)
- **e2e/** -- full command execution tests (init, add, update, remove, diff)

The snapshot test at `src/__test__/unit/command-help.test.ts` captures help output for all commands. When you add a new command or change flags, update the snapshot with `bun run test -- -u`.

## Conventions

- Zod for all option validation -- parse both options and arguments schemas
- ora spinner for progress feedback (spinner.start/succeed/fail/warn/info)
- kleur (via `highlighter` utility) for terminal colors
- execa for running shell commands
- fs-extra for file operations
- prompts for interactive questions (skip with `--yes`)
- `require_config_value` to validate constants at module load
