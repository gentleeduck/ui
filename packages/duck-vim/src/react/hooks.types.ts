import type { Command } from '../command/command.types'
import type { Recorder } from '../recorder/recorder.types'
import type { Sequence } from '../sequence/sequence.types'

export namespace ReactHooks {
  /**
   * Options for the useKeyBind hook.
   */
  export interface IKeyBindHookOptions extends Partial<Command.IKeyBindOptions> {
    /** Optional ref to scope the key binding to a specific element */
    targetRef?: React.RefObject<HTMLElement | null>
  }

  /**
   * Options for the useKeySequence hook.
   */
  export interface ISequenceHookOptions extends Sequence.ISequenceOptions {
    /** Optional ref to scope the sequence listener to a specific element */
    targetRef?: React.RefObject<HTMLElement | null>
  }

  /**
   * Return type from useKeyRecorder.
   */
  export interface IKeyRecorderReturn {
    state: Recorder.IKeyRecorderState
    start: (target?: HTMLElement) => void
    stop: () => void
    reset: () => void
  }
}
