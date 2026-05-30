import type { CommandConfig } from '../shared.types'

export type DiffCommandConfig = CommandConfig<'cwdOption' | 'guiOption', 'componentsArg'>
export type { OptionType } from '../shared.types'
