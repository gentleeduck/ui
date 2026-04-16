import * as React from 'react'
import { createSlot } from '../slot'
import type { IPrimitive } from './primitive-elements.types'

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

type Primitives = { [E in Node]: IPrimitive.IComponent<E> }

/** @internal */
function markGentleduckInWindow(): void {
  if (typeof window !== 'undefined') {
    ;(window as unknown as Record<symbol, boolean>)[Symbol.for('gentleduck-ui')] = true
  }
}

/** @internal */
function createPrimitive<E extends Node>(node: E): IPrimitive.IComponent<E> {
  const Slot = createSlot(`Primitive.${node}`)

  const PrimitiveNode = React.forwardRef<React.ComponentRef<E>, IPrimitive.IPropsWithRef<E>>(
    ({ asChild, ...primitiveProps }, forwardedRef) => {
      const Comp = (asChild ? Slot : node) as React.ElementType

      markGentleduckInWindow()

      return <Comp {...primitiveProps} ref={forwardedRef} />
    },
  )

  PrimitiveNode.displayName = `Primitive.${node}`

  return PrimitiveNode as unknown as IPrimitive.IComponent<E>
}

const Primitive = {} as Primitives

for (const node of NODES) {
  Primitive[node] = createPrimitive(node)
}

export { Primitive }
