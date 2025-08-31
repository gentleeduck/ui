import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'

export default function ButtonDemo() {
  return (
    <Button loading={true} icon={<Inbox />} aria-label="Loading inbox button" aria-busy="true" type="button">
      <span>Button</span>
    </Button>
  )
}
