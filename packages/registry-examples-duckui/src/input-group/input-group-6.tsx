import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@gentleduck/registry-ui-duckui/input-group'
import { IconBrandJavascript, IconCopy, IconCornerDownLeft, IconRefresh } from '@tabler/icons-react'

export default function InputGroupTextareaExample() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea
          className="min-h-[200px]"
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton className="ml-auto" size="sm" variant="default">
            Run <IconCornerDownLeft />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-medium font-mono">
            <IconBrandJavascript />
            script.js
          </InputGroupText>
          <InputGroupButton className="ml-auto" size="icon-xs">
            <IconRefresh />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" variant="ghost">
            <IconCopy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
