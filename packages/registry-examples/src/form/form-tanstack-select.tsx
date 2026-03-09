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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  language: z.enum(['auto', 'en', 'es'], {
    error: 'Please select a language.',
  }),
})

type FormValues = z.infer<typeof formSchema>

function hasMessage(error: unknown): error is { message: unknown } {
  return typeof error === 'object' && error !== null && 'message' in error
}

function isLanguage(value: string): value is FormValues['language'] {
  return value === 'auto' || value === 'en' || value === 'es'
}

function toFieldErrors(errors: unknown[]) {
  return errors
    .map((error) => {
      if (typeof error === 'string') {
        return { message: error }
      }
      if (hasMessage(error)) {
        const message = error.message
        return { message: typeof message === 'string' ? message : undefined }
      }
      return undefined
    })
    .filter((error): error is { message: string | undefined } => Boolean(error))
}

export default function FormTanStackSelect() {
  const defaultValues: FormValues = {
    language: 'auto',
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      toast.success('Language updated', {
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
          name="language"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form API requires children prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="responsive" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-tanstack-select-language">Spoken Language</FieldLabel>
                  <FieldDescription>For best results, select the language you speak.</FieldDescription>
                  {isInvalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(nextValue) => {
                    if (isLanguage(nextValue)) {
                      field.handleChange(nextValue)
                    }
                  }}>
                  <SelectTrigger id="form-tanstack-select-language" aria-invalid={isInvalid} className="min-w-[120px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )
          }}
        />
      </FieldGroup>

      <Button type="submit">Submit</Button>
    </form>
  )
}
