'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@gentleduck/registry-ui/field'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    error: 'You need to select a notification type.',
  }),
})

const notificationTypes = [
  {
    description: 'Receive updates for every new message.',
    id: 'all',
    title: 'All new messages',
  },
  {
    description: 'Only direct mentions and private messages.',
    id: 'mentions',
    title: 'Direct messages and mentions',
  },
  {
    description: 'Disable all notification alerts.',
    id: 'none',
    title: 'Nothing',
  },
] as const

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info(
      <div>
        <h4 className="font-medium text-md">You submitted the following values:</h4>
        <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    )
  }

  return (
    <form className="w-full max-w-lg space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend>Notify me about...</FieldLegend>
              <FieldDescription>Choose which message types should trigger notifications.</FieldDescription>
              <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange}>
                {notificationTypes.map((option) => (
                  <FieldLabel htmlFor={`form-rhf-radio-${option.id}`} key={option.id}>
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldTitle>{option.title}</FieldTitle>
                        <FieldDescription>{option.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        id={`form-rhf-radio-${option.id}`}
                        value={option.id}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  )
}
