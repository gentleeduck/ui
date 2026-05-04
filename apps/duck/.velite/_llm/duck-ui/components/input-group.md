## Philosophy

Complex input patterns  -  search bars, URL fields, currency inputs  -  need structure beyond a bare `

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add input-group
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/variants 
```
The `input-group` component depends on the [`button`](/docs/components/button), [`input`](/docs/components/input), and [`textarea`](/docs/components/textarea) components.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
```

```tsx showLineNumbers

  ` spinner behavior.

### Label

Add labels within input groups to improve accessibility.

### Dropdown

Pair input groups with dropdown menus for complex interactions.

### Button Group

Wrap input groups with button groups to create prefixes and suffixes.

### Custom Input

Add the `data-slot="input-group-control"` attribute to your custom input for automatic behavior and focus state handling.

No style is applied to the custom input. Apply your own styles using the `className` prop.

```tsx showLineNumbers

export function InputGroupCustom() {
  return (
    
      ` when building input groups. Has input group styles pre-applied and uses the unified `data-slot="input-group-control"` for focus state handling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional CSS classes to apply |
| `...props` | `React.HTMLProps` when building input groups. Has textarea group styles pre-applied and uses the unified `data-slot="input-group-control"` for focus state handling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional CSS classes to apply |
| `...props` | `React.HTMLProps<HTMLTextAreaElement>` | - | Additional props to spread to the textarea element |

### MotionInputGroup

Same props as `InputGroup` plus an optional `index` prop for stagger delay (50ms per index). Adds fade+blur entrance animation. Requires the `motion` package.