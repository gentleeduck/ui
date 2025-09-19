import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'

export default function ButtonDemo() {
  return (
    <Button aria-busy="true" aria-label="Loading inbox button" icon={<Inbox />} loading={true} type="button">
      <span>Button</span>
    </Button>
  )
}
