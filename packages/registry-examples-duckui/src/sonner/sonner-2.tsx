'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

export default function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast('Actions have been triggered', {
          className: 'gap-3',
          description: `you have clicked the 'super button' button, and btw i can be loading.`,
          icon: <ShieldAlert />,
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        })
      }>
      Show Toast
    </Button>
  )
}
