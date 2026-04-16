import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'

export namespace IPagination {
  export type IScoped<TProps> = TProps & { __scopePagination?: Scope }

  export interface IContext {
    dir: IDirection.Kind
  }

  type PrimitiveNavProps = React.ComponentPropsWithoutRef<typeof Primitive.nav>
  type PrimitiveUlProps = React.ComponentPropsWithoutRef<typeof Primitive.ul>
  type PrimitiveLiProps = React.ComponentPropsWithoutRef<typeof Primitive.li>

  export interface IProps extends PrimitiveNavProps {
    dir?: IDirection.Kind
  }

  export interface IContentProps extends PrimitiveUlProps {}
  export interface IItemProps extends PrimitiveLiProps {}
}
