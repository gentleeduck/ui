import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'

export default function ButtonDemo() {
  return (
    <Button icon={<Inbox />} aria-label="Inbox button" type="button">
      Button
    </Button>
  )
}
