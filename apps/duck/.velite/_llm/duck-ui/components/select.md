```tsx title="components/select-1.tsx"
// import from your project: import Demo from '@/components/select-1'
'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

## Philosophy

Native selects are accessible but difficult to style consistently. This select builds on `@gentleduck/primitives/select` which provides full keyboard navigation, ARIA semantics, scroll management, and typeahead search. The wrapper adds design-system styling while the primitive handles all interaction logic.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add select
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
```

## Examples

### Scrollable

```tsx title="components/select-2.tsx"
// import from your project: import Demo from '@/components/select-2'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent className="h-[400px]">
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
          <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
          <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
          <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
          <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
          <SelectItem value="ist_indonesia">Indonesia Central Standard Time (WITA)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Australia & Pacific</SelectLabel>
          <SelectItem value="awst">Australian Western Standard Time (AWST)</SelectItem>
          <SelectItem value="acst">Australian Central Standard Time (ACST)</SelectItem>
          <SelectItem value="aest">Australian Eastern Standard Time (AEST)</SelectItem>
          <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
          <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          <SelectItem value="art">Argentina Time (ART)</SelectItem>
          <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
          <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
          <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

### Form

```tsx title="components/select-3.tsx"
// import from your project: import Demo from '@/components/select-3'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@gentleduck/registry-ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  email: z.email({
    error: 'Please select an email to display.',
  }),
})

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info(
      <div>
        <h4 className="font-medium text-lg">You submitted the following values:</h4>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    )
  }

  return (
    <form className="w-2/3 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-select-email">Email</FieldLabel>
                <FieldDescription>
                  You can manage email addresses in your <Link href="/examples/forms">email settings</Link>.
                </FieldDescription>
                {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="form-rhf-select-email" aria-invalid={fieldState.invalid} className="min-w-[260px]">
                  <SelectValue placeholder="Select a verified email to display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Active Trigger on Open

Style the trigger to appear active while the select dropdown is open using `data-[state=open]`:

```tsx title="components/select-5.tsx"
// import from your project: import Demo from '@/components/select-5'
'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <Select>
      <SelectTrigger className="w-48 data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## Component Composition

## RTL Support

Set `dir="rtl"` on `Select` for a local override, or set `DirectionProvider` once at app/root level for global direction.

```tsx title="components/select-4.tsx"
// import from your project: import Demo from '@/components/select-4'
'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <Select dir="rtl">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="اختر فاكهة" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>الفواكه</SelectLabel>
          <SelectItem value="apple">تفاح</SelectItem>
          <SelectItem value="banana">موز</SelectItem>
          <SelectItem value="blueberry">توت ازرق</SelectItem>
          <SelectItem value="grapes">عنب</SelectItem>
          <SelectItem value="pineapple">اناناس</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionSelect` and `MotionSelectContent` for smooth enter/exit animations powered by [motion](https://motion.dev). The dropdown enters with a bouncy spring scale and blur, and exits with a matching reverse animation.

```tsx title="components/select-6.tsx"
// import from your project: import Demo from '@/components/select-6'
'use client'
import {
  MotionSelect,
  MotionSelectContent,
  MotionSelectTrigger,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <MotionSelect>
      <MotionSelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </MotionSelectTrigger>
      <MotionSelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </MotionSelectContent>
    </MotionSelect>
  )
}
```

}>
Requires the `motion` package. Use `MotionSelect` instead of `Select` and `MotionSelectContent` instead of `SelectContent`. All other sub-components stay the same.

## API Reference

### Select

The root component that manages open/closed state, value state, and provides context.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Initial value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Callback fired when the selected value changes |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when dropdown open state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `name` | `string` | - | Name attribute for native form submission |
| `disabled` | `boolean` | - | Disables the entire select |
| `required` | `boolean` | - | Marks the select as required for form validation |
| `form` | `string` | - | Associates the select with a form element by ID |
| `autoComplete` | `string` | - | Hint for browser autofill |

### SelectTrigger

Button that toggles the dropdown. Renders a styled `<button>` with a chevron icon.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |
| `disabled` | `boolean` | - | Disables the trigger |

Sets `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="none"`, and `data-state` automatically.

### SelectValue

Renders the selected value text, or a placeholder when nothing is selected.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `React.ReactNode` | `''` | Text shown when no value is selected |

### SelectContent

The dropdown content area. Handles positioning, focus management, keyboard navigation, and dismiss behavior.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `'item-aligned' \| 'popper'` | `'popper'` | Positioning strategy. `item-aligned` aligns selected item with trigger. `popper` uses floating positioning. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side (popper position only) |
| `sideOffset` | `number` | - | Offset from trigger on the main axis |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment on the cross axis |
| `alignOffset` | `number` | - | Offset on the cross axis |
| `avoidCollisions` | `boolean` | `true` | Whether to flip to avoid viewport overflow |
| `collisionPadding` | `number` | `10` | Padding from viewport edges |
| `className` | `string` | - | Additional CSS class names |

Exposes `data-state="open"` / `data-state="closed"` and `data-side` for CSS animation.

### SelectGroup

Groups related items together. Renders a `<div>` with `role="group"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### SelectLabel

Label for a `SelectGroup`. Renders a `<div>` linked to its group via `aria-labelledby`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### SelectItem

An individual selectable item. Renders a `<div>` with `role="option"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | The value representing this item. Must not be empty string. |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `textValue` | `string` | - | Optional text override for typeahead search |
| `className` | `string` | - | Additional CSS class names |

Exposes `data-state="checked"` / `data-state="unchecked"`, `data-highlighted`, and `data-disabled`.

### SelectSeparator

Visual separator between items. Renders a styled `<div>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### SelectScrollUpButton / SelectScrollDownButton

Scroll navigation buttons that appear when content overflows the viewport.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional CSS class names |

### MotionSelect

Same props as `Select`. Wraps the root with motion state management for enter/exit animations. Required when using `MotionSelectContent`.

### MotionSelectContent

Same props as `SelectContent`. Adds spring-powered enter/exit animation (scale + blur) via `AnimatePresence`. Must be used with `MotionSelect` root. Requires the `motion` package.