'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@gentleduck/registry-ui/field'
import { Input } from '@gentleduck/registry-ui/input'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(10, 'Username must be at most 10 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed.'),
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

export default function FormTanStackInput() {
  const form = useForm({
    defaultValues: {
      username: '',
    },
    onSubmit: async ({ value }) => {
      toast.success('Username saved', {
        description: (
          <pre className="mt-2 max-w-[480px] overflow-x-auto rounded-md border bg-muted p-4 text-xs">
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
          name="username"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form API requires children prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="form-tanstack-input-username">Username</FieldLabel>
                <Input
                  id="form-tanstack-input-username"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="username"
                  placeholder="gentleduck"
                />
                <FieldDescription>
                  This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
                  numbers, and underscores.
                </FieldDescription>
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
