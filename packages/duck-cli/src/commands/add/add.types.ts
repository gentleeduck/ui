import type { CommandConfig } from '../shared.types'

export type AddCommandConfig = CommandConfig<'yesOption' | 'forceOption' | 'cwdOption', 'componentsArg'>
export type { OptionType } from '../shared.types'
