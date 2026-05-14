'use client'

import { cn } from '@gentleduck/libs/cn'
import { Maximize2 } from 'lucide-react'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Button } from '../button'
import { Dialog, DialogContent, DialogTrigger } from '../dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'
import { PreviewPanel } from './preview-panel'
import type { IPreviewPanelDialogProps, IPreviewPanelState } from './preview-panel.types'

const PreviewPanelDialog = React.forwardRef<HTMLDivElement, IPreviewPanelDialogProps & { fullscreenText?: string }>(
  (
    {
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
      fullscreenText = 'Open fullscreen',
    },
    ref,
  ) => {
    const [sharedState, setSharedState] = useState<IPreviewPanelState | undefined>(undefined)

    // Coalesces simultaneous emissions from both panels into one setState/frame
    const pendingRef = useRef(false)

    const handleStateChange = useCallback(
      (state: IPreviewPanelState) => {
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
      <div ref={ref} className={cn('group relative', className)}>
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

          <TooltipProvider>
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      icon={<Maximize2 aria-hidden="true" />}
                      aria-label={fullscreenText}
                      className="absolute end-3 bottom-3 z-10 border bg-background/80 backdrop-blur-sm"
                    />
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>{fullscreenText}</TooltipContent>
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
          </TooltipProvider>
        </div>
      </div>
    )
  },
)
PreviewPanelDialog.displayName = 'PreviewPanelDialog'

export { PreviewPanelDialog }
