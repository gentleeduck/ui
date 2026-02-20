import { describe, expect, it } from 'vitest'
import { formatForDisplay, formatWithLabels } from '../format'

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
})
