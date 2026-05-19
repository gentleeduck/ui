```tsx title="components/textarea-1.tsx"
// import from your project: import Demo from '@/components/textarea-1'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return <Textarea placeholder="Type your message here." />
}
```

## Philosophy

When a single line isn't enough, Textarea steps in. It's the same design philosophy as Input  -  a thin wrapper around the native element with consistent styling. We don't add auto-resize or character counting because those are features you compose on top, not defaults everyone pays for.

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add textarea
```

Install the following dependencies:

```bash
npm install @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { Textarea } from '@/components/ui/textarea'
```

```tsx
<Textarea />
```

## Examples

### Default

```tsx title="components/textarea-2.tsx"
// import from your project: import Demo from '@/components/textarea-2'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return <Textarea placeholder="Type your message here." />
}
```

### Disabled

```tsx title="components/textarea-3.tsx"
// import from your project: import Demo from '@/components/textarea-3'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return <Textarea disabled placeholder="Type your message here." />
}
```

### With Label

```tsx title="components/textarea-4.tsx"
// import from your project: import Demo from '@/components/textarea-4'
import { Label } from '@gentleduck/registry-ui/label'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  )
}
```

### With Text

```tsx title="components/textarea-5.tsx"
// import from your project: import Demo from '@/components/textarea-5'
import { Label } from '@gentleduck/registry-ui/label'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-5">Your message</Label>
      <Textarea id="message-5" placeholder="Type your message here." />
      <p className="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
    </div>
  )
}
```

### With Button

```tsx title="components/textarea-6.tsx"
// import from your project: import Demo from '@/components/textarea-6'
import { Button } from '@gentleduck/registry-ui/button'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  )
}
```

### Form

```tsx title="components/textarea-7.tsx"
// import from your project: import Demo from '@/components/textarea-7'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@gentleduck/registry-ui/field'
import { Textarea } from '@gentleduck/registry-ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
})

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values:', {
      description: (
        <div>
          <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      ),
    })
  }

  return (
    <form className="w-2/3 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="bio"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-textarea-bio">Bio</FieldLabel>
              <Textarea
                {...field}
                id="form-rhf-textarea-bio"
                aria-invalid={fieldState.invalid}
                className="resize-none"
                placeholder="Tell us a little bit about yourself"
              />
              <FieldDescription>
                You can <span>@mention</span> other users and organizations.
              </FieldDescription>
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

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/textarea-8.tsx"
// import from your project: import Demo from '@/components/textarea-8'
import { Label } from '@gentleduck/registry-ui/label'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message" dir="rtl">
        {'رسالتك'}
      </Label>
      <Textarea id="message" placeholder="اكتب رسالتك هنا." dir="rtl" />
    </div>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionTextarea` for a smooth entrance animation powered by [motion](https://motion.dev). The textarea fades in with scale and blur on mount using `springBouncy`.

```tsx title="components/textarea-9.tsx"
// import from your project: import Demo from '@/components/textarea-9'
'use client'

import { MotionTextarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return <MotionTextarea placeholder="Type your message here." />
}
```

}>
  Requires the `motion` package. Use `MotionTextarea` instead of `Textarea`. Same props. The regular `Textarea` is perfectly fine - this is an optional enhancement.

## API Reference

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.HTMLProps<HTMLTextAreaElement>` | - | Additional props to spread to the textarea element |

### MotionTextarea

`scaleIn` entrance with `springBouncy` transition on mount. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `TextareaProps` | - | All props from `Textarea` are supported |

## See also

* [Input](/duck-ui/components/input)  -  Single-line text input
* [Label](/duck-ui/components/label)  -  Accessible label for form controls