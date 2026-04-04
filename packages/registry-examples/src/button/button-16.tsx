import { Button } from '@gentleduck/registry-ui/button'
import { Inbox } from 'lucide-react'

export default function Demo() {
  return (
    <Button aria-busy="true" aria-label="Loading inbox button" icon={<Inbox />} loading={true} type="button">
      <span>Button</span>
    </Button>
  )
}
