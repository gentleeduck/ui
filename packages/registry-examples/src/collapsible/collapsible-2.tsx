'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible className="flex w-[350px] flex-col gap-2" onOpenChange={setIsOpen} open={isOpen} dir="rtl">
      <div className="flex items-center justify-between gap-4 px-4">
        <h4 className="font-semibold text-sm">@peduarte قام بتمييز 3 مستودعات</h4>
        <CollapsibleTrigger size={'icon'}>
          <ChevronsUpDown aria-hidden="true" />
          <span className="sr-only">تبديل</span>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">@gentleduck/primitives</div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@gentleduck/variants</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
