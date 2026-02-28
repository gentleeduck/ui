import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '@/lib'
import { Popover, PopoverContent, PopoverTrigger, Separator } from '../..'
import { turnIntoComponent } from '../mdx-editor'
import { Button } from '../ui/Button'
import { TurnIntoPickerProps } from './TurnIntoPicker.types'

export const TurnIntoPicker = ({ onChange, value, commands, states }: TurnIntoPickerProps) => {
  const [valueState, setValueState] = useState(value)

  // const currentValue = turnIntoComponent.find((size) => size.value === `is${value}`)

  return (
    <Popover>
      <PopoverTrigger asChild className="turn__into__picker__trigger" value={value}>
        <Button className="flex justify-between" variant="outline">
          {valueState} <ChevronDown className="size-[16px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="turn__into__picker__content" defaultValue={'Medium'}>
        <span>Turn into </span>
        <Separator className="mb-1" />
        {turnIntoComponent.map((item, idx) => (
          <Button
            className={cn('turn__into__picker__content__button', states[item.value] && 'bg-red-100')}
            key={idx}
            onClick={commands[item.action] as MouseEvent}
            onMouseDown={() => setValueState(item.label)}
            variant="ghost">
            <img className="w-[22px]" src={item.img} />
            <span>{item.label}</span>

            <div className="turn__into__picker__content__button__hover__menu">
              <img className="w-[22px]" src={item.discriptionImg} />
              <span>{item.discription}</span>
            </div>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
