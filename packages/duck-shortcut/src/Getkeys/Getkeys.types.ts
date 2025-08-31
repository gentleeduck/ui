export type Shortcuts = Shortcut[]

export type KeyCombination = string & { keyCombination: never }
export type KeySequence = string & { keySequence: never }
export type Shortcut = KeyCombination | KeySequence
