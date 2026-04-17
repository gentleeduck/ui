import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'

export namespace IToggle {
  export type IScoped<TProps> = TProps & { __scopeToggle?: Scope }

  export interface IContext {
    pressed: boolean
    disabled: boolean
    dir: IDirection.Kind
  }

  type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

  export interface IProps extends PrimitiveButtonProps {
    pressed?: boolean
    defaultPressed?: boolean
    onPressedChange?(pressed: boolean): void
    dir?: IDirection.Kind
  }
}
