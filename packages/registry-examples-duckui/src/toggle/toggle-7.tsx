import { Toggle } from '@gentleduck/registry-ui-duckui/toggle'
import { Underline } from 'lucide-react'

export default function Toggle1Demo() {
  return (
    <Toggle aria-label="Toggle underline" disabled>
      <Underline className="h-4 w-4" />
    </Toggle>
  )
}
