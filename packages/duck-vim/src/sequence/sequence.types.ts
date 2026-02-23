/**
 * A single step in a key sequence.
 */
export interface SequenceStep {
  /** The key binding string for this step (e.g. 'ctrl+k', 'g', 'd') */
  binding: string
}

/**
 * Options for a sequence registration.
 */
export interface SequenceOptions {
  /** Timeout in ms between steps. Default: 600 */
  timeout?: number
  /** Whether the sequence is active. Default: true */
  enabled?: boolean
}

/**
 * A sequence registration with steps, handler, and options.
 */
export interface SequenceRegistration {
  /** Array of steps in order */
  steps: SequenceStep[]
  /** Callback when full sequence is matched */
  handler: () => void
  /** Options for this sequence */
  options?: SequenceOptions
}

/**
 * Handle returned after registering a sequence, used for cleanup.
 */
export interface SequenceHandle {
  /** Unregister this sequence */
  unregister: () => void
}

/**
 * Current state of sequence matching.
 */
export interface SequenceState {
  /** Steps completed so far */
  completedSteps: number
  /** Total steps in the current matching sequence */
  totalSteps: number
  /** Whether a sequence match is in progress */
  isMatching: boolean
}
