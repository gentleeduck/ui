}>

**Rewritten version:**
**Note:** You might wonder why we don't use the `CommandShortcut` component from the `command` module.
The reason is that we want to give you the flexibility to use the `kbd` component in any context, not just within a command.
Additionally, the `CommandShortcut` component is specifically designed to represent a keyboard shortcut associated with a command, not a plain HTML element.
As a result, it has a different API and does not require certain props like `keys` or `onKeyPress`.

## Philosophy

Keyboard shortcuts deserve visual prominence. The Kbd component renders key combinations with consistent styling, making shortcut discovery a natural part of the UI rather than something hidden in documentation. We pair it with `@gentleduck/vim` for actual key binding  -  Kbd handles the display, vim handles the logic.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add kbd
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx
<Kbd>Ctrl</Kbd>
```

## Examples

### Group

Use the `KbdGroup` component to group keyboard keys together.

### Button

Use the `Kbd` component inside a `Button` component to display a keyboard key inside a button.

### Tooltip

You can use the `Kbd` component inside a `Tooltip` component to display a tooltip with a keyboard key.

### Input Group

You can use the `Kbd` component inside a `InputGroupAddon` component to display a keyboard key inside an input group.

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionKbd` for staggered fade+blur entrance on keyboard shortcuts powered by [motion](https://motion.dev).

}>
Requires the `motion` package. Use `MotionKbd` instead of `Kbd`. Pass `index` for stagger order.

## API Reference

### Kbd

Displays an individual keyboard key with consistent styling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional class names for the kbd element |
| `children` | `React.ReactNode` | - | Key label text or icon |
| `...props` | `React.HTMLProps<HTMLElement>` | - | Additional props to spread to the kbd element |

### KbdGroup

Groups multiple `Kbd` components together in an inline layout.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the group |
| `children` | `React.ReactNode` | - | `Kbd` elements to group together |
| `...props` | `React.ComponentPropsWithoutRef<'div'>` | - | Additional props to spread to the group element (renders as a `kbd`) |

### MotionKbd

Same props as `Kbd` plus an optional `index` prop for stagger delay (30ms per index). Adds fade+blur entrance. Requires the `motion` package.