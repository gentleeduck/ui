import type { Parser } from './parser.types'

export {
  KEY_ALIASES,
  keyboardEventToDescriptor,
  MODIFIER_KEYS,
  normalizeKeyBind,
  parseKeyBind,
  validateKeyBind,
} from './parser'
export type { Parser } from './parser.types'

export type IParsedKeyBind = Parser.IParsedKeyBind
export type IValidationResult = Parser.IValidationResult
