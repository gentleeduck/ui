import * as React from 'react'
import { flushSync } from 'react-dom'
import { createSlot } from '../slot'

/* -------------------------------------------------------------------------------------------------
 * Primitive
 *
 * A collection of low-level HTML element wrappers that support the `asChild`
 * prop for component composition. When asChild is true, the component renders
 * its child via the Slot system instead of the native element.
 *
 * Usage: <Primitive.button asChild><MyButton /></Primitive.button>
 * -----------------------------------------------------------------------------------------------*/

const NODES = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'span',
  'svg',
  'ul',
] as const

type Node = (typeof NODES)[number]

export type PrimitivePropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E> & {
  asChild?: boolean
}

type PrimitiveComponent<E extends React.ElementType> = React.ForwardRefExoticComponent<PrimitivePropsWithRef<E>>

type Primitives = { [E in Node]: PrimitiveComponent<E> }

function markGentleduckInWindow(): void {
  if (typeof window !== 'undefined') {
    ;(window as unknown as Record<symbol, boolean>)[Symbol.for('gentleduck-ui')] = true
  }
}

function createPrimitive<E extends Node>(node: E): PrimitiveComponent<E> {
  const Slot = createSlot(`Primitive.${node}`)

  const PrimitiveNode = React.forwardRef<React.ElementRef<E>, PrimitivePropsWithRef<E>>(
    ({ asChild, ...primitiveProps }, forwardedRef) => {
      const Comp = (asChild ? Slot : node) as React.ElementType

      markGentleduckInWindow()

      return <Comp {...primitiveProps} ref={forwardedRef} />
    },
  )

  PrimitiveNode.displayName = `Primitive.${node}`

  return PrimitiveNode as unknown as PrimitiveComponent<E>
}

const Primitive = {} as Primitives

for (const node of NODES) {
  Primitive[node] = createPrimitive(node)
}

/* -------------------------------------------------------------------------------------------------
 * dispatchDiscreteCustomEvent
 *
 * Dispatches a custom event inside flushSync to ensure React processes the
 * resulting state update synchronously (required for discrete user events).
 * -----------------------------------------------------------------------------------------------*/

function dispatchDiscreteCustomEvent<E extends CustomEvent>(target: E['target'], event: E) {
  if (target) flushSync(() => target.dispatchEvent(event))
}

export { Primitive, dispatchDiscreteCustomEvent }
