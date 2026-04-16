import type * as React from 'react'
import type { IDirection } from '../direction'
import type { IRovingFocus } from './roving-focus.types'

export { focusFirst, wrapArray } from '../libs/shared-utils'

const MAP_KEY_TO_FOCUS_INTENT: Record<string, IRovingFocus.FocusIntent> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}

function getDirectionAwareKey(key: string, dir?: IDirection.Kind) {
  if (dir !== 'rtl') return key
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key
}

/** Determines the focus intent from a keyboard event based on orientation and direction. */
function getFocusIntent(event: React.KeyboardEvent, orientation?: IRovingFocus.Orientation, dir?: IDirection.Kind) {
  const key = getDirectionAwareKey(event.key, dir)
  if (orientation === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(key)) return undefined
  if (orientation === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(key)) return undefined
  return MAP_KEY_TO_FOCUS_INTENT[key]
}

export { getFocusIntent }
