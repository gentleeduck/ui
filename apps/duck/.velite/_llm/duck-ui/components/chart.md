}>

**Recharts v3 is here.** Charts have been upgraded to [Recharts v3](https://recharts.org/) with server-side rendering via `next/dynamic`, improved accessibility (enabled by default), and smaller client bundles. No changes needed on your end  -  the API is the same.

Introducing **Charts**. A collection of chart components that you can copy and paste into your apps.

Charts are designed to look great out of the box. They work well with the other components and are fully customizable to fit your project.

[Browse the Charts Library](/charts).

## Philosophy

Charts turn data into stories. We wrap Recharts because building accessible, responsive, animated SVG charts from scratch is a multi-month project  -  not a component library feature. Our layer adds consistent theming (via ChartConfig), accessible tooltips and legends, and the visual polish that makes charts feel native to your design system.

## How It's Built

## Installation

  CLI
  Manual

Run the following command to install `chart.tsx`

```bash
npx @gentleduck/cli add chart
```

Add the following colors to your CSS file

```css title="app/globals.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
  }

  .dark {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
  }
}
```

Install the following dependencies:

```bash
npm install recharts @gentleduck/libs 
```

Copy and paste the following code into `components/ui/chart.tsx`.

Add the following colors to your CSS file

```css title="app/globals.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
  }

  .dark {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
  }
}
```

## Usage

We use [Recharts](https://recharts.org/) under the hood.

We designed the `chart` component with composition in mind. **You build your charts using Recharts components and only bring in custom components, such as `ChartTooltip`, when and where you need it**.

```tsx showLineNumbers /ChartContainer/ /ChartTooltipContent/

export function MyChart() {
  return (
    
        } />

  )
}
```

We do not wrap Recharts. This means you're not locked into an abstraction. When a new Recharts version is released, you can follow the official upgrade path to upgrade your charts.

## Examples

### Your First Chart

Let's build your first chart. We'll build a bar chart, add a grid, axis, tooltip and legend.

Start by defining your data

The following data represents the number of desktop and mobile users for each month.

} className="mt-4">

**Note:** Your data can be in any shape. You are not limited to the shape of the data below. Use the `dataKey` prop to map your data to the chart.

```tsx title="components/example-chart.tsx" showLineNumbers
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
```

Define your chart config

The chart config holds configuration for the chart. This is where you place human-readable strings, such as labels, icons and color tokens for theming.

```tsx title="components/example-chart.tsx" showLineNumbers

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig
```

Build your chart

You can now build your chart using Recharts components.

} className="mt-4 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-950">

**Important:** Remember to set a `min-h-[VALUE]` on the `ChartContainer` component. This is required for the chart be responsive.

### Add a Grid

Let's add a grid to the chart.

Import the `CartesianGrid` component.

```tsx /CartesianGrid/

```

Add the `CartesianGrid` component to your chart.

```tsx showLineNumbers {3}

```

### Add an Axis

To add an x-axis to the chart, we'll use the `XAxis` component.

Import the `XAxis` component.

```tsx /XAxis/

```

Add the `XAxis` component to your chart.

```tsx showLineNumbers {4-10}

```

### Add Tooltip

So far we've only used components from Recharts. They look great out of the box thanks to some customization in the `chart` component.

To add a tooltip, we'll use the custom `ChartTooltip` and `ChartTooltipContent` components from `chart`.

Import the `ChartTooltip` and `ChartTooltipContent` components.

```tsx

```

Add the components to your chart.

```tsx showLineNumbers {11}

    
    } />

```

Hover to see the tooltips. Easy, right? Two components, and we've got a beautiful tooltip.

### Add Legend

We'll do the same for the legend. We'll use the `ChartLegend` and `ChartLegendContent` components from `chart`.

Import the `ChartLegend` and `ChartLegendContent` components.

```tsx

```

Add the components to your chart.

```tsx showLineNumbers {12}

    
    } />
    } />

```

Done. You've built your first chart! What's next?

- [Themes and Colors](/docs/components/chart#theming)
- [Tooltip](/docs/components/chart#tooltip)
- [Legend](/docs/components/chart#legend)

## Chart Config

The chart config is where you define the labels, icons and colors for a chart.

It is intentionally decoupled from chart data.

This allows you to share config and color tokens between charts. It can also works independently for cases where your data or color tokens live remotely or in a different format.

```tsx showLineNumbers /ChartConfig/

const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'
    color: "#2563eb",
    // OR a theme object with 'light' and 'dark' keys
    theme: {
      light: "#2563eb",
      dark: "#dc2626",
    },
  },
} satisfies ChartConfig
```

## Theming

Charts has built-in support for theming. You can use css variables (recommended) or color values in any color format, such as hex, hsl or oklch.

### CSS Variables

Define your colors in your css file

```css {6-7,14-15} title="app/globals.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
  }

  .dark  {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
  }
}
```

Add the color to your `chartConfig`

```tsx {4,8} showLineNumbers
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig
```

### hex, hsl or oklch

You can also define your colors directly in the chart config. Use the color format you prefer.

```tsx showLineNumbers
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
} satisfies ChartConfig
```

### Using Colors

To use the theme colors in your chart, reference the colors using the format `var(--color-KEY)`.

#### Components

```tsx

```

#### Chart Data

```tsx showLineNumbers
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]
```

#### Tailwind

```tsx

```

## Tooltip

A chart tooltip contains a label, name, indicator and value. You can use a combination of these to customize your tooltip.

You can turn on/off any of these using the `hideLabel`, `hideIndicator` props and customize the indicator style using the `indicator` prop.

Use `labelKey` and `nameKey` to use a custom key for the tooltip label and name.

Chart comes with the `} />
```

See the full [API Reference](#api-reference) below for all available props.

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for tooltip label and names, use the `labelKey` and `nameKey` props.

```tsx showLineNumbers /browser/
const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: {
    label: "Total Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
```

```tsx
}
/>
```

This will use `Total Visitors` for label and `Chrome` and `Safari` for the tooltip names.

## Legend

You can use the custom `} />
```

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for legend names, use the `nameKey` prop.

```tsx showLineNumbers /browser/
const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
```

```tsx
} />
```

This will use `Chrome` and `Safari` for the legend names.

## Accessibility

You can turn on the `accessibilityLayer` prop to add an accessible layer to your chart.

This prop adds keyboard access and screen reader support to your charts.

```tsx

```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## API Reference

### ChartContainer

The top-level wrapper component for all charts. Provides chart context and applies default styling for Recharts elements.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `config` | `ChartConfig` | - | (required) Chart configuration object mapping data keys to labels, icons, and colors. |
| `id` | `string` | - | Optional id used to scope CSS custom properties. Auto-generated when omitted. |
| `children` | `React.ComponentProps` via its `content` prop.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.ComponentPropsWithoutRef` via its `content` prop.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Legend>` | - | Additional props inherited from Recharts `Legend`. |

### ChartLegendContent

Custom content renderer for `<ChartLegend>` (Recharts `Legend`). Reads theme colors and icons from chart context.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nameKey` | `string` | - | Config or data key to use for legend item names. |
| `hideIcon` | `boolean` | `false` | Whether to hide the icon or color swatch for each legend entry. |
| `verticalAlign` | `'top' \| 'middle' \| 'bottom'` | `'bottom'` | Vertical alignment of the legend relative to the chart. Controls top/bottom padding. |
| `payload` | `RechartsPrimitive.LegendProps['payload']` | - | Legend payload provided automatically by Recharts. |
| `className` | `string` | - | Additional CSS classes applied to the legend container. |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the legend container `div`. |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div. |

### ChartStyle

Internal component that injects a `<style>` tag to set CSS custom properties (`--color-*`) for each chart data key based on the `config`. Supports light/dark theming.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | - | (required) The chart id used to scope styles via `[data-chart]` attribute selector. |
| `config` | `ChartConfig` | - | (required) Chart configuration object. Entries with `theme` or `color` values produce CSS custom properties. |

### ChartConfig

The configuration type used by all chart components.

```tsx
type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<'light' | 'dark', string> }
  )
}
```

Each key maps to a data series. Use either `color` (single value) or `theme` (light/dark pair)  -  never both.