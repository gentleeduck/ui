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
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  twoFactor: z.boolean(),
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

export default function FormTanStackSwitch() {
  const form = useForm({
    defaultValues: {
      twoFactor: true,
    },
    onSubmit: async ({ value }) => {
      toast.success('Security settings updated', {
        description: (
          <pre className="mt-2 max-w-[420px] overflow-x-auto rounded-md border bg-muted p-4 text-xs">
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
          name="twoFactor"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form API requires children prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-tanstack-switch-twoFactor">Multi-factor authentication</FieldLabel>
                  <FieldDescription>Enable multi-factor authentication to secure your account.</FieldDescription>
                  {isInvalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                </FieldContent>
                <Switch
                  id="form-tanstack-switch-twoFactor"
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                  aria-invalid={isInvalid}
                />
              </Field>
            )
          }}
        />
      </FieldGroup>

      <Button type="submit">Submit</Button>
    </form>
  )
}
