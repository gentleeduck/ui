## Philosophy

Typography *is* a system, not a single component. We ship a set of small, semantic wrappers — `TypographyH1`, `TypographyP`, `TypographyBlockquote`, `TypographyList`, `TypographyTable`, etc. — that render native HTML elements with a consistent set of utility classes. Your markup stays semantic, the bundle stays lean, and every `className` you pass is merged on top of the defaults via `cn()` so local overrides are trivial.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add typography
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/motion
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

  TypographyH1,
  TypographyP,
  TypographyBlockquote,
  TypographyList,
  TypographyTable,
  TypographyTd,
  TypographyTh,
  TypographyTr,
} from '@/components/ui/typography'
```

```tsx
<TypographyH1>The Joke Tax Chronicles</TypographyH1>
<TypographyP>Once upon a time, in a far-off land, there was a very lazy king...</TypographyP>
```

## Examples

### h1

### h2

### h3

### h4

### p

### blockquote

### table

### list

### Inline code

### Lead

### Large

### Small

### Muted

## RTL Support

Every `Typography*` component inherits the RTL styles it needs from Tailwind's `rtl:` variant. Wrap the composition in an element with `dir="rtl"` (or set `DirectionProvider` at app/root level for global RTL/LTR) and the blockquote border, list indent, and table alignment automatically flip.

## Motion

Use the `Motion*` variants for a staggered entrance animation powered by [motion](https://motion.dev). Each component accepts an `index` prop — the entrance is delayed by `index * 0.05s` so a full page of typography cascades in from bottom to top with a subtle slide + blur.

}>
Requires the `motion` package. Each `Motion*` component uses the shared `slideUp` preset with a `springBouncy` transition and `delay: index * 0.05`.

## API Reference

### Typography components

Every base `Typography*` component is a thin `forwardRef` wrapper around the matching HTML element that merges a pre-set `className` with the one you pass in. All accept the native element's props.

| Component | Element | Classes |
| --- | --- | --- |
| `TypographyH1` | `h1` | `scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl` |
| `TypographyH2` | `h2` | `scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight first:mt-0` |
| `TypographyH3` | `h3` | `scroll-m-20 font-semibold text-2xl tracking-tight` |
| `TypographyH4` | `h4` | `scroll-m-20 font-semibold text-xl tracking-tight` |
| `TypographyP` | `p` | `leading-7 [&:not(:first-child)]:mt-6` |
| `TypographyBlockquote` | `blockquote` | `mt-6 border-l-2 pl-6 italic` (flips in RTL) |
| `TypographyList` | `ul` | `my-6 ml-6 list-disc [&>li]:mt-2` (flips in RTL) |
| `TypographyInlineCode` | `code` | `relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm` |
| `TypographyLead` | `p` | `text-muted-foreground text-xl` |
| `TypographyLarge` | `div` | `font-semibold text-lg` |
| `TypographySmall` | `small` | `font-medium text-sm leading-none` |
| `TypographyMuted` | `p` | `text-muted-foreground text-sm` |
| `TypographyTable` | `div > table` | wrapper + `w-full` (accepts `wrapperClassName` for the outer div) |
| `TypographyTr` | `tr` | `m-0 border-t p-0 even:bg-muted` |
| `TypographyTh` | `th` | `border px-4 py-2 text-left font-bold rtl:text-right` |
| `TypographyTd` | `td` | `border px-4 py-2 text-left rtl:text-right` |

### Motion variants

Every `Motion*` variant supports all the props of its base component plus an optional `index` prop.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay multiplier. Entrance delay is `index * 0.05s`. |
| `...props` | base component props | - | All props from the base `Typography*` are supported (drag handlers omitted for motion type safety) |