import { useIntersectionOnce } from '../use-intersection-once'
import type { UseLazyLoadReturn } from './lazy-component.types'

export const useLazyLoad = (options?: IntersectionObserverInit): UseLazyLoadReturn => {
  const { ref, intersected } = useIntersectionOnce<HTMLDivElement>(options)
  return { isVisible: intersected, ref }
}
