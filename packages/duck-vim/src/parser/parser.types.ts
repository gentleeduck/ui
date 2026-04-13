/**
 * A parsed key binding broken down into its components.
 */
export interface IParsedKeyBind {
  /** The non-modifier key, lowercased (e.g. 's', 'space', 'enter') */
  key: string
  ctrl: boolean
  shift: boolean
  alt: boolean
  meta: boolean
  /** Sorted array of active modifier names */
  modifiers: Array<'ctrl' | 'alt' | 'meta' | 'shift'>
}

/**
 * Result of validating a key binding string.
 */
export interface IValidationResult {
  valid: boolean
  warnings: string[]
  errors: string[]
}
