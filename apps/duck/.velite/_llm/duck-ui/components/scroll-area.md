## Philosophy

Native scrollbars break visual consistency across platforms. ScrollArea provides custom-styled scrollbars that behave identically everywhere while preserving native scroll physics. We keep the API minimal  -  just `viewportClassName`  -  because scrolling should be invisible infrastructure, not a feature you configure.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add scroll-area
```

```css title="global.css"
/* Add this block of css to your project. */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  /* Replace this with your own custom scrollbar thumb color */
  background: var(--border);
  border-radius: 5px;
}
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

 Add this block of css to your project.

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  /* Replace this with your own custom scrollbar thumb color */
  background: var(--border);
  border-radius: 5px;
}
```

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

  Jokester began sneaking into the castle in the middle of the night and leaving
  jokes all over the place: under the king's pillow, in his soup, even in the
  royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
  then, one day, the people of the kingdom discovered that the jokes left by
  Jokester were so funny that they couldn't help but laugh. And once they
  started laughing, they couldn't stop.

```

## Examples

### Horizontal Scrolling

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionScrollArea` for a smooth entrance animation powered by [motion](https://motion.dev). The container fades in with scale and blur on mount using the shared `scaleIn` preset with a `springBouncy` transition.

}>
Requires the `motion` package. Use `MotionScrollArea` instead of `ScrollArea`. Same props. The regular `ScrollArea` is perfectly fine - this is an optional enhancement.

## API Reference

### ScrollArea

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `viewportRef` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the inner scrollable viewport element |
| `viewportClassName` | `string` | `--` | Additional CSS classes for the inner scrollable viewport |
| `className` | `string` | `--` | Additional CSS classes for the outer container |
| `style` | `React.CSSProperties` | `--` | Inline styles for the outer container |
| `children` | `React.ReactNode` | `--` | Scrollable content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionScrollArea

`scaleIn` entrance with `springBouncy` transition on mount. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `ScrollAreaProps` | - | All props from `ScrollArea` are supported (drag handlers are omitted for motion type safety) |