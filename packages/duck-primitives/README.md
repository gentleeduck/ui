# @gentleduck/primitives

**Primitives** is a behavioral component abstraction library for React. It provides **unstyled, accessibility-first building blocks**-dialogs, popovers, tooltips, sliders, and more—so you can bring your own design system while relying on correct behavior.

---

## 🚀 Installation

```sh
npm install @gentleduck/primitives
```

---

## 🔧 Usage

Each primitive is exposed via **path exports**. Import only what you need:

```tsx
// Dialog
import * as Dialog from "@gentleduck/primitives/dialog";

// Popover
import * as Popover from "@gentleduck/primitives/popover";

// Tooltip
import * as Tooltip from "@gentleduck/primitives/tooltip";

// Slider
import * as Slider from "@gentleduck/primitives/slider";
```

### Example: Dialog

```tsx
import { useState } from "react";
import * as Dialog from "@gentleduck/primitives/dialog";

export function ExampleDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog.Trigger onClick={() => setOpen(true)}>Open</Dialog.Trigger>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Content goes here</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
```

> API shape may vary between primitives. See each primitive’s `src/<primitive>/` for details.

---

## 📚 Available Primitives

```text
@gentleduck/primitives/checkers          helpers for conditional behaviors
@gentleduck/primitives/dialog            accessible modal dialog
@gentleduck/primitives/drawer            anchored, dismissible panel
@gentleduck/primitives/mount             mount/unmount utilities
@gentleduck/primitives/navigation-menu   menu/navigation behaviors (WIP)
@gentleduck/primitives/popover           floating, non-modal surface
@gentleduck/primitives/sheet             full-height/width surface
@gentleduck/primitives/slider            pointer/keyboard-driven slider
@gentleduck/primitives/slot              composition utility
@gentleduck/primitives/tooltip           accessible tooltip
```

## 🔒 Security

See [`SECURITY.md`](./SECURITY.md).
Report issues at [github.com/gentleduck/ui/issues](https://github.com/gentleduck/ui/issues).

---

## 📄 License

[MIT © GentleDuck](./LICENSE)
