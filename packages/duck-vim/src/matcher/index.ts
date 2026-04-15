import type { Matcher } from './matcher.types'

export { createKeyBindHandler, createMultiKeyBindHandler, isInputElement, matchesKeyboardEvent } from './matcher'
export type { Matcher } from './matcher.types'

export type IKeyBindHandlerConfig = Matcher.IKeyBindHandlerConfig
export type IMatchOptions = Matcher.IMatchOptions
export type ISingleKeyBindOptions = Matcher.ISingleKeyBindOptions
