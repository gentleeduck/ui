'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { toast } from 'sonner'

export default function SonnerRtlDemo() {
  return (
    <div dir="rtl">
      <Button
        onClick={() =>
          toast('تم إنشاء الحدث', {
            action: {
              label: 'تراجع',
              onClick: () => console.log('Undo'),
            },
            description: 'الأحد، 3 ديسمبر 2023 الساعة 9:00 صباحاً',
          })
        }
        variant="outline">
        {'عرض الإشعار'}
      </Button>
    </div>
  )
}
