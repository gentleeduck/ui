import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'

export default function Button24Demo() {
  return (
    <div className="block">
      <Button aria-label="Inbox button" type="button" variant="expand_icon" icon={<Inbox />}>
        Button
      </Button>
    </div>
  )
}
