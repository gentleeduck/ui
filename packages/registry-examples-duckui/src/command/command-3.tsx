'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gentleduck/registry-ui-duckui/command'
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

export default function CommandRtlDemo() {
  return (
    <Command className="h-fit border pt-0" dir="rtl">
      <CommandInput placeholder="...اكتب امرا او ابحث" />
      <CommandList>
        <CommandEmpty>لا توجد نتائج.</CommandEmpty>
        <CommandGroup heading="اقتراحات">
          <CommandItem>
            <Calendar />
            <span>التقويم</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>بحث عن رموز تعبيرية</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>الالة الحاسبة</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="الاعدادات">
          <CommandItem>
            <User />
            <span>الملف الشخصي</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>الفواتير</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>الاعدادات</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
