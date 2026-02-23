'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { toast } from 'sonner'

export default function SonnerRtlDemo() {
  return (
    <div dir="rtl">
      <Button
        onClick={() =>
          toast('\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u062F\u062B', {
            action: {
              label: '\u062A\u0631\u0627\u062C\u0639',
              onClick: () => console.log('Undo'),
            },
            description:
              '\u0627\u0644\u0623\u062D\u062F\u060C 3 \u062F\u064A\u0633\u0645\u0628\u0631 2023 \u0627\u0644\u0633\u0627\u0639\u0629 9:00 \u0635\u0628\u0627\u062D\u0627\u064B',
          })
        }
        variant="outline">
        {'\u0639\u0631\u0636 \u0627\u0644\u0625\u0634\u0639\u0627\u0631'}
      </Button>
    </div>
  )
}
