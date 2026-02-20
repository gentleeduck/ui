import "react";
import "react/jsx-runtime";
import * as _gentleduck_variants0 from "@gentleduck/variants";
import { VariantProps } from "@gentleduck/variants";
import * as PopoverPrimitive from "@gentleduck/primitives/popover";

//#region ../registry-ui-duckui/src/button/button.constants.d.ts
declare const buttonVariants: (props?: _gentleduck_variants0.CvaProps<{
  border: {
    default: string;
    destructive: string;
    primary: string;
    secondary: string;
    warning: string;
  };
  size: {
    default: string;
    icon: string;
    'icon-lg': string;
    'icon-sm': string;
    lg: string;
    sm: string;
  };
  variant: {
    dashed: string;
    default: string;
    destructive: string;
    expand_icon: string;
    ghost: string;
    link: string;
    nothing: string;
    outline: string;
    secondary: string;
    warning: string;
  };
}> | undefined) => string;
//#endregion
//#region ../registry-ui-duckui/src/button/button.types.d.ts
/**
 * Props for the Button component, combining native button attributes, variant styles, and custom options.
 */
interface ButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'>, VariantProps<typeof buttonVariants> {
  /** Render as child component using Slot (e.g., for custom wrappers) */
  asChild?: boolean;
  /** Controls collapsed state for buttons like sidebar toggles */
  isCollapsed?: boolean;
  /** Shows loading state/spinner in the button */
  loading?: boolean;
  /** Primary icon to display in the button */
  icon?: React.ReactNode;
  /** Secondary icon (e.g., for split actions or toggles) */
  secondIcon?: React.ReactNode;
}
//#endregion
//#region ../registry-ui-duckui/src/popover/popover.d.ts
declare const PopoverTrigger: typeof PopoverPrimitive.Trigger;
//#endregion
export { ButtonProps as n, PopoverTrigger as t };
//# sourceMappingURL=index-CZlFw1fK.d.ts.map