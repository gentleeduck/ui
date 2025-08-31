import { Toggle } from '@gentleduck/registry-ui-duckui/toggle'
import { Bold } from 'lucide-react'

export default function Toggle1Demo() {
  return (
    <Toggle aria-label="Toggle bold" variant={'outline'}>
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}
