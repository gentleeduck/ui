'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import type { JsonEditorText } from '@gentleduck/registry-ui-duckui/json-editor'
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

const AR_TEXT: JsonEditorText = {
  format: 'تنسيق',
  cancel: 'إلغاء',
  save: 'حفظ',
  full: 'كامل',
  close: 'إغلاق',
  keepEditing: 'متابعة التحرير',
  discard: 'تجاهل',
  discardTitle: 'تجاهل التغييرات؟',
  discardDescription: 'لديك تغييرات غير محفوظة. إذا أغلقت الآن، ستفقدها.',
  statusHint: 'Ctrl/Cmd + Enter: حفظ، Esc: إلغاء',
  sheetStatusHint: 'Ctrl/Cmd + Enter: حفظ، Esc: إغلاق',
  unsavedChanges: 'تغييرات غير محفوظة',
  saved: 'تم الحفظ',
  nullPreview: 'فارغ',
}

export default function JsonEditorRtlDemo() {
  const form = useForm<JsonEditorValues>({
    defaultValues: {
      settings: DEFAULT_SETTINGS,
    },
  })

  function onSubmit(values: JsonEditorValues) {
    toast('تم حفظ الإعدادات', {
      description: (
        <pre dir="ltr" className="max-w-[560px] overflow-x-auto rounded-md border bg-muted p-3 text-left text-xs">
          {JSON.stringify(values.settings, null, 2)}
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form className="w-full max-w-2xl space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <JsonTextareaField
          control={form.control}
          description={'قم بتعديل إعدادات التطبيق بصيغة JSON صالحة.'}
          dir="rtl"
          label={'الإعدادات'}
          lang="ar"
          name="settings"
          rows={14}
          sheetTitle={'تعديل إعدادات JSON'}
          text={AR_TEXT}
        />

        <div className="flex items-center justify-end gap-2" dir="rtl">
          <Button type="submit">{'حفظ الإعدادات'}</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset({ settings: DEFAULT_SETTINGS })
            }}>
            {'إعادة تعيين'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
