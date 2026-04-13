/**
 * Props for the CommandBadge component (also used as CommandShortcut).
 * This component displays a badge that indicates the keyboard shortcut for a command.
 */
export interface ICommandBadgeProps extends React.HTMLProps<HTMLElement> {
  variant?: 'default' | 'secondary'
  /** The keyboard shortcut keys (e.g., "ctrl+K"). */
  keys?: string
  /** Callback function that is invoked when the shortcut keys are pressed. */
  onKeysPressed?: () => void
}
