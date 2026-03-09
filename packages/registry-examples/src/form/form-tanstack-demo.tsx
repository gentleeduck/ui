'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@gentleduck/registry-ui/field'
import { Input } from '@gentleduck/registry-ui/input'
import { Textarea } from '@gentleduck/registry-ui/textarea'
import { useForm } from '@tanstack/react-form'
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

function toFieldErrors(errors: unknown[]) {
  return errors
    .map((error) => {
      if (typeof error === 'string') {
        return { message: error }
      }
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message?: unknown }).message
        return { message: typeof message === 'string' ? message : undefined }
      }
      return undefined
    })
    .filter((error): error is { message: string | undefined } => Boolean(error))
}

export default function FormTanStackDemo() {
  const form = useForm({
    defaultValues: {
      description: '',
      title: '',
    },
    onSubmit: async ({ value }) => {
      toast.success('Form submitted successfully', {
        description: (
          <pre className="mt-2 max-w-[520px] overflow-x-auto rounded-md border bg-muted p-4 text-xs">
            {JSON.stringify(value, null, 2)}
          </pre>
        ),
      })
    },
    validators: {
      onSubmit: formSchema,
    },
  })

  return (
    <form
      className="w-full max-w-xl space-y-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}>
      <FieldGroup>
        <form.Field
          name="title"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form API requires children prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  placeholder="Login button not working on mobile"
                />
                <FieldDescription>Provide a concise title for your bug report.</FieldDescription>
                {isInvalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="description"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form API requires children prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  className="min-h-[120px]"
                  placeholder="Describe the issue and expected behavior..."
                />
                <FieldDescription>Add enough detail for someone else to reproduce the bug.</FieldDescription>
                {isInvalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <Button type="submit">Submit</Button>
    </form>
  )
}
