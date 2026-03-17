import * as React from 'react'
import { useLayoutEffect } from '../hooks/use-layout-effect'

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

function resolveLoadingStatus(image: HTMLImageElement | null, src?: string): ImageLoadingStatus {
  if (!image) {
    return 'idle'
  }
  if (!src) {
    return 'error'
  }
  if (image.src !== src) {
    image.src = src
  }
  return image.complete && image.naturalWidth > 0 ? 'loaded' : 'loading'
}

function subscribe() {
  return () => {}
}

function useIsHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

function useImageLoadingStatus(
  src: string | undefined,
  { referrerPolicy, crossOrigin }: Pick<React.ComponentPropsWithoutRef<'img'>, 'referrerPolicy' | 'crossOrigin'>,
) {
  const isHydrated = useIsHydrated()
  const imageRef = React.useRef<HTMLImageElement | null>(null)
  const image = (() => {
    if (!isHydrated) return null
    if (!imageRef.current) {
      imageRef.current = new window.Image()
    }
    return imageRef.current
  })()

  const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>(() => resolveLoadingStatus(image, src))

  useLayoutEffect(() => {
    setLoadingStatus(resolveLoadingStatus(image, src))
  }, [image, src])

  useLayoutEffect(() => {
    const updateStatus = (status: ImageLoadingStatus) => () => {
      setLoadingStatus(status)
    }

    if (!image) return

    const handleLoad = updateStatus('loaded')
    const handleError = updateStatus('error')
    image.addEventListener('load', handleLoad)
    image.addEventListener('error', handleError)
    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy
    }
    if (typeof crossOrigin === 'string') {
      image.crossOrigin = crossOrigin
    }

    return () => {
      image.removeEventListener('load', handleLoad)
      image.removeEventListener('error', handleError)
    }
  }, [image, crossOrigin, referrerPolicy])

  return loadingStatus
}

export type { ImageLoadingStatus }
export { useImageLoadingStatus }
