# todos for the dialog.
---

### 🧩 Radix UI Dialog Feature Overview

| **Category**           | **Feature**                                                                                   | **Description** |
|------------------------|-----------------------------------------------------------------------------------------------|-----------------|
| **Accessibility**         | ARIA roles and attributes                | Sets `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby` |
|                           | Screen reader support                    | Properly announces dialog title/description |
|                           | Keyboard accessibility                   | Handles Escape key, focus trap, and tab navigation |
| **Focus Management**      | Auto focus on open                       | Automatically focuses the first focusable element |
|                           | Focus trap                               | Prevents focus from escaping the dialog while open |
|                           | Return focus                             | Returns focus to the trigger when dialog closes |
| **Keyboard Support**      | Escape key to close                      | Dialog closes on Escape key press (configurable) |
|                           | Tab/Shift+Tab to cycle focus             | Enables full keyboard navigation |
| **[x]Overlay**               | Optional overlay component               | Renders backdrop to prevent interaction with the rest of the UI |
|                           | Click outside to close                   | Overlay click closes dialog (configurable) |
| **Portals**               | Uses React portal                        | Dialog content is rendered outside the DOM hierarchy for isolation |
|                           | Prevents z-index and overflow issues     | Ensures stacking context doesn't interfere |
| **Composition**           | Composable low-level building blocks     | Fine-grained components: Root, Trigger, Overlay, etc. |
|                           | Full control over structure and styling  | Doesn't enforce design—fully unstyled |
| **Animations**            | Data attributes for animations           | Uses `data-state="open"`/`"closed"` for CSS or animation libraries |
| **Controlled Modes**      | Controlled mode                          | Use `open`, `onOpenChange` to manage state manually |
|                           | Uncontrolled mode                        | Use `defaultOpen` for internal state management |
| **Nested Dialogs**        | Stackable dialogs                        | Multiple dialogs can be open—focus and interactions managed correctly |
| **Screen Reader Support** | Title & description association          | Uses ARIA attributes to tie title and description correctly |
| **Customization**         | Style everything with your system        | Compatible with Tailwind, CSS-in-JS, etc. |
| **Modularity**            | Can be composed with other primitives    | Works great with other Radix components like `Popover`, `Tabs`, etc. |

---


# Radix UI Dialog To-Do List

### 🧩 Radix UI Dialog Features To-Do List

| **Feature**                                      | **Status**        |
|--------------------------------------------------|-------------------|
| **Accessibility**                                |                   |
| - ARIA roles and attributes                      | ⬜ To Do          |
| - Screen reader support                          | ⬜ To Do          |
| - Keyboard accessibility                         | ⬜ To Do          |
| **Focus Management**                             |                   |
| - Auto focus on open                             | ⬜ To Do          |
| - Focus trap                                     | ⬜ To Do          |
| - Return focus                                   | ⬜ To Do          |
| **Keyboard Support**                             |                   |
| - Escape key to close                            | ✅ To Do          |
| - Tab/Shift+Tab to cycle focus                   | ⬜ To Do          |
| **Overlay**                                      |                   |
| - Optional overlay component                     | ✅ Done           |
| - Click outside to close                         | ✅ To Do          |
| **Portals**                                      |                   |
| - Uses React portal                              | ⬜ To Do          |
| - Prevents z-index and overflow issues           | ⬜ To Do          |
| **Composition**                                  |                   |
| - Composable low-level building blocks           | ✅ To Do          |
| - Full control over structure and styling        | ✅ To Do          |
| **Animations**                                   |                   |
| - Data attributes for animations                 | ⬜ To Do          |
| **Controlled Modes**                             |                   |
| - Controlled mode                                | ⬜ To Do          |
| - Uncontrolled mode                              | ⬜ To Do          |
| **Nested Dialogs**                               |                   |
| - Stackable dialogs                              | ⬜ To Do          |
| **Screen Reader Support**                        |                   |
| - Title & description association                | ⬜ To Do          |
| **Customization**                                |                   |
| - Style everything with your system              | ✅ To Do          |
| **Modularity**                                   |                   |
| - Can be composed with other primitives          | ✅ To Do          |
