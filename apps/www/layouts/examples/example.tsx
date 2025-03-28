'use client'

import {
  Button,
  ButtonTooltip,
  Tooltip,
  TooltipContent,
  TooltipExample,
  TooltipTrigger,
} from '@gentelduck/registry-ui-duckui/button'
import { TooltipProvider } from '@gentelduck/registry-ui-duckui/tooltip'
import { Calendar, Grab, LineChart } from 'lucide-react'
import { Button as BButton } from '../../app/page'

export function MainExample() {
  // <Button
  //   variant={'outline'}
  //   size={'default'}
  //   icon={<Calendar />}
  //   // asChild
  //   label={[ButtonTooltip, , { open: true }]}
  //   // command{[]}
  // >
  //   <div>Mettings</div>
  // </Button>

  return <>
  <TooltipExample/>
  </>
  return (
    <div className='flex flex-col gap-3 items-center'>
      <Tooltip>
        <TooltipTrigger className='mb-12'>fuckyou</TooltipTrigger>
        <TooltipContent>fuckyou</TooltipContent>
      </Tooltip>

      <Button variant={'outline'} size={'default'} icon={<Calendar />}>
        Mettings
      </Button>
      <div className='relative'>
        <Grab className='size-4 absolute -top-2 right-8 z-10 fill-white' />

        <Button
          variant={'outline'}
          size={'default'}
          className='bg-secondary'
          icon={<LineChart />}
        >
          Analytics
        </Button>
      </div>
    </div>
  )
}
