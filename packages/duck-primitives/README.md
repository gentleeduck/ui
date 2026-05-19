<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/primitives" width="120"/>
</p>

<h1 align="center">@gentleduck/primitives</h1>

<p align="center">
  Unstyled, accessibility-first UI primitives for React.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/primitives"><img src="https://img.shields.io/npm/v/@gentleduck/primitives.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/primitives"><img src="https://img.shields.io/npm/dm/@gentleduck/primitives.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/primitives.svg" alt="MIT"/></a>
</p>

---

Unstyled, accessibility-first UI primitives for React.

## Why primitives

- **50-92% smaller than Radix** - Alert Dialog: 1.6 KB vs 18.6 KB. Popover: 2.4 KB vs 19.6 KB. Dialog: 3.1 KB vs 10.6 KB. Shared internals (Slot, Presence, Popper, focus scope) load once instead of being duplicated per-package.
- **Full keyboard navigation + ARIA compliance out of the box** - every component ships with correct roles, states, and keyboard interactions so you don't have to wire them yourself.
- **Compound component pattern** - compose `Root`, `Trigger`, `Content`, and friends to build exactly the UI you need without prop drilling.
- **Compatible with Radix API** - same naming, same `asChild` pattern, same `data-state` attributes. Migration from Radix is a namespace change in your imports.

## Components

| Primitive | Description |
| --- | --- |
| `alert-dialog` | Modal dialog that requires user acknowledgment |
| `arrow` | Positioning arrow for floating elements |
| `avatar` | User avatar with image and fallback support |
| `calendar` | Date grid with keyboard navigation and multi-view support |
| `checkers` | Checkbox and switch toggle primitive |
| `command` | Command palette with search filtering |
| `context-menu` | Right-click context menu with submenus |
| `dialog` | Modal and non-modal dialog windows |
| `direction` | RTL/LTR direction provider |
| `dismissable-layer` | Layer that dismisses on outside interaction |
| `dropdown-menu` | Dropdown menu with submenus, checkboxes, and radio items |
| `focus-scope` | Traps and manages focus within a boundary |
| `hover-card` | Card triggered by hover with open/close delay |
| `input-otp` | One-time password input with slots and separators |
| `menu` | Base menu primitive used by dropdown, context, and menubar |
| `menubar` | Horizontal menu bar with keyboard navigation |
| `mount` | Deferred mounting with lifecycle callbacks |
| `navigation-menu` | Site navigation with animated indicator and viewport |
| `pagination` | Page navigation controls |
| `popover` | Floating content anchored to a trigger |
| `popper` | Low-level floating element positioning via Floating UI |
| `portal` | Renders children into a DOM portal |
| `presence` | Animate mount/unmount transitions |
| `primitive-elements` | Base `Primitive` element factory (`asChild` support) |
| `progress` | Determinate and indeterminate progress indicator |
| `radio-group` | Radio button group with roving focus |
| `roving-focus` | Roving tabindex focus management for groups |
| `select` | Listbox-style select with typeahead and scroll buttons |
| `sheet` | Slide-out panel (re-exports dialog internals) |
| `slider` | Range slider with single or multiple thumbs |
| `slot` | Merges props and ref onto a child element (`asChild` engine) |
| `toggle` | Two-state toggle button |
| `toggle-group` | Single or multi-select group of toggles |
| `tooltip` | Accessible tooltip with provider-level delay |
| `visibility-hidden` | Visually hidden element for screen readers |

## Quick Start

```bash
npm install @gentleduck/primitives
```

```tsx
import * as Dialog from '@gentleduck/primitives/dialog'

function Demo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Heading</Dialog.Title>
          <Dialog.Description>Body text here.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

## Features

- **`asChild` / Slot**  -  render any primitive as your own element via the `asChild` prop, powered by the `Slot` utility.
- **`createContextScope`**  -  scoped React context factory that prevents cross-instance state leaks.
- **`forwardRef` everywhere**  -  every component forwards refs for imperative access and composition.
- **`data-slot` attributes**  -  every component root emits a `data-slot` for style targeting without class names.
- **Presence animations**  -  the `Presence` primitive lets you animate enter/exit transitions before unmounting.
- **Focus trapping**  -  `FocusScope` locks focus inside modals, dialogs, and popovers with configurable loop behavior.
- **Dismiss layers**  -  `DismissableLayer` handles outside clicks, Escape key, and nested layer stacking.

## Documentation

[gentleduck.org/docs/packages/duck-primitives](https://gentleduck.org/docs/packages/duck-primitives)

## License

[MIT](./LICENSE)
