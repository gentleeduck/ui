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
