import { Button } from '@gentleduck/registry-ui/button'
import { Inbox } from 'lucide-react'

export default function Demo() {
  return (
    <div className="block">
      <Button aria-label="Inbox button" icon={<Inbox />} type="button" variant="expandIcon">
        Button
      </Button>
    </div>
  )
}
