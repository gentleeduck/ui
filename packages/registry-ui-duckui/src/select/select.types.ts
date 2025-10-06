export interface SelectContextType {
  open: boolean
  value: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  groupsRef: React.RefObject<HTMLUListElement[] | null>
  itemsRef: React.RefObject<HTMLLIElement[] | null>
  selectedItem: HTMLLIElement | null
  scrollable: boolean
}
