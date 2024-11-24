'use client'

import { Button } from '@/registry/registry-ui-components/button'
import { ToastAction, useToast } from '@/registry/registry-ui-components/toast'

export default function Toast1Demo() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: 'Scheduled: Catch up ',
          description: 'Friday, February 10, 2023 at 5:57 PM',
          action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
        })
      }}
    >
      Add to calendar
    </Button>
  )
}
