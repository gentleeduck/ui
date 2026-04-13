import { MODIFIER_KEYS } from '../parser/parser'
import type { IKeyRecorderOptions, IKeyRecorderState, IKeyStateSnapshot } from './recorder.types'

/**
 * Records key combinations for settings UIs.
 *
 * Attach to an element, press keys, and the recorder captures
 * the full key combination (modifiers + key) as a canonical string.
 *
 * @example
 * const recorder = new KeyRecorder({
 *   onRecord: (binding) => console.log('Recorded:', binding),
 * })
 * recorder.start(document)
 * // User presses Ctrl+Shift+K
 * // onRecord called with 'ctrl+shift+k'
 * recorder.stop()
 */
export class KeyRecorder {
  private options: IKeyRecorderOptions
  private target: HTMLElement | Document | null = null
  private heldModifiers = new Set<string>()
  private currentKey: string | null = null
  private _recorded: string | null = null
  private _isRecording = false

  constructor(options?: IKeyRecorderOptions) {
    this.options = options ?? {}
  }

  /**
   * Start recording key combinations.
   */
  start(target: HTMLElement | Document = document): void {
    if (this._isRecording) return

    this.target = target
    this._isRecording = true
    this.heldModifiers.clear()
    this.currentKey = null

    target.addEventListener('keydown', this.onKeyDown as EventListener)
    target.addEventListener('keyup', this.onKeyUp as EventListener)

    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.onBlur)
    }

    this.options.onStart?.()
  }

  /**
   * Stop recording.
   */
  stop(): void {
    if (!this._isRecording || !this.target) return

    this.target.removeEventListener('keydown', this.onKeyDown as EventListener)
    this.target.removeEventListener('keyup', this.onKeyUp as EventListener)

    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.onBlur)
    }

    this._isRecording = false
    this.heldModifiers.clear()
    this.currentKey = null
    this.target = null
    this.options.onStop?.()
  }

  /**
   * Get the current recorder state.
   */
  getState(): IKeyRecorderState {
    const activeKeys = [...this.heldModifiers]
    if (this.currentKey) activeKeys.push(this.currentKey)

    return {
      activeKeys,
      recorded: this._recorded,
      isRecording: this._isRecording,
    }
  }

  /**
   * Clear the recorded key binding.
   */
  reset(): void {
    this._recorded = null
    this.heldModifiers.clear()
    this.currentKey = null
  }

  /**
   * Stop and clean up all resources.
   */
  destroy(): void {
    this.stop()
    this._recorded = null
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    const key = e.key.toLowerCase()

    // Track modifiers
    if (e.ctrlKey) this.heldModifiers.add('ctrl')
    if (e.altKey) this.heldModifiers.add('alt')
    if (e.metaKey) this.heldModifiers.add('meta')
    if (e.shiftKey) this.heldModifiers.add('shift')

    // If it's a pure modifier press, just track it
    if (['shift', 'control', 'alt', 'meta'].includes(key)) return

    // Non-modifier key pressed -- build the key binding string
    this.currentKey = key === ' ' ? 'space' : key === 'escape' ? 'esc' : key

    const parts: string[] = []
    // Use alphabetical modifier order
    for (const mod of ['alt', 'ctrl', 'meta', 'shift'] as const) {
      if (this.heldModifiers.has(mod)) parts.push(mod)
    }
    parts.push(this.currentKey)

    this._recorded = parts.join('+')
    this.options.onRecord?.(this._recorded)
  }

  private onKeyUp = (e: KeyboardEvent): void => {
    const key = e.key.toLowerCase()

    if (key === 'control' || key === 'ctrl') this.heldModifiers.delete('ctrl')
    if (key === 'alt') this.heldModifiers.delete('alt')
    if (key === 'meta') this.heldModifiers.delete('meta')
    if (key === 'shift') this.heldModifiers.delete('shift')

    // Clear current non-modifier key on release
    if (!['shift', 'control', 'alt', 'meta'].includes(key)) {
      this.currentKey = null
    }
  }

  private onBlur = (): void => {
    // Reset held keys when window loses focus to avoid stuck keys
    this.heldModifiers.clear()
    this.currentKey = null
  }
}

/**
 * Tracks which keys are currently pressed.
 *
 * Simpler than KeyRecorder -- just real-time key state tracking
 * without recording logic.
 */
export class KeyStateTracker {
  private pressed = new Set<string>()
  private target: HTMLElement | Document | null = null

  /**
   * Start tracking key state on the given target.
   */
  attach(target: HTMLElement | Document = document): void {
    this.target = target
    target.addEventListener('keydown', this.onKeyDown as EventListener)
    target.addEventListener('keyup', this.onKeyUp as EventListener)

    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.onBlur)
    }
  }

  /**
   * Stop tracking.
   */
  detach(): void {
    if (!this.target) return

    this.target.removeEventListener('keydown', this.onKeyDown as EventListener)
    this.target.removeEventListener('keyup', this.onKeyUp as EventListener)

    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.onBlur)
    }

    this.pressed.clear()
    this.target = null
  }

  /**
   * Get a snapshot of currently pressed keys.
   */
  getSnapshot(): IKeyStateSnapshot {
    let hasModifier = false
    for (const key of this.pressed) {
      if (MODIFIER_KEYS.has(key)) {
        hasModifier = true
        break
      }
    }

    return {
      pressed: new Set(this.pressed),
      hasModifier,
    }
  }

  /**
   * Check if a specific key is currently pressed.
   */
  isKeyPressed(key: string): boolean {
    return this.pressed.has(key.toLowerCase())
  }

  /**
   * Stop tracking and clean up.
   */
  destroy(): void {
    this.detach()
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    this.pressed.add(e.key.toLowerCase())
  }

  private onKeyUp = (e: KeyboardEvent): void => {
    this.pressed.delete(e.key.toLowerCase())
  }

  private onBlur = (): void => {
    this.pressed.clear()
  }
}
