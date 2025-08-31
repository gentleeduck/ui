import { ToggleGroup, ToggleGroupItem } from '@gentleduck/registry-ui-duckui/toggle-group'
import { Bold, Italic, Underline } from 'lucide-react'

export default function ToggleGroup1Demo() {
  return (
    <ToggleGroup type="single">
      <ToggleGroupItem value="bold" aria-label="Toggle bold" disabled>
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic" disabled>
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline" disabled>
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
