import { keyboardEventToDescriptor, MODIFIER_KEY_EVENT_NAMES_LOWER, MODIFIER_KEYS } from '../parser/parser'
import type { Recorder } from './recorder.types'

/** Narrows the `HTMLElement | Document` union to a `KeyboardEvent` listener. */
function addKeyListener(
  target: HTMLElement | Document,
  type: 'keydown' | 'keyup',
  listener: (e: KeyboardEvent) => void,
): void {
  target.addEventListener(type, listener as EventListener)
}

function removeKeyListener(
  target: HTMLElement | Document,
  type: 'keydown' | 'keyup',
  listener: (e: KeyboardEvent) => void,
): void {
  target.removeEventListener(type, listener as EventListener)
}

/** Records a key combination as a canonical binding string ("press to set shortcut" UIs). */
export class KeyRecorder {
  private options: Recorder.IKeyRecorderOptions
  private target: HTMLElement | Document | null = null
  private heldModifiers = new Set<string>()
  private currentKey: string | null = null
  private _recorded: string | null = null
  private _isRecording = false

  constructor(options?: Recorder.IKeyRecorderOptions) {
    this.options = options ?? {}
  }

  start(target: HTMLElement | Document = document): void {
    if (this._isRecording) return

    this.target = target
    this._isRecording = true
    this.heldModifiers.clear()
    this.currentKey = null
    // Each new recording session starts with a clean slate.
    this._recorded = null

    addKeyListener(target, 'keydown', this.onKeyDown)
    addKeyListener(target, 'keyup', this.onKeyUp)

    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.onBlur)
    }

    this.options.onStart?.()
  }

  stop(): void {
    if (!this._isRecording || !this.target) return

    removeKeyListener(this.target, 'keydown', this.onKeyDown)
    removeKeyListener(this.target, 'keyup', this.onKeyUp)

    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.onBlur)
    }

    this._isRecording = false
    this.heldModifiers.clear()
    this.currentKey = null
    this.target = null
    this.options.onStop?.()
  }

  getState(): Recorder.IKeyRecorderState {
    const activeKeys = [...this.heldModifiers]
    if (this.currentKey) activeKeys.push(this.currentKey)

    return {
      activeKeys,
      recorded: this._recorded,
      isRecording: this._isRecording,
    }
  }

  reset(): void {
    this._recorded = null
    this.heldModifiers.clear()
    this.currentKey = null
  }

  destroy(): void {
    this.stop()
    this._recorded = null
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    const lowerKey = e.key.toLowerCase()

    if (e.ctrlKey) this.heldModifiers.add('ctrl')
    if (e.altKey) this.heldModifiers.add('alt')
    if (e.metaKey) this.heldModifiers.add('meta')
    if (e.shiftKey) this.heldModifiers.add('shift')

    // Pure modifier press: just keep tracking, don't emit yet.
    if (MODIFIER_KEY_EVENT_NAMES_LOWER.has(lowerKey)) return

    // Reuse the canonical parser descriptor so the recorder's output compares
    // byte-equal with anything produced by parseKeyBind/normalizeKeyBind.
    const desc = keyboardEventToDescriptor(e)
    if (!desc) return

    // Track currentKey (parser-normalised) so getState() can report active keys.
    const parts = desc.split('+')
    this.currentKey = parts[parts.length - 1] ?? null

    this._recorded = desc
    this.options.onRecord?.(this._recorded)
  }

  private onKeyUp = (e: KeyboardEvent): void => {
    const key = e.key.toLowerCase()

    if (key === 'control' || key === 'ctrl') this.heldModifiers.delete('ctrl')
    if (key === 'alt') this.heldModifiers.delete('alt')
    if (key === 'meta') this.heldModifiers.delete('meta')
    if (key === 'shift') this.heldModifiers.delete('shift')

    if (!MODIFIER_KEY_EVENT_NAMES_LOWER.has(key)) {
      this.currentKey = null
    }
  }

  // Window blur can swallow keyup events, leaving modifiers "stuck" — clear them defensively.
  private onBlur = (): void => {
    this.heldModifiers.clear()
    this.currentKey = null
  }
}

export class KeyStateTracker {
  private pressed = new Set<string>()
  private target: HTMLElement | Document | null = null

  attach(target: HTMLElement | Document = document): void {
    this.target = target
    addKeyListener(target, 'keydown', this.onKeyDown)
    addKeyListener(target, 'keyup', this.onKeyUp)

    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.onBlur)
    }
  }

  detach(): void {
    if (!this.target) return

    removeKeyListener(this.target, 'keydown', this.onKeyDown)
    removeKeyListener(this.target, 'keyup', this.onKeyUp)

    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.onBlur)
    }

    this.pressed.clear()
    this.target = null
  }

  getSnapshot(): Recorder.IKeyStateSnapshot {
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

  isKeyPressed(key: string): boolean {
    return this.pressed.has(key.toLowerCase())
  }

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
