export interface CommandBadgeProps extends React.HTMLProps<HTMLElement> {
  variant?: 'default' | 'secondary'
  /** The keyboard shortcut keys (e.g., "ctrl+K"). */
  keys?: string
  /** Callback function that is invoked when the shortcut keys are pressed. */
  onKeysPressed?: () => void
}
