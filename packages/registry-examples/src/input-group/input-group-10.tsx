import { ButtonGroup, ButtonGroupText } from '@gentleduck/registry-ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { Label } from '@gentleduck/registry-ui/label'
import { SendIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <ButtonGroup>
        <ButtonGroupText asChild>
          <Label htmlFor="endpoint">api/v1/</Label>
        </ButtonGroupText>
        <InputGroup>
          <InputGroupInput id="endpoint" />
          <InputGroupAddon align="inline-end">
            <SendIcon />
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </div>
  )
}
