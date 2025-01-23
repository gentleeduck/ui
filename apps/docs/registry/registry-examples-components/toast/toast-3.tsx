'use client'

import { useToast } from '@/registry/registry-ui-components/toast'
import { Button } from '@/registry/registry-ui-components/button'

export default function Toast3Demo() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        })
      }}
    >
      Show Toast
    </Button>
  )
}
