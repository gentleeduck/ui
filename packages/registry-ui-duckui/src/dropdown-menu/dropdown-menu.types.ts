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
  /** Ref to the button that opens the menu */
  triggerRef: React.RefObject<HTMLButtonElement | null>
  /** Ref to the menu content container */
  contentRef: React.RefObject<HTMLDivElement | null>
  /** Refs to all group containers inside the menu */
  groupsRef: React.RefObject<HTMLDivElement[]>
  /** Refs to all currently visible menu items */
  itemsRef: React.RefObject<HTMLLIElement[]>
  /** Refs to the original unfiltered menu items */
  originalItemsRef: React.RefObject<HTMLLIElement[]>
  /** Ref to the currently selected/focused item */
  selectedItemRef: React.RefObject<HTMLLIElement | null>
  /** Whether the menu is currently open */
  open: boolean
  /** Callback function that is invoked when the menu is opened or closed */
  onOpenChange: (open: boolean) => void
}

export type DropdownMenuSubContextType = DropdownMenuContextType
