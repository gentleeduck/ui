'use client'

import { useToast } from '@/registry/default/hooks/use-toast'
import { Button } from '@/registry/default/ui/button'

export default function ToastSimple() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          description: 'Your message has been sent.',
        })
      }}
      variant="outline">
      Show Toast
    </Button>
  )
}
