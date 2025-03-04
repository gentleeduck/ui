'use client'

import { Button } from '@duck/registry-ui-duckui/button'
import { TooltipProvider } from '@duck/registry-ui-duckui/tooltip'
import { Calendar, Grab, LineChart } from 'lucide-react'
import { Button as BButton } from '../../app/page'

export function MainExample() {
  return (
    <div className="flex flex-col gap-3 items-center">
      <Button variant={'outline'} size={'default'} icon={<Calendar />}>
        Mettings
      </Button>
      <div className="relative">
        <Grab className="size-4 absolute -top-2 right-8 z-10 fill-white" />

        <Button
          variant={'outline'}
          size={'default'}
          className="bg-secondary"
          icon={<LineChart />}
        >
          Analytics
        </Button>
      </div>

      <div className="w-[500px] h-[584px]"></div>

      <Button variant={'outline'} size={'icon'} icon={<Calendar />}>
        Mettings
      </Button>
      <BButton variant={'outline'}>
        <Calendar />
        Mettings
      </BButton>
      <Button variant={'outline'} size={'default'} icon={<Calendar />}>
        Mettings
      </Button>
    </div>
  )
}
