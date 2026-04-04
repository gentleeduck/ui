import { Button } from '@gentleduck/registry-ui/button'
import { ChevronsRight } from 'lucide-react'

export default function Demo() {
  return (
    <Button aria-label="Inbox button with 23 notifications" secondIcon={<ChevronsRight />} type="button">
      Button
    </Button>
  )
}
