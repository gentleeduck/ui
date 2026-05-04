## Philosophy

Calendars are complex accessibility challenges disguised as simple grids. We own the entire calendar stack  -  from the headless engine ([`@gentleduck/calendar`](/duck-calendar)) to the compound primitives (`@gentleduck/primitives/calendar`) to this styled component. The adapter pattern lets you swap date libraries, the hook layer handles state management, and this component applies Tailwind styling via `data-*` attribute selectors.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add calendar
```

Install the following dependencies:

```bash
npm install @gentleduck/calendar @gentleduck/libs
```

Add the `Button` and `Select` components to your project.

The `Calendar` uses the [`Button`](/duck-ui/components/button) variant styles and the [`Select`](/duck-ui/components/select) component for month/year dropdowns.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

```

```tsx showLineNumbers
const [date, setDate] = React.useState
)
```

See the [@gentleduck/calendar package docs](/duck-calendar) for more information on the headless engine, date adapters, and advanced features.

## Examples

### Date Picker (Popover)

### Date Picker (Input)

### Date Input (Natural Language)

### Form Integration

### Multi-Month Range Picker

### Range Calendar

### Date Constraints

### Multi-Select

### Event Calendar

### Custom Cell Size

### Click to View Events (Popover)

### Booked Dates (Strikethrough)

### Booking Calendar

### Multi-Range Selection

### Multi-Range with Shift+Click

### Presets

### Persian (Jalali) Calendar

### Islamic (Hijri) Calendar

### Hebrew Calendar

### Hebrew Calendar (English)

### Islamic Calendar (English)

### Persian Calendar (English)

## Notes

### Blocks

We have built a collection of 30+ calendar blocks that you can use to build your own calendar components.

See all calendar blocks in the [Blocks Library](/blocks/calendar) page.

### Migrated from react-day-picker

} tone="warning" title="Migrated from react-day-picker">
We have replaced `react-day-picker` with our own headless calendar engine  -  [`@gentleduck/calendar`](/duck-calendar). The result is **75% smaller bundle** (~5 KB vs ~20 KB gzipped), zero external dependencies, full keyboard navigation, and complete ARIA compliance. See the [performance benchmarks](/duck-calendar#performance) for detailed comparisons.

### Date Picker

You can use the `
      )}
    </>
  )}
/>
```

The `day` object exposes: `date`, `isToday`, `isSelected`, `isDisabled`, `isOutside`, `isHidden`, `isWeekend`, `isRangeStart`, `isRangeEnd`, `isRangeMiddle`.

#### renderHeader

Replace the entire navigation header. Receives a context object with navigation controls.

```tsx showLineNumbers

```

#### renderWeekday

Customize individual weekday column headers. Receives the abbreviation and column index.

```tsx showLineNumbers

```

#### renderFooter

Add content below the calendar grid. Receives the current months array for context.

```tsx showLineNumbers

```

### Data Attributes

The calendar uses `data-*` attributes on day cells for styling. Target these in your CSS:

| Attribute | When Present |
| --- | --- |
| `data-selected="true"` | Day is selected |
| `data-selected-single="true"` | Day is selected (single mode, not part of range) |
| `data-today="true"` | Day is today |
| `data-focused="true"` | Day has keyboard focus |
| `data-range-start="true"` | Day is the start of a range |
| `data-range-end="true"` | Day is the end of a range |
| `data-range-middle="true"` | Day is between range start and end |
| `data-day` | Formatted date string for the day (always present) |

### MotionCalendar

Adds directional slide transitions on month navigation (with blur) and staggered day cell entry animation. Uses `LazyMotion` for a lightweight bundle (~5KB). Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `CalendarProps` | - | All props from `Calendar` are supported |

### CSS Variables

| Variable | Default | Description |
| --- | --- | --- |
| `--gentleduck-calendar-cell` | `--spacing(8)` (32px) | Size of day cells and nav buttons |