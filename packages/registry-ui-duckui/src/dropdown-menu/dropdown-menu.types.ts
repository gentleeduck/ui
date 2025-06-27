/**
 * Props for the DropdownMenuShortcutProps component (also used as CommandShortcut).
 * This component displays a badge that indicates the keyboard shortcut for a command.
 */
export interface DropdownMenuShortcutProps extends React.HTMLProps<HTMLElement> {
  colored?: boolean
  /** The keyboard shortcut keys (e.g., "ctrl+K"). */
  keys: string
  /** Callback function that is invoked when the shortcut keys are pressed. */
  onKeysPressed: () => void
}

export interface DropdownMenuContextType {
  wrapperRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  groupsRef: React.RefObject<HTMLDivElement[]>
  itemsRef: React.RefObject<HTMLLIElement[]>
  originalItemsRef: React.RefObject<HTMLLIElement[]>
  selectedItemRef: React.RefObject<HTMLLIElement | null>
}
