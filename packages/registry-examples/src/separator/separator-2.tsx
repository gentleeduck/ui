import { Separator } from '@gentleduck/registry-ui/separator'

export default function Demo() {
  return (
    <div dir="rtl">
      <div>
        <div className="space-y-1">
          <h4 className="font-medium text-sm leading-none">مكونات Radix الاساسية</h4>
          <p className="text-muted-foreground text-sm">مكتبة مكونات واجهة مستخدم مفتوحة المصدر.</p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>المدونة</div>
          <Separator orientation="vertical" />
          <div>التوثيق</div>
          <Separator orientation="vertical" />
          <div>المصدر</div>
        </div>
      </div>
    </div>
  )
}
