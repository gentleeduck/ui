import type { Control, FieldPath, FieldValues } from 'react-hook-form'

export type JsonEditorMode = 'inline' | 'popover'
export type JsonEditorExpandMode = 'none' | 'callback' | 'sheet'

export interface IJsonEditorExpandPayload<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  rawText: string
  value: unknown
}
export type JsonEditorExpandPayload<TFieldValues extends FieldValues> = IJsonEditorExpandPayload<TFieldValues>

export interface IJsonTextareaFieldProps<TFieldValues extends FieldValues> {
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

  text?: IJsonEditorText

  onExpandEditor?: (payload: IJsonEditorExpandPayload<TFieldValues>) => void
}
export type JsonTextareaFieldProps<TFieldValues extends FieldValues> = IJsonTextareaFieldProps<TFieldValues>

export interface IJsonEditorText {
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
export type JsonEditorText = IJsonEditorText

export type IJsonParseResult = { ok: true; value: unknown } | { ok: false; message: string }
export type JsonParseResult = IJsonParseResult

export interface IJsonEditorViewProps {
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
export type JsonEditorViewProps = IJsonEditorViewProps

export interface IUseJsonEditorHotkeysOptions {
  enabled: boolean
  onEscape: () => void
  onSave: () => void
}
export type UseJsonEditorHotkeysOptions = IUseJsonEditorHotkeysOptions
