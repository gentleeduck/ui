import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { Kbd, KbdGroup } from '@gentleduck/registry-ui/kbd'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'

export default function Demo() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-4">
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline">
                Undo
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                Undo{' '}
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Z</Kbd>
                </KbdGroup>
              </div>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline">
                Redo
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                Redo{' '}
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Y</Kbd>
                </KbdGroup>
              </div>
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>
      </div>
    </TooltipProvider>
  )
}
