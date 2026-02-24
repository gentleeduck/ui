import { Loader } from 'lucide-react'

import { Button } from '@/registry/default/ui/button'

export function ButtonLoading() {
  return (
    <Button disabled>
      <Loader className="animate-spin" />
      Please wait
    </Button>
  )
}
