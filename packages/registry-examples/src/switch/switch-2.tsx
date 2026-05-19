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
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

export default function Demo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      security_emails: true,
    },
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info(
      <div>
        <h4 className="font-medium text-lg">You submitted the following values:</h4>
        <pre className="mt-2 w-[270px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    )
  }

  return (
    <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <h3 className="mb-4 font-medium text-lg">Email Notifications</h3>
        <FieldGroup className="space-y-4">
          <Controller
            control={form.control}
            name="marketing_emails"
            render={({ field, fieldState }) => (
              <Field
                className="justify-between rounded-lg border p-3 shadow-sm"
                orientation="horizontal"
                data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="switch-marketing-emails">Marketing emails</FieldLabel>
                  <FieldDescription>Receive emails about new products, features, and more.</FieldDescription>
                  {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
                <Switch
                  id="switch-marketing-emails"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="security_emails"
            render={({ field, fieldState }) => (
              <Field
                className="justify-between rounded-lg border p-3 shadow-sm"
                orientation="horizontal"
                data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="switch-security-emails">Security emails</FieldLabel>
                  <FieldDescription>Receive emails about your account security.</FieldDescription>
                  {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
                <Switch
                  id="switch-security-emails"
                  name={field.name}
                  checked={field.value}
                  disabled
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
