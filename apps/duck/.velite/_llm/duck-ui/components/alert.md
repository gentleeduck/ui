## Philosophy

Alerts exist to break the user's flow  -  intentionally. When something demands attention, a subtle inline message beats a disruptive modal every time. We keep the API to just `variant` because an alert's job is simple: show a message with visual weight. Anything more complex belongs in a dialog.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add alert
```

Install the following dependencies:

```bash
npm install @gentleduck/variants @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

  <AlertTitle>Heads up!</AlertTitle>

    You can add components and dependencies to your app using the cli.

```

## Examples

### Variants

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionAlert` for a smooth fade-up entrance animation powered by [motion](https://motion.dev). The alert slides up with blur and opacity on mount.

}>
Requires the `motion` package. Use `MotionAlert` instead of `Alert`, `MotionAlertTitle` instead of `AlertTitle`, and `MotionAlertDescription` instead of `AlertDescription`. The icon stays as a plain SVG.

## API Reference

### Alert

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive'` | `'default'` | Visual style variant for the alert |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes applied to the alert container |
| `children` | `React.ReactNode` | - | Alert content, typically an icon, AlertTitle, and AlertDescription |
| `...props` | `React.ComponentProps<'div'>` | - | Additional standard component props. |

### AlertTitle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the title element |
| `children` | `React.ReactNode` | - | Title text content |
| `...props` | `React.ComponentProps<'div'>` | - | Additional standard component props. |

### AlertDescription

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS classes applied to the description element |
| `children` | `React.ReactNode` | - | Description text content |
| `...props` | `React.ComponentProps<'div'>` | - | Additional standard component props. |

### MotionAlert

Animates on mount with fade-up (slide up 6px + blur + opacity) using the `fadeUp` preset and `contentTransition` (250ms expo-out). Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AlertProps` | - | All props from `Alert` are supported |

### MotionAlertTitle

Fades up with blur at 100ms delay after the container. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AlertTitleProps` | - | All props from `AlertTitle` are supported |

### MotionAlertDescription

Fades up with blur at 180ms delay after the title. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AlertDescriptionProps` | - | All props from `AlertDescription` are supported |