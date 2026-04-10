'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { DirectionContext } from '@gentleduck/registry-ui/direction'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterPlusIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
} from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [label, setLabel] = React.useState('personal')

  return (
    <DirectionContext.Provider value="rtl">
      <ButtonGroup dir="rtl">
        <ButtonGroup className="hidden sm:flex">
          <Button aria-label="رجوع" size="icon" variant="outline">
            <ArrowLeftIcon className="rtl:rotate-180" />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">أرشفة</Button>
          <Button variant="outline">إبلاغ</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">تأجيل</Button>
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button aria-label="خيارات إضافية" size="icon" variant="outline">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <MailCheckIcon />
                  تحديد كمقروء
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArchiveIcon />
                  أرشفة
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ClockIcon />
                  تأجيل
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarPlusIcon />
                  إضافة إلى التقويم
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListFilterPlusIcon />
                  إضافة إلى القائمة
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <TagIcon />
                    تصنيف كـ...
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup onValueChange={setLabel} value={label}>
                      <DropdownMenuRadioItem value="personal">شخصي</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="work">عمل</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="other">أخرى</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </ButtonGroup>
    </DirectionContext.Provider>
  )
}
