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

  describe('isInputElement - edge cases', () => {
    it('returns true for password input', () => {
      const input = document.createElement('input')
      input.type = 'password'
      expect(isInputElement(input)).toBe(true)
    })

    it('returns true for email input', () => {
      const input = document.createElement('input')
      input.type = 'email'
      expect(isInputElement(input)).toBe(true)
    })

    it('returns true for number input', () => {
      const input = document.createElement('input')
      input.type = 'number'
      expect(isInputElement(input)).toBe(true)
    })

    it('returns true for search input', () => {
      const input = document.createElement('input')
      input.type = 'search'
      expect(isInputElement(input)).toBe(true)
    })

    it('returns true for tel input', () => {
      const input = document.createElement('input')
      input.type = 'tel'
      expect(isInputElement(input)).toBe(true)
    })

    it('returns true for url input', () => {
      const input = document.createElement('input')
      input.type = 'url'
      expect(isInputElement(input)).toBe(true)
    })

    it('returns false for reset input', () => {
      const input = document.createElement('input')
      input.type = 'reset'
      expect(isInputElement(input)).toBe(false)
    })

    it('returns true for input with no explicit type (defaults to text)', () => {
      const input = document.createElement('input')
      expect(isInputElement(input)).toBe(true)
    })

    it('returns false for checkbox input', () => {
      // checkbox is not in BUTTON_INPUT_TYPES, but it IS an INPUT tag
      // so it returns true because only button/submit/reset are excluded
      const input = document.createElement('input')
      input.type = 'checkbox'
      expect(isInputElement(input)).toBe(true)
    })

    it('returns false for span element', () => {
      const span = document.createElement('span')
      expect(isInputElement(span)).toBe(false)
    })

    it('returns false for button element', () => {
      const button = document.createElement('button')
      expect(isInputElement(button)).toBe(false)
    })

    it('returns true for contenteditable set via property', () => {
      const div = document.createElement('div')
      div.contentEditable = 'true'
      expect(isInputElement(div)).toBe(true)
    })

    it('returns false for contenteditable=false', () => {
      const div = document.createElement('div')
      div.contentEditable = 'false'
      expect(isInputElement(div)).toBe(false)
    })
  })

  describe('matchesKeyboardEvent - edge cases', () => {
    it('does not match when alt is required but not pressed', () => {
      const parsed = parseKeyBind('alt+k')
      expect(matchesKeyboardEvent(parsed, createEvent('k'))).toBe(false)
    })

    it('does not match when meta is required but not pressed', () => {
      const parsed = parseKeyBind('meta+k')
      expect(matchesKeyboardEvent(parsed, createEvent('k'))).toBe(false)
    })

    it('does not match when shift is required but not pressed', () => {
      const parsed = parseKeyBind('shift+k')
      expect(matchesKeyboardEvent(parsed, createEvent('k'))).toBe(false)
    })

    it('fails when extra alt modifier is pressed', () => {
      const parsed = parseKeyBind('ctrl+s')
      expect(matchesKeyboardEvent(parsed, createEvent('s', { ctrlKey: true, altKey: true }))).toBe(false)
    })

    it('fails when extra meta modifier is pressed', () => {
      const parsed = parseKeyBind('ctrl+s')
      expect(matchesKeyboardEvent(parsed, createEvent('s', { ctrlKey: true, metaKey: true }))).toBe(false)
    })

    it('matches case sensitively when ignoreCase is false', () => {
      const parsed = parseKeyBind('s')
      // parsed.key is lowercase 's'; event key is uppercase 'S'
      expect(matchesKeyboardEvent(parsed, createEvent('S'), { ignoreCase: false })).toBe(false)
    })

    it('matches case sensitively for exact match', () => {
      const parsed = parseKeyBind('s')
      expect(matchesKeyboardEvent(parsed, createEvent('s'), { ignoreCase: false })).toBe(true)
    })

    it('matches F-key bindings', () => {
      const parsed = parseKeyBind('f1')
      expect(matchesKeyboardEvent(parsed, createEvent('F1'))).toBe(true)
    })

    it('matches F12 with modifier', () => {
      const parsed = parseKeyBind('ctrl+f12')
      expect(matchesKeyboardEvent(parsed, createEvent('F12', { ctrlKey: true }))).toBe(true)
    })

    it('matches Tab key', () => {
      const parsed = parseKeyBind('tab')
      expect(matchesKeyboardEvent(parsed, createEvent('Tab'))).toBe(true)
    })

    it('matches Backspace key', () => {
      const parsed = parseKeyBind('backspace')
      expect(matchesKeyboardEvent(parsed, createEvent('Backspace'))).toBe(true)
    })

    it('matches Delete key', () => {
      const parsed = parseKeyBind('delete')
      expect(matchesKeyboardEvent(parsed, createEvent('Delete'))).toBe(true)
    })

    it('matches Enter key', () => {
      const parsed = parseKeyBind('enter')
      expect(matchesKeyboardEvent(parsed, createEvent('Enter'))).toBe(true)
    })

    it('matches all four modifiers at once', () => {
      const parsed = parseKeyBind('ctrl+shift+alt+meta+s')
      const event = createEvent('s', { ctrlKey: true, shiftKey: true, altKey: true, metaKey: true })
      expect(matchesKeyboardEvent(parsed, event)).toBe(true)
    })

    it('fails when all four modifiers expected but one missing', () => {
      const parsed = parseKeyBind('ctrl+shift+alt+meta+s')
      const event = createEvent('s', { ctrlKey: true, shiftKey: true, altKey: true })
      expect(matchesKeyboardEvent(parsed, event)).toBe(false)
    })

    it('matches digit keys', () => {
      const parsed = parseKeyBind('ctrl+1')
      expect(matchesKeyboardEvent(parsed, createEvent('1', { ctrlKey: true }))).toBe(true)
    })
  })

  describe('createKeyBindHandler - edge cases', () => {
    it('skips when ignoreInputs is set and target is input', () => {
      const fn = vi.fn()
      const input = document.createElement('input')
      input.type = 'text'
      const handler = createKeyBindHandler({
        binding: 'ctrl+s',
        handler: fn,
        options: { ignoreInputs: true },
      })
      const event = createEvent('s', { ctrlKey: true })
      Object.defineProperty(event, 'target', { value: input })
      handler(event)
      expect(fn).not.toHaveBeenCalled()
    })

    it('does not skip when ignoreInputs is set and target is div', () => {
      const fn = vi.fn()
      const handler = createKeyBindHandler({
        binding: 'ctrl+s',
        handler: fn,
        options: { ignoreInputs: true },
      })
      const event = createEvent('s', { ctrlKey: true })
      handler(event)
      expect(fn).toHaveBeenCalledOnce()
    })

    it('passes the event object to the handler', () => {
      const fn = vi.fn()
      const handler = createKeyBindHandler({ binding: 'k', handler: fn })
      const event = createEvent('k')
      handler(event)
      expect(fn).toHaveBeenCalledWith(event)
    })

    it('handles both preventDefault and stopPropagation together', () => {
      const fn = vi.fn()
      const handler = createKeyBindHandler({
        binding: 'ctrl+s',
        handler: fn,
        options: { preventDefault: true, stopPropagation: true },
      })
      const event = createEvent('s', { ctrlKey: true })
      const pdSpy = vi.spyOn(event, 'preventDefault')
      const spSpy = vi.spyOn(event, 'stopPropagation')
      handler(event)
      expect(pdSpy).toHaveBeenCalled()
      expect(spSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })
  })

  describe('createMultiKeyBindHandler - edge cases', () => {
    it('no handler is called when no binding matches', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const handler = createMultiKeyBindHandler([
        { binding: 'ctrl+s', handler: fn1 },
        { binding: 'ctrl+k', handler: fn2 },
      ])
      handler(createEvent('x'))
      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()
    })

    it('skips disabled entries and matches next', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const handler = createMultiKeyBindHandler([
        { binding: 'ctrl+s', handler: fn1, options: { enabled: false } },
        { binding: 'ctrl+s', handler: fn2 },
      ])
      handler(createEvent('s', { ctrlKey: true }))
      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).toHaveBeenCalledOnce()
    })

    it('skips entries with ignoreInputs when target is input', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const input = document.createElement('input')
      input.type = 'text'
      const handler = createMultiKeyBindHandler([
        { binding: 'ctrl+s', handler: fn1, options: { ignoreInputs: true } },
        { binding: 'ctrl+s', handler: fn2 },
      ])
      const event = createEvent('s', { ctrlKey: true })
      Object.defineProperty(event, 'target', { value: input })
      handler(event)
      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).toHaveBeenCalledOnce()
    })

    it('handles empty configs array without error', () => {
      const handler = createMultiKeyBindHandler([])
      expect(() => handler(createEvent('k'))).not.toThrow()
    })

    it('applies preventDefault and stopPropagation on matched entry', () => {
      const fn = vi.fn()
      const handler = createMultiKeyBindHandler([
        { binding: 'ctrl+s', handler: fn, options: { preventDefault: true, stopPropagation: true } },
      ])
      const event = createEvent('s', { ctrlKey: true })
      const pdSpy = vi.spyOn(event, 'preventDefault')
      const spSpy = vi.spyOn(event, 'stopPropagation')
      handler(event)
      expect(pdSpy).toHaveBeenCalled()
      expect(spSpy).toHaveBeenCalled()
    })
  })
})
