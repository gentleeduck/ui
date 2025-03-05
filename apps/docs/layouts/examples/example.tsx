'use client'

import { Button } from '@duck/registry-ui-duckui/button'
import { Calendar, Grab, LineChart } from 'lucide-react'
import { Card } from '../../../../packages/_oldstuff_refactor/ui/ShadcnUI'

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

      <Card className="w-[500px] h-[584px]"></Card>
    </div>
  )
}
