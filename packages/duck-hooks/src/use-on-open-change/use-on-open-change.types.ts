import type * as React from 'react'

export namespace IUseOnOpenChange {
  export interface IReturn<T extends React.RefObject<HTMLElement | null>> {
    onOpenChange: (state: boolean) => void
    open: boolean
    ref: T
  }
}
