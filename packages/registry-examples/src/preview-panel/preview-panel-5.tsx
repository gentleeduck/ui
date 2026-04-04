import { PreviewPanel } from '@gentleduck/registry-ui/preview-panel'

export default function Demo() {
  return (
    <PreviewPanel maxHeight="400px" className="rounded-lg border bg-card" dir="rtl">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="size-24 rounded-full bg-primary/20" />
        <h3 className="font-semibold text-lg">تحريك وتكبير</h3>
        <p className="text-muted-foreground text-sm">اسحب للتحريك، مرر للتكبير، او استخدم ادوات التحكم.</p>
      </div>
    </PreviewPanel>
  )
}
