import type * as React from 'react'

export namespace IDirection {
  export type Kind = 'ltr' | 'rtl'

  export interface IProviderProps {
    children?: React.ReactNode
    dir: Kind
  }
}
