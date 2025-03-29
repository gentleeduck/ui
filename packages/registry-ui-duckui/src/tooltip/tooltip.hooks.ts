import { useCallback, useState } from "react";

type Position = "top" | "bottom" | "left" | "right";
type PositionRefs = {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

export const useTooltipPosition = (
  initialPosition: Position = "top",
  sideOffset: number = 4,
  autoPosition: boolean = true,
  refs: PositionRefs
) => {
  const [computedPosition, setComputedPosition] =
    useState<Position>(initialPosition);

  const updatePosition = useCallback(() => {
    const { triggerRef, contentRef } = refs;

    if (!autoPosition || !triggerRef.current || !contentRef.current) {
      setComputedPosition(initialPosition);
      return;
    }

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = contentRef.current.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const buffer = sideOffset + 8;

    // Available space in each direction
    const space = {
      top: trigger.top - tooltip.height - buffer,
      bottom: viewport.height - trigger.bottom - tooltip.height - buffer,
      left: trigger.left - tooltip.width - buffer,
      right: viewport.width - trigger.right - tooltip.width - buffer,
    };

    const positions = [
      initialPosition, // Try preferred position first
      { top: "bottom", bottom: "top", left: "right", right: "left" }[
        initialPosition
      ], // Try opposite
      ...(initialPosition === "top" || initialPosition === "bottom"
        ? ["left", "right"]
        : ["top", "bottom"]), // Try alternatives
    ] as Position[];

    // Find first position with enough space, or use position with most space
    const bestPosition =
      positions.find((pos) => space[pos] >= 0) ||
      Object.entries(space).reduce(
        (a, [pos, sp]) => (sp > space[a] ? pos : a),
        initialPosition
      );

    setComputedPosition(bestPosition as Position);
  }, [initialPosition, sideOffset, autoPosition, refs]);

  return { computedPosition, updatePosition };
};

// Optional: Add a hook for viewport changes
export const useViewportChanges = (
  updatePosition: () => void,
  disabled: boolean
) => {
  const handleViewportChange = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updatePosition, 100);
    };
  }, [updatePosition]);

  return useCallback(() => {
    if (disabled) return;

    const throttled = handleViewportChange();
    window.addEventListener("scroll", throttled, { passive: true });
    window.addEventListener("resize", throttled, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttled);
      window.removeEventListener("resize", throttled);
    };
  }, [handleViewportChange, disabled]);
};
