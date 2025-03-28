export interface CommandProps extends React.HTMLProps<HTMLDivElement> {}

export interface CommandInputProps extends React.HTMLProps<HTMLInputElement> {}

export interface CommandListProps
  extends Omit<React.HTMLProps<HTMLUListElement>, 'children'> {
  children: (search: string) => React.ReactNode
}

export interface CommandItemProps extends React.HTMLProps<HTMLLIElement> {}

export interface CommandEmptyProps
  extends React.HTMLProps<HTMLHeadingElement> {}

export interface CommandBadgeProps extends React.HTMLProps<HTMLElement> {
  keys: string
  onKeysPressed: () => void
}
