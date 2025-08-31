export type addCommandConfig = {
  name: string
  description: string
  options: Record<`option_${number}`, OptionType>
}

export type OptionType = {
  flags: `-${string}, --${string}`
  description: string
  defaultValue: boolean | string
}
