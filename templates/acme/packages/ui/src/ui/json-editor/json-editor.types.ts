import type { Control, FieldPath, FieldValues } from 'react-hook-form'

export type JsonEditorMode = 'inline' | 'popover'
export type JsonEditorExpandMode = 'none' | 'callback' | 'sheet'

export type JsonEditorExpandPayload<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  rawText: string
  value: unknown
}

export type JsonTextareaFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  description?: string
  className?: string
  actionsClassName?: string

  isEditable?: boolean
  allowArray?: boolean

  mode?: JsonEditorMode
  rows?: number
  placeholder?: string

  lineNumbers?: boolean
  lineHeightPx?: number

  dir?: 'ltr' | 'rtl'
  lang?: string

  expandMode?: JsonEditorExpandMode
  sheetSide?: 'left' | 'right'
  sheetTitle?: string

  text?: JsonEditorText

  onExpandEditor?: (payload: JsonEditorExpandPayload<TFieldValues>) => void
}

export type JsonEditorText = {
  format?: string
  cancel?: string
  save?: string
  full?: string
  close?: string
  keepEditing?: string
  discard?: string
  discardTitle?: string
  discardDescription?: string
  statusHint?: string
  sheetStatusHint?: string
  unsavedChanges?: string
  saved?: string
  nullPreview?: string
}

export type JsonParseResult = { ok: true; value: unknown } | { ok: false; message: string }

export type JsonEditorViewProps = {
  value: string
  onChange: (value: string) => void
  onScroll?: (scrollTop: number) => void
  scrollTop: number
  rows: number
  placeholder: string
  readOnly: boolean
  lineNumbers: boolean
  lineHeightPx: number
  dir?: 'ltr' | 'rtl'
  lang?: string
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export type UseJsonEditorHotkeysOptions = {
  enabled: boolean
  onEscape: () => void
  onSave: () => void
}
