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
import { useForm } from '@tanstack/react-form'
import { XIcon } from 'lucide-react'
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

export default function FormTanStackArray() {
  const form = useForm({
    defaultValues: {
      emails: [{ address: '' }],
    },
    onSubmit: async ({ value }) => {
      toast.success('Email list saved', {
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
      className="w-full max-w-2xl space-y-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}>
      <form.Field
        name="emails"
        mode="array"
        // biome-ignore lint/correctness/noChildrenProp: TanStack Form API uses children prop for render callback
        children={(field) => (
          <FieldSet className="gap-4">
            <FieldLegend variant="label">Email Addresses</FieldLegend>
            <FieldDescription>Add up to 5 email addresses where we can contact you.</FieldDescription>

            <FieldGroup className="gap-4">
              {field.state.value.map((_, index) => (
                <form.Field
                  // Type-safe path strings are verbose in examples; keep this ergonomic.
                  name={`emails[${index}].address` as never}
                  // biome-ignore lint/suspicious/noArrayIndexKey: dynamic form array items have no stable ID
                  key={index}
                  // biome-ignore lint/correctness/noChildrenProp: TanStack Form API uses children prop for render callback
                  children={(subField) => {
                    const isSubFieldInvalid = subField.state.meta.isTouched && !subField.state.meta.isValid
                    return (
                      <Field orientation="horizontal" data-invalid={isSubFieldInvalid}>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              id={`form-tanstack-array-email-${index}`}
                              name={subField.name}
                              value={subField.state.value}
                              onBlur={subField.handleBlur}
                              onChange={(event) => subField.handleChange(event.target.value as never)}
                              aria-invalid={isSubFieldInvalid}
                              autoComplete="email"
                              placeholder="name@example.com"
                              type="email"
                            />
                            {field.state.value.length > 1 && (
                              <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => field.removeValue(index)}
                                  aria-label={`Remove email ${index + 1}`}>
                                  <XIcon aria-hidden="true" />
                                </InputGroupButton>
                              </InputGroupAddon>
                            )}
                          </InputGroup>
                          {isSubFieldInvalid && <FieldError errors={toFieldErrors(subField.state.meta.errors)} />}
                        </FieldContent>
                      </Field>
                    )
                  }}
                />
              ))}
            </FieldGroup>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => field.pushValue({ address: '' } as never)}
                disabled={field.state.value.length >= 5}>
                Add Email Address
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </FieldSet>
        )}
      />
    </form>
  )
}
