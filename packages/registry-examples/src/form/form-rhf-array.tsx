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
