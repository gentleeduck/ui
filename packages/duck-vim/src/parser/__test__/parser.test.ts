import { describe, expect, it } from 'vitest'
import { keyboardEventToDescriptor, normalizeKeyBind, parseKeyBind, validateKeyBind } from '../parser'

describe('parser', () => {
  describe('parseKeyBind', () => {
    it('parses a simple key', () => {
      const result = parseKeyBind('k')
      expect(result.key).toBe('k')
      expect(result.ctrl).toBe(false)
      expect(result.shift).toBe(false)
      expect(result.alt).toBe(false)
      expect(result.meta).toBe(false)
      expect(result.modifiers).toEqual([])
    })

    it('parses ctrl+k', () => {
      const result = parseKeyBind('ctrl+k')
      expect(result.key).toBe('k')
      expect(result.ctrl).toBe(true)
      expect(result.modifiers).toEqual(['ctrl'])
    })

    it('parses multiple modifiers', () => {
      const result = parseKeyBind('ctrl+shift+alt+s')
      expect(result.key).toBe('s')
      expect(result.ctrl).toBe(true)
      expect(result.shift).toBe(true)
      expect(result.alt).toBe(true)
      expect(result.modifiers).toEqual(['alt', 'ctrl', 'shift'])
    })

    it('resolves Mod to meta on mac', () => {
      const result = parseKeyBind('Mod+S', 'mac')
      expect(result.key).toBe('s')
      expect(result.meta).toBe(true)
      expect(result.ctrl).toBe(false)
      expect(result.modifiers).toEqual(['meta'])
    })

    it('resolves Mod to ctrl on windows', () => {
      const result = parseKeyBind('Mod+S', 'windows')
      expect(result.key).toBe('s')
      expect(result.ctrl).toBe(true)
      expect(result.meta).toBe(false)
      expect(result.modifiers).toEqual(['ctrl'])
    })

    it('resolves key aliases', () => {
      const result = parseKeyBind('ctrl+escape')
      expect(result.key).toBe('esc')
    })

    it('resolves cmd alias to meta', () => {
      const result = parseKeyBind('cmd+s')
      expect(result.meta).toBe(true)
      expect(result.key).toBe('s')
    })

    it('handles case insensitivity', () => {
      const result = parseKeyBind('Ctrl+Shift+S')
      expect(result.ctrl).toBe(true)
      expect(result.shift).toBe(true)
      expect(result.key).toBe('s')
    })

    it('throws on empty string', () => {
      expect(() => parseKeyBind('')).toThrow('cannot be empty')
    })

    it('throws on modifier-only string', () => {
      expect(() => parseKeyBind('ctrl+shift')).toThrow('No non-modifier key')
    })

    it('throws on multiple non-modifier keys', () => {
      expect(() => parseKeyBind('a+b')).toThrow('Multiple non-modifier keys')
    })
  })

  describe('normalizeKeyBind', () => {
    it('normalizes modifier order', () => {
      expect(normalizeKeyBind('shift+ctrl+s')).toBe('ctrl+shift+s')
    })

    it('normalizes to lowercase', () => {
      expect(normalizeKeyBind('Ctrl+S')).toBe('ctrl+s')
    })

    it('resolves Mod', () => {
      expect(normalizeKeyBind('Mod+S', 'mac')).toBe('meta+s')
      expect(normalizeKeyBind('Mod+S', 'windows')).toBe('ctrl+s')
    })

    it('normalizes aliases', () => {
      expect(normalizeKeyBind('cmd+escape')).toBe('meta+esc')
    })
  })

  describe('validateKeyBind', () => {
    it('validates a correct key binding', () => {
      const result = validateKeyBind('ctrl+s')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('errors on empty string', () => {
      const result = validateKeyBind('')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Key binding string cannot be empty')
    })

    it('errors on duplicate modifiers', () => {
      const result = validateKeyBind('ctrl+ctrl+s')
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('Duplicate modifier')
    })

    it('errors on multiple non-modifier keys', () => {
      const result = validateKeyBind('a+b')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Multiple non-modifier keys found')
    })

    it('errors on modifier-only', () => {
      const result = validateKeyBind('ctrl+shift')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('No non-modifier key found')
    })

    it('warns about alt+letter on mac', () => {
      const result = validateKeyBind('alt+a')
      expect(result.valid).toBe(true)
      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })

  describe('keyboardEventToDescriptor', () => {
    it('returns null for pure modifier keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'Shift' })
      expect(keyboardEventToDescriptor(event)).toBe(null)
    })

    it('builds descriptor for simple key', () => {
      const event = new KeyboardEvent('keydown', { key: 'k' })
      expect(keyboardEventToDescriptor(event)).toBe('k')
    })

    it('builds descriptor with modifiers', () => {
      const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true })
      expect(keyboardEventToDescriptor(event)).toBe('ctrl+shift+s')
    })

    it('normalizes space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' })
      expect(keyboardEventToDescriptor(event)).toBe('space')
    })

    it('orders modifiers alphabetically', () => {
      const event = new KeyboardEvent('keydown', { key: 'a', shiftKey: true, altKey: true, ctrlKey: true })
      expect(keyboardEventToDescriptor(event)).toBe('alt+ctrl+shift+a')
    })
  })
})
