import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'

export namespace IProgress {
  export type IScoped<TProps> = TProps & { __scopeProgress?: Scope }

  export interface IContext {
    value: number | null
    max: number
    dir: IDirection.Kind
  }

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

  export interface IProps extends PrimitiveDivProps {
    value?: number | null | undefined
    max?: number
    getValueLabel?(value: number, max: number): string
    dir?: IDirection.Kind
  }

  export interface IIndicatorProps extends PrimitiveDivProps {}
}
