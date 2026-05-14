export namespace Parser {
  export interface IParsedKeyBind {
    /** The non-modifier key, lowercased (e.g. 's', 'space', 'enter') */
    key: string
    ctrl: boolean
    shift: boolean
    alt: boolean
    meta: boolean
    /** Active modifiers in canonical order */
    modifiers: Array<'ctrl' | 'alt' | 'meta' | 'shift'>
  }

  export interface IValidationResult {
    valid: boolean
    warnings: string[]
    errors: string[]
  }
}
