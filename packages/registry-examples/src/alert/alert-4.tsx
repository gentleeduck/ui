import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui/alert'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from 'lucide-react'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <div className="grid w-full max-w-xl items-start gap-4">
        <Alert>
          <CheckCircle2Icon aria-hidden="true" />
          <AlertTitle>تم بنجاح! تم حفظ التغييرات الخاصة بك</AlertTitle>
          <AlertDescription>هذا تنبيه يحتوي على أيقونة وعنوان ووصف.</AlertDescription>
        </Alert>
        <Alert>
          <PopcornIcon aria-hidden="true" />
          <AlertTitle>هذا التنبيه يحتوي على عنوان وأيقونة. بدون وصف.</AlertTitle>
        </Alert>
        <Alert variant="destructive">
          <AlertCircleIcon aria-hidden="true" />
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
    </DirectionProvider>
  )
}
