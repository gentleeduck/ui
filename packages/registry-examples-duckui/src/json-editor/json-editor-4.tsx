'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { JsonTextareaField } from '@gentleduck/registry-ui-duckui/json-editor'
import { Form } from '@gentleduck/registry-ui-duckui/react-hook-form'
import { useForm } from 'react-hook-form'
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

export default function JsonEditorRtlDemo() {
  const form = useForm<JsonEditorValues>({
    defaultValues: {
      settings: DEFAULT_SETTINGS,
    },
  })

  function onSubmit(values: JsonEditorValues) {
    toast('تم حفظ JSON', {
      description: (
        <pre className="max-w-[560px] overflow-x-auto rounded-md border bg-muted p-3 text-xs">
          {JSON.stringify(values.settings, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <div dir="rtl">
      <Form {...form}>
        <form className="w-full max-w-2xl space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <JsonTextareaField
            control={form.control}
            description="عدل اعدادات التطبيق المهيكلة كـ JSON صالح."
            label="الاعدادات"
            name="settings"
            rows={14}
            sheetTitle="تعديل اعدادات JSON"
          />

          <div className="flex items-center justify-start gap-2">
            <Button
              onClick={() => {
                form.reset({ settings: DEFAULT_SETTINGS })
              }}
              type="button"
              variant="outline">
              اعادة تعيين
            </Button>
            <Button type="submit">حفظ الاعدادات</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
