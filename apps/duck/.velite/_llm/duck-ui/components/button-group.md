## Philosophy

Individual buttons sometimes belong together. ButtonGroup handles the visual joining  -  shared borders, connected radii, consistent spacing  -  so you don't manually manage CSS for grouped actions. It's a layout primitive, not a logic primitive: each button inside still owns its own behavior.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add button-group
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/variants
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
```

```tsx

  <Button>Button 1</Button>
  <Button>Button 2</Button>

```

## Examples

### Orientation

Set the `orientation` prop to change the button group layout.

### Size

Control the size of buttons using the `size` prop on individual buttons.

### Nested

Nest `<ButtonGroup>` components to create button groups with spacing.

### Separator

The `ButtonGroupSeparator` component visually divides buttons within a group.

Buttons with variant `outline` do not need a separator since they have a border. For other variants, a separator is recommended to improve the visual hierarchy.

### Split

Create a split button group by adding two buttons separated by a `ButtonGroupSeparator`.

### Input

Wrap an `Input` component with buttons.

### Input Group

Wrap an `InputGroup` component to create complex input layouts.

### Dropdown Menu

Create a split button group with a `DropdownMenu` component.

### Select

Pair with a `Select` component.

### Popover

Use with a `Popover` component.

## Accessibility

- The `ButtonGroup` component has the `role` attribute set to `group`.
- Use <Kbd>Tab</Kbd> to navigate between the buttons in the group.
- Use `aria-label` or `aria-labelledby` to label the button group.

```tsx showLineNumbers

  <Button>Button 1</Button>
  <Button>Button 2</Button>

```

## ButtonGroup vs ToggleGroup

- Use the `ButtonGroup` component when you want to group buttons that perform an action.
- Use the `ToggleGroup` component when you want to group buttons that toggle a state.

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionButtonGroup` for a smooth fade-up entrance animation powered by [motion](https://motion.dev).

}>
Requires the `motion` package. Use `MotionButtonGroup` instead of `ButtonGroup`. All other sub-components stay the same.

## API Reference

### ButtonGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the button group |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional class names to apply |
| `children` | `React.ReactNode` | `--` | Grouped content (buttons, separators, text, or nested groups) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### ButtonGroupSeparator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Orientation of the separator line |
| `className` | `string` | `--` | Additional class names to apply |
| `...props` | `React.ComponentPropsWithoutRef<typeof Separator>` | - | Additional props inherited from `Separator`. |

### ButtonGroupText

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | `false` | If `true`, uses the `Slot` component instead of rendering a `div` |
| `className` | `string` | `--` | Additional class names to apply |
| `children` | `React.ReactNode` | `--` | Text content to display |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionButtonGroup

Fades up with blur on mount using the `fadeUp` preset. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `ButtonGroupProps` | - | All props from `ButtonGroup` are supported |