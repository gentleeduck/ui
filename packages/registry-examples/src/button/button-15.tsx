import { Button } from '@gentleduck/registry-ui/button'
import { Inbox } from 'lucide-react'

export default function Demo() {
  return (
    <Button aria-label="Inbox button" icon={<Inbox />} type="button">
      Button
    </Button>
  )
}
