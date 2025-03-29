import { VariantProps } from "class-variance-authority";
import { tooltipVariants } from "./tooltip.constants";

export interface TooltipProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "content"> {
  asChild?: boolean;
  delayDuration?: number;
  sideOffset?: number;
}

export interface TooltipContentProps
  extends React.HTMLProps<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  showArrow?: boolean;
}
