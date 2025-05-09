export type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';
export interface SnapPoint {
  fraction: number;
  height: number;
}

export type AnyFunction = (...args: any) => any;

export interface DrawerContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
  shouldScaleBackground: boolean
  setBackgroundColorOnScale: boolean
  noBodyStyles: boolean
  direction: 'top' | 'bottom' | 'left' | 'right'
  ref: React.RefObject<HTMLDialogElement | null>
}

export type DrawerProps = {
  children: React.ReactNode
} & Partial<Omit<DrawerContextType, 'ref'>>