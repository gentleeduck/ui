import * as React from 'react'
import type { Direction } from '../direction'
import { useDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { ImageLoadingStatus } from './avatar.libs'

const AVATAR_NAME = 'Avatar'

type ScopedProps<P> = P & { __scopeAvatar?: Scope }
const [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME)

type AvatarContextValue = {
  imageLoadingStatus: ImageLoadingStatus
  onImageLoadingStatusChange(status: ImageLoadingStatus): void
  dir: Direction
}

const [AvatarProvider, useAvatarContext] = createAvatarContext<AvatarContextValue>(AVATAR_NAME)

type AvatarElement = React.ComponentRef<typeof Primitive.span>
interface IAvatarProps extends React.ComponentPropsWithoutRef<typeof Primitive.span> {
  dir?: Direction
}

const Avatar = React.forwardRef<AvatarElement, IAvatarProps>((props: ScopedProps<IAvatarProps>, forwardedRef) => {
  const { __scopeAvatar, dir, ...avatarProps } = props
  const direction = useDirection(dir)
  const [imageLoadingStatus, setImageLoadingStatus] = React.useState<ImageLoadingStatus>('idle')
  return (
    <AvatarProvider
      scope={__scopeAvatar}
      imageLoadingStatus={imageLoadingStatus}
      onImageLoadingStatusChange={setImageLoadingStatus}
      dir={direction}>
      <Primitive.span data-slot="avatar" dir={direction} {...avatarProps} ref={forwardedRef} />
    </AvatarProvider>
  )
})

Avatar.displayName = AVATAR_NAME

export type { IAvatarProps, ScopedProps }
export { Avatar, createAvatarScope, useAvatarContext }
