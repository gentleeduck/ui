import * as React from 'react'
import { useDirection } from '../direction'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { IAvatar } from './avatar.types'

const AVATAR_NAME = 'Avatar'

const [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME)

const [AvatarProvider, useAvatarContext] = createAvatarContext<IAvatar.IContext>(AVATAR_NAME)

type AvatarElement = React.ComponentRef<typeof Primitive.span>

const Avatar = React.forwardRef<AvatarElement, IAvatar.IProps>(
  (props: IAvatar.IScoped<IAvatar.IProps>, forwardedRef) => {
    const { __scopeAvatar, dir, ...avatarProps } = props
    const direction = useDirection(dir)
    const [imageLoadingStatus, setImageLoadingStatus] = React.useState<IAvatar.IContext['imageLoadingStatus']>('idle')
    return (
      <AvatarProvider
        scope={__scopeAvatar}
        imageLoadingStatus={imageLoadingStatus}
        onImageLoadingStatusChange={setImageLoadingStatus}
        dir={direction}>
        <Primitive.span data-slot="avatar" dir={direction} {...avatarProps} ref={forwardedRef} />
      </AvatarProvider>
    )
  },
)

Avatar.displayName = AVATAR_NAME

export { Avatar, createAvatarScope, useAvatarContext }
