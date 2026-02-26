import { Button } from '@gentleduck/registry-ui-duckui/button'
import { DirectionProvider } from '@gentleduck/registry-ui-duckui/direction'
import { ChevronLeft, Send } from 'lucide-react'

export default function ButtonRtlDemo() {
  return (
    <DirectionProvider dir="rtl">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="default" icon={<Send />}>
          ارسال
        </Button>
        <Button variant="outline" icon={<ChevronLeft />} className="rtl:[&_svg]:rotate-180">
          السابق
        </Button>
        <Button variant="secondary">تسجيل الدخول</Button>
        <Button variant="destructive">حذف</Button>
      </div>
    </DirectionProvider>
  )
}
