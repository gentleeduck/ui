import { describe, expect, test } from 'bun:test'
import { renderHook } from '@testing-library/react'
import type { MotionPresetName } from '../motion-presets'
import { useMotionPreset } from '../motion-presets'
import { createDirectionalPreset, createSlidePreset } from '../presets/directional'
import { fadeIn } from '../presets/fade-in'
import { popIn } from '../presets/pop-in'
import { rotateIn } from '../presets/rotate-in'
import { scaleIn } from '../presets/scale-in'
import { slideDown } from '../presets/slide-down'
import { slideFromLeft } from '../presets/slide-from-left'
import { slideFromRight } from '../presets/slide-from-right'
import { slideUp } from '../presets/slide-up'

const ALL_PRESETS: MotionPresetName[] = [
  'fadeIn',
  'scaleIn',
  'slideUp',
  'slideDown',
  'slideFromLeft',
  'slideFromRight',
  'rotateIn',
  'popIn',
]

describe('individual preset exports (tree-shakeable)', () => {
  test('fadeIn has opacity 0 to 1', () => {
    expect(fadeIn.initial.opacity).toBe(0)
    expect(fadeIn.animate.opacity).toBe(1)
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

  test('slideFromLeft enters from 8 and exits to 30', () => {
    expect(slideFromLeft.initial.x).toBe(8)
    expect(slideFromLeft.exit.x).toBe(30)
  })

  test('slideFromRight enters from -8 and exits to -30', () => {
    expect(slideFromRight.initial.x).toBe(-8)
    expect(slideFromRight.exit.x).toBe(-30)
  })

  test('slide presets have light blur', () => {
    expect(slideUp.initial.filter).toBe('blur(4px)')
    expect(slideUp.exit.filter).toBe('blur(4px)')
  })

  test('slide presets do not introduce scale change (scale stays 1)', () => {
    expect(slideUp.initial.scale).toBe(1)
    expect(slideUp.animate.scale).toBe(1)
    expect(slideUp.exit.scale).toBe(1)
  })

  test('rotateIn initial has non-zero rotation', () => {
    expect(rotateIn.initial.rotate).not.toBe(0)
    expect(rotateIn.initial.rotate).not.toBeUndefined()
  })

  test('rotateIn exit has non-zero rotation (asymmetric)', () => {
    expect(rotateIn.exit.rotate).not.toBe(0)
    expect(rotateIn.exit.rotate).not.toBe(rotateIn.initial.rotate)
  })

  test('rotateIn initial has blur filter', () => {
    expect(rotateIn.initial.filter).toMatch(/blur\(\d+px\)/)
    expect(rotateIn.initial.filter).not.toBe('blur(0px)')
  })

  test('rotateIn animate is fully revealed (opacity 1, rotate 0)', () => {
    expect(rotateIn.animate.opacity).toBe(1)
    expect(rotateIn.animate.rotate).toBe(0)
  })

  test('popIn exit scale is 0', () => {
    expect(popIn.exit.scale).toBe(0)
  })

  test('popIn initial scale is less than animate scale', () => {
    expect(popIn.initial.scale as number).toBeLessThan(popIn.animate.scale as number)
  })

  test('popIn animate is fully visible', () => {
    expect(popIn.animate.opacity).toBe(1)
    expect(popIn.animate.scale).toBe(1)
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

describe('createSlidePreset', () => {
  test('produces no scale change (scale 1 across states)', () => {
    const preset = createSlidePreset('top')
    expect(preset.initial.scale).toBe(1)
    expect(preset.animate.scale).toBe(1)
    expect(preset.exit.scale).toBe(1)
  })

  test('uses light blur (4px)', () => {
    const preset = createSlidePreset('top')
    expect(preset.initial.filter).toBe('blur(4px)')
    expect(preset.exit.filter).toBe('blur(4px)')
  })

  test('matches slideUp shape', () => {
    const preset = createSlidePreset('top')
    expect(preset.initial.y).toBe(slideUp.initial.y)
    expect(preset.exit.y).toBe(slideUp.exit.y)
  })
})

describe('useMotionPreset', () => {
  test('every preset returns initial, animate, exit, transition', () => {
    for (const name of ALL_PRESETS) {
      const { result } = renderHook(() => useMotionPreset(name))
      expect(result.current).toHaveProperty('initial')
      expect(result.current).toHaveProperty('animate')
      expect(result.current).toHaveProperty('exit')
      expect(result.current).toHaveProperty('transition')
    }
  })

  test('direction option overrides preset with directional values', () => {
    const { result } = renderHook(() => useMotionPreset('fadeIn', { direction: 'bottom' }))
    expect(result.current.initial.y).toBe(-8)
  })

  test('delay option adds delay to enter transition', () => {
    const { result } = renderHook(() => useMotionPreset('fadeIn', { delay: 0.05 }))
    const animateTransition = result.current.animate.transition as Record<string, unknown>
    expect(animateTransition.delay).toBe(0.05)
  })

  test('default transition is spring-based', () => {
    const { result } = renderHook(() => useMotionPreset('fadeIn'))
    expect(result.current.transition).toHaveProperty('type', 'spring')
  })
})
