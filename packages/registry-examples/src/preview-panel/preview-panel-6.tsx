'use client'

import { MotionPreviewPanel } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <MotionPreviewPanel maxHeight="400px" className="rounded-lg border bg-card">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="size-24 rounded-full bg-primary/20" />
        <h3 className="font-semibold text-lg">Pan & Zoom</h3>
        <p className="text-muted-foreground text-sm">Drag to pan, scroll to zoom, or use the controls.</p>
      </div>
    </MotionPreviewPanel>
  )
}
