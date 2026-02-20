import { describe, expect, it, vi } from 'vitest'
import { parseKeyBind } from '../../parser/parser'
import { createKeyBindHandler, createMultiKeyBindHandler, isInputElement, matchesKeyboardEvent } from '../matcher'

function createEvent(key: string, opts: Partial<KeyboardEventInit> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts })
}

describe('matcher', () => {
  describe('isInputElement', () => {
    it('returns true for text input', () => {
      const input = document.createElement('input')
      input.type = 'text'
      expect(isInputElement(input)).toBe(true)
    })

    it('returns false for button input', () => {
      const input = document.createElement('input')
      input.type = 'button'
      expect(isInputElement(input)).toBe(false)
    })

    it('returns false for submit input', () => {
      const input = document.createElement('input')
      input.type = 'submit'
      expect(isInputElement(input)).toBe(false)
    })

    it('returns true for textarea', () => {
      const textarea = document.createElement('textarea')
      expect(isInputElement(textarea)).toBe(true)
    })

    it('returns true for select', () => {
      const select = document.createElement('select')
      expect(isInputElement(select)).toBe(true)
    })

    it('returns true for contenteditable', () => {
      const div = document.createElement('div')
      div.contentEditable = 'true'
      expect(isInputElement(div)).toBe(true)
    })

    it('returns false for regular div', () => {
      const div = document.createElement('div')
      expect(isInputElement(div)).toBe(false)
    })

    it('returns false for null', () => {
      expect(isInputElement(null)).toBe(false)
    })
  })

  describe('matchesKeyboardEvent', () => {
    it('matches simple key', () => {
      const parsed = parseKeyBind('k')
      expect(matchesKeyboardEvent(parsed, createEvent('k'))).toBe(true)
    })

    it('does not match different key', () => {
      const parsed = parseKeyBind('k')
      expect(matchesKeyboardEvent(parsed, createEvent('j'))).toBe(false)
    })

    it('matches with ctrl modifier', () => {
      const parsed = parseKeyBind('ctrl+s')
      expect(matchesKeyboardEvent(parsed, createEvent('s', { ctrlKey: true }))).toBe(true)
    })

    it('fails when ctrl is required but not pressed', () => {
      const parsed = parseKeyBind('ctrl+s')
      expect(matchesKeyboardEvent(parsed, createEvent('s'))).toBe(false)
    })

    it('fails when extra modifier is pressed', () => {
      const parsed = parseKeyBind('ctrl+s')
      expect(matchesKeyboardEvent(parsed, createEvent('s', { ctrlKey: true, shiftKey: true }))).toBe(false)
    })

    it('matches case insensitively by default', () => {
      const parsed = parseKeyBind('s')
      expect(matchesKeyboardEvent(parsed, createEvent('S'))).toBe(true)
    })

    it('matches space key alias', () => {
      const parsed = parseKeyBind('space', 'linux')
      expect(matchesKeyboardEvent(parsed, createEvent(' '))).toBe(true)
    })

    it('matches escape key alias', () => {
      const parsed = parseKeyBind('esc', 'linux')
      expect(matchesKeyboardEvent(parsed, createEvent('Escape'))).toBe(true)
    })
  })

  describe('createKeyBindHandler', () => {
    it('calls handler on match', () => {
      const fn = vi.fn()
      const handler = createKeyBindHandler({ binding: 'ctrl+s', handler: fn })
      handler(createEvent('s', { ctrlKey: true }))
      expect(fn).toHaveBeenCalledOnce()
    })

    it('does not call handler on non-match', () => {
      const fn = vi.fn()
      const handler = createKeyBindHandler({ binding: 'ctrl+s', handler: fn })
      handler(createEvent('k'))
      expect(fn).not.toHaveBeenCalled()
    })

    it('skips when enabled is false', () => {
      const fn = vi.fn()
      const handler = createKeyBindHandler({
        binding: 'ctrl+s',
        handler: fn,
        options: { enabled: false },
      })
      handler(createEvent('s', { ctrlKey: true }))
      expect(fn).not.toHaveBeenCalled()
    })

    it('calls preventDefault when option set', () => {
      const fn = vi.fn()
      const handler = createKeyBindHandler({
        binding: 'ctrl+s',
        handler: fn,
        options: { preventDefault: true },
      })
      const event = createEvent('s', { ctrlKey: true })
      const spy = vi.spyOn(event, 'preventDefault')
      handler(event)
      expect(spy).toHaveBeenCalled()
    })

    it('calls stopPropagation when option set', () => {
      const fn = vi.fn()
      const handler = createKeyBindHandler({
        binding: 'ctrl+s',
        handler: fn,
        options: { stopPropagation: true },
      })
      const event = createEvent('s', { ctrlKey: true })
      const spy = vi.spyOn(event, 'stopPropagation')
      handler(event)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('createMultiKeyBindHandler', () => {
    it('dispatches to correct handler', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const handler = createMultiKeyBindHandler([
        { binding: 'ctrl+s', handler: fn1 },
        { binding: 'ctrl+k', handler: fn2 },
      ])

      handler(createEvent('k', { ctrlKey: true }))
      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).toHaveBeenCalledOnce()
    })

    it('first match wins', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const handler = createMultiKeyBindHandler([
        { binding: 'ctrl+s', handler: fn1 },
        { binding: 'ctrl+s', handler: fn2 },
      ])

      handler(createEvent('s', { ctrlKey: true }))
      expect(fn1).toHaveBeenCalledOnce()
      expect(fn2).not.toHaveBeenCalled()
    })
  })
})
