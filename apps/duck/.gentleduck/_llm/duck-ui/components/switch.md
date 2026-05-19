```tsx title="components/switch-1.tsx"
// import from your project: import Demo from '@/components/switch-1'
'use client'

import { Switch } from '@gentleduck/registry-ui/switch'

export default function Demo() {
  return <Switch />
}
```

## Philosophy

Switches represent immediate, binary state changes  -  unlike checkboxes, which defer action to a form submission. This semantic distinction matters for UX: a switch should take effect instantly. We support custom SVG indicators so the on/off metaphor can match your design language without sacrificing the accessible `role="switch"` foundation.

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add switch
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/motion @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Switch } from "@/components/ui/switch"
```

```tsx
<Switch />
```

## Examples

### Form

```tsx title="components/switch-2.tsx"
// import from your project: import Demo from '@/components/switch-2'
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
import { Switch } from '@gentleduck/registry-ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      security_emails: true,
    },
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info(
      <div>
        <h4 className="font-medium text-lg">You submitted the following values:</h4>
        <pre className="mt-2 w-[270px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    )
  }

  return (
    <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <h3 className="mb-4 font-medium text-lg">Email Notifications</h3>
        <FieldGroup className="space-y-4">
          <Controller
            control={form.control}
            name="marketing_emails"
            render={({ field, fieldState }) => (
              <Field
                className="justify-between rounded-lg border p-3 shadow-sm"
                orientation="horizontal"
                data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="switch-marketing-emails">Marketing emails</FieldLabel>
                  <FieldDescription>Receive emails about new products, features, and more.</FieldDescription>
                  {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
                <Switch
                  id="switch-marketing-emails"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="security_emails"
            render={({ field, fieldState }) => (
              <Field
                className="justify-between rounded-lg border p-3 shadow-sm"
                orientation="horizontal"
                data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="switch-security-emails">Security emails</FieldLabel>
                  <FieldDescription>Receive emails about your account security.</FieldDescription>
                  {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
                <Switch
                  id="switch-security-emails"
                  name={field.name}
                  checked={field.value}
                  disabled
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/switch-3.tsx"
// import from your project: import Demo from '@/components/switch-3'
'use client'

import { Switch } from '@gentleduck/registry-ui/switch'

export default function Demo() {
  return <Switch dir="rtl" />
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionSwitch` for a physical-feeling toggle powered by [motion](https://motion.dev). The thumb slides with a bouncy spring, stretches in the direction of travel when pressed, and the track color crossfades between border and primary.

```tsx title="components/switch-4.tsx"
// import from your project: import Demo from '@/components/switch-4'
'use client'

import { MotionSwitch } from '@gentleduck/registry-ui/switch'

export default function Demo() {
  return <MotionSwitch />
}
```

}>
  Requires the `motion` package. Use `MotionSwitch` instead of `Switch`. The motion variant renders its own track + thumb so it does not support the `indicator` / `checkedIndicator` props — use the base `Switch` if you need custom SVG indicators.

## API Reference

### Switch

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional class names for the checkbox input |
| `indicator` | `React.ReactElement` | - | Custom element for the unchecked state indicator |
| `checkedIndicator` | `React.ReactElement` | - | Custom element for the checked state indicator |
| `onChange` | `(event: ChangeEvent) => void` | - | Native checkbox `change` event handler |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback with the new checked boolean when toggled |
| `ref` | `React.Ref<HTMLInputElement>` | - | Ref forwarded to the native checkbox input |
| `style` | `React.CSSProperties` | - | Inline styles applied to the input element |
| `...props` | `React.HTMLProps<HTMLInputElement>` | - | Additional props to spread to the input element |

### MotionSwitch

Renders its own motion-controlled track and thumb. The thumb slides with a bouncy spring, stretches in the direction of travel while pressed, and the track color crossfades between `border` and `primary`. Requires the `motion` package. Does **not** support the `indicator` / `checkedIndicator` props — use the base `Switch` for custom SVG indicators.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. In RTL the thumb starts on the right and the stretch origin flips. |
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Uncontrolled initial checked state |
| `disabled` | `boolean` | `false` | Disables interaction and lowers opacity |
| `onChange` | `(event: ChangeEvent) => void` | - | Native checkbox `change` event handler |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback with the new checked boolean when toggled |
| `className` | `string` | - | Additional class names for the outer track label |
| `style` | `React.CSSProperties` | - | Inline styles applied to the outer track label |
| `...props` | `React.HTMLProps<HTMLInputElement>` | - | Additional props spread onto the hidden input element |

## See also

* [Checkbox](/duck-ui/components/checkbox)  -  Multi-selection toggle control
* [Radio Group](/duck-ui/components/radio-group)  -  Single selection from a set of options