/**
 * Props for the Command component.
 * This component acts as a container for the command palette and provides the command context.
 */
export interface CommandProps extends React.HTMLProps<HTMLDivElement> {}

/**
 * Props for the CommandInput component.
 * This component renders an input field for searching through the command items.
 */
export interface CommandInputProps extends React.HTMLProps<HTMLInputElement> {}

/**
 * Props for the CommandList component.
 * The children property is a render function that receives the current search string,
 * allowing dynamic filtering of command items.
 */
export interface CommandListProps
  extends Omit<React.HTMLProps<HTMLUListElement>, 'children'> {
  /** A render function that returns the command items.*/
  children: (/** The current search string */ search: string) => React.ReactNode
}

/**
 * Props for the CommandGroup component.
 * This component is used to group command items under a common heading.
 */
export interface CommandGroupProps extends React.HTMLProps<HTMLDivElement> {
  /** The title for the command group. */
  heading: string
}

/**
 * Props for the CommandItem component.
 * Represents an individual command item in the command palette.
 */
export interface CommandItemProps extends React.HTMLProps<HTMLLIElement> {}

/**
 * Props for the CommandEmpty component.
 * Rendered when no command items match the current search query.
 */
export interface CommandEmptyProps
  extends React.HTMLProps<HTMLHeadingElement> {}

/**
 * Type for the context used within the Command components.
 * This context provides the current search query and a function to update it.
 */
export type CommandContextType = {
  /** The current search query. */
  search: string
  /** A function to update the search query. */
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Props for the CommandSeparator component.
 * This component renders a visual separator between command groups or items.
 */
export interface CommandSeparatorProps
  extends React.HTMLProps<HTMLDivElement> {}

/**
 * Props for the CommandBadge component (also used as CommandShortcut).
 * This component displays a badge that indicates the keyboard shortcut for a command.
 */
export interface CommandBadgeProps extends React.HTMLProps<HTMLElement> {
  /** The keyboard shortcut keys (e.g., "ctrl+K"). */
  keys: string
  /** Callback function that is invoked when the shortcut keys are pressed. */
  onKeysPressed: () => void
}
