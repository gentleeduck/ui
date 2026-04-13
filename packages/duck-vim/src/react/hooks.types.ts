import type { IKeyBindOptions } from '../command/command.types'
import type { IKeyRecorderState } from '../recorder/recorder.types'
import type { ISequenceOptions } from '../sequence/sequence.types'

/**
 * Options for the useKeyBind hook.
 */
export interface IKeyBindHookOptions extends Partial<IKeyBindOptions> {
  /** Optional ref to scope the key binding to a specific element */
  targetRef?: React.RefObject<HTMLElement | null>
}

/**
 * Options for the useKeySequence hook.
 */
export interface ISequenceHookOptions extends ISequenceOptions {
  /** Optional ref to scope the sequence listener to a specific element */
  targetRef?: React.RefObject<HTMLElement | null>
}

/**
 * Return type from useKeyRecorder.
 */
export interface IKeyRecorderReturn {
  state: IKeyRecorderState
  start: (target?: HTMLElement) => void
  stop: () => void
  reset: () => void
}
