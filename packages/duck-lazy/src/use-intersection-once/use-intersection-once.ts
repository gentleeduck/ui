import React from 'react'

/** Single-fire IntersectionObserver. `threshold` array stringified into deps so inline literals don't churn. */
export function useIntersectionOnce<T extends Element>(
  options?: IntersectionObserverInit,
): {
  ref: React.RefObject<T | null>
  intersected: boolean
} {
  const ref = React.useRef<T | null>(null)
  const [intersected, setIntersected] = React.useState(false)

  const root = options?.root ?? null
  const rootMargin = options?.rootMargin
  const threshold = options?.threshold
  const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : String(threshold)

  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIntersected(true)
          observer.disconnect()
        }
      },
      { root, rootMargin, threshold },
    )

    observer.observe(el)

    return () => {
      observer.unobserve(el)
      observer.disconnect()
    }
    // threshold is intentionally tracked via thresholdKey to allow array literals
    // biome-ignore lint/correctness/useExhaustiveDependencies: thresholdKey is the stable identity for `threshold`
  }, [root, rootMargin, thresholdKey])

  return { intersected, ref }
}
