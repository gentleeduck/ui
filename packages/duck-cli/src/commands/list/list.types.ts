import type { CommandConfig } from '../shared.types'

export type ListCommandConfig = CommandConfig<'typeOption' | 'jsonOption', 'unusedArg'>
export type { OptionType } from '../shared.types'
