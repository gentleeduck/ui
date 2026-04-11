'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { Portal } from '@gentleduck/primitives/portal'
import { Maximize } from 'lucide-react'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import type { FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../alert-dialog'
import { Button, MotionButton } from '../button'
import { Field, FieldDescription, FieldError, FieldLabel } from '../field'
import { MotionPopover, MotionPopoverContent, Popover, PopoverContent, PopoverTrigger } from '../popover'
import { MotionSheet, MotionSheetContent, Sheet, SheetContent, SheetHeader, SheetTitle } from '../sheet'
import { useJsonEditorHotkeys } from './json-editor.hooks'
import { formatJson, isObjectLike, safeStringify, tryParseJson } from './json-editor.libs'
import type { JsonEditorText, JsonTextareaFieldProps } from './json-editor.types'
import { JsonEditorView } from './json-editor.view'

type ComponentOverrides = {
  Button: typeof Button
  Popover: typeof Popover
  PopoverContent: typeof PopoverContent
  Sheet: typeof Sheet
  SheetContent: typeof SheetContent
}

const defaultComponents: ComponentOverrides = { Button, Popover, PopoverContent, Sheet, SheetContent }
const motionComponents: ComponentOverrides = {
  Button: MotionButton,
  Popover: MotionPopover as typeof Popover,
  PopoverContent: MotionPopoverContent as typeof PopoverContent,
  Sheet: MotionSheet as typeof Sheet,
  SheetContent: MotionSheetContent as typeof SheetContent,
}

export function JsonTextareaField<TFieldValues extends FieldValues>(
  props: JsonTextareaFieldProps<TFieldValues> & { _components?: ComponentOverrides },
): React.JSX.Element {
  const {
    control,
    name,
    label,
    description,
    className,
    actionsClassName,
    isEditable = true,
    allowArray = true,
    mode = 'inline',
    rows = 12,
    placeholder = '{\n  "theme": "dark"\n}',
    lineNumbers = true,
    lineHeightPx = 20,
    dir,
    lang,
    expandMode = 'sheet',
    sheetSide = 'right',
    sheetTitle = 'Edit JSON',
    text: textProp,
    onExpandEditor,
    _components: componentOverrides,
  } = props

  const C = componentOverrides ?? defaultComponents

  const t: Required<JsonEditorText> = {
    format: textProp?.format ?? 'Format',
    cancel: textProp?.cancel ?? 'Cancel',
    save: textProp?.save ?? 'Save',
    full: textProp?.full ?? 'Full',
    close: textProp?.close ?? 'Close',
    keepEditing: textProp?.keepEditing ?? 'Keep editing',
    discard: textProp?.discard ?? 'Discard',
    discardTitle: textProp?.discardTitle ?? 'Discard changes?',
    discardDescription:
      textProp?.discardDescription ?? 'You have unsaved changes in the editor. If you close now, they will be lost.',
    statusHint: textProp?.statusHint ?? 'Ctrl/Cmd + Enter: Save, Esc: Cancel',
    sheetStatusHint: textProp?.sheetStatusHint ?? 'Ctrl/Cmd + Enter: Save, Esc: Close',
    unsavedChanges: textProp?.unsavedChanges ?? 'Unsaved changes',
    saved: textProp?.saved ?? 'Saved',
    nullPreview: textProp?.nullPreview ?? 'NULL',
  }

  const { field, fieldState } = useController({ control, name })
  const committedText = React.useMemo(() => safeStringify(field.value), [field.value])

  const [draft, setDraft] = React.useState(committedText)
  const [dirty, setDirty] = React.useState(false)
  const [scrollTop, setScrollTop] = React.useState(0)

  React.useEffect(() => {
    if (dirty) return
    setDraft(committedText)
  }, [committedText, dirty])

  const [popoverOpen, setPopoverOpen] = React.useState(false)

  React.useEffect(() => {
    if (mode !== 'popover') {
      setPopoverOpen(false)
    }
  }, [mode])

  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [sheetDraft, setSheetDraft] = React.useState('')
  const [sheetDirty, setSheetDirty] = React.useState(false)
  const [sheetScrollTop, setSheetScrollTop] = React.useState(0)
  const [confirmDiscardOpen, setConfirmDiscardOpen] = React.useState(false)

  const validateAndCommitValue = React.useCallback(
    (text: string): boolean => {
      if (!isEditable) return false

      const parsed = tryParseJson(text)
      if (!parsed.ok) {
        toast.error(parsed.message || 'Please enter valid JSON')
        return false
      }

      if (parsed.value === null) {
        field.onChange(null)
        return true
      }

      if (!allowArray && Array.isArray(parsed.value)) {
        toast.error('Value must be a JSON object (arrays are not allowed).')
        return false
      }

      if (!allowArray && !isObjectLike(parsed.value)) {
        toast.error('Value must be a JSON object.')
        return false
      }

      field.onChange(parsed.value)
      return true
    },
    [allowArray, field, isEditable],
  )

  const cancelInline = React.useCallback(() => {
    setDraft(committedText)
    setDirty(false)
    if (mode === 'popover') {
      setPopoverOpen(false)
    }
  }, [committedText, mode])

  const saveInline = React.useCallback(() => {
    if (!validateAndCommitValue(draft)) return
    setDirty(false)
    if (mode === 'popover') {
      setPopoverOpen(false)
    }
  }, [draft, mode, validateAndCommitValue])

  const formatInline = React.useCallback(() => {
    if (!isEditable) return

    const result = formatJson(draft)
    if (!result.ok) {
      toast.error(result.message || 'Please enter valid JSON to format')
      return
    }

    setDraft(result.formatted)
    setDirty(true)
  }, [draft, isEditable])

  const inlineHotkeys = useJsonEditorHotkeys({
    enabled: mode === 'inline' || popoverOpen,
    onEscape: cancelInline,
    onSave: saveInline,
  })

  const openSheet = React.useCallback(() => {
    setSheetDraft(draft)
    setSheetDirty(false)
    setSheetScrollTop(0)
    setSheetOpen(true)
  }, [draft])

  const requestCloseSheet = React.useCallback(() => {
    if (!sheetDirty) {
      setSheetOpen(false)
      return
    }

    setConfirmDiscardOpen(true)
  }, [sheetDirty])

  const discardSheetChanges = React.useCallback(() => {
    setConfirmDiscardOpen(false)
    setSheetDirty(false)
    setSheetOpen(false)
  }, [])

  const saveSheet = React.useCallback(() => {
    if (!validateAndCommitValue(sheetDraft)) return

    setDraft(sheetDraft)
    setDirty(false)
    setSheetDirty(false)
    setSheetOpen(false)
  }, [sheetDraft, validateAndCommitValue])

  const formatSheet = React.useCallback(() => {
    if (!isEditable) return

    const result = formatJson(sheetDraft)
    if (!result.ok) {
      toast.error(result.message || 'Please enter valid JSON to format')
      return
    }

    setSheetDraft(result.formatted)
    setSheetDirty(true)
  }, [isEditable, sheetDraft])

  const sheetHotkeys = useJsonEditorHotkeys({
    enabled: sheetOpen,
    onEscape: requestCloseSheet,
    onSave: saveSheet,
  })

  const handleExpand = React.useCallback(() => {
    if (expandMode === 'none') return

    if (expandMode === 'callback') {
      const parsed = tryParseJson(draft)
      onExpandEditor?.({
        name,
        rawText: draft,
        value: parsed.ok ? parsed.value : field.value,
      })
      return
    }

    openSheet()
  }, [draft, expandMode, field.value, name, onExpandEditor, openSheet])

  const canFormatDraft = React.useMemo(() => {
    const parsed = tryParseJson(draft)
    return parsed.ok && parsed.value !== null
  }, [draft])

  const canFormatSheet = React.useMemo(() => {
    const parsed = tryParseJson(sheetDraft)
    return parsed.ok && parsed.value !== null
  }, [sheetDraft])

  const preview = React.useMemo(() => {
    if (!committedText.trim()) return t.nullPreview

    const oneLine = committedText.replace(/\s+/g, ' ').trim()
    return oneLine.length > 120 ? `${oneLine.slice(0, 117)}...` : oneLine
  }, [committedText, t.nullPreview])

  const inlineEditor = (
    <div className="space-y-2" data-slot="json-editor-inline">
      <JsonEditorView
        dir={dir}
        lang={lang}
        lineHeightPx={lineHeightPx}
        lineNumbers={lineNumbers}
        onChange={(value) => {
          setDraft(value)
          setDirty(true)
        }}
        onKeyDown={inlineHotkeys}
        onScroll={setScrollTop}
        placeholder={placeholder}
        readOnly={!isEditable}
        rows={rows}
        scrollTop={scrollTop}
        value={draft}
      />

      <div
        className="flex items-center justify-between gap-2 text-muted-foreground text-xs"
        data-slot="json-editor-status">
        <span>{t.statusHint}</span>
        {dirty ? <span className="text-foreground">{t.unsavedChanges}</span> : <span>{t.saved}</span>}
      </div>
    </div>
  )

  return (
    <Field className={cn('space-y-3', className)} data-slot="json-editor-field" dir={dir}>
      <div className="mb-1 flex items-start justify-between gap-4" data-slot="json-editor-header">
        <div className="space-y-1">
          <FieldLabel className="font-semibold text-base">{label}</FieldLabel>
          {description ? <FieldDescription>{description}</FieldDescription> : null}
        </div>

        <div className={cn('flex items-center gap-2', actionsClassName)} data-slot="json-editor-actions">
          <C.Button
            disabled={!isEditable || !canFormatDraft}
            onClick={formatInline}
            size="sm"
            type="button"
            variant="outline">
            {t.format}
          </C.Button>

          {dirty ? (
            <>
              <C.Button onClick={cancelInline} size="sm" type="button" variant="outline">
                {t.cancel}
              </C.Button>
              <C.Button disabled={!isEditable} onClick={saveInline} size="sm" type="button">
                {t.save}
              </C.Button>
            </>
          ) : null}

          {expandMode !== 'none' ? (
            <C.Button onClick={handleExpand} size="sm" type="button" variant="outline">
              <Maximize aria-hidden="true" size={14} />
              <span className="ms-2">{t.full}</span>
            </C.Button>
          ) : null}
        </div>
      </div>

      <div>
        {mode === 'inline' ? (
          inlineEditor
        ) : (
          <div data-slot="json-editor-popover">
            <C.Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
              <PopoverTrigger asChild>
                <C.Button
                  className="w-full justify-start overflow-hidden text-start font-mono text-xs"
                  type="button"
                  variant="outline">
                  <span className="truncate">{preview}</span>
                </C.Button>
              </PopoverTrigger>
              <C.PopoverContent className="w-[min(96vw,720px)] p-2">{inlineEditor}</C.PopoverContent>
            </C.Popover>
          </div>
        )}
      </div>

      {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}

      {expandMode === 'sheet' ? (
        <C.Sheet
          onOpenChange={(nextOpen) => {
            if (nextOpen) {
              openSheet()
              return
            }

            requestCloseSheet()
          }}
          open={sheetOpen}>
          <C.SheetContent className="w-full sm:max-w-3xl" dir={dir} side={sheetSide}>
            <SheetHeader>
              <SheetTitle>{sheetTitle}</SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-3" data-slot="json-editor-sheet-content">
              <JsonEditorView
                dir={dir}
                lang={lang}
                lineHeightPx={lineHeightPx}
                lineNumbers={lineNumbers}
                onChange={(value) => {
                  setSheetDraft(value)
                  setSheetDirty(true)
                }}
                onKeyDown={sheetHotkeys}
                onScroll={setSheetScrollTop}
                placeholder={placeholder}
                readOnly={!isEditable}
                rows={24}
                scrollTop={sheetScrollTop}
                value={sheetDraft}
              />

              <div className="flex items-center justify-between gap-2" data-slot="json-editor-sheet-actions">
                <div className="text-muted-foreground text-xs">{t.sheetStatusHint}</div>

                <div className="flex items-center gap-2">
                  <C.Button
                    disabled={!isEditable || !canFormatSheet}
                    onClick={formatSheet}
                    size="sm"
                    type="button"
                    variant="outline">
                    {t.format}
                  </C.Button>

                  <C.Button onClick={requestCloseSheet} size="sm" type="button" variant="outline">
                    {t.close}
                  </C.Button>

                  <C.Button disabled={!isEditable} onClick={saveSheet} size="sm" type="button">
                    {t.save}
                  </C.Button>
                </div>
              </div>
            </div>
          </C.SheetContent>
        </C.Sheet>
      ) : null}

      <Portal>
        <AlertDialog onOpenChange={setConfirmDiscardOpen} open={confirmDiscardOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.discardTitle}</AlertDialogTitle>
              <AlertDialogDescription>{t.discardDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild onClick={() => setConfirmDiscardOpen(false)}>
                <C.Button variant="outline" size="sm">
                  {t.keepEditing}
                </C.Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild onClick={discardSheetChanges}>
                <C.Button variant="default" size="sm">
                  {t.discard}
                </C.Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Portal>
    </Field>
  )
}
JsonTextareaField.displayName = 'JsonTextareaField'

export function MotionJsonTextareaField<TFieldValues extends FieldValues>(
  props: JsonTextareaFieldProps<TFieldValues>,
): React.JSX.Element {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <JsonTextareaField {...props} _components={motionComponents} />
      </m.div>
    </LazyMotion>
  )
}
MotionJsonTextareaField.displayName = 'MotionJsonTextareaField'
