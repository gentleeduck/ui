import type * as React from 'react'

export namespace ILazyImage {
  export interface IUseLazyImageReturn {
    isLoaded: boolean
    imageRef: React.RefObject<HTMLImageElement | null>
  }

  export interface IProps
    extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    options?: IntersectionObserverInit
    placeholder?: string | undefined
    nextImage?: boolean
    width: number | `${number}`
    height: number | `${number}`
  }
}
