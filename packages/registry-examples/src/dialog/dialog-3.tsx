import { Button } from '@gentleduck/registry-ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui/dialog'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <Dialog>
        <form onSubmit={(e) => e.preventDefault()}>
          <DialogTrigger asChild>
            <Button variant={'outline'}>فتح النافذة</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>تعديل الملف الشخصي</DialogTitle>
              <DialogDescription>قم باجراء التعديلات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">الاسم</Label>
                <Input defaultValue="احمد خالد" id="name-1" name="name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">اسم المستخدم</Label>
                <Input defaultValue="@ahmad" id="username-1" name="username" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={'outline'}>الغاء</Button>
              </DialogClose>
              <Button type="submit">حفظ التغييرات</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </DirectionProvider>
  )
}
