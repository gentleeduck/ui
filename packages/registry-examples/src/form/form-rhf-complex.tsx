'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
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
import { Input } from '@gentleduck/registry-ui/input'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import { Switch } from '@gentleduck/registry-ui/switch'
import { Textarea } from '@gentleduck/registry-ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const tasks = [
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'mobile', label: 'Mobile' },
] as const

const plans = [
  { description: 'Good for trying the platform.', id: 'free', title: 'Free' },
  { description: 'For fast-moving teams and priority support.', id: 'pro', title: 'Pro' },
  { description: 'Advanced controls for larger organizations.', id: 'enterprise', title: 'Enterprise' },
] as const

const formSchema = z.object({
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  language: z.enum(['auto', 'en', 'es'], {
    error: 'Please select a language.',
  }),
  plan: z.enum(['free', 'pro', 'enterprise'], {
    error: 'Select a plan.',
  }),
  tasks: z.array(z.string()).min(1, 'Select at least one team.'),
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  twoFactor: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export default function FormRHFComplex() {
  const form = useForm<FormValues>({
    defaultValues: {
      description: '',
      language: 'auto',
      plan: 'free',
      tasks: ['frontend'],
      title: '',
      twoFactor: true,
    },
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: FormValues) {
    toast.success('Form submitted', {
      description: (
        <pre className="mt-2 max-w-[640px] overflow-x-auto rounded-md border bg-muted p-4 text-xs">
          {JSON.stringify(values, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <form className="w-full max-w-2xl space-y-6" noValidate onSubmit={form.handleSubmit(onSubmit)}>
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
                placeholder="Search input clears itself"
              />
              <FieldDescription>Provide a concise title for your issue.</FieldDescription>
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
                placeholder="Add reproduction steps and expected behavior."
              />
              <FieldDescription>Include steps, expected output, and actual output.</FieldDescription>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="language"
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-complex-language">Language</FieldLabel>
                <FieldDescription>Pick your preferred language for bug notifications.</FieldDescription>
                {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="form-rhf-complex-language"
                  aria-invalid={fieldState.invalid}
                  className="min-w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="tasks"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend variant="label">Notify teams</FieldLegend>
              <FieldDescription>Select which teams should receive this report.</FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                {tasks.map((task) => (
                  <Field orientation="horizontal" key={task.id} data-invalid={fieldState.invalid}>
                    <Checkbox
                      id={`form-rhf-complex-task-${task.id}`}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value.includes(task.id)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...field.value, task.id]
                          : field.value.filter((value) => value !== task.id)
                        field.onChange(next)
                      }}
                    />
                    <FieldLabel className="font-normal" htmlFor={`form-rhf-complex-task-${task.id}`}>
                      {task.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />

        <Controller
          control={form.control}
          name="plan"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend>Support plan</FieldLegend>
              <FieldDescription>Select the support response tier for this project.</FieldDescription>
              <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange}>
                {plans.map((plan) => (
                  <FieldLabel htmlFor={`form-rhf-complex-plan-${plan.id}`} key={plan.id}>
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldTitle>{plan.title}</FieldTitle>
                        <FieldDescription>{plan.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        id={`form-rhf-complex-plan-${plan.id}`}
                        value={plan.id}
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

        <Controller
          control={form.control}
          name="twoFactor"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-complex-two-factor">Multi-factor authentication</FieldLabel>
                <FieldDescription>Require MFA for all users with access to this project.</FieldDescription>
                {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Switch
                id="form-rhf-complex-two-factor"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex items-center gap-2">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
      </div>
    </form>
  )
}
