import { describe, expect, test } from 'bun:test'
import type { MotionPresetName } from '../motion-presets'
import { useDirectionalPreset, useMotionPreset } from '../motion-presets'
import { createDirectionalPreset } from '../presets/directional'
import { fadeIn } from '../presets/fade-in'
import { fadeOut } from '../presets/fade-out'
import { scaleIn } from '../presets/scale-in'
import { slideDown } from '../presets/slide-down'
import { slideFromLeft } from '../presets/slide-from-left'
import { slideFromRight } from '../presets/slide-from-right'
import { slideUp } from '../presets/slide-up'

const ALL_PRESETS: MotionPresetName[] = [
  'fadeIn',
  'fadeOut',
  'scaleIn',
  'slideUp',
  'slideDown',
  'slideFromLeft',
  'slideFromRight',
]

describe('individual preset exports (tree-shakeable)', () => {
  test('fadeIn has opacity 0 to 1', () => {
    expect(fadeIn.initial.opacity).toBe(0)
    expect(fadeIn.animate.opacity).toBe(1)
  })

  test('fadeOut has opacity 1 to 0', () => {
    expect(fadeOut.initial.opacity).toBe(1)
    expect(fadeOut.animate.opacity).toBe(0)
  })

  test('scaleIn has asymmetric exit (0.9 not 0.95)', () => {
    expect(scaleIn.initial.scale).toBe(0.95)
    expect(scaleIn.exit.scale).toBe(0.9)
  })

  test('scaleIn has blur on initial and exit', () => {
    expect(scaleIn.initial.filter).toBe('blur(8px)')
    expect(scaleIn.exit.filter).toBe('blur(8px)')
  })

  test('slideUp has asymmetric offset (8px enter, 30px exit)', () => {
    expect(slideUp.initial.y).toBe(8)
    expect(slideUp.exit.y).toBe(30)
  })

  test('slideDown enters from -8 and exits to -30', () => {
    expect(slideDown.initial.y).toBe(-8)
    expect(slideDown.exit.y).toBe(-30)
  })

  test('slideFromLeft enters from -8 and exits to -30', () => {
    expect(slideFromLeft.initial.x).toBe(-8)
    expect(slideFromLeft.exit.x).toBe(-30)
  })

  test('slideFromRight enters from 8 and exits to 30', () => {
    expect(slideFromRight.initial.x).toBe(8)
    expect(slideFromRight.exit.x).toBe(30)
  })

  test('slide presets have blur', () => {
    expect(slideUp.initial.filter).toBe('blur(4px)')
    expect(slideUp.exit.filter).toBe('blur(4px)')
  })
})

describe('createDirectionalPreset', () => {
  test('top direction offsets on y axis positively', () => {
    const preset = createDirectionalPreset('top')
    expect(preset.initial.y).toBe(8)
    expect(preset.exit.y).toBe(30)
  })

  test('bottom direction offsets on y axis negatively', () => {
    const preset = createDirectionalPreset('bottom')
    expect(preset.initial.y).toBe(-8)
    expect(preset.exit.y).toBe(-30)
  })

  test('left direction offsets on x axis positively', () => {
    const preset = createDirectionalPreset('left')
    expect(preset.initial.x).toBe(8)
    expect(preset.exit.x).toBe(30)
  })

  test('right direction offsets on x axis negatively', () => {
    const preset = createDirectionalPreset('right')
    expect(preset.initial.x).toBe(-8)
    expect(preset.exit.x).toBe(-30)
  })

  test('includes scale and blur', () => {
    const preset = createDirectionalPreset('top')
    expect(preset.initial.scale).toBe(0.95)
    expect(preset.exit.scale).toBe(0.9)
    expect(preset.initial.filter).toBe('blur(8px)')
  })

  test('custom offsets', () => {
    const preset = createDirectionalPreset('top', 12, 40, 6)
    expect(preset.initial.y).toBe(12)
    expect(preset.exit.y).toBe(40)
    expect(preset.initial.filter).toBe('blur(6px)')
  })
})

describe('useMotionPreset', () => {
  test('every preset returns initial, animate, exit, transition', () => {
    for (const name of ALL_PRESETS) {
      const preset = useMotionPreset(name)
      expect(preset).toHaveProperty('initial')
      expect(preset).toHaveProperty('animate')
      expect(preset).toHaveProperty('exit')
      expect(preset).toHaveProperty('transition')
    }
  })

  test('direction option overrides preset with directional values', () => {
    const preset = useMotionPreset('fadeIn', { direction: 'bottom' })
    expect(preset.initial.y).toBe(-8)
  })

  test('delay option adds delay to enter transition', () => {
    const preset = useMotionPreset('fadeIn', { delay: 0.05 })
    const animateTransition = preset.animate.transition as Record<string, unknown>
    expect(animateTransition.delay).toBe(0.05)
  })

  test('default transition is spring-based', () => {
    const preset = useMotionPreset('fadeIn')
    expect(preset.transition).toHaveProperty('type', 'spring')
  })
})

describe('useDirectionalPreset', () => {
  test('returns directional preset for given direction', () => {
    const preset = useDirectionalPreset('bottom')
    expect(preset.initial.y).toBe(-8)
    expect(preset.exit.y).toBe(-30)
  })

  test('accepts delay', () => {
    const preset = useDirectionalPreset('top', { delay: 0.03 })
    const animateTransition = preset.animate.transition as Record<string, unknown>
    expect(animateTransition.delay).toBe(0.03)
  })
})
