## Philosophy

Native selects are accessible but difficult to style consistently. This select builds on `@gentleduck/primitives/select` which provides full keyboard navigation, ARIA semantics, scroll management, and typeahead search. The wrapper adds design-system styling while the primitive handles all interaction logic.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add select
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

```tsx

## RTL Support

Set `dir="rtl"` on `Select` for a local override, or set `DirectionProvider` once at app/root level for global direction.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionSelect` and `MotionSelectContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The dropdown enters with a bouncy spring scale and blur, and exits with a matching reverse animation.

}>
Requires the `motion` package. Use `MotionSelect` instead of `Select` and `MotionSelectContent` instead of `SelectContent`. All other sub-components stay the same.

## API Reference

### Select

The root component that manages open/closed state, value state, and provides context.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Initial value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Callback fired when the selected value changes |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when dropdown open state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `name` | `string` | - | Name attribute for native form submission |
| `disabled` | `boolean` | - | Disables the entire select |
| `required` | `boolean` | - | Marks the select as required for form validation |
| `form` | `string` | - | Associates the select with a form element by ID |
| `autoComplete` | `string` | - | Hint for browser autofill |

### SelectTrigger

Button that toggles the dropdown. Renders a styled `<button>` with a chevron icon.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `disabled` | `boolean` | - | Disables the trigger |

Sets `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="none"`, and `data-state` automatically.

### SelectValue

Renders the selected value text, or a placeholder when nothing is selected.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `React.ReactNode` | `''` | Text shown when no value is selected |

### SelectContent

The dropdown content area. Handles positioning, focus management, keyboard navigation, and dismiss behavior.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `'item-aligned' \| 'popper'` | `'popper'` | Positioning strategy. `item-aligned` aligns selected item with trigger. `popper` uses floating positioning. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side (popper position only) |
| `sideOffset` | `number` | - | Offset from trigger on the main axis |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment on the cross axis |
| `alignOffset` | `number` | - | Offset on the cross axis |
| `avoidCollisions` | `boolean` | `true` | Whether to flip to avoid viewport overflow |
| `collisionPadding` | `number` | `10` | Padding from viewport edges |
| `className` | `string` | - | Additional CSS class names |

Exposes `data-state="open"` / `data-state="closed"` and `data-side` for CSS animation.

### SelectGroup

Groups related items together. Renders a `<div>` with `role="group"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### SelectLabel

Label for a `SelectGroup`. Renders a `<div>` linked to its group via `aria-labelledby`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### SelectItem

An individual selectable item. Renders a `<div>` with `role="option"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | The value representing this item. Must not be empty string. |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `textValue` | `string` | - | Optional text override for typeahead search |
| `className` | `string` | - | Additional CSS class names |

Exposes `data-state="checked"` / `data-state="unchecked"`, `data-highlighted`, and `data-disabled`.

### SelectSeparator

Visual separator between items. Renders a styled `<div>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### SelectScrollUpButton / SelectScrollDownButton

Scroll navigation buttons that appear when content overflows the viewport.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### MotionSelect

Same props as `Select`. Wraps the root with motion state management for enter/exit animations. Required when using `MotionSelectContent`.

### MotionSelectContent

Same props as `SelectContent`. Adds spring-powered enter/exit animation (scale + blur) via `AnimatePresence`. Must be used with `MotionSelect` root. Requires the `motion` package.