---
"@gentleduck/registry-ui": minor
---

Add styled arrow components for overlay components: `TooltipArrow`, `PopoverArrow`, `HoverCardArrow`, and `DropdownMenuArrow`. Arrows use a bezier curve SVG shape that seamlessly joins the content border, with border stroke on curved sides only via a two-path technique. Border color is customizable via `--tooltip-border-color`, `--popover-border-color`, `--hover-card-border-color`, and `--dropdown-menu-border-color` CSS custom properties on the respective content elements. Also fixes `overflow-hidden` removal from content containers so arrows are not clipped, adds `relative` positioning for correct arrow animation, and restructures `DropdownMenuContent` with an inner scrollable wrapper to decouple overflow from the arrow's containing block.
