'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { JsonTextareaField } from '@gentleduck/registry-ui/json-editor'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type JsonEditorCallbackValues = {
  payload: Record<string, unknown> | null
}

export default function Demo() {
  const form = useForm<JsonEditorCallbackValues>({
    defaultValues: {
      payload: {
        amount: 1200,
        currency: 'USD',
        metadata: {
          customerId: 'cus_1234',
          source: 'dashboard',
        },
      },
    },
  })

  function onSubmit(values: JsonEditorCallbackValues) {
    toast('Payload submitted', {
      description: (
        <pre className="max-w-[520px] overflow-x-auto rounded-md border bg-muted p-3 text-xs">
          {JSON.stringify(values.payload, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <FormProvider {...form}>
      <form className="w-full max-w-2xl space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <JsonTextareaField
          allowArray={false}
          control={form.control}
          description="Full opens your own external editor flow through a callback."
          expandMode="callback"
          label="Payment Payload"
          name="payload"
          onExpandEditor={({ rawText }) => {
            toast('External editor callback', {
              description: (
                <pre className="max-w-[520px] overflow-x-auto rounded-md border bg-muted p-3 text-xs">
                  {rawText || '{}'}
                </pre>
              ),
            })
          }}
          rows={12}
        />

        <Button type="submit">Submit payload</Button>
      </form>
    </FormProvider>
  )
}
