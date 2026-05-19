'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { toast } from 'sonner'

export default function Demo() {
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
            style: {
              direction: 'rtl',
              textAlign: 'right',
            },
          })
        }
        variant="outline">
        {'عرض الإشعار'}
      </Button>
    </div>
  )
}
