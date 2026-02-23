/**
 * State of the key recorder.
 */
export interface KeyRecorderState {
  /** Currently held key descriptors during recording */
  activeKeys: string[]
  /** The final recorded key binding string (canonical form), or null if nothing recorded */
  recorded: string | null
  /** Whether the recorder is actively listening */
  isRecording: boolean
}

/**
 * Options for KeyRecorder.
 */
export interface KeyRecorderOptions {
  /** Called when a new combination is recorded */
  onRecord?: (binding: string) => void
  /** Called when recording starts */
  onStart?: () => void
  /** Called when recording stops */
  onStop?: () => void
}

/**
 * Snapshot of currently pressed keys from KeyStateTracker.
 */
export interface KeyStateSnapshot {
  /** Set of currently pressed key descriptors */
  pressed: ReadonlySet<string>
  /** Whether any modifier is currently held */
  hasModifier: boolean
}
