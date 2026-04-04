'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { JsonTextareaField } from '@gentleduck/registry-ui/json-editor'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type JsonEditorPopoverValues = {
  filters: Record<string, unknown> | null
}

export default function Demo() {
  const form = useForm<JsonEditorPopoverValues>({
    defaultValues: {
      filters: {
        includeArchived: false,
        limit: 25,
        sortBy: 'createdAt',
      },
    },
  })

  function onSubmit(values: JsonEditorPopoverValues) {
    toast('Filters applied', {
      description: (
        <pre className="max-w-[420px] overflow-x-auto rounded-md border bg-muted p-3 text-xs">
          {JSON.stringify(values.filters, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <FormProvider {...form}>
      <form className="w-full max-w-xl space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <JsonTextareaField
          control={form.control}
          description="Click the field to open a compact editor in a popover."
          expandMode="none"
          label="Query Filters"
          mode="popover"
          name="filters"
          rows={10}
        />

        <Button type="submit">Apply filters</Button>
      </form>
    </FormProvider>
  )
}
