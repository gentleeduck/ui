export type UseLazyLoadOptions = {
  isVisible: boolean
  elementRef: React.RefObject<HTMLDivElement | null>
}

export interface DuckLazyProps extends React.HTMLProps<HTMLDivElement> {
  options: IntersectionObserverInit
}
