export namespace Sequence {
  export interface ISequenceStep {
    /** Key binding for this step (e.g. 'ctrl+k', 'g', 'd') */
    binding: string
  }

  export interface ISequenceOptions {
    /** Timeout in ms between steps. Default: 600 */
    timeout?: number
    /** Whether the sequence is active. Default: true */
    enabled?: boolean
  }

  export interface ISequenceRegistration {
    steps: ISequenceStep[]
    handler: () => void
    options?: ISequenceOptions
  }

  export interface ISequenceHandle {
    unregister: () => void
  }

  export interface ISequenceState {
    completedSteps: number
    totalSteps: number
    isMatching: boolean
  }
}
