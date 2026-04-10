'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side={'top'} className="w-80">
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the values for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width">Width</Label>
                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxWidth">Max</Label>
                <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxHeight">Max</Label>
                <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side={'right'} className="w-80">
          {/* same content */}
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the values for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width-r">Width</Label>
                <Input id="width-r" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxWidth-r">Max</Label>
                <Input id="maxWidth-r" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height-r">Height</Label>
                <Input id="height-r" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxHeight-r">Max</Label>
                <Input id="maxHeight-r" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side={'bottom'} className="w-80">
          {/* same content */}
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the values for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width-b">Width</Label>
                <Input id="width-b" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxWidth-b">Max</Label>
                <Input id="maxWidth-b" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height-b">Height</Label>
                <Input id="height-b" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxHeight-b">Max</Label>
                <Input id="maxHeight-b" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side={'left'} className="w-80">
          {/* same content */}
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the values for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width-l">Width</Label>
                <Input id="width-l" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxWidth-l">Max</Label>
                <Input id="maxWidth-l" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height-l">Height</Label>
                <Input id="height-l" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="maxHeight-l">Max</Label>
                <Input id="maxHeight-l" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
