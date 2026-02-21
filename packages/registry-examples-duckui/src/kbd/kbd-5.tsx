import { InputGroup, InputGroupAddon, InputGroupInput } from '@gentleduck/registry-ui-duckui/input-group'
import { Kbd } from '@gentleduck/registry-ui-duckui/kbd'
import { SearchIcon } from 'lucide-react'

export default function KbdDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Quick find..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>Ctrl</Kbd>
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
