import type * as React from 'react'
import type { Direction } from '../direction'

export { focusFirst, wrapArray } from '../libs/shared-utils'
export type { Direction }

type Orientation = React.AriaAttributes['aria-orientation']
type FocusIntent = 'first' | 'last' | 'prev' | 'next'

const MAP_KEY_TO_FOCUS_INTENT: Record<string, FocusIntent> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}

function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== 'rtl') return key
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key
}

/** Determines the focus intent from a keyboard event based on orientation and direction. */
function getFocusIntent(event: React.KeyboardEvent, orientation?: Orientation, dir?: Direction) {
  const key = getDirectionAwareKey(event.key, dir)
  if (orientation === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(key)) return undefined
  if (orientation === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(key)) return undefined
  return MAP_KEY_TO_FOCUS_INTENT[key]
}

export type { FocusIntent, Orientation }
export { getFocusIntent }
