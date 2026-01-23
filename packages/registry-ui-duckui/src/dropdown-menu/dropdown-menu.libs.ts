import type React from 'react'

export function initRefs(
  groupsRef: React.RefObject<HTMLDivElement[] | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  originalItemsRef: React.RefObject<HTMLLIElement[]>,
  onOpenChange: (open: boolean) => void,
  sub: boolean,
) {
  const groups = contentRef.current?.querySelectorAll('[duck-dropdown-menu-group]')
  const items = contentRef.current?.querySelectorAll(
    sub
      ? '[duck-dropdown-menu-item]:not([duck-dropdown-menu-sub-trigger]):not([aria-disabled])'
      : `[duck-dropdown-menu-item]:not([aria-disabled]):not([duck-dropdown-menu-sub-content] [duck-dropdown-menu-item]), [duck-dropdown-menu-sub-trigger]`,
  ) as unknown as HTMLLIElement[]

  groupsRef.current = Array.from(groups ?? []) as HTMLDivElement[]
  itemsRef.current = Array.from(items ?? []) as HTMLLIElement[]
  originalItemsRef.current = Array.from(items ?? []) as HTMLLIElement[]

  for (let i = 0; i < itemsRef.current?.length; i++) {
    const item = itemsRef.current[i] as HTMLLIElement

    if (!item.hasAttribute('duck-dropdown-menu-sub-trigger')) {
      item.addEventListener('click', () => {
        onOpenChange(false)
      })
    }
  }
}
