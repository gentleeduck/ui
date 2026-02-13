import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@gentleduck/ui/alert-dialog'
import { Button } from '@gentleduck/ui/button'
import { FormControl, FormItem, FormLabel, FormMessage } from '@gentleduck/ui/react-hook-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@gentleduck/ui/sheet'
import { Maximize } from 'lucide-react'
import * as React from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { toast } from 'sonner'

/* ------------------------------ JSON helpers ------------------------------ */

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
type JsonObject = { [k: string]: JsonValue | undefined }

function safeStringify(value: unknown) {
  try {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

function tryParseJson(text: string): { ok: true; value: unknown } | { ok: false; message: string } {
  const raw = text.trim()
  if (!raw) return { ok: true, value: null }
  try {
    return { ok: true, value: JSON.parse(raw) }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Invalid JSON' }
  }
}

function isObjectLike(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function formatJson(text: string): { ok: true; formatted: string } | { ok: false; message: string } {
  const parsed = tryParseJson(text)
  if (!parsed.ok) return parsed
  if (parsed.value === null) return { ok: true, formatted: '' }
  return { ok: true, formatted: JSON.stringify(parsed.value, null, 2) }
}

/* ----------------------------- Key handling ------------------------------ */

function useBlockKeys(opts: { enabled: boolean; onEscape: () => void; onSave: () => void }) {
  return React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!opts.enabled) return
      if (e.key === 'Escape') {
        e.preventDefault()
        opts.onEscape()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        opts.onSave()
      }
    },
    [opts],
  )
}

/* --------------------------- Reusable editor view -------------------------- */

function JsonEditorView(props: {
  value: string
  onChange: (v: string) => void
  onScroll?: (scrollTop: number) => void
  scrollTop: number

  rows: number
  placeholder: string
  readOnly: boolean

  lineNumbers: boolean
  lineHeightPx: number

  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}) {
  const { value, onChange, onScroll, scrollTop, rows, placeholder, readOnly, lineNumbers, lineHeightPx, onKeyDown } =
    props

  const lineCount = React.useMemo(() => {
    const n = value ? value.split(/\r\n|\r|\n/).length : 1
    return Math.max(1, n)
  }, [value])

  const numbers = React.useMemo(
    () => Array.from({ length: lineCount }, (_, i) => String(i + 1)).join('\n'),
    [lineCount],
  )

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <div className="relative">
        {lineNumbers ? (
          <div className="absolute inset-y-0 left-0 w-12 border-r bg-muted/30">
            <pre
              aria-hidden
              className="select-none px-2 py-2 text-right font-mono text-muted-foreground text-xs"
              style={{
                lineHeight: `${lineHeightPx}px`,
                transform: `translateY(-${scrollTop}px)`,
              }}>
              {numbers}
            </pre>
          </div>
        ) : null}

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => onScroll?.(e.currentTarget.scrollTop)}
          onKeyDown={onKeyDown}
          rows={rows}
          spellCheck={false}
          readOnly={readOnly}
          className={[
            'w-full resize-y bg-transparent px-3 py-2 font-mono text-sm outline-none',
            lineNumbers ? 'pl-14' : '',
          ].join(' ')}
          style={{ lineHeight: `${lineHeightPx}px` }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

/* --------------------------- Field component -------------------------- */

type ExpandPayload<TFV extends FieldValues> = { name: FieldPath<TFV>; value: unknown; rawText: string }
type Mode = 'inline' | 'popover'
type ExpandMode = 'none' | 'callback' | 'sheet'

export function JsonTextareaField<TFV extends FieldValues>(props: {
  control: Control<TFV>
  name: FieldPath<TFV>
  label: string
  description?: string

  isEditable?: boolean
  allowArray?: boolean

  mode?: Mode
  rows?: number
  placeholder?: string

  lineNumbers?: boolean
  lineHeightPx?: number

  expandMode?: ExpandMode
  sheetSide?: 'left' | 'right'
  sheetTitle?: string

  onExpandEditor?: (payload: ExpandPayload<TFV>) => void
}) {
  const {
    control,
    name,
    label,
    description,
    isEditable = true,
    allowArray = true,
    mode = 'inline',
    rows = 12,
    placeholder = '{\n  "theme": "dark"\n}',
    lineNumbers = true,
    lineHeightPx = 20,
    expandMode = 'sheet',
    sheetSide = 'right',
    sheetTitle = 'Edit JSON',
    onExpandEditor,
  } = props

  const { field, fieldState } = useController({ control, name })
  const committedText = React.useMemo(() => safeStringify(field.value), [field.value])

  /* ---------- inline/popover draft ---------- */
  const [draft, setDraft] = React.useState(committedText)
  const [dirty, setDirty] = React.useState(false)
  const [scrollTop, setScrollTop] = React.useState(0)

  // when external value changes, sync editor if user isn't editing
  React.useEffect(() => {
    if (dirty) return
    setDraft(committedText)
  }, [committedText, dirty])

  /* ---------- popover open ---------- */
  const [popoverOpen, setPopoverOpen] = React.useState(mode === 'inline')
  React.useEffect(() => {
    setPopoverOpen(mode === 'inline' ? true : popoverOpen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  /* ---------- sheet state (isolated draft) ---------- */
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [sheetDraft, setSheetDraft] = React.useState('')
  const [sheetDirty, setSheetDirty] = React.useState(false)
  const [sheetScrollTop, setSheetScrollTop] = React.useState(0)

  const [confirmDiscardOpen, setConfirmDiscardOpen] = React.useState(false)

  const validateAndCommitValue = React.useCallback(
    (text: string): { ok: true } | { ok: false } => {
      if (!isEditable) return { ok: false }

      const parsed = tryParseJson(text)
      if (!parsed.ok) {
        toast.error('Please enter a valid JSON')
        return { ok: false }
      }

      if (parsed.value === null) {
        field.onChange(null)
        return { ok: true }
      }

      if (!allowArray && Array.isArray(parsed.value)) {
        toast.error('Value must be a JSON object (arrays are not allowed).')
        return { ok: false }
      }
      if (!allowArray && !isObjectLike(parsed.value)) {
        toast.error('Value must be a JSON object.')
        return { ok: false }
      }

      field.onChange(parsed.value)
      return { ok: true }
    },
    [allowArray, field, isEditable],
  )

  const cancelInline = React.useCallback(() => {
    setDraft(committedText)
    setDirty(false)
    if (mode === 'popover') setPopoverOpen(false)
  }, [committedText, mode])

  const saveInline = React.useCallback(() => {
    const r = validateAndCommitValue(draft)
    if (!r.ok) return
    setDirty(false)
    if (mode === 'popover') setPopoverOpen(false)
  }, [draft, mode, validateAndCommitValue])

  const formatInline = React.useCallback(() => {
    const r = formatJson(draft)
    if (!r.ok) {
      toast.error('Please enter a valid JSON to format')
      return
    }
    setDraft(r.formatted)
    setDirty(true)
  }, [draft])

  const inlineKeys = useBlockKeys({
    enabled: mode === 'inline' ? true : popoverOpen,
    onEscape: cancelInline,
    onSave: saveInline,
  })

  /* ---------- sheet open/close behavior ---------- */

  const openSheet = React.useCallback(() => {
    // start sheet from current inline draft (even if inline is dirty), but DO NOT affect inline while typing in sheet
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
    // sheetDraft can stay; we re-init on open anyway
  }, [])

  const saveSheet = React.useCallback(() => {
    const r = validateAndCommitValue(sheetDraft)
    if (!r.ok) return

    // reflect saved value back into inline editor as well
    setDraft(sheetDraft)
    setDirty(false)

    setSheetDirty(false)
    setSheetOpen(false)
  }, [sheetDraft, validateAndCommitValue])

  const formatSheet = React.useCallback(() => {
    const r = formatJson(sheetDraft)
    if (!r.ok) {
      toast.error('Please enter a valid JSON to format')
      return
    }
    setSheetDraft(r.formatted)
    setSheetDirty(true)
  }, [sheetDraft])

  const sheetKeys = useBlockKeys({
    enabled: sheetOpen,
    onEscape: requestCloseSheet,
    onSave: saveSheet,
  })

  /* ---------- expand button ---------- */

  const doExpand = React.useCallback(() => {
    if (expandMode === 'none') return

    if (expandMode === 'callback') {
      const parsed = tryParseJson(draft)
      const value = parsed.ok ? parsed.value : field.value
      onExpandEditor?.({ name, value, rawText: draft })
      return
    }

    openSheet()
  }, [draft, expandMode, field.value, name, onExpandEditor, openSheet])

  const canFormatInline = (() => {
    const p = tryParseJson(draft)
    return p.ok && p.value !== null
  })()

  const preview = React.useMemo(() => {
    if (committedText.trim() === '') return 'NULL'
    const oneLine = committedText.replace(/\s+/g, ' ').trim()
    return oneLine.length > 120 ? oneLine.slice(0, 117) + '...' : oneLine
  }, [committedText])

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={formatInline} disabled={!canFormatInline}>
        Format
      </Button>

      {dirty ? (
        <>
          <Button type="button" variant="outline" size="sm" onClick={cancelInline}>
            Cancel (Esc)
          </Button>
          <Button type="button" variant="default" size="sm" onClick={saveInline} disabled={!isEditable}>
            Save (Ctrl/⌘ + Enter)
          </Button>
        </>
      ) : null}

      {expandMode !== 'none' ? (
        <Button type="button" variant="outline" size="sm" onClick={doExpand}>
          <Maximize size={14} />
          <span className="ml-2">Full</span>
        </Button>
      ) : null}
    </div>
  )

  const inlineEditor = (
    <div className="space-y-2">
      <JsonEditorView
        value={draft}
        onChange={(v) => {
          setDraft(v)
          setDirty(true)
        }}
        scrollTop={scrollTop}
        onScroll={setScrollTop}
        rows={rows}
        placeholder={placeholder}
        readOnly={!isEditable}
        lineNumbers={lineNumbers}
        lineHeightPx={lineHeightPx}
        onKeyDown={inlineKeys}
      />

      <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
        <span>Ctrl/⌘ + Enter: Save, Esc: Cancel</span>
        {dirty ? <span className="text-foreground">Unsaved changes</span> : <span>Saved</span>}
      </div>
    </div>
  )

  return (
    <FormItem>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-2">
          <FormLabel className="font-semibold text-base">{label}</FormLabel>
          {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
        </div>
        {headerActions}
      </div>

      <FormControl>
        {mode === 'inline' ? (
          inlineEditor
        ) : (
          <div className="relative">
            <button
              type="button"
              className="w-full rounded-md border bg-background px-3 py-2 text-left font-mono text-sm"
              onClick={() => {
                if (!isEditable) return
                setPopoverOpen(true)
              }}>
              {preview}
            </button>

            {popoverOpen ? <div className="absolute z-50 mt-2 w-full shadow">{inlineEditor}</div> : null}
          </div>
        )}
      </FormControl>

      {fieldState.error?.message ? <FormMessage /> : null}

      {/* -------------------- Sheet expand -------------------- */}
      {expandMode === 'sheet' ? (
        <>
          <Sheet
            open={sheetOpen}
            onOpenChange={(next) => {
              if (next) {
                openSheet()
              } else {
                requestCloseSheet()
              }
            }}>
            <SheetContent side={sheetSide} className="min-w-[720px] max-w-[95vw]">
              <SheetHeader>
                <SheetTitle>{sheetTitle}</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-3">
                <JsonEditorView
                  value={sheetDraft}
                  onChange={(v) => {
                    setSheetDraft(v)
                    setSheetDirty(true)
                  }}
                  scrollTop={sheetScrollTop}
                  onScroll={setSheetScrollTop}
                  rows={24}
                  placeholder={placeholder}
                  readOnly={!isEditable}
                  lineNumbers={lineNumbers}
                  lineHeightPx={lineHeightPx}
                  onKeyDown={sheetKeys}
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="text-muted-foreground text-xs">Ctrl/⌘ + Enter: Save, Esc: Close</div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={formatSheet}
                      disabled={(() => {
                        const p = tryParseJson(sheetDraft)
                        return !(p.ok && p.value !== null)
                      })()}>
                      Format
                    </Button>

                    <Button type="button" variant="outline" size="sm" onClick={requestCloseSheet}>
                      Close
                    </Button>

                    <Button type="button" variant="default" size="sm" onClick={saveSheet} disabled={!isEditable}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* -------------------- Discard confirm -------------------- */}
          <AlertDialog open={confirmDiscardOpen} onOpenChange={setConfirmDiscardOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes in the editor. If you close now, they will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmDiscardOpen(false)}>Keep editing</AlertDialogCancel>
                <AlertDialogAction onClick={discardSheetChanges}>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : null}
    </FormItem>
  )
}
