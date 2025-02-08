'use client'

import { ToastAction, useToast } from '@/registry/registry-ui-components/toast'
import { Button } from '@/registry/registry-ui-components/button'

export default function Toast4Demo() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }}
    >
      Show Toast
    </Button>
  )
}
