'use client'
import { composeRefs } from '@gentleduck/hooks/use-composed-refs'
import React from 'react'

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export function createSlot<T = HTMLElement>(ownerName: string) {
  const SlotClone = createSlotClone<T>(ownerName)

  const Slot = React.forwardRef<T, SlotProps>((props, forwardedRef) => {
    const { children, ...slotProps } = props
    const childrenArray = React.Children.toArray(children)
    const slottable = childrenArray.find(isSlottable)

    if (slottable) {
      // the element passed inside <Slottable>{/* element */}</Slottable>
      const newElement = slottable.props.children
      // replace the slottable placeholder with the actual element to render
      const replacedChildren = childrenArray.map((child) => (child === slottable ? newElement : child))

      return (
        <SlotClone {...slotProps} ref={forwardedRef}>
          {replacedChildren}
        </SlotClone>
      )
    }

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {children}
      </SlotClone>
    )
  })

  Slot.displayName = `${ownerName}.Slot`
  return Slot
}

const Slot = createSlot('Slot')

interface SlotCloneProps {
  children: React.ReactNode
}

function createSlotClone<T = HTMLElement>(ownerName: string) {
  const SlotClone = React.forwardRef<T, SlotCloneProps>((props, forwardedRef) => {
    const { children, ...slotProps } = props
    const childrenArray = React.Children.toArray(children)

    if (childrenArray.length === 0) return null

    // find the first valid React element among children to merge props into
    const firstElementIndex = childrenArray.findIndex((c) => React.isValidElement(c))
    if (firstElementIndex === -1) {
      // no element to merge into — just return children as-is
      return <>{children}</>
    }

    const element = childrenArray[firstElementIndex] as React.ReactElement
    const elementRef = getElementRef(element)
    const merged = mergeProps(slotProps, (element.props as AnyProps) || {})

    // do not pass ref to React.Fragment for React 19 compatibility
    if (element.type !== React.Fragment) {
      merged.ref = forwardedRef ? composeRefs(forwardedRef, elementRef) : elementRef
    }

    const cloned = React.cloneElement(element, merged)

    // rebuild children array with the cloned element in place
    const finalChildren = childrenArray.map((c, idx) => (idx === firstElementIndex ? cloned : c))

    // If there is only one child after replacement, return it directly,
    // otherwise return the array (JSX allows arrays of nodes).
    return finalChildren.length === 1 ? (finalChildren[0] as React.ReactElement) : finalChildren
  })

  SlotClone.displayName = `${ownerName}.SlotClone`
  return SlotClone
}

const SLOTTABLE_IDENTIFIER = Symbol('radix.slottable')

interface SlottableProps {
  children: React.ReactNode
}

interface SlottableComponent extends React.FC<SlottableProps> {
  __radixId: symbol
}

export function createSlottable(ownerName: string) {
  const Slottable: SlottableComponent = ({ children }) => {
    return <>{children}</>
  }
  Slottable.displayName = `${ownerName}.Slottable`
  Slottable.__radixId = SLOTTABLE_IDENTIFIER
  return Slottable
}

const Slottable = createSlottable('Slottable')

type AnyProps = Record<string, any>

function isSlottable(child: React.ReactNode): child is React.ReactElement<SlottableProps, typeof Slottable> {
  return (
    React.isValidElement(child) &&
    typeof child.type === 'function' &&
    '__radixId' in child.type &&
    (child.type as any).__radixId === SLOTTABLE_IDENTIFIER
  )
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // child props override slot props, but handlers compose
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]

    const isHandler = /^on[A-Z]/.test(propName)
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          const result = childPropValue(...args)
          slotPropValue(...args)
          return result
        }
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue }
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ')
    }
  }

  return { ...slotProps, ...overrideProps }
}

function getElementRef(element: React.ReactElement) {
  // React <=18 dev
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && (getter as any).isReactWarning
  if (mayWarn) {
    return (element as any).ref
  }

  // React 19 dev
  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && (getter as any).isReactWarning
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref
  }

  // production
  return (element.props as { ref?: React.Ref<unknown> }).ref || (element as any).ref
}

export { Slot, Slottable }
