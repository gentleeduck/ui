'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@gentleduck/registry-ui/input-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { AudioLinesIcon, PlusIcon } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [voiceEnabled, setVoiceEnabled] = React.useState(false)

  return (
    <TooltipProvider>
      <ButtonGroup className="[--radius:9999rem]">
        <ButtonGroup>
          <Button aria-label="Add" size="icon" variant="outline">
            <PlusIcon aria-hidden="true" />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput
              disabled={voiceEnabled}
              placeholder={voiceEnabled ? 'Record and send audio...' : 'Send a message...'}
            />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    aria-label="Voice Mode"
                    aria-pressed={voiceEnabled}
                    className="data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
                    data-active={voiceEnabled}
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    size="icon-xs">
                    <AudioLinesIcon aria-hidden="true" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>Voice Mode</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </ButtonGroup>
      </ButtonGroup>
    </TooltipProvider>
  )
}
