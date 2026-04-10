'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'

export default function Demo() {
  return (
    <Collapsible className="w-72 space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="font-semibold text-sm">3 dependencies</h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">@gentleduck/primitives</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@gentleduck/variants</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@gentleduck/libs</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
