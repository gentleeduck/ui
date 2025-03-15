import React from 'react'

export const useLazyImage = (
  src: string,
  options?: IntersectionObserverInit,
) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imageRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true)
        observer.disconnect() // Stop observing once the image is in view
      }
    }, options)

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [options])

  React.useEffect(() => {
    if (!isInView) return

    const img = new Image()
    img.src = src
    img.onload = () => {
      setIsLoaded(true)
    }
  }, [isInView, src])

  return { isLoaded, imageRef }
}
