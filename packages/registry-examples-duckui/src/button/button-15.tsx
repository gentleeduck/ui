import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'

export default function ButtonDemo() {
  return (
    <Button aria-label="Inbox button" icon={<Inbox />} type="button">
      Button
    </Button>
  )
}
