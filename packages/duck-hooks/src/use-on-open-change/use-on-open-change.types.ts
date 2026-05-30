import type * as React from 'react'

export namespace IUseOnOpenChange {
  export interface IReturn {
    onOpenChange: (state: boolean) => void
    open: boolean
    ref: React.RefObject<HTMLElement | null>
  }
}
