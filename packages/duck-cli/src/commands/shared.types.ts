export type OptionType = {
  flags: `-${string}, --${string}`
  description: string
  defaultValue: boolean | string
}

export type ArgumentType = {
  name: string
  description: string
  defaultValue: string[]
}

/**
 * Command-config shape: keys are intent-named (e.g. `yesOption`, `cwdOption`, `componentsArg`)
 * so call sites stay self-documenting without a separate `requireConfigValue` lookup table.
 */
export type CommandConfig<OptionKey extends string = string, ArgumentKey extends string = string> = {
  name: string
  description: string
  options: Record<OptionKey, OptionType>
  arguments_: Record<ArgumentKey, ArgumentType>
}
