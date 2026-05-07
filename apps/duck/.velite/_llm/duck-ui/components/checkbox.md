```tsx title="components/checkbox-1.tsx"
// import from your project: import Demo from '@/components/checkbox-1'
'use client'

import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox defaultChecked id="terms-2" />
        <div className="grid gap-2">
          <Label htmlFor="terms-2">Accept terms and conditions</Label>
          <p className="text-muted-foreground text-sm">
            By clicking this checkbox, you agree to the terms and conditions.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox disabled id="toggle" />
        <Label htmlFor="toggle">Enable notifications</Label>
      </div>
      <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
        <Checkbox
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          defaultChecked
          id="toggle-2"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="font-medium text-sm leading-none">Enable notifications</p>
          <p className="text-muted-foreground text-sm">You can enable or disable notifications at any time.</p>
        </div>
      </Label>
    </div>
  )
}
```

## Philosophy

Checkboxes are deceptively complex. A simple checked/unchecked state becomes indeterminate for parent/child relationships, needs accessible labels, and must work in both controlled and uncontrolled modes. We handle all of this with native checkbox semantics and custom SVG indicators, so the visual design is yours while the behavior is correct.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add checkbox
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/motion @gentleduck/libs
```

Make sure you have the [`Label`](/duck-ui/components/label) component installed in your project.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox"
```

```tsx
<Checkbox />
```

## Examples

### Basic uncontrolled checkbox
```tsx title="components/checkbox-2.tsx"
// import from your project: import Demo from '@/components/checkbox-2'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'

export default function Demo() {
  return <Checkbox defaultChecked={false} />
}
```

### Controlled checkbox

```tsx title="components/checkbox-3.tsx"
// import from your project: import Demo from '@/components/checkbox-3'
'use client'
import { Checkbox, type CheckedState } from '@gentleduck/registry-ui/checkbox'
import { useState } from 'react'

export default function Demo() {
  const [checked, setChecked] = useState<CheckedState>(false)

  return <Checkbox checked={checked} onCheckedChange={setChecked} />
}
```

### Checkbox with label

```tsx title="components/checkbox-4.tsx"
// import from your project: import Demo from '@/components/checkbox-4'
import { CheckboxWithLabel } from '@gentleduck/registry-ui/checkbox'
import { toast } from 'sonner'

export default function Demo() {
  return (
    <CheckboxWithLabel
      checkbox={{
        defaultChecked: false,
        onCheckedChange: (state) => toast.info(`Checkbox ${state ? 'checked' : 'unchecked'}`),
      }}
      label={{ children: 'I agree to the terms and conditions' }}
      id="termss"
    />
  )
}
```

### Indeterminate state

```tsx title="components/checkbox-5.tsx"
// import from your project: import Demo from '@/components/checkbox-5'
'use client'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { useState } from 'react'

export default function Demo() {
  const [checked, setChecked] = useState<'indeterminate' | boolean>('indeterminate')

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={() => {
        setChecked((prev) => (prev === false ? 'indeterminate' : prev === 'indeterminate'))
      }}
    />
  )
}
```

###  Checkbox group

```tsx title="components/checkbox-6.tsx"
// import from your project: import Demo from '@/components/checkbox-6'
import { CheckboxGroup, type CheckboxGroupSubtasks } from '@gentleduck/registry-ui/checkbox'
import { toast } from 'sonner'

export default function Demo() {
  const subtasks: CheckboxGroupSubtasks[] = [
    { id: 'subtask-1', title: 'Design wireframes' },
    { id: 'subtask-2', title: 'Build UI components' },
    { id: 'subtask-3', title: 'Write documentation' },
  ]

  return (
    <CheckboxGroup
      subtasks={subtasks}
      defaults={{
        checkbox: { onCheckedChange: (state) => toast.info(`Checkbox ${state ? 'checked' : 'unchecked'}`) },
        label: { className: 'text-sm text-muted-foreground' },
      }}
    />
  )
}
```

### Custom indicator icons

```tsx title="components/checkbox-7.tsx"
// import from your project: import Demo from '@/components/checkbox-7'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { Gem, Minus } from 'lucide-react'

export default function Demo() {
  return <Checkbox checkedIndicator={<Gem className="h-3 w-3" />} indicator={<Minus className="h-3 w-3" />} />
}
```

### Form

```tsx title="components/checkbox-8.tsx"
// import from your project: import Demo from '@/components/checkbox-8'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@gentleduck/registry-ui/field'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      items: ['recents', 'home'],
    },
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="items"
        render={({ field, fieldState }) => (
          <FieldSet>
            <FieldLegend variant="label">Sidebar</FieldLegend>
            <FieldDescription>Select the items you want to display in the sidebar.</FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              {items.map((item) => (
                <Field orientation="horizontal" key={item.id} data-invalid={fieldState.invalid}>
                  <Checkbox
                    id={`form-rhf-checkbox-${item.id}`}
                    name={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={field.value.includes(item.id)}
                    onCheckedChange={(checked) => {
                      const nextValue = checked
                        ? [...field.value, item.id]
                        : field.value.filter((value) => value !== item.id)
                      field.onChange(nextValue)
                    }}
                  />
                  <FieldLabel className="font-normal text-sm" htmlFor={`form-rhf-checkbox-${item.id}`}>
                    {item.label}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
            {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
          </FieldSet>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/checkbox-9.tsx"
// import from your project: import Demo from '@/components/checkbox-9'
'use client'

import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <div className="flex flex-col gap-6" dir="rtl">
        <div className="flex items-center gap-3">
          <Checkbox id="terms" />
          <Label htmlFor="terms">قبول الشروط والاحكام</Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox defaultChecked id="terms-2" />
          <div className="grid gap-2">
            <Label htmlFor="terms-2">قبول الشروط والاحكام</Label>
            <p className="text-muted-foreground text-sm">بالنقر على هذا المربع، فانك توافق على الشروط والاحكام.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox disabled id="toggle" />
          <Label htmlFor="toggle">تفعيل الاشعارات</Label>
        </div>
        <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950">
          <Checkbox
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            defaultChecked
            id="toggle-2"
          />
          <div className="grid gap-1.5 font-normal">
            <p className="font-medium text-sm leading-none">تفعيل الاشعارات</p>
            <p className="text-muted-foreground text-sm">يمكنك تفعيل او تعطيل الاشعارات في اي وقت.</p>
          </div>
        </Label>
      </div>
    </DirectionProvider>
  )
}
```

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionCheckboxWithLabel` for staggered fade-up entrance animations powered by [motion](https://motion.dev). Pass `index` for stagger delay.

```tsx title="components/checkbox-10.tsx"
// import from your project: import Demo from '@/components/checkbox-10'
'use client'

import { MotionCheckbox, MotionCheckboxWithLabel } from '@gentleduck/registry-ui/checkbox'
import { Label } from '@gentleduck/registry-ui/label'
import * as React from 'react'

export default function Demo() {
  const [tasks, setTasks] = React.useState([
    { id: 'motion-design', label: 'Design system review', checked: true },
    { id: 'motion-tests', label: 'Write integration tests', checked: false },
    { id: 'motion-deploy', label: 'Deploy to staging', checked: false },
  ])

  const allChecked = tasks.every((t) => t.checked)
  const someChecked = tasks.some((t) => t.checked) && !allChecked
  const parentState = allChecked ? true : someChecked ? ('indeterminate' as const) : false

  const toggleAll = () => {
    const next = !allChecked
    setTasks((prev) => prev.map((t) => ({ ...t, checked: next })))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 border-b pb-3">
        <MotionCheckbox checked={parentState} onCheckedChange={toggleAll} id="motion-parent" />
        <Label htmlFor="motion-parent" className="cursor-pointer font-medium">
          Select all tasks
        </Label>
      </div>
      <div className="flex flex-col gap-2 ps-6">
        {tasks.map((task, i) => (
          <MotionCheckboxWithLabel
            key={task.id}
            id={task.id}
            index={i}
            checkbox={{
              checked: task.checked,
              onCheckedChange: (next) =>
                setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, checked: !!next } : t))),
            }}
            label={{ children: task.label }}
          />
        ))}
      </div>
    </div>
  )
}
```

}>
Requires the `motion` package. Use `MotionCheckboxWithLabel` instead of `CheckboxWithLabel`, or `MotionCheckboxGroup` instead of `CheckboxGroup`. The `Checkbox` component stays the same.

## API Reference

### Checkbox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `indicator` | `React.ReactElement` | - | Custom SVG or icon for unchecked state indicator |
| `checkedIndicator` | `React.ReactElement` | - | Custom SVG or icon for checked state indicator |
| `checked` | `boolean \| 'indeterminate'` | - | Controlled checked state |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | Initial checked state if uncontrolled |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | - | Callback fired when checked state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS classes applied to the checkbox input |
| `style` | `React.CSSProperties` | - | Inline styles merged with internal indicator styles |
| `ref` | `React.Ref<HTMLInputElement>` | - | Ref forwarded to the native checkbox input |
| `...props` | `Omit<React.HTMLProps<HTMLInputElement>, 'checked' \| 'onChange' \| 'defaultChecked'>` | - | Additional props to spread to the input element |

### CheckboxWithLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | (required) | HTML `id` attribute to link checkbox and label |
| `checkbox` | `React.ComponentPropsWithoutRef<typeof Checkbox>` | (required) | Props passed to the internal `Checkbox` component |
| `label` | `React.ComponentPropsWithoutRef<typeof Label>` | (required) | Props passed to the internal `Label` component |
| `className` | `string` | - | Additional CSS classes applied to the wrapping div |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the wrapping div |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CheckboxGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `subtasks` | `CheckboxGroupSubtasks[]` | (required) | Array of subtasks to render as individual checkboxes with labels |
| `defaults` | `CheckboxWithLabelProps` | - | Default props applied to each checkbox and label in the group |
| `className` | `string` | - | Additional CSS classes applied to the wrapping div |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the wrapping div |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### CheckboxGroupSubtasks

```tsx
type CheckboxGroupSubtasks = {
  id: string
  title: string
  checked?: boolean | 'indeterminate'
}
```

### MotionCheckbox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | - | Callback fired when checked state changes. Also triggers the bounce animation. |
| `...props` | `CheckboxProps` | - | All props from `Checkbox` are supported |

Wraps `Checkbox` with a bounce animation (scale + rotate) on check. Requires the `motion` package.

### MotionCheckboxWithLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `...props` | `CheckboxWithLabelProps` | - | All props from `CheckboxWithLabel` are supported |

Wraps `CheckboxWithLabel` with a staggered `scaleIn` entrance. Uses `MotionCheckbox` internally. Requires the `motion` package.

### MotionCheckboxGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `CheckboxGroupProps` | - | All props from `CheckboxGroup` are supported |

Same as `CheckboxGroup` but renders each item as `MotionCheckboxWithLabel` with automatic stagger index. Requires the `motion` package.

## See also

- [Radio Group](/duck-ui/components/radio-group)  -  Single selection from a set of options
- [Switch](/duck-ui/components/switch)  -  Toggle between on and off states