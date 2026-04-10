import { InputGroup, InputGroupAddon, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { Kbd } from '@gentleduck/registry-ui/kbd'
import { SearchIcon } from 'lucide-react'

export default function Demo() {
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
