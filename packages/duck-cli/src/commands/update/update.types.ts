import type { CommandConfig } from '../shared.types'

export type UpdateCommandConfig = CommandConfig<'allOption' | 'yesOption' | 'cwdOption', 'componentsArg'>
export type { OptionType } from '../shared.types'
