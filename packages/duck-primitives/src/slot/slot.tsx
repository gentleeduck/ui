import * as React from 'react'
import { composeRefs } from '../libs/compose-ref'
import type { ISlot } from './slot.types'

/* @__NO_SIDE_EFFECTS__ */ export function createSlot(ownerName: string) {
  const SlotClone = createSlotClone(ownerName)
  const Slot = React.forwardRef<HTMLElement, ISlot.IProps>((props, forwardedRef) => {
    const { children, ...slotProps } = props
    const childrenArray = React.Children.toArray(children)
    const slottable = childrenArray.find(isSlottable)

    if (slottable) {
      const newElement = slottable.props.children

      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (React.Children.count(newElement) > 1) return React.Children.only(null)
          return React.isValidElement(newElement) ? (newElement.props as { children: React.ReactNode }).children : null
        } else {
          return child
        }
      })

      return (
        <SlotClone {...slotProps} ref={forwardedRef}>
          {React.isValidElement(newElement) ? React.cloneElement(newElement, undefined, newChildren) : null}
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

/* @__NO_SIDE_EFFECTS__ */ function createSlotClone(ownerName: string) {
  const SlotClone = React.forwardRef<HTMLElement, ISlot.ICloneProps>((props, forwardedRef) => {
    const { children, ...slotProps } = props

    if (React.isValidElement(children)) {
      const childrenRef = getComponentRef(children)
      const props = mergeProps(slotProps, children.props as AnyProps)
      if (children.type !== React.Fragment) {
        props.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef
      }
      return React.cloneElement(children, props)
    }

    return React.Children.count(children) > 1 ? React.Children.only(null) : null
  })

  SlotClone.displayName = `${ownerName}.SlotClone`
  return SlotClone
}

const SLOTTABLE_IDENTIFIER = Symbol('gentleduck.slottable')

/* @__NO_SIDE_EFFECTS__ */ export function createSlottable(ownerName: string) {
  const Slottable: ISlot.ISlottableComponent = ({ children }) => {
    return <>{children}</>
  }
  Slottable.displayName = `${ownerName}.Slottable`
  Slottable.__radixId = SLOTTABLE_IDENTIFIER
  return Slottable
}

const Slottable = createSlottable('Slottable')

/** @internal */
type AnyProps = { ref?: React.Ref<unknown> | undefined; [key: string]: unknown }

/** @internal */
function isSlottable(child: React.ReactNode): child is React.ReactElement<ISlot.ISlottableProps, typeof Slottable> {
  return (
    React.isValidElement(child) &&
    typeof child.type === 'function' &&
    '__radixId' in child.type &&
    child.type.__radixId === SLOTTABLE_IDENTIFIER
  )
}

/** @internal */
function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]

    const isHandler = /^on[A-Z]/.test(propName)
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          const result = (childPropValue as (...a: unknown[]) => unknown)(...args)
          ;(slotPropValue as (...a: unknown[]) => unknown)(...args)
          return result
        }
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...(slotPropValue as object), ...(childPropValue as object) }
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ')
    }
  }

  return { ...slotProps, ...overrideProps }
}

/**
 * @internal
 * Before React 19 accessing `element.props.ref` will throw a warning and suggest using `element.ref`
 * After React 19 accessing `element.ref` does the opposite.
 */
function getComponentRef(element: React.ReactElement) {
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element as React.ReactElement & { ref?: React.Ref<unknown> }).ref
  }

  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref
  }

  return (
    (element.props as { ref?: React.Ref<unknown> }).ref ||
    (element as React.ReactElement & { ref?: React.Ref<unknown> }).ref
  )
}

export { Slot, Slottable }
