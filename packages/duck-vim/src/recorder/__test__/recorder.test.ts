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
