'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { JsonTextareaField } from '@gentleduck/registry-ui/json-editor'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type JsonEditorValues = {
  settings: Record<string, unknown> | null
}

const DEFAULT_SETTINGS: Record<string, unknown> = {
  featureFlags: {
    betaSidebar: true,
    compactCards: false,
  },
  notifications: {
    email: true,
    push: true,
  },
  theme: 'system',
}

export default function Demo() {
  const form = useForm<JsonEditorValues>({
    defaultValues: {
      settings: DEFAULT_SETTINGS,
    },
  })

  function onSubmit(values: JsonEditorValues) {
    toast('JSON saved', {
      description: (
        <pre className="max-w-[560px] overflow-x-auto rounded-md border bg-muted p-3 text-xs">
          {JSON.stringify(values.settings, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <FormProvider {...form}>
      <form className="w-full max-w-2xl space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <JsonTextareaField
          control={form.control}
          description="Edit structured app settings as valid JSON."
          label="Settings"
          name="settings"
          rows={14}
          sheetTitle="Edit settings JSON"
        />

        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => {
              form.reset({ settings: DEFAULT_SETTINGS })
            }}
            type="button"
            variant="outline">
            Reset
          </Button>
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </FormProvider>
  )
}
