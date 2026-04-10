the bloom library by josh puckett uses a set of animation techniques that create ios-like feel for dropdown menus and popovers. after studying their full source code these are the patterns worth adopting for duck-ui motion components.

the most impactful technique is using spring physics instead of duration-based easing for everything. bloom uses visualDuration (0.25s default) with bounce (0.2) instead of our current approach of duration in seconds with cubic-bezier ease arrays. springs make elements settle like physical objects instead of following a predetermined curve. this applies to every animated property including opacity, scale, position, and blur. the reduced motion fallback uses stiffness 1000 and damping 100 which makes the spring resolve near-instantly without removing the animation entirely.

the second technique is direction-aware content offset. when a menu opens upward (direction top), the content slides from below with a small 8px offset on enter and exits with a larger 30px offset going further away. the asymmetry is important because the enter is subtle (scale 0.95 to 1, offset 8px to 0) while the exit is more dramatic (scale 1 to 0.9, offset 0 to 30px). this makes closing feel snappier and more intentional than just reversing the enter animation. the direction is configurable as top, bottom, left, or right and the offsets adjust accordingly.

the third technique is blur transitions. both the trigger and content use css filter blur that transitions from 8-10px to 0px on enter. this creates an ios depth-of-field effect where content appears to come into focus as it enters. the trigger icon also blurs out when the menu opens creating a handoff between the two states. blur is skipped entirely when prefers-reduced-motion is active.

the fourth technique is staggered timing. the content fade-in is delayed by 30-80ms after the container starts animating. the content also uses 85% of the parent visual duration making it slightly faster. this prevents everything from moving at once and creates a layered feel where the shape expands first then the content appears inside it.

the fifth technique is container shape morphing where the trigger button literally morphs into the menu by animating width, height, border-radius, box-shadow, and position offset on a single motion.div. the transform origin is calculated from the direction and anchor props so the expansion feels like it grows from the right edge. this is bloom-specific and harder to retrofit onto radix primitives where trigger and content are separate dom trees, but the concept of animating the container shape is worth considering for a future custom menu component.

to implement this in duck-ui the plan is to update the existing motion presets and components in this order.

first update the duckMotionTransition presets in packages/duck-motion/src/motion-tokens.ts to include spring-based variants alongside the current duration-based ones. add duckMotionSpring with visualDuration 0.25 and bounce 0.2 as the default, plus a snappy variant with visualDuration 0.2 and bounce 0.15 for menus. keep the existing duration-based presets for backwards compatibility.

second add a blur property to the useMotionPreset hook presets in packages/duck-motion/src/motion-presets.tsx. update fadeIn to include filter blur 4px to 0px on enter. update scaleIn to include filter blur 8px to 0px matching what bloom uses. add new direction-aware presets like slideUpBlur, slideDownBlur, slideFromLeftBlur, slideFromRightBlur that combine the directional offset with blur and use asymmetric exit values (enter offset 8px, exit offset 30px, enter scale 0.95, exit scale 0.9).

third update MotionDialogContent in packages/registry-ui/src/dialog/dialog.tsx to use the spring transition instead of duration-based. change the content animation to include blur on enter and exit. use the asymmetric exit pattern where exit scale is 0.9 instead of 0.95 and add a small directional offset.

fourth when implementing dropdown-menu, context-menu, and popover animations for issue 289, use the direction-aware offset pattern. the content should slide in from the trigger direction with 8px offset and blur, and exit going 30px away from the trigger. the transform origin should match the placement side. use spring transitions with visualDuration 0.2 and bounce 0.15 for snappier feel on menus vs dialogs.

fifth add a contentDelay option to MotionProvider so consumers can control the stagger timing. default to 0 for dialogs (they appear in place) but recommend 0.03-0.05s for menus where the container shape change should lead the content appearance.

the container shape morphing technique from bloom is not planned for the initial implementation because it requires a fundamentally different component architecture where the trigger and menu share a single animated container. this could be explored later as a separate BloomMenu or MorphMenu component that does not use radix primitives.
