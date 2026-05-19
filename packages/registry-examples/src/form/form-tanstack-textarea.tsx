'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@gentleduck/registry-ui/field'
import { Textarea } from '@gentleduck/registry-ui/textarea'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  about: z.string().min(20, 'About must be at least 20 characters.').max(180, 'About must be at most 180 characters.'),
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

export default function FormTanStackTextarea() {
  const form = useForm({
    defaultValues: {
      about: '',
    },
    onSubmit: async ({ value }) => {
      toast.success('Profile summary saved', {
        description: (
          <pre className="mt-2 max-w-[560px] overflow-x-auto rounded-md border bg-muted p-4 text-xs">
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
          name="about"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form API requires children prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="form-tanstack-textarea-about">More about you</FieldLabel>
                <Textarea
                  id="form-tanstack-textarea-about"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  className="min-h-[120px]"
                  placeholder="I'm a software engineer..."
                />
                <FieldDescription>
                  Tell us more about yourself. This will be used to help us personalize your experience.
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
