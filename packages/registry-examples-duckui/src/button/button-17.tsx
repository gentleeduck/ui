import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ChevronsRight } from 'lucide-react'

export default function ButtonDemo() {
  return (
    <Button aria-label="Inbox button with 23 notifications" secondIcon={<ChevronsRight />} type="button">
      Button
    </Button>
  )
}
