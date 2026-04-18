import type * as React from 'react'

export namespace ILazyComponent {
  export interface IUseLazyLoadReturn {
    isVisible: boolean
    ComponentRef: React.RefObject<HTMLDivElement | null>
  }

  export interface IProps extends React.HTMLProps<HTMLDivElement> {
    options?: IntersectionObserverInit
  }
}
