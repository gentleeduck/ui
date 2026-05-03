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

The `json-editor` component depends on the [`alert-dialog`](/docs/components/alert-dialog), [`button`](/docs/components/button), [`field`](/docs/components/field), [`popover`](/docs/components/popover), and [`sheet`](/docs/components/sheet) components.

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

type FormValues = {
  settings: Record

```

## Examples

### Inline + sheet expansion

Default mode renders the editor inline and opens an expanded sheet editor with the `Full` action.

### Popover mode

Use `mode="popover"` to keep layout compact and open the editor only when needed.

### Custom full-editor callback

Set `expandMode="callback"` to hand off full-screen editing to your own flow.

## RTL Support

Set `dir="rtl"` on `JsonEditor` for a local override, or set `DirectionProvider` once at app/root level for global direction. Pass `lang` for locale-aware line numbers, and use `text` to translate labels/messages.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionJsonTextareaField` for a spring-powered entrance animation with blur powered by [motion](https://motion.dev).

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

- `Ctrl/Cmd + Enter` saves the current editor buffer.
- `Esc` cancels inline edits or closes the expanded sheet.

## See also

- [React Hook Form](/docs/components/react-hook-form)  -  Form context components used by `JsonTextareaField`
- [Textarea](/docs/components/textarea)  -  Basic plain-text multiline input
- [Field](/docs/components/field)  -  Layout primitive for label + description + error composition