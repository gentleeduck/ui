import { afterEach, describe, expect, it, vi } from 'vitest'
import { KeyRecorder, KeyStateTracker } from '../recorder'

function createKeyEvent(type: 'keydown' | 'keyup', key: string, opts: Partial<KeyboardEventInit> = {}): KeyboardEvent {
  return new KeyboardEvent(type, { key, bubbles: true, cancelable: true, ...opts })
}

describe('KeyRecorder', () => {
  let recorder: KeyRecorder
  let target: HTMLElement

  afterEach(() => {
    recorder?.destroy()
    if (target?.parentNode) target.parentNode.removeChild(target)
  })

  it('records a simple key press', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k'))

    expect(onRecord).toHaveBeenCalledWith('k')
    expect(recorder.getState().recorded).toBe('k')
  })

  it('records a modifier + key combination', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 's', { ctrlKey: true, shiftKey: true }))

    expect(onRecord).toHaveBeenCalledWith('ctrl+shift+s')
  })

  it('ignores pure modifier presses', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'Control', { ctrlKey: true }))

    expect(onRecord).not.toHaveBeenCalled()
  })

  it('calls onStart and onStop callbacks', () => {
    const onStart = vi.fn()
    const onStop = vi.fn()
    recorder = new KeyRecorder({ onStart, onStop })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    expect(onStart).toHaveBeenCalledOnce()

    recorder.stop()
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('resets recorded state', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k'))
    expect(recorder.getState().recorded).toBe('k')

    recorder.reset()
    expect(recorder.getState().recorded).toBe(null)
  })

  it('reports isRecording state', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    expect(recorder.getState().isRecording).toBe(false)
    recorder.start(target)
    expect(recorder.getState().isRecording).toBe(true)
    recorder.stop()
    expect(recorder.getState().isRecording).toBe(false)
  })

  it('normalizes space key', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', ' '))

    expect(onRecord).toHaveBeenCalledWith('space')
  })
})

describe('KeyStateTracker', () => {
  let tracker: KeyStateTracker
  let target: HTMLElement

  afterEach(() => {
    tracker?.destroy()
    if (target?.parentNode) target.parentNode.removeChild(target)
  })

  it('tracks pressed keys', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))

    expect(tracker.isKeyPressed('a')).toBe(true)
    expect(tracker.isKeyPressed('b')).toBe(false)
  })

  it('removes keys on keyup', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))
    expect(tracker.isKeyPressed('a')).toBe(true)

    target.dispatchEvent(createKeyEvent('keyup', 'a'))
    expect(tracker.isKeyPressed('a')).toBe(false)
  })

  it('returns snapshot', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))
    target.dispatchEvent(createKeyEvent('keydown', 'b'))

    const snapshot = tracker.getSnapshot()
    expect(snapshot.pressed.size).toBe(2)
    expect(snapshot.pressed.has('a')).toBe(true)
    expect(snapshot.pressed.has('b')).toBe(true)
  })

  it('detects modifier in snapshot', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'ctrl'))

    expect(tracker.getSnapshot().hasModifier).toBe(true)
  })

  it('clears on detach', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))
    tracker.detach()

    expect(tracker.isKeyPressed('a')).toBe(false)
  })
})

describe('KeyRecorder - edge cases', () => {
  let recorder: KeyRecorder
  let target: HTMLElement

  afterEach(() => {
    recorder?.destroy()
    if (target?.parentNode) target.parentNode.removeChild(target)
  })

  it('start is idempotent when already recording', () => {
    const onStart = vi.fn()
    recorder = new KeyRecorder({ onStart })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    recorder.start(target) // second call should be a no-op
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('stop is a no-op when not recording', () => {
    const onStop = vi.fn()
    recorder = new KeyRecorder({ onStop })
    recorder.stop()
    expect(onStop).not.toHaveBeenCalled()
  })

  it('destroy stops recording and clears recorded', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k'))
    expect(recorder.getState().recorded).toBe('k')

    recorder.destroy()
    expect(recorder.getState().isRecording).toBe(false)
    expect(recorder.getState().recorded).toBe(null)
  })

  it('records escape key as esc', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'Escape'))
    expect(onRecord).toHaveBeenCalledWith('esc')
  })

  it('records with all four modifiers', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(
      createKeyEvent('keydown', 'k', { ctrlKey: true, altKey: true, metaKey: true, shiftKey: true }),
    )
    expect(onRecord).toHaveBeenCalledWith('alt+ctrl+meta+shift+k')
  })

  it('records alt+key combination', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k', { altKey: true }))
    expect(onRecord).toHaveBeenCalledWith('alt+k')
  })

  it('records meta+key combination', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k', { metaKey: true }))
    expect(onRecord).toHaveBeenCalledWith('meta+k')
  })

  it('ignores all pure modifier key presses (Shift, Control, Alt, Meta)', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'Shift', { shiftKey: true }))
    target.dispatchEvent(createKeyEvent('keydown', 'Alt', { altKey: true }))
    target.dispatchEvent(createKeyEvent('keydown', 'Meta', { metaKey: true }))
    expect(onRecord).not.toHaveBeenCalled()
  })

  it('keyup clears modifier tracking', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k', { ctrlKey: true }))
    expect(recorder.getState().recorded).toBe('ctrl+k')

    // Release ctrl
    target.dispatchEvent(createKeyEvent('keyup', 'Control'))
    // Release k
    target.dispatchEvent(createKeyEvent('keyup', 'k'))

    // activeKeys should be empty after releases
    expect(recorder.getState().activeKeys).toEqual([])
  })

  it('keyup of non-modifier clears currentKey', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k'))
    expect(recorder.getState().activeKeys).toContain('k')

    target.dispatchEvent(createKeyEvent('keyup', 'k'))
    expect(recorder.getState().activeKeys).not.toContain('k')
  })

  it('keyup for alt modifier clears it', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k', { altKey: true }))
    target.dispatchEvent(createKeyEvent('keyup', 'Alt'))
    target.dispatchEvent(createKeyEvent('keyup', 'k'))
    expect(recorder.getState().activeKeys).toEqual([])
  })

  it('keyup for meta modifier clears it', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k', { metaKey: true }))
    target.dispatchEvent(createKeyEvent('keyup', 'Meta'))
    target.dispatchEvent(createKeyEvent('keyup', 'k'))
    expect(recorder.getState().activeKeys).toEqual([])
  })

  it('keyup for shift modifier clears it', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k', { shiftKey: true }))
    target.dispatchEvent(createKeyEvent('keyup', 'Shift'))
    target.dispatchEvent(createKeyEvent('keyup', 'k'))
    expect(recorder.getState().activeKeys).toEqual([])
  })

  it('records F-keys', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'F1'))
    expect(onRecord).toHaveBeenCalledWith('f1')
  })

  it('records Tab key', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'Tab'))
    expect(onRecord).toHaveBeenCalledWith('tab')
  })

  it('records Backspace key', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'Backspace'))
    expect(onRecord).toHaveBeenCalledWith('backspace')
  })

  it('records Delete key', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'Delete'))
    expect(onRecord).toHaveBeenCalledWith('delete')
  })

  it('records Enter key', () => {
    const onRecord = vi.fn()
    recorder = new KeyRecorder({ onRecord })
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'Enter'))
    expect(onRecord).toHaveBeenCalledWith('enter')
  })

  it('constructor works with no options', () => {
    recorder = new KeyRecorder()
    expect(recorder.getState().isRecording).toBe(false)
    expect(recorder.getState().recorded).toBe(null)
    expect(recorder.getState().activeKeys).toEqual([])
  })

  it('reset clears recorded but does not stop recording', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    target.dispatchEvent(createKeyEvent('keydown', 'k'))
    expect(recorder.getState().recorded).toBe('k')

    recorder.reset()
    expect(recorder.getState().recorded).toBe(null)
    expect(recorder.getState().isRecording).toBe(true)
  })

  it('preventDefault and stopPropagation are called on keydown', () => {
    recorder = new KeyRecorder()
    target = document.createElement('div')
    document.body.appendChild(target)

    recorder.start(target)
    const event = createKeyEvent('keydown', 'k')
    const pdSpy = vi.spyOn(event, 'preventDefault')
    const spSpy = vi.spyOn(event, 'stopPropagation')
    target.dispatchEvent(event)
    expect(pdSpy).toHaveBeenCalled()
    expect(spSpy).toHaveBeenCalled()
  })
})

describe('KeyStateTracker - edge cases', () => {
  let tracker: KeyStateTracker
  let target: HTMLElement

  afterEach(() => {
    tracker?.destroy()
    if (target?.parentNode) target.parentNode.removeChild(target)
  })

  it('isKeyPressed is case-insensitive', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'A'))
    expect(tracker.isKeyPressed('a')).toBe(true)
    expect(tracker.isKeyPressed('A')).toBe(true)
  })

  it('tracks multiple simultaneous keys', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))
    target.dispatchEvent(createKeyEvent('keydown', 'b'))
    target.dispatchEvent(createKeyEvent('keydown', 'c'))

    expect(tracker.isKeyPressed('a')).toBe(true)
    expect(tracker.isKeyPressed('b')).toBe(true)
    expect(tracker.isKeyPressed('c')).toBe(true)
    expect(tracker.getSnapshot().pressed.size).toBe(3)
  })

  it('keyup only removes the released key', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))
    target.dispatchEvent(createKeyEvent('keydown', 'b'))
    target.dispatchEvent(createKeyEvent('keyup', 'a'))

    expect(tracker.isKeyPressed('a')).toBe(false)
    expect(tracker.isKeyPressed('b')).toBe(true)
  })

  it('hasModifier is false when only non-modifier keys pressed', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))
    expect(tracker.getSnapshot().hasModifier).toBe(false)
  })

  it('detects alt as modifier', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'alt'))
    expect(tracker.getSnapshot().hasModifier).toBe(true)
  })

  it('detects shift as modifier', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'shift'))
    expect(tracker.getSnapshot().hasModifier).toBe(true)
  })

  it('detects meta as modifier', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'meta'))
    expect(tracker.getSnapshot().hasModifier).toBe(true)
  })

  it('getSnapshot returns a copy of pressed keys', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))

    const snapshot1 = tracker.getSnapshot()
    target.dispatchEvent(createKeyEvent('keydown', 'b'))
    const snapshot2 = tracker.getSnapshot()

    // snapshot1 should not reflect the later 'b' press
    expect(snapshot1.pressed.size).toBe(1)
    expect(snapshot2.pressed.size).toBe(2)
  })

  it('destroy calls detach', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'a'))
    tracker.destroy()
    expect(tracker.isKeyPressed('a')).toBe(false)
  })

  it('detach when no target is a no-op', () => {
    tracker = new KeyStateTracker()
    expect(() => tracker.detach()).not.toThrow()
  })

  it('isKeyPressed returns false when nothing pressed', () => {
    tracker = new KeyStateTracker()
    expect(tracker.isKeyPressed('a')).toBe(false)
  })

  it('getSnapshot returns empty set when nothing pressed', () => {
    tracker = new KeyStateTracker()
    const snapshot = tracker.getSnapshot()
    expect(snapshot.pressed.size).toBe(0)
    expect(snapshot.hasModifier).toBe(false)
  })

  it('tracks special keys (F1, Tab, Backspace, etc.)', () => {
    tracker = new KeyStateTracker()
    target = document.createElement('div')
    document.body.appendChild(target)

    tracker.attach(target)
    target.dispatchEvent(createKeyEvent('keydown', 'F1'))
    expect(tracker.isKeyPressed('f1')).toBe(true)

    target.dispatchEvent(createKeyEvent('keyup', 'F1'))
    expect(tracker.isKeyPressed('f1')).toBe(false)

    target.dispatchEvent(createKeyEvent('keydown', 'Tab'))
    expect(tracker.isKeyPressed('tab')).toBe(true)
  })
})
