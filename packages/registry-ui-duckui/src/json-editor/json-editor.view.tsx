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
  onKeyDown,
}: JsonEditorViewProps) {
  const lineCount = React.useMemo(() => {
    const count = value ? value.split(/\r\n|\r|\n/).length : 1
    return Math.max(1, count)
  }, [value])

  const numbers = React.useMemo(
    () => Array.from({ length: lineCount }, (_, index) => String(index + 1)).join('\n'),
    [lineCount],
  )

  return (
    <div className="overflow-hidden rounded-md border bg-background" data-slot="json-editor-shell">
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
