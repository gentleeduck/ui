```tsx title="components/json-editor-1.tsx"
// import from your project: import Demo from '@/components/json-editor-1'
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
```

## Philosophy

JSON editing is common in advanced settings, integration payloads, and admin tooling. A plain textarea is easy to ship but hard to use safely. `JsonTextareaField` keeps JSON editing in your form flow, adds validation, formatting, and keyboard shortcuts, and supports compact or expanded editing modes without introducing a heavy code editor dependency.

## How It's Built

## Installation

CLI
Manual

```bash
npx @gentleduck/cli add json-editor
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives react-hook-form sonner lucide-react
```

The `json-editor` component depends on the [`alert-dialog`](/duck-ui/components/alert-dialog), [`button`](/duck-ui/components/button), [`field`](/duck-ui/components/field), [`popover`](/duck-ui/components/popover), and [`sheet`](/duck-ui/components/sheet) components.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import { JsonTextareaField } from '@/components/ui/json-editor'
```

```tsx
import { FormProvider, useForm } from 'react-hook-form'

type FormValues = {
  settings: Record<string, unknown> | null
}

const form = useForm<FormValues>({
  defaultValues: {
    settings: {
      theme: 'system',
      notifications: true,
    },
  },
})

<FormProvider {...form}>
  <form>
    <JsonTextareaField
      control={form.control}
      name="settings"
      label="Settings"
    />
  </form>
</FormProvider>
```

## Examples

### Inline + sheet expansion

Default mode renders the editor inline and opens an expanded sheet editor with the `Full` action.

```tsx title="components/json-editor-1.tsx"
// import from your project: import Demo from '@/components/json-editor-1'
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
```

### Popover mode

Use `mode="popover"` to keep layout compact and open the editor only when needed.

```tsx title="components/json-editor-2.tsx"
// import from your project: import Demo from '@/components/json-editor-2'
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
```

### Custom full-editor callback

Set `expandMode="callback"` to hand off full-screen editing to your own flow.

```tsx title="components/json-editor-3.tsx"
// import from your project: import Demo from '@/components/json-editor-3'
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
          onExpandEditor={({ name, rawText }) => {
            // In a real app you would open your own editor modal here.
            // This demo just logs to the console.
            console.log(`[onExpandEditor] field "${name}"`, rawText)
          }}
          rows={12}
        />

        <Button type="submit">Submit payload</Button>
      </form>
    </FormProvider>
  )
}
```

## RTL Support

Set `dir="rtl"` on `JsonEditor` for a local override, or set `DirectionProvider` once at app/root level for global direction. Pass `lang` for locale-aware line numbers, and use `text` to translate labels/messages.

```tsx title="components/json-editor-4.tsx"
// import from your project: import Demo from '@/components/json-editor-4'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import type { JsonEditorText } from '@gentleduck/registry-ui/json-editor'
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

export default function Demo() {
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
    <FormProvider {...form}>
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
    </FormProvider>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionJsonTextareaField` for a spring-powered entrance animation with blur powered by [motion](https://motion.dev).

```tsx title="components/json-editor-5.tsx"
// import from your project: import Demo from '@/components/json-editor-5'
'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import { MotionJsonTextareaField } from '@gentleduck/registry-ui/json-editor'
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
        <MotionJsonTextareaField
          control={form.control}
          description="Edit structured app settings as valid JSON."
          label="Settings"
          name="settings"
          rows={14}
          sheetTitle="Edit settings JSON"
        />

        <div className="flex items-center justify-end gap-2">
          <MotionButton
            onClick={() => {
              form.reset({ settings: DEFAULT_SETTINGS })
            }}
            type="button"
            variant="outline">
            Reset
          </MotionButton>
          <MotionButton type="submit">Save settings</MotionButton>
        </div>
      </form>
    </FormProvider>
  )
}
```

}>
  Requires the `motion` package. Use `MotionJsonTextareaField` instead of `JsonTextareaField`. Same props, animated entrance.

## API Reference

### JsonTextareaField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `control` | `Control<TFieldValues>` | `-` | React Hook Form control object from `useForm` |
| `name` | `FieldPath<TFieldValues>` | `-` | Field path in your form values |
| `label` | `string` | `-` | Visible label rendered above the editor |
| `description` | `string` | `-` | Helper text rendered under the label |
| `className` | `string` | `-` | Additional CSS classes for the field root |
| `actionsClassName` | `string` | `-` | Additional CSS classes for the action buttons row |
| `isEditable` | `boolean` | `true` | Disables editing and save actions when set to `false` |
| `allowArray` | `boolean` | `true` | When `false`, only JSON objects are accepted (arrays rejected) |
| `mode` | `'inline' \| 'popover'` | `'inline'` | Presentation mode for the editor |
| `rows` | `number` | `12` | Number of rows for the inline textarea |
| `placeholder` | `string` | `'{\n  "theme": "dark"\n}'` | Placeholder content shown when empty |
| `lineNumbers` | `boolean` | `true` | Shows or hides the line-number gutter |
| `lineHeightPx` | `number` | `20` | Line-height used by textarea and line-number gutter |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved by primitives `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). Controls editor chrome (gutter/buttons); JSON content stays LTR. |
| `lang` | `string` | - | BCP 47 locale tag (e.g. `'ar'`, `'fa'`). Controls the numeral system used for line numbers. |
| `expandMode` | `'none' \| 'callback' \| 'sheet'` | `'sheet'` | Full-editor behavior for the `Full` action |
| `sheetSide` | `'left' \| 'right'` | `'right'` | Side used when `expandMode="sheet"` |
| `sheetTitle` | `string` | `'Edit JSON'` | Title displayed in the sheet header |
| `text` | `JsonEditorText` | See below | Object of translatable UI strings for i18n support |
| `onExpandEditor` | `(payload: JsonEditorExpandPayload<TFieldValues>) => void` | `-` | Callback invoked when `expandMode="callback"` and `Full` is pressed |

### JsonEditorText

All fields are optional. Omitted keys fall back to their English defaults.

```tsx
type JsonEditorText = {
  format?: string        // "Format"
  cancel?: string        // "Cancel"
  save?: string          // "Save"
  full?: string          // "Full"
  close?: string         // "Close"
  keepEditing?: string   // "Keep editing"
  discard?: string       // "Discard"
  discardTitle?: string  // "Discard changes?"
  discardDescription?: string // "You have unsaved changes..."
  statusHint?: string    // "Ctrl/Cmd + Enter: Save, Esc: Cancel"
  sheetStatusHint?: string // "Ctrl/Cmd + Enter: Save, Esc: Close"
  unsavedChanges?: string // "Unsaved changes"
  saved?: string         // "Saved"
  nullPreview?: string   // "NULL"
}
```

### JsonEditorExpandPayload

```tsx
type JsonEditorExpandPayload<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  rawText: string
  value: unknown
}
```

### MotionJsonTextareaField

Same props as `JsonTextareaField`. Adds spring scaleIn+blur entrance animation via motion. Requires the `motion` package.

### Keyboard shortcuts

* `Ctrl/Cmd + Enter` saves the current editor buffer.
* `Esc` cancels inline edits or closes the expanded sheet.

## See also

* [React Hook Form](/duck-ui/components/react-hook-form)  -  Form context components used by `JsonTextareaField`
* [Textarea](/duck-ui/components/textarea)  -  Basic plain-text multiline input
* [Field](/duck-ui/components/field)  -  Layout primitive for label + description + error composition