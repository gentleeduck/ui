import { InputGroup, InputGroupAddon, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { AtSignIcon, CheckCircleIcon, GlobeIcon, LinkIcon, PackageIcon, PhoneIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="+1 (555) 000-0000" type="tel" />
        <InputGroupAddon>
          <PhoneIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Enter tracking number" />
        <InputGroupAddon>
          <PackageIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Look up domain" />
        <InputGroupAddon>
          <GlobeIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <CheckCircleIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="username" />
        <InputGroupAddon>
          <AtSignIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <LinkIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
