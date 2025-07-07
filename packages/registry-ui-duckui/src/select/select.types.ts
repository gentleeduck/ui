export interface SelectContextType {
  open: boolean
  value: string
  wrapperRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<HTMLDivElement | null>
  contentRef: React.RefObject<HTMLDialogElement | null>
  groupsRef: React.RefObject<HTMLUListElement[] | null>
  itemsRef: React.RefObject<HTMLLIElement[] | null>
  selectedItem: HTMLLIElement | null
  scrollable: boolean
}
