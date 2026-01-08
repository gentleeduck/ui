'use client'

import { useColors } from '@gentleduck/docs'
import type { Color } from '@gentleduck/docs/lib'
import { trackEvent } from '@gentleduck/docs/lib'
import { useCopyToClipboard } from '@gentleduck/hooks/use-copy-to-clipboard'
import { Check, Clipboard } from 'lucide-react'
import { toast } from 'sonner'

export function Color({ color }: { color: Color }) {
  const { format, setLastCopied, lastCopied } = useColors()
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 0 })

  return (
    <button
      className="group relative flex aspect-[3/1] w-full flex-1 cursor-pointer flex-col gap-2 text-(--text) sm:aspect-[2/3] sm:h-auto sm:w-auto [&>svg]:absolute [&>svg]:top-4 [&>svg]:right-4 [&>svg]:z-10 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-0 [&>svg]:transition-opacity"
      data-last-copied={lastCopied === color[format]}
      key={color.hex}
      onClick={() => {
        copyToClipboard(color[format])
        trackEvent({
          name: 'copy_color',
          properties: {
            color: color.id,
            format,
            value: color[format],
          },
        })
        setLastCopied(color[format])
        toast.success(`Copied ${color[format]} to clipboard.`)
      }}
      style={
        {
          '--bg': `${color.oklch}`,
          '--text': color.foreground,
        } as React.CSSProperties
      }>
      {isCopied ? (
        <Check className="group-hover:opacity-100 group-data-[last-copied=true]:opacity-100" />
      ) : (
        <Clipboard className="group-hover:opacity-100" />
      )}
      <div className="w-full flex-1 rounded-md border bg-(--bg) after:rounded-lg after:border-input md:rounded-lg" />
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <span className="font-mono text-muted-foreground text-xs tabular-nums transition-colors group-hover:text-foreground group-data-[last-copied=true]:text-primary sm:hidden xl:flex">
          {color.className}
        </span>
        <span className="hidden font-mono text-muted-foreground text-xs tabular-nums transition-colors group-hover:text-foreground group-data-[last-copied=true]:text-primary sm:flex xl:hidden">
          {color.scale}
        </span>
      </div>
    </button>
  )
}
