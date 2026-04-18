import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'

export namespace IInputOTP {
  export type IScoped<TProps> = TProps & { __scopeInputOTP?: Scope }

  export interface IContext {
    value?: string | undefined
    inputsRef: React.RefObject<HTMLInputElement[]>
    wrapperRef: React.RefObject<HTMLDivElement | null>
    dir: IDirection.Kind
    maxLength?: number | undefined
  }

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
  type PrimitiveInputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>

  export interface IProps extends Omit<PrimitiveDivProps, 'onChange'> {
    value?: string
    onValueChange?: (value: string) => void
    pattern?: RegExp
    dir?: IDirection.Kind
    maxLength?: number
    name?: string
  }

  export interface IGroupProps extends PrimitiveDivProps {}

  export interface ISeparatorProps extends PrimitiveDivProps {
    customIndicator?: React.ReactNode
  }

  export interface ISlotProps extends PrimitiveInputProps {}
}
