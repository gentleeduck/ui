export interface IMatchOptions {
  /** Ignore case when comparing the non-modifier key. Default: true */
  ignoreCase?: boolean
}

export interface ISingleKeyBindOptions {
  /** Whether this handler is active. Default: true */
  enabled?: boolean
  /** Call event.preventDefault() on match. Default: false */
  preventDefault?: boolean
  /** Call event.stopPropagation() on match. Default: false */
  stopPropagation?: boolean
  /** Skip if event target is an input element. Default: false */
  ignoreInputs?: boolean
}

export interface IKeyBindHandlerConfig {
  /** The key binding string (e.g. 'ctrl+s', 'Mod+Shift+Z') */
  binding: string
  /** The handler to call when the key binding matches */
  handler: (event: KeyboardEvent) => void
  /** Options for this handler */
  options?: ISingleKeyBindOptions
}
