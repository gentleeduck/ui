import { Button } from '@gentleduck/registry-ui/button'
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'

export default function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" arrowPadding={8} className="w-60">
        <p className="text-sm">Settings and configuration options for your account.</p>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  )
}
