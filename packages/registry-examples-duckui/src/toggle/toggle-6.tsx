import { Toggle } from '@gentleduck/registry-ui-duckui/toggle'
import { Italic } from 'lucide-react'

export default function Toggle1Demo() {
  return (
    <Toggle aria-label="Toggle italic" size="lg">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
