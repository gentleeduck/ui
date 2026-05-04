## Philosophy

Date picking is a composition problem, not a component problem. A date picker is just a Calendar inside a Popover triggered by a Button  -  three components you already have. We document it as a pattern rather than shipping a dedicated component because the "right" date picker varies wildly by use case (single date, range, date-time, with presets).

## How It's Built

## Installation

The Date Picker is built using a composition of the `` and the `` components.

See installation instructions for the [Popover](/docs/components/popover#installation) and the [Calendar](/docs/components/calendar#installation) components.

## Usage

```tsx showLineNumbers title="components/example-date-picker.tsx"
"use client"

  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState

  )
}
```

See the [@gentleduck/calendar](/docs/packages/duck-calendar) documentation for more information on the headless calendar engine.

## Examples

### Date of Birth Picker

### Picker with Input

### Date and Time Picker

### Natural Language Picker

This component uses the `chrono-node` library to parse natural language dates.

### Date of Birth Picker (with dropdowns)

### Date and Time Picker

### Natural Language Picker

### Form Integration

## RTL Support

RTL is supported through the underlying Calendar and Popover components. Set `dir="rtl"` on the Calendar or use `DirectionProvider` at app/root level for global direction.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionPopover`, `MotionPopoverContent`, and `MotionCalendar` for animated date picking. The popover enters/exits with spring animation and the calendar has directional month transitions with staggered day cells.

}>
Requires the `motion` package. Use `MotionPopover` instead of `Popover`, `MotionPopoverContent` instead of `PopoverContent`, and `MotionCalendar` instead of `Calendar`.