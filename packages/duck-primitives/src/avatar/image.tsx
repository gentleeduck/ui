import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { Primitive } from '../primitive-elements'
import { useAvatarContext } from './avatar'
import type { ImageLoadingStatus } from './avatar.libs'
import { useImageLoadingStatus } from './avatar.libs'
import type { IAvatar } from './avatar.types'

const IMAGE_NAME = 'AvatarImage'

type AvatarImageElement = React.ComponentRef<typeof Primitive.img>

const AvatarImage = React.forwardRef<AvatarImageElement, IAvatar.IImageProps>(
  (props: IAvatar.IScoped<IAvatar.IImageProps>, forwardedRef) => {
    const { __scopeAvatar, src, onLoadingStatusChange = () => {}, ...imageProps } = props
    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar)
    const imageLoadingStatus = useImageLoadingStatus(src, imageProps)
    const handleLoadingStatusChange = useCallbackRef((status: ImageLoadingStatus) => {
      onLoadingStatusChange(status)
      context.onImageLoadingStatusChange(status)
    })

    useLayoutEffect(() => {
      if (imageLoadingStatus !== 'idle') {
        handleLoadingStatusChange(imageLoadingStatus)
      }
    }, [imageLoadingStatus, handleLoadingStatusChange])

    return imageLoadingStatus === 'loaded' ? (
      // biome-ignore lint/performance/noImgElement: avatar primitive needs raw <img> for framework-agnostic usage
      <Primitive.img data-slot="avatar-image" dir={context.dir} {...imageProps} ref={forwardedRef} src={src} />
    ) : null
  },
)

AvatarImage.displayName = IMAGE_NAME

export { AvatarImage }
