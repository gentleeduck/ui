import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@gentleduck/registry-ui-duckui/alert-dialog'
import { Button } from '@gentleduck/registry-ui-duckui/button'

export default function AlertDialogRtlDemo() {
  return (
    <div dir="rtl">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">فتح</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تماما؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيا وإزالة بياناتك من خوادمنا
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">إلغاء</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button>متابعة</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
