'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui-duckui/sheet'

const SHEET_SIDES = ['right'] as const

export default function SheetRtlDemo() {
  return (
    <div dir="rtl">
      <div className="grid grid-cols-1 gap-2">
        {SHEET_SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant={'outline'}>{side}</Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>تعديل الملف الشخصي</SheetTitle>
                <SheetDescription>قم باجراء تغييرات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.</SheetDescription>
              </SheetHeader>
              <div className="item-start flex h-full flex-direction flex-col justify-start gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name">الاسم</Label>
                  <Input className="col-span-3" id="name" value="احمد محمد" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input className="col-span-3" id="username" value="@ahmad" />
                </div>
              </div>
              <SheetFooter>
                <SheetClose>
                  <Button variant={'outline'}>حفظ التغييرات</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  )
}
