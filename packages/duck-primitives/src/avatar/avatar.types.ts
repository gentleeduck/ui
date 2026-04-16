import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'
import type { ImageLoadingStatus } from './avatar.libs'

export namespace IAvatar {
  export type IScoped<TProps> = TProps & { __scopeAvatar?: Scope }

  export interface IContext {
    imageLoadingStatus: ImageLoadingStatus
    onImageLoadingStatusChange(status: ImageLoadingStatus): void
    dir: IDirection.Kind
  }

  export interface IProps extends React.ComponentPropsWithoutRef<typeof Primitive.span> {
    dir?: IDirection.Kind
  }

  export interface IFallbackProps extends React.ComponentPropsWithoutRef<typeof Primitive.span> {
    delayMs?: number
  }

  export interface IImageProps extends React.ComponentPropsWithoutRef<typeof Primitive.img> {
    src?: string
    onLoadingStatusChange?: (status: ImageLoadingStatus) => void
  }
}
