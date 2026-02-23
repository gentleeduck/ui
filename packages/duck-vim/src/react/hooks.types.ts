import type { KeyBindOptions } from '../command/command.types'
import type { KeyRecorderState } from '../recorder/recorder.types'
import type { SequenceOptions } from '../sequence/sequence.types'

/**
 * Options for the useKeyBind hook.
 */
export interface KeyBindHookOptions extends Partial<KeyBindOptions> {
  /** Optional ref to scope the key binding to a specific element */
  targetRef?: React.RefObject<HTMLElement | null>
}

/**
 * Options for the useKeySequence hook.
 */
export interface SequenceHookOptions extends SequenceOptions {
  /** Optional ref to scope the sequence listener to a specific element */
  targetRef?: React.RefObject<HTMLElement | null>
}

/**
 * Return type from useKeyRecorder.
 */
export interface KeyRecorderReturn {
  state: KeyRecorderState
  start: (target?: HTMLElement) => void
  stop: () => void
  reset: () => void
}
