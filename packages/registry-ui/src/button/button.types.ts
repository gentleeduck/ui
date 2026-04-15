/**
 * Props for the Button component, combining native button attributes, variant styles, and custom options.
 */
export interface IButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'>, IButtonProps.IVariants {
  /** Render as child component using Slot (e.g., for custom wrappers) */
  asChild?: boolean
  /** Controls collapsed state for buttons like sidebar toggles */
  isCollapsed?: boolean
  /** Shows loading state/spinner in the button */
  loading?: boolean
  /** Primary icon to display in the button */
  icon?: React.ReactNode
  /** Secondary icon (e.g., for split actions or toggles) */
  secondIcon?: React.ReactNode
}

export namespace IButtonProps {
  export type IBorder = 'default' | 'destructive' | 'primary' | 'secondary' | 'warning'

  export type ISize = 'default' | 'icon' | 'icon-lg' | 'icon-sm' | 'lg' | 'sm'

  export type IVariant =
    | 'dashed'
    | 'default'
    | 'destructive'
    | 'expandIcon'
    | 'ghost'
    | 'link'
    | 'nothing'
    | 'outline'
    | 'secondary'
    | 'warning'

  export interface IVariants {
    border?: IBorder
    size?: ISize
    variant?: IVariant
  }
}

/**
 * Props for components that support optional animated icons.
 */
export interface IButtonAnimationIconProps {
  /** The content inside the icon wrapper */
  children: React.ReactNode
  /**
   * Optional animated icon configuration.
   * Modify the variant to use animation styles.
   */
  animationIcon?: {
    /** Icon to animate (if applicable) */
    icon?: React.ReactNode
    /** Determines icon position relative to the children */
    iconPlacement?: 'left' | 'right'
  }
}
