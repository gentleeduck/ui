## Philosophy

Empty states are opportunities, not dead ends. When there's no data to show, the Empty component turns a blank screen into a call to action. We structure it as header + content because every empty state needs two things: an explanation of why it's empty, and a path forward. The media slot (icon, avatar, illustration) adds emotional tone.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add empty
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/variants
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
```

```tsx

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionEmpty`, `MotionEmptyMedia`, `MotionEmptyTitle`, `MotionEmptyDescription`, and `MotionEmptyContent` for staggered entrance animations powered by [motion](https://motion.dev). The media scales in while text elements fade up with increasing delays.

}>
Requires the `motion` package. Replace each sub-component with its Motion variant. `EmptyHeader` stays the same — it's a layout wrapper with no visual animation.

## API Reference

### Empty

The main component of the empty state. Wraps the `EmptyHeader` and `EmptyContent` components.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Empty state content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### EmptyHeader

The `EmptyHeader` component wraps the empty media, title, and description.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Header content (media, title, description) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### EmptyMedia

Use the `EmptyMedia` component to display the media of the empty state such as an icon or an image. You can also use it to display other components such as an avatar.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'icon'` | `'default'` | Visual variant of the media container |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Media content (icon, avatar, image) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### EmptyTitle

Use the `EmptyTitle` component to display the title of the empty state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Title text |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### EmptyDescription

Use the `EmptyDescription` component to display the description of the empty state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Description text |
| `...props` | `React.ComponentProps<'p'>` | - | Additional props to spread to the description element (renders as a `div`) |

### EmptyContent

Use the `EmptyContent` component to display the content of the empty state such as a button, input or a link.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Action content (buttons, links, inputs) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionEmpty

Same props as `Empty`. Adds fadeUp entrance animation. Requires the `motion` package.

### MotionEmptyMedia

Same props as `EmptyMedia`. Adds scaleBlur entrance with 50ms delay. Requires the `motion` package.

### MotionEmptyTitle

Same props as `EmptyTitle`. Adds fadeUp entrance with 100ms delay. Requires the `motion` package.

### MotionEmptyDescription

Same props as `EmptyDescription`. Adds fadeUp entrance with 150ms delay. Requires the `motion` package.

### MotionEmptyContent

Same props as `EmptyContent`. Adds fadeUp entrance with 200ms delay. Requires the `motion` package.