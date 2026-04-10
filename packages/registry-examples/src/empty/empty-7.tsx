import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconInbox } from '@tabler/icons-react'
import { ArrowUpRightIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div dir="rtl">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconInbox />
          </EmptyMedia>
          <EmptyTitle>صندوق الوارد فارغ</EmptyTitle>
          <EmptyDescription>
            لا توجد رسائل في انتظارك. ستظهر المحادثات الجديدة هنا عندما يتواصل معك شخص ما.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>كتابة رسالة</Button>
            <Button variant="outline">عرض المؤرشف</Button>
          </div>
        </EmptyContent>
        <Button asChild className="text-muted-foreground" size="sm" variant="link">
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder href in demo component */}
          <a href="#">
            ادارة التفضيلات <ArrowUpRightIcon />
          </a>
        </Button>
      </Empty>
    </div>
  )
}
