export interface DrawerContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
  shouldScaleBackground: boolean
  setBackgroundColorOnScale: boolean
  noBodyStyles: boolean
  direction: 'top' | 'bottom' | 'left' | 'right'
  disablePreventScroll: boolean
  ref: React.RefObject<HTMLDialogElement | null>
}

export type DrawerProps = {
  children: React.ReactNode
} & Partial<Omit<DrawerContextType, 'ref'>>
