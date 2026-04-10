'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@gentleduck/registry-ui/field'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      items: ['recents', 'home'],
    },
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="items"
        render={({ field, fieldState }) => (
          <FieldSet>
            <FieldLegend variant="label">Sidebar</FieldLegend>
            <FieldDescription>Select the items you want to display in the sidebar.</FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              {items.map((item) => (
                <Field orientation="horizontal" key={item.id} data-invalid={fieldState.invalid}>
                  <Checkbox
                    id={`form-rhf-checkbox-${item.id}`}
                    name={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={field.value.includes(item.id)}
                    onCheckedChange={(checked) => {
                      const nextValue = checked
                        ? [...field.value, item.id]
                        : field.value.filter((value) => value !== item.id)
                      field.onChange(nextValue)
                    }}
                  />
                  <FieldLabel className="font-normal text-sm" htmlFor={`form-rhf-checkbox-${item.id}`}>
                    {item.label}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
            {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
          </FieldSet>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
