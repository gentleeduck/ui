import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui/hover-card'
import { CalendarIcon } from 'lucide-react'

export default function Demo() {
  return (
    <HoverCard dir="rtl">
      <HoverCardTrigger variant={'link'}>@nextjs</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4 space-x-reverse">
          <Avatar dir="rtl">
            <AvatarImage alt="VC" src="https://github.com/gentleeduck.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">@nextjs</h4>
            <p className="text-sm">اطار React -- تم انشاؤه وصيانته بواسطة @vercel.</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-muted-foreground text-xs">انضم في ديسمبر 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
