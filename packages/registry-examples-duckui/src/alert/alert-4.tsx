import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui-duckui/alert'
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from 'lucide-react'

export default function AlertRtlDemo() {
  return (
    <div dir="rtl">
      <div className="grid w-full max-w-xl items-start gap-4">
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>تم بنجاح! تم حفظ التغييرات الخاصة بك</AlertTitle>
          <AlertDescription>هذا تنبيه يحتوي على أيقونة وعنوان ووصف.</AlertDescription>
        </Alert>
        <Alert>
          <PopcornIcon />
          <AlertTitle>هذا التنبيه يحتوي على عنوان وأيقونة. بدون وصف.</AlertTitle>
        </Alert>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>تعذرت معالجة عملية الدفع الخاصة بك.</AlertTitle>
          <AlertDescription>
            <p>يرجى التحقق من معلومات الفوترة والمحاولة مرة أخرى.</p>
            <ul className="list-inside list-disc text-sm">
              <li>تحقق من تفاصيل بطاقتك</li>
              <li>تأكد من توفر رصيد كاف</li>
              <li>تحقق من عنوان الفوترة</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
