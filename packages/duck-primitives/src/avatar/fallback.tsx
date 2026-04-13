import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { ScopedProps } from './avatar'
import { useAvatarContext } from './avatar'

const FALLBACK_NAME = 'AvatarFallback'

type AvatarFallbackElement = React.ComponentRef<typeof Primitive.span>
interface IAvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof Primitive.span> {
  delayMs?: number
}

const AvatarFallback = React.forwardRef<AvatarFallbackElement, IAvatarFallbackProps>(
  (props: ScopedProps<IAvatarFallbackProps>, forwardedRef) => {
    const { __scopeAvatar, delayMs, ...fallbackProps } = props
    const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar)
    const [canRender, setCanRender] = React.useState(delayMs === undefined)

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timerId = window.setTimeout(() => setCanRender(true), delayMs)
        return () => window.clearTimeout(timerId)
      }
    }, [delayMs])

    return canRender && context.imageLoadingStatus !== 'loaded' ? (
      <Primitive.span data-slot="avatar-fallback" dir={context.dir} {...fallbackProps} ref={forwardedRef} />
    ) : null
  },
)

AvatarFallback.displayName = FALLBACK_NAME

export type { IAvatarFallbackProps }
export { AvatarFallback }
