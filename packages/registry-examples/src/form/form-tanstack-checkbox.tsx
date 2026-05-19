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
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { z } from 'zod'

const tasks = [
  { id: 'recents', label: 'Recents' },
  { id: 'home', label: 'Home' },
  { id: 'applications', label: 'Applications' },
] as const

const formSchema = z.object({
  tasks: z.array(z.string()).min(1, 'You have to select at least one item.'),
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

export default function FormTanStackCheckbox() {
  const form = useForm({
    defaultValues: {
      tasks: ['recents'] as string[],
    },
    onSubmit: async ({ value }) => {
      toast.success('Sidebar preferences saved', {
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
      <form.Field
        name="tasks"
        mode="array"
        // biome-ignore lint/correctness/noChildrenProp: TanStack Form API requires children prop
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <FieldSet>
              <FieldLegend variant="label">Tasks</FieldLegend>
              <FieldDescription>Get notified when tasks you've created have updates.</FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                {tasks.map((task) => (
                  <Field orientation="horizontal" key={task.id} data-invalid={isInvalid}>
                    <Checkbox
                      id={`form-tanstack-checkbox-${task.id}`}
                      name={field.name}
                      aria-invalid={isInvalid}
                      checked={field.state.value.includes(task.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.pushValue(task.id)
                          return
                        }

                        const index = field.state.value.indexOf(task.id)
                        if (index > -1) {
                          field.removeValue(index)
                        }
                      }}
                    />
                    <FieldLabel htmlFor={`form-tanstack-checkbox-${task.id}`} className="font-normal">
                      {task.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
              {isInvalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
            </FieldSet>
          )
        }}
      />

      <Button type="submit">Submit</Button>
    </form>
  )
}
