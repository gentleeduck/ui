import { describe, expect, it } from 'vitest'
import { LABEL_MAP, SYMBOL_MAP, formatForDisplay, formatWithLabels } from '../format'

describe('format', () => {
  describe('formatForDisplay', () => {
    it('formats simple key', () => {
      expect(formatForDisplay('s', { platform: 'linux' })).toBe('S')
    })

    it('formats ctrl+s on linux', () => {
      expect(formatForDisplay('ctrl+s', { platform: 'linux' })).toBe('Ctrl+S')
    })

    it('formats Mod+S on mac', () => {
      expect(formatForDisplay('Mod+S', { platform: 'mac' })).toBe('Cmd+S')
    })

    it('formats Mod+S on windows', () => {
      expect(formatForDisplay('Mod+S', { platform: 'windows' })).toBe('Ctrl+S')
    })

    it('formats Mod+S on linux', () => {
      expect(formatForDisplay('Mod+S', { platform: 'linux' })).toBe('Ctrl+S')
    })

    it('formats multiple modifiers', () => {
      expect(formatForDisplay('ctrl+shift+s', { platform: 'linux' })).toBe('Ctrl+Shift+S')
    })

    it('formats meta on mac as Cmd', () => {
      expect(formatForDisplay('meta+s', { platform: 'mac' })).toBe('Cmd+S')
    })

    it('formats alt on mac as Opt', () => {
      expect(formatForDisplay('alt+s', { platform: 'mac' })).toBe('Opt+S')
    })

    it('formats meta on windows as Win', () => {
      expect(formatForDisplay('meta+s', { platform: 'windows' })).toBe('Win+S')
    })

    it('formats meta on linux as Super', () => {
      expect(formatForDisplay('meta+s', { platform: 'linux' })).toBe('Super+S')
    })

    it('uses custom separator', () => {
      expect(formatForDisplay('ctrl+s', { platform: 'linux', separator: ' + ' })).toBe('Ctrl + S')
    })

    it('formats special keys', () => {
      expect(formatForDisplay('ctrl+esc', { platform: 'linux' })).toBe('Ctrl+Esc')
    })
  })

  describe('formatWithLabels', () => {
    it('formats with verbose labels', () => {
      expect(formatWithLabels('ctrl+s', { platform: 'linux' })).toBe('Ctrl + S')
    })

    it('expands special key names', () => {
      expect(formatWithLabels('ctrl+esc', { platform: 'linux' })).toBe('Ctrl + Escape')
    })

    it('expands space key', () => {
      expect(formatWithLabels('space', { platform: 'linux' })).toBe('Space')
    })

    it('uses platform modifiers', () => {
      expect(formatWithLabels('Mod+Shift+S', { platform: 'mac' })).toBe('Cmd + Shift + S')
    })

    it('uses custom separator', () => {
      expect(formatWithLabels('ctrl+s', { platform: 'linux', separator: '-' })).toBe('Ctrl-S')
    })
  })

  describe('formatForDisplay - all 4 modifiers', () => {
    it('formats ctrl+shift+alt+meta+key on linux', () => {
      expect(formatForDisplay('ctrl+shift+alt+meta+k', { platform: 'linux' })).toBe('Alt+Ctrl+Super+Shift+K')
    })

    it('formats ctrl+shift+alt+meta+key on mac', () => {
      expect(formatForDisplay('ctrl+shift+alt+meta+k', { platform: 'mac' })).toBe('Opt+Ctrl+Cmd+Shift+K')
    })

    it('formats ctrl+shift+alt+meta+key on windows', () => {
      expect(formatForDisplay('ctrl+shift+alt+meta+k', { platform: 'windows' })).toBe('Alt+Ctrl+Win+Shift+K')
    })
  })

  describe('formatForDisplay - Mac vs Windows vs Linux modifier symbols', () => {
    it('formats alt as Opt on mac', () => {
      expect(formatForDisplay('alt+x', { platform: 'mac' })).toBe('Opt+X')
    })

    it('formats alt as Alt on windows', () => {
      expect(formatForDisplay('alt+x', { platform: 'windows' })).toBe('Alt+X')
    })

    it('formats alt as Alt on linux', () => {
      expect(formatForDisplay('alt+x', { platform: 'linux' })).toBe('Alt+X')
    })

    it('formats shift consistently across platforms', () => {
      expect(formatForDisplay('shift+x', { platform: 'mac' })).toBe('Shift+X')
      expect(formatForDisplay('shift+x', { platform: 'windows' })).toBe('Shift+X')
      expect(formatForDisplay('shift+x', { platform: 'linux' })).toBe('Shift+X')
    })

    it('formats ctrl consistently across platforms', () => {
      expect(formatForDisplay('ctrl+x', { platform: 'mac' })).toBe('Ctrl+X')
      expect(formatForDisplay('ctrl+x', { platform: 'windows' })).toBe('Ctrl+X')
      expect(formatForDisplay('ctrl+x', { platform: 'linux' })).toBe('Ctrl+X')
    })
  })

  describe('formatForDisplay - special keys', () => {
    it('formats F1 through F12', () => {
      for (let i = 1; i <= 12; i++) {
        const result = formatForDisplay(`f${i}`, { platform: 'linux' })
        expect(result).toBe(`F${i}`)
      }
    })

    it('formats ctrl+F5', () => {
      expect(formatForDisplay('ctrl+f5', { platform: 'linux' })).toBe('Ctrl+F5')
    })

    it('formats Tab', () => {
      expect(formatForDisplay('tab', { platform: 'linux' })).toBe('Tab')
    })

    it('formats Backspace', () => {
      expect(formatForDisplay('backspace', { platform: 'linux' })).toBe('Backspace')
    })

    it('formats Delete', () => {
      expect(formatForDisplay('delete', { platform: 'linux' })).toBe('Delete')
    })

    it('formats Enter', () => {
      expect(formatForDisplay('enter', { platform: 'linux' })).toBe('Enter')
    })

    it('formats Escape via esc alias', () => {
      expect(formatForDisplay('esc', { platform: 'linux' })).toBe('Esc')
    })

    it('formats Space', () => {
      expect(formatForDisplay('space', { platform: 'linux' })).toBe('Space')
    })

    it('formats arrow keys', () => {
      expect(formatForDisplay('arrowup', { platform: 'linux' })).toBe('Arrowup')
      expect(formatForDisplay('arrowdown', { platform: 'linux' })).toBe('Arrowdown')
      expect(formatForDisplay('arrowleft', { platform: 'linux' })).toBe('Arrowleft')
      expect(formatForDisplay('arrowright', { platform: 'linux' })).toBe('Arrowright')
    })

    it('formats ctrl+shift+enter', () => {
      expect(formatForDisplay('ctrl+shift+enter', { platform: 'linux' })).toBe('Ctrl+Shift+Enter')
    })

    it('formats Mod+tab on mac', () => {
      expect(formatForDisplay('Mod+tab', { platform: 'mac' })).toBe('Cmd+Tab')
    })

    it('formats alt+backspace on mac', () => {
      expect(formatForDisplay('alt+backspace', { platform: 'mac' })).toBe('Opt+Backspace')
    })
  })

  describe('formatForDisplay - edge cases', () => {
    it('throws on empty string', () => {
      expect(() => formatForDisplay('', { platform: 'linux' })).toThrow()
    })

    it('throws on whitespace-only string', () => {
      expect(() => formatForDisplay('   ', { platform: 'linux' })).toThrow()
    })

    it('formats single character key alone', () => {
      expect(formatForDisplay('a', { platform: 'linux' })).toBe('A')
      expect(formatForDisplay('z', { platform: 'linux' })).toBe('Z')
    })

    it('formats single digit key alone', () => {
      expect(formatForDisplay('1', { platform: 'linux' })).toBe('1')
      expect(formatForDisplay('0', { platform: 'linux' })).toBe('0')
    })

    it('preserves case normalization for multi-char keys', () => {
      expect(formatForDisplay('pageup', { platform: 'linux' })).toBe('Pageup')
      expect(formatForDisplay('home', { platform: 'linux' })).toBe('Home')
      expect(formatForDisplay('end', { platform: 'linux' })).toBe('End')
    })

    it('uses empty separator', () => {
      expect(formatForDisplay('ctrl+s', { platform: 'linux', separator: '' })).toBe('CtrlS')
    })
  })

  describe('formatWithLabels - special keys expanded', () => {
    it('expands enter', () => {
      expect(formatWithLabels('enter', { platform: 'linux' })).toBe('Enter')
    })

    it('expands tab', () => {
      expect(formatWithLabels('tab', { platform: 'linux' })).toBe('Tab')
    })

    it('expands backspace', () => {
      expect(formatWithLabels('backspace', { platform: 'linux' })).toBe('Backspace')
    })

    it('expands delete', () => {
      expect(formatWithLabels('delete', { platform: 'linux' })).toBe('Delete')
    })

    it('expands arrow keys to directional labels', () => {
      expect(formatWithLabels('arrowup', { platform: 'linux' })).toBe('Up')
      expect(formatWithLabels('arrowdown', { platform: 'linux' })).toBe('Down')
      expect(formatWithLabels('arrowleft', { platform: 'linux' })).toBe('Left')
      expect(formatWithLabels('arrowright', { platform: 'linux' })).toBe('Right')
    })

    it('expands navigation keys', () => {
      expect(formatWithLabels('pageup', { platform: 'linux' })).toBe('PageUp')
      expect(formatWithLabels('pagedown', { platform: 'linux' })).toBe('PageDown')
      expect(formatWithLabels('home', { platform: 'linux' })).toBe('Home')
      expect(formatWithLabels('end', { platform: 'linux' })).toBe('End')
      expect(formatWithLabels('insert', { platform: 'linux' })).toBe('Insert')
    })

    it('formats all 4 modifiers with label on mac', () => {
      expect(formatWithLabels('ctrl+shift+alt+meta+k', { platform: 'mac' })).toBe('Opt + Ctrl + Cmd + Shift + K')
    })

    it('formats all 4 modifiers with label on windows', () => {
      expect(formatWithLabels('ctrl+shift+alt+meta+k', { platform: 'windows' })).toBe(
        'Alt + Ctrl + Win + Shift + K',
      )
    })

    it('does not expand F-keys (no LABEL_MAP entry)', () => {
      expect(formatWithLabels('f1', { platform: 'linux' })).toBe('F1')
      expect(formatWithLabels('f12', { platform: 'linux' })).toBe('F12')
    })

    it('formats Mod+arrowup on mac', () => {
      expect(formatWithLabels('Mod+arrowup', { platform: 'mac' })).toBe('Cmd + Up')
    })

    it('formats Mod+arrowdown on windows', () => {
      expect(formatWithLabels('Mod+arrowdown', { platform: 'windows' })).toBe('Ctrl + Down')
    })
  })

  describe('formatWithLabels - edge cases', () => {
    it('throws on empty string', () => {
      expect(() => formatWithLabels('', { platform: 'linux' })).toThrow()
    })

    it('formats digit keys', () => {
      expect(formatWithLabels('ctrl+1', { platform: 'linux' })).toBe('Ctrl + 1')
    })

    it('uses empty separator', () => {
      expect(formatWithLabels('ctrl+s', { platform: 'linux', separator: '' })).toBe('CtrlS')
    })
  })

  describe('SYMBOL_MAP', () => {
    it('has entries for all 3 platforms', () => {
      expect(SYMBOL_MAP).toHaveProperty('mac')
      expect(SYMBOL_MAP).toHaveProperty('windows')
      expect(SYMBOL_MAP).toHaveProperty('linux')
    })

    it('each platform maps all 4 modifiers', () => {
      for (const platform of ['mac', 'windows', 'linux'] as const) {
        expect(SYMBOL_MAP[platform]).toHaveProperty('meta')
        expect(SYMBOL_MAP[platform]).toHaveProperty('ctrl')
        expect(SYMBOL_MAP[platform]).toHaveProperty('alt')
        expect(SYMBOL_MAP[platform]).toHaveProperty('shift')
      }
    })

    it('mac uses Cmd/Opt naming', () => {
      expect(SYMBOL_MAP.mac.meta).toBe('Cmd')
      expect(SYMBOL_MAP.mac.alt).toBe('Opt')
    })

    it('windows uses Win naming', () => {
      expect(SYMBOL_MAP.windows.meta).toBe('Win')
      expect(SYMBOL_MAP.windows.alt).toBe('Alt')
    })

    it('linux uses Super naming', () => {
      expect(SYMBOL_MAP.linux.meta).toBe('Super')
      expect(SYMBOL_MAP.linux.alt).toBe('Alt')
    })
  })

  describe('LABEL_MAP', () => {
    it('contains all expected special keys', () => {
      const expectedKeys = [
        'space',
        'esc',
        'enter',
        'tab',
        'backspace',
        'delete',
        'arrowup',
        'arrowdown',
        'arrowleft',
        'arrowright',
        'pageup',
        'pagedown',
        'home',
        'end',
        'insert',
      ]
      for (const key of expectedKeys) {
        expect(LABEL_MAP).toHaveProperty(key)
      }
    })

    it('maps arrow keys to directional words', () => {
      expect(LABEL_MAP.arrowup).toBe('Up')
      expect(LABEL_MAP.arrowdown).toBe('Down')
      expect(LABEL_MAP.arrowleft).toBe('Left')
      expect(LABEL_MAP.arrowright).toBe('Right')
    })
  })
})
