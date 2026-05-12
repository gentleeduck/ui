```tsx title="components/input-otp-1.tsx"
// import from your project: import Demo from '@/components/input-otp-1'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gentleduck/registry-ui/input-otp'

export default function Demo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

## Philosophy

OTP inputs are deceptively complex: they need to handle paste, auto-fill, focus management across segments, and mobile keyboard optimization. We isolate this complexity in a dedicated component rather than stretching Input to cover it. Each slot is its own element, giving you full control over styling and animation per digit.

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add input-otp
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
```

```tsx showLineNumbers
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot />
    <InputOTPSlot />
    <InputOTPSlot />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot />
    <InputOTPSlot />
    <InputOTPSlot />
  </InputOTPGroup>
</InputOTP>
```

## Examples

### Pattern

Use the `pattern` prop to define a custom pattern for the OTP input.

```tsx title="components/input-otp-2.tsx"
// import from your project: import Demo from '@/components/input-otp-2'
'use client'
import { InputOTP, InputOTPGroup, InputOTPSlot, REGEXP_ONLY_DIGITS } from '@gentleduck/registry-ui/input-otp'

export default function Demo() {
  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

```tsx showLineNumbers {1,7}

...

<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot />
    {/* ... */}
  </InputOTPGroup>
</InputOTP>
```

### Separator

You can use the `` component to add a separator between the input groups.

```tsx title="components/input-otp-3.tsx"
// import from your project: import Demo from '@/components/input-otp-3'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gentleduck/registry-ui/input-otp'

export default function Demo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

```tsx showLineNumbers {4,15}
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

...

<InputOTP maxLength={4}>
  <InputOTPGroup>
    <InputOTPSlot />
    <InputOTPSlot />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot />
    <InputOTPSlot />
  </InputOTPGroup>
</InputOTP>
```

### Controlled

You can use the `value` and `onValueChange` props to control the input value.

```tsx title="components/input-otp-4.tsx"
// import from your project: import Demo from '@/components/input-otp-4'
'use client'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gentleduck/registry-ui/input-otp'
import React from 'react'

export default function Demo() {
  const [value, setValue] = React.useState('')

  return (
    <div className="space-y-2">
      <InputOTP maxLength={6} onValueChange={(value) => setValue(value)} value={value}>
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === '' ? 'Enter your one-time password.' : <>You entered: {value}</>}
      </div>
    </div>
  )
}
```

### Custom separator

```tsx title="components/input-otp-5.tsx"
// import from your project: import Demo from '@/components/input-otp-5'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gentleduck/registry-ui/input-otp'
import { Minus } from 'lucide-react'

export default function Demo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator customIndicator={<Minus aria-hidden="true" />} />
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

### Form

```tsx title="components/input-otp-6.tsx"
// import from your project: import Demo from '@/components/input-otp-6'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@gentleduck/registry-ui/field'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gentleduck/registry-ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
})

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      pin: '',
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
    <form className="w-2/3 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="pin"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-input-otp-pin">One-Time Password</FieldLabel>
              <InputOTP
                id="form-rhf-input-otp-pin"
                maxLength={6}
                name={field.name}
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}>
                <InputOTPGroup>
                  <InputOTPSlot />
                  <InputOTPSlot />
                  <InputOTPSlot />
                  <InputOTPSlot />
                  <InputOTPSlot />
                  <InputOTPSlot />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>Please enter the one-time password sent to your phone.</FieldDescription>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Paste

* Pasting fills slots starting at the focused input.
* Characters are filtered by the `pattern` prop.
* `onValueChange` fires after paste and per-key entry.

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/input-otp-7.tsx"
// import from your project: import Demo from '@/components/input-otp-7'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gentleduck/registry-ui/input-otp'

export default function Demo() {
  return (
    <InputOTP maxLength={6} dir="rtl">
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionInputOTP` for a scale+blur entrance animation on the entire OTP input powered by [motion](https://motion.dev).

```tsx title="components/input-otp-8.tsx"
// import from your project: import Demo from '@/components/input-otp-8'
'use client'

import { InputOTPGroup, InputOTPSeparator, InputOTPSlot, MotionInputOTP } from '@gentleduck/registry-ui/input-otp'

export default function Demo() {
  return (
    <MotionInputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </MotionInputOTP>
  )
}
```

}>
  Requires the `motion` package. Use `MotionInputOTP` instead of `InputOTP`. All other sub-components stay the same.

## API Reference

### InputOTP

The root component that provides OTP context and manages slot focus, paste, and value state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the wrapper div |
| `children` | `React.ReactNode` | - | OTP groups, slots, and separators |
| `value` | `string` | - | Controlled value of the OTP input |
| `onValueChange` | `(value: string) => void` | - | Callback fired when the combined slot value changes |
| `pattern` | `RegExp` | `/^.$/` | Regex used to validate each entered character |
| `maxLength` | `number` | - | Optional cap for active slots used by keyboard and paste behavior |
| `name` | `string` | - | Optional field name (useful with form libraries) |
| `dir` | `'ltr' \| 'rtl'` | inherited | Local direction override |
| `ref` | `React.Ref` | Custom element to render instead of the default dot icon |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the separator div |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionInputOTP

Same props as `InputOTP`. Adds scale+blur entrance animation on the entire OTP container. Requires the `motion` package.