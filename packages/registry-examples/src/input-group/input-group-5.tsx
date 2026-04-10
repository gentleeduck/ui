import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { HelpCircle, InfoIcon } from 'lucide-react'

export default function Demo() {
  return (
    <TooltipProvider>
      <div className="grid w-full max-w-sm gap-4">
        <InputGroup>
          <InputGroupInput placeholder="Paste your SSH public key" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton aria-label="Info" size="icon-xs" variant="ghost">
                  <InfoIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent align="end" side="top">
                <p>Starts with ssh-rsa, ssh-ed25519, or ecdsa-sha2</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="https://hooks.example.com/events" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton aria-label="Help" size="icon-xs" variant="ghost">
                  <HelpCircle />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent align="end" side="top">
                <p>Webhook events are sent as POST requests</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="DATABASE_URL" />
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupAddon>
                <InputGroupButton aria-label="Help" size="icon-xs" variant="ghost">
                  <HelpCircle />
                </InputGroupButton>
              </InputGroupAddon>
            </TooltipTrigger>
            <TooltipContent align="end" side="top">
              <p>Environment variables are encrypted at rest</p>
            </TooltipContent>
          </Tooltip>
        </InputGroup>
      </div>
    </TooltipProvider>
  )
}
