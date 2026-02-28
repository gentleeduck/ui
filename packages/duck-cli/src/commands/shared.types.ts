export type OptionType = {
  flags: `-${string}, --${string}`
  description: string
  defaultValue: boolean | string
}

export type CommandConfig = {
  name: string
  description: string
  options: Record<`option_${number}`, OptionType>
  arguments_: Record<
    `arg_${number}`,
    {
      name: string
      description: string
      defaultValue: string[]
    }
  >
}
