import type * as React from 'react'

export namespace ISlot {
  export interface IProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode
  }

  export interface ICloneProps {
    children: React.ReactNode
  }

  export interface ISlottableProps {
    children: React.ReactNode
  }

  export interface ISlottableComponent extends React.FC<ISlottableProps> {
    __radixId: symbol
  }
}
