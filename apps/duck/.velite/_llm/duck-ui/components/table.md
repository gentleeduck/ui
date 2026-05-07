## Philosophy

HTML tables are semantically powerful but visually bland. Our Table components add consistent styling while preserving the native table structure  -  `

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add table
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx showLineNumbers
` component to build more complex data tables. Combine it with
[@gentleduck/table](https://github.com/gentleeduck/gentleduck/tree/master/packages/duck-table) to create tables with sorting, filtering and pagination.

See the [Data Table](/duck-ui/components/data-table) documentation for more information.

You can also see data-table examples in the [Blocks Library](/blocks).

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionTable` and `MotionTableRow` for staggered entrance animations powered by [motion](https://motion.dev). The table fades in with scale and blur, and each row staggers by 50ms via the `index` prop.

}>
Requires the `motion` package. Use `MotionTable` instead of `Table` and `MotionTableRow` instead of `TableRow`. All other sub-components stay the same. The regular components are perfectly fine - this is an optional enhancement.

## API Reference

### Table

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Table content (`TableHeader`, `TableBody`, `TableFooter`, `TableCaption`) |
| `...props` | `React.HTMLProps<HTMLTableElement>` | - | Additional props to spread to the table element |

### TableHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Header rows |
| `...props` | `React.HTMLProps<HTMLTableSectionElement>` | - | Additional props to spread to the thead element |

### TableBody

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Body rows |
| `...props` | `React.HTMLProps<HTMLTableSectionElement>` | - | Additional props to spread to the tbody element |

### TableFooter

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Footer rows |
| `...props` | `React.HTMLProps<HTMLTableSectionElement>` | - | Additional props to spread to the tfoot element |

### TableRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Row cells (`TableHead` or `TableCell`) |
| `...props` | `React.HTMLProps<HTMLTableRowElement>` | - | Additional props to spread to the tr element |

### TableHead

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `string` | `'col'` | HTML `scope` attribute for accessibility |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Header cell content |
| `...props` | `React.ThHTMLAttributes<HTMLTableCellElement>` | - | Additional props to spread to the th element |

### TableCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Cell content |
| `...props` | `React.TdHTMLAttributes<HTMLTableCellElement>` | - | Additional props to spread to the td element |

### TableCaption

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `children` | `React.ReactNode` | - | Caption text |
| `...props` | `React.HTMLProps<HTMLTableCaptionElement>` | - | Additional props to spread to the caption element |

### MotionTable

`scaleIn` entrance with `springBouncy` transition on mount. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `TableProps` | - | All props from `Table` are supported |

### MotionTableRow

Staggered `scaleIn` entrance with `springBouncy` transition. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `...props` | `TableRowProps` | - | All props from `TableRow` are supported |