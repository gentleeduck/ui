This guide explores how to build forms using TanStack Form. You'll learn to create forms with the `` component, implement schema validation with Zod, handle errors, and ensure accessibility.

## Demo

We'll start by building the following form. It has a simple text input and a textarea. On submit, we'll validate the form data and display any errors.

}>
  **Note:** For the purpose of this demo, we have intentionally disabled browser
  validation to show how schema validation and form errors work in TanStack
  Form. It is recommended to add basic browser validation in your production
  code.

## Approach

This form uses TanStack Form for headless form handling. We'll build our form using the `` component, which gives you **full control over the markup and styling**.

- Uses TanStack Form's `useForm` hook for form state management.
- `form.Field` component with render prop pattern for controlled inputs.
- `` components for building accessible forms.
- Client-side validation using Zod.
- Real-time validation feedback.

## Anatomy

Here's a basic example of a form using TanStack Form with the `` component.

```tsx showLineNumbers {1-14,29-45}
function toFieldErrors(errors: unknown[]) {
  return errors
    .map((error) => {
      if (typeof error === "string") {
        return { message: error }
      }
      if (error && typeof error === "object" && "message" in error) {
        const message = (error as { message?: unknown }).message
        return { message: typeof message === "string" ? message : undefined }
      }
      return undefined
    })
    .filter(
      (error): error is { message: string | undefined } => Boolean(error)
    )
}

            
            )}

        )
      }}
    />

  ` component.

## Form

### Create a schema

We'll start by defining the shape of our form using a Zod schema.

```tsx showLineNumbers title="form.tsx"

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

Use the `useForm` hook from TanStack Form to create your form instance with Zod validation.

```tsx showLineNumbers title="form.tsx" {10-21}

const formSchema = z.object({
  // ...
})

export function BugReportForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Form submitted successfully")
    },
  })

  return (
    ` component.

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the `onSubmit` function will be called with the validated form data. If the form data is invalid, TanStack Form will display the errors next to each field.

## Validation

### Client-side Validation

TanStack Form validates your form data using the Zod schema. Validation happens in real-time as the user types.

```tsx showLineNumbers title="form.tsx" {13-15}

const formSchema = z.object({
  // ...
})

export function BugReportForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return `. For styling and accessibility:

- Add the `data-invalid` prop to the `` component.
- Add the `aria-invalid` prop to the form control such as ``, ``, ``, etc.

```tsx showLineNumbers title="form.tsx" {4,18-20}

        {isInvalid && (
          
        )}

    )
  }}
/>
```

## Working with Different Field Types

### Input

- For input fields, use `field.state.value` and `field.handleChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Textarea

- For textarea fields, use `field.state.value` and `field.handleChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Select

- For select components, use `field.state.value` and `field.handleChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Checkbox

- For checkbox, use `field.state.value` and `field.handleChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.
- For checkbox arrays, use `mode="array"` on the `` component and TanStack Form's array helpers.
- Remember to add `data-slot="checkbox-group"` to the `` component for proper styling and spacing.

### Radio Group

- For radio groups, use `field.state.value` and `field.handleChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Switch

- For switches, use `field.state.value` and `field.handleChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

## Resetting the Form

Use `form.reset()` to reset the form to its default values.

```tsx showLineNumbers

```

### Adding Items

Use `field.pushValue(item)` to add items to an array field. You can disable the button when the array reaches its maximum length.

```tsx showLineNumbers title="form.tsx"

)}
```

### Array Validation

Validate array fields using Zod's array methods.

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