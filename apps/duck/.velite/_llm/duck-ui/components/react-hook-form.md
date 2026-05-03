In this guide, we will take a look at building forms with React Hook Form. We'll cover building forms with the `` component, adding schema validation using Zod, error handling, accessibility, and more.

## Demo

We are going to build the following form. It has a simple text input and a textarea. On submit, we'll validate the form data and display any errors.

}>
  **Note:** For the purpose of this demo, we have intentionally disabled browser
  validation to show how schema validation and form errors work in React Hook
  Form. It is recommended to add basic browser validation in your production
  code.

## Approach

This form uses React Hook Form for form state and validation. We'll build our form using the `` component, which gives you **full control over the markup and styling**.

- Uses React Hook Form's `useForm` hook for form state management.
- `` component for controlled inputs.
- `` components for building accessible forms.
- Client-side validation using Zod with `zodResolver`.

## Anatomy

Here's a basic example of a form using the `` component from React Hook Form and the `` component.

```tsx showLineNumbers {5-18}

      }

  )}
/>
```

## Form

### Create a form schema

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

Next, we'll use the `useForm` hook from React Hook Form to create our form instance. We'll also add the Zod resolver to validate the form data.

```tsx showLineNumbers title="form.tsx" {17-23}

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
  const form = useForm` component from React Hook Form and the `` component.

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the `onSubmit` function will be called with the validated form data. If the form data is invalid, React Hook Form will display the errors next to each field.

## Validation

### Client-side Validation

React Hook Form validates your form data using the Zod schema. Define a schema and pass it to the `resolver` option of the `useForm` hook.

```tsx showLineNumbers title="example-form.tsx" {5-8,12}

const formSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export function ExampleForm() {
  const form = useForm`. For styling and accessibility:

- Add the `data-invalid` prop to the `` component.
- Add the `aria-invalid` prop to the form control such as ``, ``, ``, etc.

```tsx showLineNumbers title="form.tsx" {5,11,13}

      {fieldState.invalid && fieldState.error && }

  )}
/>
```

## Working with Different Field Types

### Input

- For input fields, spread the `field` object onto the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Textarea

- For textarea fields, spread the `field` object onto the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Select

- For select components, use `field.value` and `field.onChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Checkbox

- For checkbox arrays, use `field.value` and `field.onChange` with array manipulation.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.
- Remember to add `data-slot="checkbox-group"` to the `` component for proper styling and spacing.

### Radio Group

- For radio groups, use `field.value` and `field.onChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Switch

- For switches, use `field.value` and `field.onChange` on the `` component.
- To show errors, add the `aria-invalid` prop to the `` component and the `data-invalid` prop to the `` component.

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

## Resetting the Form

Use `form.reset()` to reset the form to its default values.

```tsx showLineNumbers
<Button type="button" variant="outline" onClick={() => form.reset()}>
  Reset

```

## Array Fields

React Hook Form provides a `useFieldArray` hook for managing dynamic array fields. This is useful when you need to add or remove fields dynamically.

### Using useFieldArray

Use the `useFieldArray` hook to manage array fields. It provides `fields`, `append`, and `remove` methods.

```tsx showLineNumbers title="form.tsx" {8-11}

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