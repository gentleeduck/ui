import { PreviewPanelDialog } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <PreviewPanelDialog maxHeight="350px" syncPanels>
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list generated from Array.from
              key={i}
              className="flex size-16 items-center justify-center rounded-md bg-primary/10 font-medium text-sm">
              {i + 1}
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm">
          Click expand to open fullscreen. Zoom state syncs between both views.
        </p>
      </div>
    </PreviewPanelDialog>
  )
}
