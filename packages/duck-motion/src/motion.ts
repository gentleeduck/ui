import { duckDuration, duckEasing } from './tokens'

const DEFAULT_IN_KEYFRAMES: Keyframe[] = [
  { filter: 'blur(5px)', opacity: 0, transform: 'scale(0.8)' },
  { filter: 'blur(0px)', opacity: 1, transform: 'scale(1)' },
]

const DEFAULT_IN_OPTIONS: KeyframeAnimationOptions = {
  duration: duckDuration.normal,
  easing: duckEasing.spring,
}

export function animateIn(
  ref: HTMLElement | Element | null,
  keyframes: Keyframe[] | PropertyIndexedKeyframes = DEFAULT_IN_KEYFRAMES,
  options: KeyframeAnimationOptions = DEFAULT_IN_OPTIONS,
) {
  if (!ref) return null
  return ref.animate(keyframes, options)
}

/** @deprecated Use `animateIn` instead. */
export const motion = animateIn
