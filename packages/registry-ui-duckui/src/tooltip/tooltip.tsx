"use client";

import * as React from "react";
import { cn } from "@gentelduck/libs/cn";
import { tooltipVariants, tooltipArrowVariants } from "./tooltip.constants";
import type { TooltipContentProps, TooltipProps } from "./tooltip.types";

export const Tooltip = ({
  children,
  delayDuration = 500,
  sideOffset = 4,
  size,
  className,
  asChild,
  ...props
}: TooltipProps) => {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-regular cursor-pointer",
        "group/tooltip flex w-full"
      )}
      style={
        {
          "--tooltip-delay": `${delayDuration}ms`,
          "--side-offset": `${sideOffset}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
};

export function TooltipContent({
  position,
  variant,
  className,
  showArrow = false,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <div
      role="tooltip"
      className={cn(tooltipVariants({ variant, position }), className)}
      data-side={position}
      {...props}
    >
      {children}
      {showArrow && (
        <span
          className={cn(tooltipArrowVariants({ position }))}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

Tooltip.displayName = "Tooltip";
