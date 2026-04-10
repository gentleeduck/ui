'use client'

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@gentleduck/registry-ui/menubar'

export default function Demo() {
  return (
    <Menubar dir="rtl">
      <MenubarMenu>
        <MenubarTrigger>ملف</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            تبويب جديد
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            نافذة جديدة
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>نافذة تصفح خاص جديدة</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>مشاركة</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>رابط بريد الكتروني</MenubarItem>
              <MenubarItem>الرسائل</MenubarItem>
              <MenubarItem>الملاحظات</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            طباعة... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>تحرير</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            تراجع <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            اعادة <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>بحث</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>البحث في الويب</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>بحث...</MenubarItem>
              <MenubarItem>البحث عن التالي</MenubarItem>
              <MenubarItem>البحث عن السابق</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>قص</MenubarItem>
          <MenubarItem>نسخ</MenubarItem>
          <MenubarItem>لصق</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>عرض</MenubarTrigger>
        <MenubarContent className="w-60">
          <MenubarCheckboxItem>اظهار شريط المفضلة دائما</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>اظهار الروابط الكاملة دائما</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            اعادة تحميل <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            اعادة تحميل اجبارية <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>تبديل ملء الشاشة</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>اخفاء الشريط الجانبي</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>الملفات الشخصية</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="ahmad">
            <MenubarRadioItem value="ali">علي</MenubarRadioItem>
            <MenubarRadioItem value="ahmad">احمد</MenubarRadioItem>
            <MenubarRadioItem value="omar">عمر</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>تعديل</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>اضافة ملف شخصي</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
