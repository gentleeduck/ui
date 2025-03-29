import { VariantProps } from "class-variance-authority";
import { tooltipVariants } from "./tooltip.constants";
import { ReactNode } from "react";
import { buttonVariants } from "../button";

export interface TooltipProps extends VariantProps<typeof buttonVariants> {
  content: [
    React.ElementType<TooltipContentProps>,
    Omit<TooltipContentProps, "triggerRef" | "contentRef">
  ];
  children: ReactNode;
  delayDuration?: number;
  className?: string;
  disabled?: boolean;
  // contentMargin?:
  //   | number
  //   | { top?: number; right?: number; bottom?: number; left?: number };
  // open?: boolean;
}

export interface TooltipContentProps
  extends React.HTMLProps<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  sideOffset?: number;
  autoPosition?: boolean;
  triggerRef?: React.RefObject<HTMLDivElement>;
  contentRef?: React.RefObject<HTMLDivElement>;
  showArrow?: boolean;
}
