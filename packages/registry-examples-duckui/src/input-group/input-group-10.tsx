import { Link2Icon } from 'lucide-react'

import { ButtonGroup, ButtonGroupText } from '@gentleduck/registry-ui-duckui/button-group'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gentleduck/registry-ui-duckui/input-group'
import { Label } from '@gentleduck/registry-ui-duckui/label'

export default function InputGroupButtonGroup() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <ButtonGroup>
        <ButtonGroupText asChild>
          <Label htmlFor="url">https://</Label>
        </ButtonGroupText>
        <InputGroup>
          <InputGroupInput id="url" />
          <InputGroupAddon align="inline-end">
            <Link2Icon />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroupText>.com</ButtonGroupText>
      </ButtonGroup>
    </div>
  )
}
