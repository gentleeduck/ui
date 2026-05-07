```tsx title="components/radio-group-1.tsx"
// import from your project: import Demo from '@/components/radio-group-1'
'use client'

import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'

export default function Demo() {
  return (
    <RadioGroup
      className="[&>div]:felx flex flex-col space-y-1 [&>div]:items-center [&>div]:space-x-3 [&>div]:space-y-0"
      defaultValue="comfortable">
      <RadioGroupItem value="default">Default</RadioGroupItem>
      <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
      <RadioGroupItem value="compact">Compact</RadioGroupItem>
    </RadioGroup>
  )
}
```

## Philosophy

Radio groups enforce single selection from a set  -  the constraint is the feature. Unlike checkboxes (multi-select) or selects (dropdown), radio groups make all options visible simultaneously. The primitive layer handles keyboard navigation (arrow keys plus Home/End/PageUp/PageDown navigation, auto-selecting on focus), form integration via hidden native radio inputs, and RTL direction support.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add radio-group
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/motion @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue="option-one">
  <RadioGroupItem value="option-one">Option One</RadioGroupItem>
  <RadioGroupItem value="option-two">Option Two</RadioGroupItem>
</RadioGroup>
```

## Examples

### Form

```tsx title="components/radio-group-2.tsx"
// import from your project: import Demo from '@/components/radio-group-2'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@gentleduck/registry-ui/field'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    error: 'You need to select a notification type.',
  }),
})

const notificationTypes = [
  {
    description: 'Receive updates for every new message.',
    id: 'all',
    title: 'All new messages',
  },
  {
    description: 'Only direct mentions and private messages.',
    id: 'mentions',
    title: 'Direct messages and mentions',
  },
  {
    description: 'Disable all notification alerts.',
    id: 'none',
    title: 'Nothing',
  },
] as const

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info(
      <div>
        <h4 className="font-medium text-md">You submitted the following values:</h4>
        <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    )
  }

  return (
    <form className="w-full max-w-lg space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend>Notify me about...</FieldLegend>
              <FieldDescription>Choose which message types should trigger notifications.</FieldDescription>
              <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange}>
                {notificationTypes.map((option) => (
                  <FieldLabel htmlFor={`form-rhf-radio-${option.id}`} key={option.id}>
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldTitle>{option.title}</FieldTitle>
                        <FieldDescription>{option.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        id={`form-rhf-radio-${option.id}`}
                        value={option.id}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Component Composition

## Keyboard Navigation

| Key | Description |
| --- | --- |
| `ArrowDown` | Move focus to next item and select it |
| `ArrowRight` | Move focus to next item and select it |
| `ArrowUp` | Move focus to previous item and select it |
| `ArrowLeft` | Move focus to previous item and select it |
| `Home` | Move focus to first item and select it |
| `End` | Move focus to last item and select it |
| `PageUp` | Move focus to first item and select it |
| `PageDown` | Move focus to last item and select it |
| `a-z` | Jump to next item matching typed characters and select it |
| `g` `g` | Jump to first item and select it |
| `G` | Jump to last item and select it |
| `Tab` | Move focus into/out of the radio group |
| `Space` | Select the focused item (if not already selected) |

## RTL Support

Set `dir="rtl"` on `RadioGroup` for a local override, or set `DirectionProvider` once at app/root level for global direction.

```tsx title="components/radio-group-3.tsx"
// import from your project: import Demo from '@/components/radio-group-3'
'use client'

import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'

export default function Demo() {
  return (
    <RadioGroup
      dir="rtl"
      className="[&>div]:felx flex flex-col space-y-1 [&>div]:items-center [&>div]:space-x-3 [&>div]:space-y-0"
      defaultValue="comfortable">
      <RadioGroupItem value="default">افتراضي</RadioGroupItem>
      <RadioGroupItem value="comfortable">مريح</RadioGroupItem>
      <RadioGroupItem value="compact">مضغوط</RadioGroupItem>
    </RadioGroup>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionRadioGroup` and `MotionRadioGroupItem` for staggered entrance animations powered by [motion](https://motion.dev). Each item fades in with scale and blur, staggered by 50ms.

```tsx title="components/radio-group-4.tsx"
// import from your project: import Demo from '@/components/radio-group-4'
'use client'

import { MotionRadioGroup, MotionRadioGroupItem } from '@gentleduck/registry-ui/radio-group'

export default function Demo() {
  return (
    <MotionRadioGroup
      className="[&>div]:felx flex flex-col space-y-1 [&>div]:items-center [&>div]:space-x-3 [&>div]:space-y-0"
      defaultValue="comfortable">
      <MotionRadioGroupItem value="default">Default</MotionRadioGroupItem>
      <MotionRadioGroupItem value="comfortable">Comfortable</MotionRadioGroupItem>
      <MotionRadioGroupItem value="compact">Compact</MotionRadioGroupItem>
    </MotionRadioGroup>
  )
}
```

}>
Requires the `motion` package. Use `MotionRadioGroup` + `MotionRadioGroupItem` instead of `RadioGroup` + `RadioGroupItem`. Same props. The regular components are perfectly fine - this is an optional enhancement.

## API Reference

### RadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled value of the selected radio item |
| `defaultValue` | `string` | - | Initial selected value when uncontrolled |
| `onValueChange` | `(value: string) => void` | - | Callback fired when selection changes |
| `disabled` | `boolean` | `false` | Whether the entire group is disabled |
| `required` | `boolean` | `false` | Whether the group is required in a form |
| `name` | `string` | - | The name used when submitting an HTML form |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `orientation` | `'horizontal' \| 'vertical'` | - | The orientation of the group for arrow key navigation |
| `loop` | `boolean` | `true` | Whether keyboard navigation should loop |
| `className` | `string` | - | Additional CSS classes |

### RadioGroupItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | (required) | Unique value for the radio item |
| `disabled` | `boolean` | `false` | Whether this item is disabled |
| `indicator` | `React.ReactElement` | - | Custom SVG or element for unchecked state indicator |
| `checkedIndicator` | `React.ReactElement` | - | Custom SVG or element for checked state indicator |
| `textValue` | `string` | - | Optional text used for keyboard typeahead matching (`a-z`). In the registry component, plain string/number children are inferred automatically. |
| `children` | `React.ReactNode` | - | Label content. When provided, a clickable label is rendered next to the control and selects the item on click. |
| `className` | `string` | - | Additional CSS classes for the radio button control |

### MotionRadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `RadioGroupProps` | - | All props from `RadioGroup` are supported |

Wraps `RadioGroup` and auto-injects stagger `index` into `MotionRadioGroupItem` children. Requires the `motion` package.

### MotionRadioGroupItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `...props` | `RadioGroupItemProps` | - | All props from `RadioGroupItem` are supported |

Wraps `RadioGroupItem` with a staggered `scaleIn` entrance animation and a bounce (scale + rotate) on the radio circle when clicked. Requires the `motion` package.

## See also

- [Checkbox](/duck-ui/components/checkbox)  -  Multi-selection toggle control
- [Switch](/duck-ui/components/switch)  -  Toggle between on and off states
- [Select](/duck-ui/components/select)  -  Dropdown selection from a list
- [Radio Group Primitive API](/duck-primitives/api/radio-group)  -  Headless primitive reference (`Root`, `Item`, `Indicator`)