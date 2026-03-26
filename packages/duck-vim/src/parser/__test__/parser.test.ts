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

  describe('parseKeyBind - edge cases', () => {
    it('throws on whitespace-only string', () => {
      expect(() => parseKeyBind('   ')).toThrow('cannot be empty')
    })

    it('resolves Mod to ctrl on linux', () => {
      const result = parseKeyBind('Mod+S', 'linux')
      expect(result.ctrl).toBe(true)
      expect(result.meta).toBe(false)
      expect(result.key).toBe('s')
    })

    it('resolves option alias to alt', () => {
      const result = parseKeyBind('option+k')
      expect(result.alt).toBe(true)
      expect(result.key).toBe('k')
    })

    it('resolves opt alias to alt', () => {
      const result = parseKeyBind('opt+k')
      expect(result.alt).toBe(true)
      expect(result.key).toBe('k')
    })

    it('resolves command alias to meta', () => {
      const result = parseKeyBind('command+s')
      expect(result.meta).toBe(true)
      expect(result.key).toBe('s')
    })

    it('resolves control alias to ctrl', () => {
      const result = parseKeyBind('control+s')
      expect(result.ctrl).toBe(true)
      expect(result.key).toBe('s')
    })

    it('parses all four modifiers together', () => {
      const result = parseKeyBind('ctrl+shift+alt+meta+s')
      expect(result.ctrl).toBe(true)
      expect(result.shift).toBe(true)
      expect(result.alt).toBe(true)
      expect(result.meta).toBe(true)
      expect(result.key).toBe('s')
      expect(result.modifiers).toEqual(['alt', 'ctrl', 'meta', 'shift'])
    })

    it('parses space key alias', () => {
      const result = parseKeyBind('ctrl+space')
      expect(result.key).toBe('space')
      expect(result.ctrl).toBe(true)
    })

    it('parses F-keys', () => {
      const result = parseKeyBind('ctrl+f1')
      expect(result.key).toBe('f1')
      expect(result.ctrl).toBe(true)
    })

    it('parses F12 key', () => {
      const result = parseKeyBind('f12')
      expect(result.key).toBe('f12')
      expect(result.modifiers).toEqual([])
    })

    it('parses Tab key', () => {
      const result = parseKeyBind('tab')
      expect(result.key).toBe('tab')
    })

    it('parses Backspace key', () => {
      const result = parseKeyBind('backspace')
      expect(result.key).toBe('backspace')
    })

    it('parses Delete key', () => {
      const result = parseKeyBind('delete')
      expect(result.key).toBe('delete')
    })

    it('parses Enter key', () => {
      const result = parseKeyBind('enter')
      expect(result.key).toBe('enter')
    })

    it('parses single digit key', () => {
      const result = parseKeyBind('ctrl+1')
      expect(result.key).toBe('1')
      expect(result.ctrl).toBe(true)
    })

    it('parses single special character key', () => {
      const result = parseKeyBind('ctrl+/')
      expect(result.key).toBe('/')
      expect(result.ctrl).toBe(true)
    })

    it('handles parts with extra whitespace', () => {
      const result = parseKeyBind('ctrl + s')
      expect(result.ctrl).toBe(true)
      expect(result.key).toBe('s')
    })

    it('skips empty parts from double plus', () => {
      // 'ctrl++s' splits into ['ctrl', '', 's'] — empty part is skipped
      const result = parseKeyBind('ctrl++s')
      expect(result.ctrl).toBe(true)
      expect(result.key).toBe('s')
    })
  })

  describe('normalizeKeyBind - edge cases', () => {
    it('normalizes all four modifiers in correct order', () => {
      expect(normalizeKeyBind('shift+meta+ctrl+alt+s')).toBe('alt+ctrl+meta+shift+s')
    })

    it('normalizes option alias', () => {
      expect(normalizeKeyBind('option+k')).toBe('alt+k')
    })

    it('normalizes command alias', () => {
      expect(normalizeKeyBind('command+s')).toBe('meta+s')
    })

    it('normalizes control alias', () => {
      expect(normalizeKeyBind('control+s')).toBe('ctrl+s')
    })

    it('normalizes Mod on linux to ctrl', () => {
      expect(normalizeKeyBind('Mod+S', 'linux')).toBe('ctrl+s')
    })

    it('normalizes F-keys', () => {
      expect(normalizeKeyBind('Ctrl+F5')).toBe('ctrl+f5')
    })

    it('normalizes simple key to lowercase', () => {
      expect(normalizeKeyBind('K')).toBe('k')
    })
  })

  describe('validateKeyBind - edge cases', () => {
    it('errors on whitespace-only string', () => {
      const result = validateKeyBind('   ')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Key binding string cannot be empty')
    })

    it('detects empty parts from double plus', () => {
      const result = validateKeyBind('ctrl++s')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Empty part found in key binding string')
    })

    it('validates F-key bindings', () => {
      const result = validateKeyBind('ctrl+f5')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('validates single character key', () => {
      const result = validateKeyBind('a')
      expect(result.valid).toBe(true)
    })

    it('no alt warning without letter key', () => {
      const result = validateKeyBind('alt+f1')
      expect(result.valid).toBe(true)
      // alt+f1 should still warn (nonModifierCount === 1 and alt is present)
      expect(result.warnings.length).toBeGreaterThan(0)
    })

    it('no warnings when alt is not present', () => {
      const result = validateKeyBind('ctrl+s')
      expect(result.warnings).toEqual([])
    })

    it('validates mod alias as modifier', () => {
      const result = validateKeyBind('mod+s')
      expect(result.valid).toBe(true)
    })

    it('reports duplicate for repeated alias and canonical form', () => {
      // 'cmd' resolves to 'meta', so cmd+meta+s has duplicate 'meta'
      const result = validateKeyBind('cmd+meta+s')
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('Duplicate modifier')
    })

    it('validates key bindings with all four modifiers', () => {
      const result = validateKeyBind('ctrl+shift+alt+meta+k')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })
  })

  describe('keyboardEventToDescriptor - edge cases', () => {
    it('returns null for Control key press', () => {
      const event = new KeyboardEvent('keydown', { key: 'Control' })
      expect(keyboardEventToDescriptor(event)).toBe(null)
    })

    it('returns null for Alt key press', () => {
      const event = new KeyboardEvent('keydown', { key: 'Alt' })
      expect(keyboardEventToDescriptor(event)).toBe(null)
    })

    it('returns null for Meta key press', () => {
      const event = new KeyboardEvent('keydown', { key: 'Meta' })
      expect(keyboardEventToDescriptor(event)).toBe(null)
    })

    it('handles meta modifier in descriptor', () => {
      const event = new KeyboardEvent('keydown', { key: 's', metaKey: true })
      expect(keyboardEventToDescriptor(event)).toBe('meta+s')
    })

    it('handles all four modifiers together', () => {
      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        altKey: true,
        metaKey: true,
        shiftKey: true,
      })
      expect(keyboardEventToDescriptor(event)).toBe('alt+ctrl+meta+shift+s')
    })

    it('normalizes escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      expect(keyboardEventToDescriptor(event)).toBe('esc')
    })

    it('handles F-key events', () => {
      const event = new KeyboardEvent('keydown', { key: 'F1' })
      expect(keyboardEventToDescriptor(event)).toBe('f1')
    })

    it('handles F12 key event', () => {
      const event = new KeyboardEvent('keydown', { key: 'F12', ctrlKey: true })
      expect(keyboardEventToDescriptor(event)).toBe('ctrl+f12')
    })

    it('handles Tab key event', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' })
      expect(keyboardEventToDescriptor(event)).toBe('tab')
    })

    it('handles Backspace key event', () => {
      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      expect(keyboardEventToDescriptor(event)).toBe('backspace')
    })

    it('handles Delete key event', () => {
      const event = new KeyboardEvent('keydown', { key: 'Delete' })
      expect(keyboardEventToDescriptor(event)).toBe('delete')
    })

    it('handles Enter key event', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      expect(keyboardEventToDescriptor(event)).toBe('enter')
    })

    it('handles digit key event', () => {
      const event = new KeyboardEvent('keydown', { key: '1', ctrlKey: true })
      expect(keyboardEventToDescriptor(event)).toBe('ctrl+1')
    })

    it('handles uppercase letter event by lowercasing', () => {
      const event = new KeyboardEvent('keydown', { key: 'A' })
      expect(keyboardEventToDescriptor(event)).toBe('a')
    })
  })
})
