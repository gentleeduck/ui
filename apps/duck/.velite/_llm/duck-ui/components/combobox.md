## Philosophy

Comboboxes solve the "too many options" problem  -  they combine a text input with a filterable dropdown. We make the component fully generic (`Combobox

## Installation

The Combobox is built using a composition of the `` and the `` components.

See installation instructions for the [Popover](/duck-ui/components/popover#installation) and the [Command](/duck-ui/components/command#installation) components.

## Usage

```tsx showLineNumbers
// components/example-combobox.tsx
"use client"

  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function ExampleCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (

                  {framework.label}

              ))}

  )
}
```

Note: The `Combobox` wrapper component (`@/components/ui/combobox`) uses item `value`s for `value`, `defaultValue`, and `onValueChange`. Use `label` for display only.

## Examples

### Combobox

### Popover

### Dropdown menu

### Responsive

You can create a responsive combobox by using the `` on desktop and the `` components on mobile.

### Form

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionCombobox` and `MotionComboboxItem` for motion-powered popover and checkbox animations. The trigger uses `MotionButton`, the dropdown uses `MotionPopoverContent`, and each item's checkbox bounces on toggle.

}>
Requires the `motion` package. Use `MotionCombobox` instead of `Combobox` and `MotionComboboxItem` instead of `ComboboxItem`. All other sub-components stay the same.

## API Reference

### Combobox\<TData, TType\>

A generic combobox component built on top of `Popover` and `Command`. Supports both single and multiple selection via the `TType` generic parameter (defaults to `'single'`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TData` | - | (required) Readonly array of `{ label: string; value: string }` objects to display as options. |
| `children` | `(item: TData) => React.ReactNode` | - | (required) Render function that receives the `items` array and returns the list content (e.g. `ComboboxItem` elements). |
| `value` | `TData[number]['value']` (single) or `TData[number]['value'][]` (multiple) | - | Controlled selected value. Shape depends on `TType`. |
| `defaultValue` | `TData[number]['value']` (single) or `TData[number]['value'][]` (multiple) | - | Uncontrolled default value. Shape depends on `TType`. |
| `onValueChange` | `(value) => void` | - | Callback fired when the value changes. Receives a single string (single mode) or string array (multiple mode). |
| `withSearch` | `boolean` | `true` | Whether to show the search input inside the command list. |
| `showSelected` | `boolean` | `true` | Whether to display the currently selected value(s) in the trigger button. In multiple mode, values beyond 2 are collapsed into a "+N Selected" badge. |
| `commandTriggerPlaceholder` | `string` | `'Select item...'` | Placeholder text shown in the trigger button when no value is selected. |
| `commandEmpty` | `string` | `'Nothing found.'` | Text shown inside the command list when no results match the search query. |
| `popover` | `React.ComponentPropsWithoutRef<typeof Popover>` | - | Props spread onto the root `Popover` component. |
| `popoverTrigger` | `React.ComponentPropsWithoutRef<typeof Button>` | - | Props spread onto the trigger `Button`. The `variant` defaults to `'dashed'` when not provided. |
| `popoverContent` | `React.ComponentPropsWithoutRef<typeof PopoverContent>` | - | Props spread onto `PopoverContent`. `className` is merged with the default `'w-(--gentleduck-popover-trigger-width) p-0'`. |
| `command` | `React.ComponentPropsWithoutRef<typeof Command>` | - | Props spread onto the inner `Command` component. |
| `commandInput` | `React.ComponentPropsWithoutRef<typeof CommandInput>` | - | Props spread onto `CommandInput` when `withSearch` is `true`. |

### ComboboxItem\<T\>

A single selectable item inside the combobox list. Renders a `CommandItem` with a `Checkbox` indicator.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `T extends { label: string; value: string }` | - | (required) The item object. Its `label` is displayed as text and `value` is used for selection. |
| `onSelect` | `(value: T['value']) => void` | - | Callback fired when this item is selected. Receives the item's `value`. |
| `checked` | `boolean` | - | Whether the checkbox indicator shows as checked. |
| `...props` | `Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, 'onSelect'>` | - | Additional props inherited from `CommandItem` (excluding `onSelect`). |

### ComboboxGroup

A convenience wrapper around `CommandGroup` for grouping combobox items.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | (required) `ComboboxItem` elements or other content to render inside the group. |
| `...props` | `React.ComponentPropsWithoutRef<typeof CommandGroup>` | - | Additional props inherited from `CommandGroup`. |

### MotionCombobox

Uses `MotionButton` for the trigger and `MotionPopoverContent` for the dropdown with spring enter/exit animations. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `ComboboxProps` | - | All props from `Combobox` are supported |

### MotionComboboxItem

Uses `MotionCheckbox` with bounce animation on toggle. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | - | Stagger delay index for entrance animation |
| `...props` | `ComboboxItemProps` | - | All props from `ComboboxItem` are supported |