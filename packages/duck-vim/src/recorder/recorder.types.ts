export namespace Recorder {
  export interface IKeyRecorderState {
    /** Currently held key descriptors during recording */
    activeKeys: string[]
    /** Final recorded binding (canonical form), or null if none */
    recorded: string | null
    isRecording: boolean
  }

  export interface IKeyRecorderOptions {
    onRecord?: (binding: string) => void
    onStart?: () => void
    onStop?: () => void
  }

  export interface IKeyStateSnapshot {
    pressed: ReadonlySet<string>
    /** Whether any modifier is currently held */
    hasModifier: boolean
  }
}
