import { blurLight, blurMedium } from '../transitions/blur'

export type DirectionalSide = 'top' | 'right' | 'bottom' | 'left'

export function getAxis(direction: DirectionalSide): 'x' | 'y' {
  return direction === 'left' || direction === 'right' ? 'x' : 'y'
}

export function getSign(direction: DirectionalSide): 1 | -1 {
  return direction === 'top' || direction === 'left' ? 1 : -1
}

export const BLUR_LIGHT = `blur(${blurLight}px)`
export const BLUR_MEDIUM = `blur(${blurMedium}px)`
export const BLUR_CLEAR = 'blur(0px)'
