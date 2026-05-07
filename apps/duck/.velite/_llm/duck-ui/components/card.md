## Philosophy

Cards are the universal container for grouped content. We decompose them into Header, Content, Footer, Title, and Description not because every card needs all five, but because real-world cards vary enormously. A pricing card needs a footer; a notification card doesn't. The sub-component pattern lets you compose exactly what you need.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add card
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

```tsx showLineNumbers

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionCard`, `MotionCardHeader`, `MotionCardContent`, and `MotionCardFooter` for staggered fade-up entrance animations powered by [motion](https://motion.dev).

}>
Requires the `motion` package. Replace `Card` with `MotionCard`, `CardHeader` with `MotionCardHeader`, `CardContent` with `MotionCardContent`, and `CardFooter` with `MotionCardFooter`. `CardTitle`, `CardDescription`, and `CardAction` stay the same.

## API Reference

### Card

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes applied to the card container |
| `children` | `React.ReactNode` | - | Card content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CardHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the header |
| `children` | `React.ReactNode` | - | Header content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CardTitle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the title |
| `children` | `React.ReactNode` | - | Title content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CardDescription

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the description |
| `children` | `React.ReactNode` | - | Description content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CardAction

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the action container |
| `children` | `React.ReactNode` | - | Action content (e.g. buttons, icons) |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CardContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the content area |
| `children` | `React.ReactNode` | - | Main card content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CardFooter

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the footer |
| `children` | `React.ReactNode` | - | Footer content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionCard

Same props as `Card`. Adds fadeUp entrance animation. Requires the `motion` package.

### MotionCardHeader

Same props as `CardHeader`. Adds fadeUp entrance with 50ms delay. Requires the `motion` package.

### MotionCardContent

Same props as `CardContent`. Adds fadeUp entrance with 100ms delay. Requires the `motion` package.

### MotionCardFooter

Same props as `CardFooter`. Adds fadeUp entrance with 150ms delay. Requires the `motion` package.