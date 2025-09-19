import React from 'react'
import { DrawerDirection } from './types'

interface DrawerContextValue {
  drawerRef: React.RefObject<HTMLDivElement | null>
  overlayRef: React.RefObject<HTMLDivElement | null>
  onPress: (event: React.PointerEvent<HTMLDivElement>) => void
  onRelease: (event: React.PointerEvent<HTMLDivElement> | null) => void
  onDrag: (event: React.PointerEvent<HTMLDivElement>) => void
  onNestedDrag: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void
  onNestedOpenChange: (o: boolean) => void
  onNestedRelease: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void
  dismissible: boolean
  isOpen: boolean
  isDragging: boolean
  keyboardIsOpen: React.MutableRefObject<boolean>
  snapPointsOffset: number[] | null
  snapPoints?: (number | string)[] | null
  activeSnapPointIndex?: number | null
  modal: boolean
  shouldFade: boolean
  activeSnapPoint?: number | string | null
  setActiveSnapPoint: (o: number | string | null) => void
  closeDrawer: () => void
  openProp?: boolean
  onOpenChange?: (o: boolean) => void
  direction: DrawerDirection
  shouldScaleBackground: boolean
  setBackgroundColorOnScale: boolean
  noBodyStyles: boolean
  handleOnly?: boolean
  container?: HTMLElement | null
  autoFocus?: boolean
  shouldAnimate?: React.RefObject<boolean>
}

export const DrawerContext = React.createContext<DrawerContextValue>({
  activeSnapPoint: null,
  autoFocus: false,
  closeDrawer: () => {},
  container: null,
  direction: 'bottom',
  dismissible: false,
  drawerRef: { current: null },
  handleOnly: false,
  isDragging: false,
  isOpen: false,
  keyboardIsOpen: { current: false },
  modal: false,
  noBodyStyles: false,
  onDrag: () => {},
  onNestedDrag: () => {},
  onNestedOpenChange: () => {},
  onNestedRelease: () => {},
  onOpenChange: () => {},
  onPress: () => {},
  onRelease: () => {},
  openProp: undefined,
  overlayRef: { current: null },
  setActiveSnapPoint: () => {},
  setBackgroundColorOnScale: true,
  shouldAnimate: { current: true },
  shouldFade: false,
  shouldScaleBackground: false,
  snapPoints: null,
  snapPointsOffset: null,
})

export const useDrawerContext = () => {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawerContext must be used within a Drawer.Root')
  }
  return context
}
