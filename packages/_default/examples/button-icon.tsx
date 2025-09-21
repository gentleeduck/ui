import { ChevronRight } from 'lucide-react'

import { Button } from '@/registry/default/ui/button'

export default function ButtonIcon() {
  return (
    <Button size="icon" variant="outline">
      <ChevronRight />
    </Button>
  )
}
