'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui/sheet'

const SHEET_SIDES = ['right'] as const

export default function Demo() {
  return (
    <div className="grid grid-cols-1 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side} dir="rtl">
          <SheetTrigger asChild>
            <Button variant={'outline'}>{side}</Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col" side={side}>
            <SheetHeader>
              <SheetTitle>تعديل الملف الشخصي</SheetTitle>
              <SheetDescription>قم باجراء تغييرات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.</SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">الاسم</Label>
                <Input className="col-span-3" id="name" value="احمد محمد" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input className="col-span-3" id="username" value="@ahmad" />
              </div>
            </div>
            <SheetFooter className="mt-2">
              <SheetClose>
                <Button variant={'outline'}>حفظ التغييرات</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
