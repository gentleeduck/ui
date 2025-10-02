export type templateCommandConfig = {
  name: string
  description: string
  options: Record<`option_${number}`, OptionType>
  argumentss: Record<
    `arg_${number}`,
    {
      name: string
      description: string
      defaultValue: string[]
    }
  >
}

export type OptionType = {
  flags: `-${string}, --${string}`
  description: string
  defaultValue: boolean | string
}
