import { Bold, Italic, Underline } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@/registry/default/ui/toggle-group'

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup size={'sm'} type="multiple">
      <ToggleGroupItem aria-label="Toggle bold" value="bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Toggle italic" value="italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Toggle underline" value="underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
