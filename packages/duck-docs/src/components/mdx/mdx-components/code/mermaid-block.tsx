'use client'

import { cn } from '@gentleduck/libs/cn'
import { PreviewPanelDialog } from '@gentleduck/registry-ui/preview-panel'
import { Loader } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export interface IMermaidBlockProps {
  chart?: string
  lightSvg?: string
  darkSvg?: string
  className?: string
  __mermaidLightSvg__?: string
  __mermaidDarkSvg__?: string
  __rawString__?: string
  [key: string]: unknown
}

export function MermaidBlock(props: IMermaidBlockProps) {
  const chart = props.chart || props.__rawString__ || ''
  const preLight = props.lightSvg || props.__mermaidLightSvg__ || ''
  const preDark = props.darkSvg || props.__mermaidDarkSvg__ || ''

  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentSvg = resolvedTheme === 'dark' ? preDark || preLight : preLight || preDark

  if (!mounted) {
    return (
      <output
        aria-live="polite"
        className={cn('my-6 flex h-[300px] items-center justify-center rounded-lg border bg-card', props.className)}>
        <div className="flex flex-col items-center gap-3">
          <Loader aria-hidden="true" className="size-4 animate-spin opacity-50" />
          <p className="text-muted-foreground text-sm">Loading diagram...</p>
        </div>
      </output>
    )
  }

  if (!currentSvg) {
    return (
      <pre className="my-6 overflow-auto rounded-lg border bg-muted p-4 text-muted-foreground text-sm">
        {chart || 'Mermaid diagram'}
      </pre>
    )
  }

  return (
    <PreviewPanelDialog
      html={currentSvg}
      maxHeight="500px"
      className={cn('my-6', props.className)}
      panelClassName="[&_svg]:block [&_svg]:h-auto [&_svg]:max-h-full [&_svg]:w-full [&_svg]:max-w-full"
      syncPanels
    />
  )
}
