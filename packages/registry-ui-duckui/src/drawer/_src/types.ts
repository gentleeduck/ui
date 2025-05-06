export type DrawerDirection = 'top' | 'bottom' | 'left' | 'right'
export interface SnapPoint {
  fraction: number
  height: number
}

// biome ignore lint/suspicious/noExplicitAny
export type AnyFunction = (...args: any) => any
