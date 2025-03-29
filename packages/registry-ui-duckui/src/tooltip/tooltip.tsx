"use client";

import * as React from "react";
import { cn } from "@gentelduck/libs/cn";
import { tooltipVariants, tooltipArrowVariants } from "./tooltip.constants";
import { useTooltipPosition, useViewportChanges } from "./tooltip.hooks";
import type { TooltipContentProps, TooltipProps } from "./tooltip.types";
import { buttonVariants } from "../button";

export const Tooltip = ({
  content,
  children,
  delayDuration = 500,
  border,
  size,
  className,
  disabled = false,
  variant,
}: TooltipProps) => {
  if (disabled || content.length < 2) return <>{children}</>;

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const { updatePosition } = useTooltipPosition(
    content[1]?.position!,
    content[1]?.sideOffset,
    content[1].autoPosition,
    //NOTE: add the `ref` here
    { triggerRef, contentRef }
  );

  const setupViewportListeners = useViewportChanges(updatePosition, disabled);

  // Handle viewport changes
  React.useEffect(setupViewportListeners, [setupViewportListeners]);

  const Conetent = content[0];

  return (
    <button
      className={cn(
        "group/tooltip relative inline-block",
        buttonVariants({ variant, size, border, className })
      )}
      style={
        {
          "--tooltip-delay": `${delayDuration}ms`,
          "--side-offset": `${content[1].sideOffset}px`,
        } as React.CSSProperties
      }
      onMouseEnter={updatePosition}
      onFocus={updatePosition}
    >
      {/* TRIGGER */}
      {children}

      {/* CONTENT */}
      {<Conetent {...content[1]} />}
    </button>
  );
};

export function TooltipContent({
  position,
  variant,
  autoPosition,
  sideOffset,
  contentRef,
  triggerRef,
  className,
  showArrow = false,
  children,
  ...props
}: TooltipContentProps) {
  const tooltipId = React.useId();
  const { computedPosition } = useTooltipPosition(
    position!,
    sideOffset,
    autoPosition,
    { triggerRef, contentRef }
  );
  return (
    <div
      ref={contentRef}
      id={tooltipId}
      role="tooltip"
      className={cn(
        "w-full text-xs",
        tooltipVariants({ variant, position: computedPosition }),
        className
      )}
      data-side={computedPosition}
    >
      {children}
      {showArrow && (
        <span
          className={cn(tooltipArrowVariants({ position: computedPosition }))}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

Tooltip.displayName = "Tooltip";
