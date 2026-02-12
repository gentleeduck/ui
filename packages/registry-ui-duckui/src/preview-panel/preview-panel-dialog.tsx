'use client'

import { cn } from '@gentleduck/libs/cn'
import { Maximize2 } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Button } from '../button'
import { Dialog, DialogContent, DialogTrigger } from '../dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { PreviewPanel } from './preview-panel'
import type { PreviewPanelDialogProps, PreviewPanelState } from './preview-panel.types'

function PreviewPanelDialog({
  children,
  html,
  className,
  panelClassName,
  maxHeight,
  minZoom = 0.25,
  maxZoom = 4,
  initialZoom = 1,
  showControls = true,
  syncPanels = true,
}: PreviewPanelDialogProps) {
  const [sharedState, setSharedState] = useState<PreviewPanelState | undefined>(undefined)

  // Ref tracks whether a state update is already scheduled this frame.
  // Prevents multiple setState calls per animation frame when both
  // panels emit state changes simultaneously.
  const pendingRef = useRef(false)

  const handleStateChange = useCallback(
    (state: PreviewPanelState) => {
      if (!syncPanels) return
      if (pendingRef.current) return
      pendingRef.current = true
      requestAnimationFrame(() => {
        pendingRef.current = false
        setSharedState(state)
      })
    },
    [syncPanels],
  )

  const contentProps = useMemo(() => (html ? { html } : { children }), [html, children])

  const dialogPanelClassName = useMemo(() => cn('min-h-[70vh]', panelClassName), [panelClassName])

  return (
    <div className={cn('group relative', className)}>
      <div className="relative overflow-hidden rounded-lg border bg-card">
        <PreviewPanel
          {...contentProps}
          maxHeight={maxHeight}
          minZoom={minZoom}
          maxZoom={maxZoom}
          initialZoom={initialZoom}
          showControls={showControls}
          className={panelClassName}
          onStateChange={handleStateChange}
          syncState={syncPanels ? sharedState : undefined}
        />

        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  icon={<Maximize2 />}
                  className="absolute right-3 bottom-3 z-10 border bg-background/80 backdrop-blur-sm"
                />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Open fullscreen</TooltipContent>
          </Tooltip>
          <DialogContent className="max-h-[85vh] max-w-[90vw] overflow-auto p-0">
            <PreviewPanel
              {...contentProps}
              minZoom={minZoom}
              maxZoom={maxZoom}
              initialZoom={initialZoom}
              showControls={showControls}
              className={dialogPanelClassName}
              onStateChange={handleStateChange}
              syncState={syncPanels ? sharedState : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export { PreviewPanelDialog }
