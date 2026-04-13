/**
 * A single step in a key sequence.
 */
export interface ISequenceStep {
  /** The key binding string for this step (e.g. 'ctrl+k', 'g', 'd') */
  binding: string
}

/**
 * Options for a sequence registration.
 */
export interface ISequenceOptions {
  /** Timeout in ms between steps. Default: 600 */
  timeout?: number
  /** Whether the sequence is active. Default: true */
  enabled?: boolean
}

/**
 * A sequence registration with steps, handler, and options.
 */
export interface ISequenceRegistration {
  /** Array of steps in order */
  steps: ISequenceStep[]
  /** Callback when full sequence is matched */
  handler: () => void
  /** Options for this sequence */
  options?: ISequenceOptions
}

/**
 * Handle returned after registering a sequence, used for cleanup.
 */
export interface ISequenceHandle {
  /** Unregister this sequence */
  unregister: () => void
}

/**
 * Current state of sequence matching.
 */
export interface ISequenceState {
  /** Steps completed so far */
  completedSteps: number
  /** Total steps in the current matching sequence */
  totalSteps: number
  /** Whether a sequence match is in progress */
  isMatching: boolean
}
