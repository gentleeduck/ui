import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@gentleduck/registry-ui-duckui/input-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { HelpCircle, InfoIcon } from 'lucide-react'

export default function InputGroupTooltip() {
  return (
    <TooltipProvider>
      <div className="grid w-full max-w-sm gap-4">
        <InputGroup>
          <InputGroupInput placeholder="Enter password" type="password" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton aria-label="Info" size="icon-xs" variant="ghost">
                  <InfoIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent align="end" side="top">
                <p>Password must be at least 8 characters</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="Your email address" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton aria-label="Help" size="icon-xs" variant="ghost">
                  <HelpCircle />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent align="end" side="top">
                <p>We&apos;ll use this to send you notifications</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="Enter API key" />
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupAddon>
                <InputGroupButton aria-label="Help" size="icon-xs" variant="ghost">
                  <HelpCircle />
                </InputGroupButton>
              </InputGroupAddon>
            </TooltipTrigger>
            <TooltipContent align="end" side="top">
              <p>Click for help with API keys</p>
            </TooltipContent>
          </Tooltip>
        </InputGroup>
      </div>
    </TooltipProvider>
  )
}
