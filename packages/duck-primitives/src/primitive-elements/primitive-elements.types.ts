import type * as React from 'react'

export namespace IPrimitive {
  export type IPropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E> & {
    asChild?: boolean
  }

  export type IComponent<E extends React.ElementType> = React.ForwardRefExoticComponent<IPropsWithRef<E>>
}
