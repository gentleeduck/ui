'use client'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import { useLazyImage } from './lazy-image.hooks'
import type { ILazyImage } from './lazy-image.types'

/**
 * Lazily renders an image, showing `placeholder` until the real `src` is in view and loaded.
 * Pass `nextImage` to render via `next/image` instead of a plain `<img>`.
 * Throws when `src` is missing.
 */
export function DuckLazyImage(props: ILazyImage.IProps): React.JSX.Element {
  if (!props.src) {
    throw new Error('src is required')
  }

  const { isLoaded, imageRef } = useLazyImage(props.src, {
    rootMargin: '200px',
    threshold: 0.1,
    ...props.options,
  })

  return (
    <div className="relative overflow-hidden" ref={imageRef} style={{ transform: 'translate3d(0,0,0)' }}>
      <PlaceHolder
        alt="Image is loading..."
        aria-hidden={isLoaded ? 'true' : 'false'}
        className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'} ${props.nextImage && 'opacity-100'}`}
        src={isLoaded ? props.src : (props.placeholder ?? '')}
        {...props}
      />

      {!props.nextImage && (
        <output
          aria-hidden={isLoaded ? 'true' : 'false'}
          aria-live="polite"
          className={`absolute inset-0 animate-pulse transition-all ${
            isLoaded ? 'bg-transparent opacity-0' : 'bg-muted opacity-100'
          }`}
        />
      )}
    </div>
  )
}

/** @internal Renders the actual `<img>` (or `next/image`) for `DuckLazyImage`. */
function PlaceHolder({
  width = 200,
  height = 200,
  src,
  loading,
  decoding,
  alt,
  nextImage,
  ...props
}: Omit<ILazyImage.IProps, 'placeholder'>): React.JSX.Element {
  const Component = nextImage ? Image : 'img'
  return (
    <Component
      alt={alt as string}
      decoding={decoding ?? 'async'}
      height={height}
      loading={loading ?? 'lazy'}
      src={src as (string | StaticImport) & string}
      style={{ transform: 'translate3d(0,0,0)' }}
      width={width}
      {...(props as Record<string, unknown>)}
    />
  )
}
