In this guide, we will take a look at building forms with React Hook Form. We'll cover building forms with the `` component, adding schema validation using Zod, error handling, accessibility, and more.

## Demo

We are going to build the following form. It has a simple text input and a textarea. On submit, we'll validate the form data and display any errors.

}>
  **Note:** For the purpose of this demo, we have intentionally disabled browser
  validation to show how schema validation and form errors work in React Hook
  Form. It is recommended to add basic browser validation in your production
  code.

```tsx title="components/form-rhf-demo.tsx"
// import from your project: import Demo from '@/components/form-rhf-demo'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@gentleduck/registry-ui/field'
import { Input } from '@gentleduck/registry-ui/input'
import { Textarea } from '@gentleduck/registry-ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters.')
    .max(100, 'Description must be at most 100 characters.'),
  title: z
    .string()
    .min(5, 'Bug title must be at least 5 characters.')
    .max(32, 'Bug title must be at most 32 characters.'),
})

type FormValues = z.infer<typeof formSchema>

export default function FormRHFDemo() {
  const form = useForm<FormValues>({
    defaultValues: {
      description: '',
      title: '',
    },
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: FormValues) {
    toast.success('Form submitted successfully', {
      description: (
        <pre className="mt-2 max-w-[520px] overflow-x-auto rounded-md border bg-muted p-4 text-xs">
          {JSON.stringify(values, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <form className="w-full max-w-xl space-y-6" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="Login button not working on mobile"
              />
              <FieldDescription>Provide a concise title for your bug report.</FieldDescription>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="min-h-[120px]"
                placeholder="Describe the issue and expected behavior..."
              />
              <FieldDescription>Add enough detail for someone else to reproduce the bug.</FieldDescription>
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

## Approach

This form uses React Hook Form for form state and validation. We'll build our form using the `` component, which gives you **full control over the markup and styling**.

* Uses React Hook Form's `useForm` hook for form state management.
* `` component for controlled inputs.
* `` components for building accessible forms.
* Client-side validation using Zod with `zodResolver`.

## Anatomy

Here's a basic example of a form using the `` component from React Hook Form and the `` component.

```tsx showLineNumbers {5-18}
<Controller
  name="title"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
      <Input
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="Login button not working on mobile"
        autoComplete="off"
      />
      <FieldDescription>
        Provide a concise title for your bug report.
      </FieldDescription>
      {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

## Form

### Create a form schema

We'll start by defining the shape of our form using a Zod schema.

```tsx showLineNumbers title="form.tsx"
import * as z from "zod"

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})
```

### Setup the form

Next, we'll use the `useForm` hook from React Hook Form to create our form instance. We'll also add the Zod resolver to validate the form data.

```tsx showLineNumbers title="form.tsx" {17-23}
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})

export function BugReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      {/* Build the form here */}
    </form>
  )
}
```

### Build the form

We can now build the form using the `` component from React Hook Form and the `` component.

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the `onSubmit` function will be called with the validated form data. If the form data is invalid, React Hook Form will display the errors next to each field.

## Validation

### Client-side Validation

React Hook Form validates your form data using the Zod schema. Define a schema and pass it to the `resolver` option of the `useForm` hook.

```tsx showLineNumbers title="example-form.tsx" {5-8,12}
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export function ExampleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })
}
```

### Validation Modes

React Hook Form supports different validation modes.

```tsx showLineNumbers title="form.tsx" {3}
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  mode: "onChange",
})
```

| Mode          | Description                                              |
| ------------- | -------------------------------------------------------- |
| `"onChange"`  | Validation triggers on every change.                     |
| `"onBlur"`    | Validation triggers on blur.                             |
| `"onSubmit"`  | Validation triggers on submit (default).                 |
| `"onTouched"` | Validation triggers on first blur, then on every change. |
| `"all"`       | Validation triggers on blur and change.                  |

## Displaying Errors

Display errors next to the field using ``. For styling and accessibility:

* Add the `data-invalid` prop to the `` component.
* Add the `aria-invalid` prop to the form control such as ``, ``, ``, etc.

```tsx showLineNumbers title="form.tsx" {5,11,13}
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
      <Input
        {...field}
        id={field.name}
        type="email"
        aria-invalid={fieldState.invalid}
      />
      {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

## Working with Different Field Types

### Input

* For input fields, spread the `field` object onto the `` component.
* To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

```tsx title="components/form-rhf-input.tsx"
// import from your project: import Demo from '@/components/form-rhf-input'
'use client'

export { default } from '../input/input-7'
```

### Textarea

* For textarea fields, spread the `field` object onto the `` component.
* To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

```tsx title="components/form-rhf-textarea.tsx"
// import from your project: import Demo from '@/components/form-rhf-textarea'
'use client'

export { default } from '../textarea/textarea-7'
```

### Select

* For select components, use `field.value` and `field.onChange` on the `` component.
* To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

```tsx title="components/form-rhf-select.tsx"
// import from your project: import Demo from '@/components/form-rhf-select'
'use client'

export { default } from '../select/select-3'
```

### Checkbox

* For checkbox arrays, use `field.value` and `field.onChange` with array manipulation.
* To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.
* Remember to add `data-slot="checkbox-group"` to the `` component for proper styling and spacing.

```tsx title="components/form-rhf-checkbox.tsx"
// import from your project: import Demo from '@/components/form-rhf-checkbox'
'use client'

export { default } from '../checkbox/checkbox-8'
```

### Radio Group

* For radio groups, use `field.value` and `field.onChange` on the `` component.
* To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

```tsx title="components/form-rhf-radiogroup.tsx"
// import from your project: import Demo from '@/components/form-rhf-radiogroup'
'use client'

export { default } from '../radio-group/radio-group-2'
```

### Switch

* For switches, use `field.value` and `field.onChange` on the `` component.
* To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

```tsx title="components/form-rhf-switch.tsx"
// import from your project: import Demo from '@/components/form-rhf-switch'
'use client'

export { default } from '../switch/switch-2'
```

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

```tsx title="components/form-rhf-complex.tsx"
// import from your project: import Demo from '@/components/form-rhf-complex'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
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
import { Input } from '@gentleduck/registry-ui/input'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import { Switch } from '@gentleduck/registry-ui/switch'
import { Textarea } from '@gentleduck/registry-ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const tasks = [
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'mobile', label: 'Mobile' },
] as const

const plans = [
  { description: 'Good for trying the platform.', id: 'free', title: 'Free' },
  { description: 'For fast-moving teams and priority support.', id: 'pro', title: 'Pro' },
  { description: 'Advanced controls for larger organizations.', id: 'enterprise', title: 'Enterprise' },
] as const

const formSchema = z.object({
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  language: z.enum(['auto', 'en', 'es'], {
    error: 'Please select a language.',
  }),
  plan: z.enum(['free', 'pro', 'enterprise'], {
    error: 'Select a plan.',
  }),
  tasks: z.array(z.string()).min(1, 'Select at least one team.'),
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  twoFactor: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export default function FormRHFComplex() {
  const form = useForm<FormValues>({
    defaultValues: {
      description: '',
      language: 'auto',
      plan: 'free',
      tasks: ['frontend'],
      title: '',
      twoFactor: true,
    },
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: FormValues) {
    toast.success('Form submitted', {
      description: (
        <pre className="mt-2 max-w-[640px] overflow-x-auto rounded-md border bg-muted p-4 text-xs">
          {JSON.stringify(values, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <form className="w-full max-w-2xl space-y-6" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Search input clears itself"
              />
              <FieldDescription>Provide a concise title for your issue.</FieldDescription>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="min-h-[120px]"
                placeholder="Add reproduction steps and expected behavior."
              />
              <FieldDescription>Include steps, expected output, and actual output.</FieldDescription>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="language"
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-complex-language">Language</FieldLabel>
                <FieldDescription>Pick your preferred language for bug notifications.</FieldDescription>
                {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="form-rhf-complex-language"
                  aria-invalid={fieldState.invalid}
                  className="min-w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="tasks"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend variant="label">Notify teams</FieldLegend>
              <FieldDescription>Select which teams should receive this report.</FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                {tasks.map((task) => (
                  <Field orientation="horizontal" key={task.id} data-invalid={fieldState.invalid}>
                    <Checkbox
                      id={`form-rhf-complex-task-${task.id}`}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value.includes(task.id)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...field.value, task.id]
                          : field.value.filter((value) => value !== task.id)
                        field.onChange(next)
                      }}
                    />
                    <FieldLabel className="font-normal" htmlFor={`form-rhf-complex-task-${task.id}`}>
                      {task.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />

        <Controller
          control={form.control}
          name="plan"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend>Support plan</FieldLegend>
              <FieldDescription>Select the support response tier for this project.</FieldDescription>
              <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange}>
                {plans.map((plan) => (
                  <FieldLabel htmlFor={`form-rhf-complex-plan-${plan.id}`} key={plan.id}>
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldTitle>{plan.title}</FieldTitle>
                        <FieldDescription>{plan.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        id={`form-rhf-complex-plan-${plan.id}`}
                        value={plan.id}
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

        <Controller
          control={form.control}
          name="twoFactor"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-complex-two-factor">Multi-factor authentication</FieldLabel>
                <FieldDescription>Require MFA for all users with access to this project.</FieldDescription>
                {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Switch
                id="form-rhf-complex-two-factor"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex items-center gap-2">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
      </div>
    </form>
  )
}
```

## Resetting the Form

Use `form.reset()` to reset the form to its default values.

```tsx showLineNumbers
<Button type="button" variant="outline" onClick={() => form.reset()}>
  Reset
</Button>
```

## Array Fields

React Hook Form provides a `useFieldArray` hook for managing dynamic array fields. This is useful when you need to add or remove fields dynamically.

```tsx title="components/form-rhf-array.tsx"
// import from your project: import Demo from '@/components/form-rhf-array'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@gentleduck/registry-ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { XIcon } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  emails: z
    .array(
      z.object({
        address: z.string().email('Enter a valid email address.'),
      }),
    )
    .min(1, 'Add at least one email address.')
    .max(5, 'You can add up to 5 email addresses.'),
})

type FormValues = z.infer<typeof formSchema>

export default function FormRHFArray() {
  const form = useForm<FormValues>({
    defaultValues: {
      emails: [{ address: '' }],
    },
    resolver: zodResolver(formSchema),
  })

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: 'emails',
  })

  function onSubmit(values: FormValues) {
    toast.success('Email list saved', {
      description: (
        <pre className="mt-2 max-w-[560px] overflow-x-auto rounded-md border bg-muted p-4 text-xs">
          {JSON.stringify(values, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <form className="w-full max-w-2xl space-y-6" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet className="gap-4">
        <FieldLegend variant="label">Email Addresses</FieldLegend>
        <FieldDescription>Add up to 5 email addresses where we can contact you.</FieldDescription>

        <FieldGroup className="gap-4">
          {fields.map((fieldItem, index) => (
            <Controller
              control={form.control}
              key={fieldItem.id}
              name={`emails.${index}.address`}
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={`form-rhf-array-email-${index}`}
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
                        placeholder="name@example.com"
                        type="email"
                      />
                      {fields.length > 1 && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => remove(index)}
                            aria-label={`Remove email ${index + 1}`}>
                            <XIcon aria-hidden="true" />
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                    {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          ))}
        </FieldGroup>
      </FieldSet>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ address: '' })}
          disabled={fields.length >= 5}>
          Add Email Address
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
```

### Using useFieldArray

Use the `useFieldArray` hook to manage array fields. It provides `fields`, `append`, and `remove` methods.

```tsx showLineNumbers title="form.tsx" {8-11}
import { useFieldArray, useForm } from "react-hook-form"

export function ExampleForm() {
  const form = useForm({
    // ... form config
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emails",
  })
}
```

### Array Validation

Use Zod's `array` method to validate array fields.

```tsx showLineNumbers title="form.tsx"
const formSchema = z.object({
  emails: z
    .array(
      z.object({
        address: z.string().email("Enter a valid email address."),
      })
    )
    .min(1, "Add at least one email address.")
    .max(5, "You can add up to 5 email addresses."),
})
```