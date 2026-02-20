import * as React from 'react'
import { composeRefs } from '../libs/compose-ref'

/* -------------------------------------------------------------------------------------------------
 * Slot
 *
 * Enables component composition via the "asChild" pattern. When a Slot wraps
 * a Slottable child, it replaces the rendered element with the Slottable's
 * child while merging props (event handlers compose, styles/classNames merge).
 *
 * createSlot and createSlottable produce named instances for better debugging.
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

/* @__NO_SIDE_EFFECTS__ */ export function createSlot(ownerName: string) {
  const SlotClone = createSlotClone(ownerName)
  const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
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

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 *
 * Internal component that clones its single child element, merging in the
 * slot's props and composing refs. Throws if given more than one child.
 * -----------------------------------------------------------------------------------------------*/

interface SlotCloneProps {
  children: React.ReactNode
}

/* @__NO_SIDE_EFFECTS__ */ function createSlotClone(ownerName: string) {
  const SlotClone = React.forwardRef<HTMLElement, SlotCloneProps>((props, forwardedRef) => {
    const { children, ...slotProps } = props

    if (React.isValidElement(children)) {
      const childrenRef = getElementRef(children)
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

/* -------------------------------------------------------------------------------------------------
 * Slottable
 *
 * Wrapper component that marks its children as the "slot target".
 * When placed inside a Slot, its child element replaces the Slot's element.
 * Identified via a symbol marker (__gentleduckId) rather than instanceof checks
 * to work across module boundaries.
 * -----------------------------------------------------------------------------------------------*/

const SLOTTABLE_IDENTIFIER = Symbol('gentleduck.slottable')

interface SlottableProps {
  children: React.ReactNode
}

interface SlottableComponent extends React.FC<SlottableProps> {
  __gentleduckId: symbol
}

/* @__NO_SIDE_EFFECTS__ */ export function createSlottable(ownerName: string) {
  const Slottable: SlottableComponent = ({ children }) => {
    return <>{children}</>
  }
  Slottable.displayName = `${ownerName}.Slottable`
  Slottable.__gentleduckId = SLOTTABLE_IDENTIFIER
  return Slottable
}

const Slottable = createSlottable('Slottable')

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

type AnyProps = Record<string, any>

function isSlottable(child: React.ReactNode): child is React.ReactElement<SlottableProps, typeof Slottable> {
  return (
    React.isValidElement(child) &&
    typeof child.type === 'function' &&
    '__gentleduckId' in child.type &&
    child.type.__gentleduckId === SLOTTABLE_IDENTIFIER
  )
}

/** Merges slot props with child props. Handlers compose, styles/classNames merge. */
function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
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

/**
 * Accesses a ReactElement's ref without triggering version-specific warnings.
 * React 18 DEV warns on element.props.ref, React 19 DEV warns on element.ref.
 */
function getElementRef(element: React.ReactElement) {
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element as unknown as { ref?: React.Ref<unknown> }).ref
  }

  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref
  }

  return (element.props as { ref?: React.Ref<unknown> }).ref || (element as unknown as { ref?: React.Ref<unknown> }).ref
}

export { Slot, Slottable, Slot as Root }
export type { SlotProps }
