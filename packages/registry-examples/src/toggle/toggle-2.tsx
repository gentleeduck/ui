import { Toggle } from '@gentleduck/registry-ui/toggle'
import { Italic } from 'lucide-react'

export default function Demo() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
