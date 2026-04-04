'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Settings } from 'lucide-react'

export default function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:ring-2 data-[state=open]:ring-ring">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Preferences</h4>
          <p className="text-muted-foreground text-sm">The trigger stays active while this is open.</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
