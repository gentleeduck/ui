import { Toggle } from '@gentleduck/registry-ui/toggle'
import { Underline } from 'lucide-react'

export default function Demo() {
  return (
    <Toggle aria-label="Toggle underline" disabled>
      <Underline className="h-4 w-4" />
    </Toggle>
  )
}
