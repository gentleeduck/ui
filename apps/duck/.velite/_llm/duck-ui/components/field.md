## Philosophy

Fields are the structural glue between form controls and their metadata  -  labels, descriptions, error messages. Rather than baking this structure into every input component, Field composes around any control. This means the same label/error pattern works for Input, Select, Textarea, or your custom components.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add field
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/variants
```

The `field` component depends on the [`label`](/duck-ui/components/label) and [`separator`](/duck-ui/components/separator) components.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
```

```tsx showLineNumbers

      
      
      

## Anatomy

The `Field` family is designed for composing accessible forms. A typical field is structured as follows:

```tsx showLineNumbers

  

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionField` and `MotionFieldGroup` for staggered fade-up entrance animations powered by [motion](https://motion.dev). Pass `index` to `MotionField` for stagger delay.

}>
Requires the `motion` package. Use `MotionField` instead of `Field` and `MotionFieldGroup` instead of `FieldGroup`. All other sub-components (`FieldLabel`, `FieldDescription`, `FieldSet`, etc.) stay the same.

## API Reference

### FieldSet

Container that renders a semantic `fieldset` with spacing presets.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Fieldset content |
| `...props` | `React.HTMLProps<HTMLFieldSetElement>` | - | Additional props to spread to the fieldset element |

### FieldLegend

Legend element for a `FieldSet`. Switch to the `label` variant to align with label sizing.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'legend' \| 'label'` | `'legend'` | Visual variant controlling text size |
| `className` | `string` | `--` | Additional CSS classes |
| `...props` | `React.HTMLProps<HTMLLegendElement>` | - | Additional props to spread to the legend element |

### FieldGroup

Layout wrapper that stacks `Field` components and enables container queries for responsive orientations.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Field components |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### Field

The core wrapper for a single field. Provides orientation control, invalid state styling, and spacing.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` | Layout orientation of the field |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Field content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div; set `data-invalid` to render in an error state |

### FieldContent

Flex column that groups control and descriptions when the label sits beside the control. Not required if you have no description.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Label, description, and control content |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### FieldLabel

Label styled for both direct inputs and nested `Field` children.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Label text or nested field content |
| `...props` | `React.ComponentPropsWithoutRef<typeof Label>` | - | Additional props inherited from `Label`. |

### FieldTitle

Renders a title with label styling inside `FieldContent`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Title text |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### FieldDescription

Helper text slot that automatically balances long lines in horizontal layouts.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `--` | Additional CSS classes |
| `children` | `React.ReactNode` | `--` | Description text |
| `...props` | `React.HTMLProps<HTMLParagraphElement>` | - | Additional props to spread to the p element |

### FieldSeparator

Visual divider to separate sections inside a `FieldGroup`. Accepts optional inline content.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | `--` | Optional inline content displayed over the separator |
| `className` | `string` | `--` | Additional CSS classes |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### FieldError

Accessible error container that accepts children or an `errors` array (e.g., from `react-hook-form`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `errors` | `Array<{ message?: string } \| undefined>` | `--` | Array of error objects from a form library |
| `children` | `React.ReactNode` | `--` | Custom error content (takes precedence over `errors`) |
| `className` | `string` | `--` | Additional CSS classes |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

When the `errors` array contains multiple messages, the component renders a list automatically.

`FieldError` also accepts issues produced by any validator that implements [Standard Schema](https://standardschema.dev/), including Zod, Valibot, and ArkType. Pass the `issues` array from the schema result directly to render a unified error list across libraries.

### MotionField

Same props as `Field` plus an optional `index` prop for stagger delay (50ms per index). Adds fadeUp entrance animation. Requires the `motion` package.

### MotionFieldGroup

Same props as `FieldGroup`. Adds fadeUp entrance animation. Requires the `motion` package.

### MotionFieldError

Same props as `FieldError`. Adds fadeUp entrance with 50ms delay. Requires the `motion` package.