'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import { Textarea } from '../textarea'
import type { JsonEditorViewProps } from './json-editor.types'

export function JsonEditorView({
  value,
  onChange,
  onScroll,
  scrollTop,
  rows,
  placeholder,
  readOnly,
  lineNumbers,
  lineHeightPx,
  dir,
  lang,
  onKeyDown,
}: JsonEditorViewProps) {
  const lineCount = React.useMemo(() => {
    const count = value ? value.split(/\r\n|\r|\n/).length : 1
    return Math.max(1, count)
  }, [value])

  const numbers = React.useMemo(() => {
    if (!lang) {
      return Array.from({ length: lineCount }, (_, i) => String(i + 1)).join('\n')
    }

    // Build formatter; if the locale already includes a -u-nu- extension, use as-is.
    // Otherwise append the native numbering system for known locales so that
    // environments defaulting to latn still produce locale-appropriate digits.
    let localeTag = lang
    if (!lang.includes('-u-') || !lang.includes('-nu-')) {
      const base = lang.split('-')[0].toLowerCase()
      const ns: Record<string, string> = {
        ar: 'arab',
        fa: 'arabext',
        ur: 'arabext',
        ps: 'arabext',
        bn: 'beng',
        hi: 'deva',
        mr: 'deva',
        ne: 'deva',
        th: 'thai',
        my: 'mymr',
        km: 'khmr',
        lo: 'laoo',
        ta: 'tamldec',
        te: 'telu',
        kn: 'knda',
        ml: 'mlym',
        gu: 'gujr',
        or: 'orya',
        pa: 'guru',
      }
      if (ns[base]) {
        localeTag = `${lang}-u-nu-${ns[base]}`
      }
    }

    const fmt = new Intl.NumberFormat(localeTag, { useGrouping: false })
    return Array.from({ length: lineCount }, (_, i) => fmt.format(i + 1)).join('\n')
  }, [lineCount, lang])

  return (
    <div className="overflow-hidden rounded-md border bg-background" data-slot="json-editor-shell" dir={dir}>
      <div className="relative" data-slot="json-editor-container">
        {lineNumbers ? (
          <div className="absolute inset-y-0 start-0 w-12 border-e bg-muted/30" data-slot="json-editor-gutter">
            <pre
              aria-hidden
              className="select-none px-2 py-2 text-end font-mono text-muted-foreground text-xs"
              data-slot="json-editor-line-numbers"
              style={{
                lineHeight: `${lineHeightPx}px`,
                transform: `translateY(-${scrollTop}px)`,
              }}>
              {numbers}
            </pre>
          </div>
        ) : null}

        <Textarea
          className={cn(
            'w-full resize-y bg-transparent px-3 py-2 font-mono text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring',
            lineNumbers ? 'ps-14' : '',
          )}
          data-slot="json-editor-textarea"
          dir="ltr"
          onChange={(event) => onChange(event.currentTarget.value)}
          onKeyDown={onKeyDown}
          onScroll={(event) => onScroll?.(event.currentTarget.scrollTop)}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          spellCheck={false}
          style={{ lineHeight: `${lineHeightPx}px` }}
          value={value}
        />
      </div>
    </div>
  )
}
