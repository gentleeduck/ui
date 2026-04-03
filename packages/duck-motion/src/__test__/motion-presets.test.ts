import { describe, expect, test } from 'bun:test'
import type { MotionPresetName } from '../motion-presets'
import { useMotionPreset } from '../motion-presets'

const ALL_PRESETS: MotionPresetName[] = [
  'fadeIn',
  'fadeOut',
  'scaleIn',
  'slideUp',
  'slideDown',
  'slideFromLeft',
  'slideFromRight',
]

describe('useMotionPreset', () => {
  test('is a function', () => {
    expect(typeof useMotionPreset).toBe('function')
  })

  test('every preset returns initial, animate, exit, transition', () => {
    for (const name of ALL_PRESETS) {
      const preset = useMotionPreset(name)
      expect(preset).toHaveProperty('initial')
      expect(preset).toHaveProperty('animate')
      expect(preset).toHaveProperty('exit')
      expect(preset).toHaveProperty('transition')
    }
  })

  test('fadeIn starts with opacity 0 and animates to 1', () => {
    const { initial, animate } = useMotionPreset('fadeIn')
    expect(initial.opacity).toBe(0)
    expect(animate.opacity).toBe(1)
  })

  test('fadeOut starts with opacity 1 and animates to 0', () => {
    const { initial, animate } = useMotionPreset('fadeOut')
    expect(initial.opacity).toBe(1)
    expect(animate.opacity).toBe(0)
  })

  test('scaleIn starts scaled down with blur', () => {
    const { initial, animate } = useMotionPreset('scaleIn')
    expect(initial.opacity).toBe(0)
    expect(initial.scale).toBe(0.8)
    expect(initial.filter).toBe('blur(5px)')
    expect(animate.opacity).toBe(1)
    expect(animate.scale).toBe(1)
    expect(animate.filter).toBe('blur(0px)')
  })

  test('slideUp starts below and animates up', () => {
    const { initial, animate } = useMotionPreset('slideUp')
    expect(initial.y).toBe(20)
    expect(animate.y).toBe(0)
  })

  test('slideDown starts above and animates down', () => {
    const { initial, animate } = useMotionPreset('slideDown')
    expect(initial.y).toBe(-20)
    expect(animate.y).toBe(0)
  })

  test('slideFromLeft starts left and animates in', () => {
    const { initial, animate } = useMotionPreset('slideFromLeft')
    expect(initial.x).toBe(-20)
    expect(animate.x).toBe(0)
  })

  test('slideFromRight starts right and animates in', () => {
    const { initial, animate } = useMotionPreset('slideFromRight')
    expect(initial.x).toBe(20)
    expect(animate.x).toBe(0)
  })

  test('exit mirrors initial for all presets', () => {
    for (const name of ALL_PRESETS) {
      const { initial, exit } = useMotionPreset(name)
      expect(exit).toEqual(initial)
    }
  })

  test('transition defaults to duckMotionTransition.fast', () => {
    const { transition } = useMotionPreset('fadeIn')
    expect(transition).toHaveProperty('duration', 0.15)
    expect(transition).toHaveProperty('ease')
  })

  test('custom transition overrides default', () => {
    const custom = { duration: 0.5, ease: [0, 0, 1, 1] }
    const { transition } = useMotionPreset('fadeIn', { transition: custom })
    expect(transition).toEqual(custom)
  })
})
