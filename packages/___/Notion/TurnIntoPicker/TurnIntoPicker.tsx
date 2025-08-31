import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger, Separator } from '../..'
import { TurnIntoPickerProps } from './TurnIntoPicker.types'
import { cn } from '@/lib'
import { turnIntoComponent } from '../mdx-editor'
import { ChevronDown } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/Button'

export const TurnIntoPicker = ({ onChange, value, commands, states }: TurnIntoPickerProps) => {
  const [valueState, setValueState] = useState(value)

  // const currentValue = turnIntoComponent.find((size) => size.value === `is${value}`)

  return (
    <Popover>
      <PopoverTrigger asChild className="turn__into__picker__trigger" value={value}>
        <Button variant="outline" className="flex justify-between">
          {valueState} <ChevronDown className="size-[16px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="turn__into__picker__content" defaultValue={'Medium'}>
        <span>Turn into </span>
        <Separator className="mb-1" />
        {turnIntoComponent.map((item, idx) => (
          <Button
            key={idx}
            variant="ghost"
            className={cn('turn__into__picker__content__button', states[item.value] && 'bg-red-100')}
            onMouseDown={() => setValueState(item.label)}
            onClick={commands[item.action] as MouseEvent}>
            <img src={item.img} className="w-[22px]" />
            <span>{item.label}</span>

            <div className="turn__into__picker__content__button__hover__menu">
              <img src={item.discriptionImg} className="w-[22px]" />
              <span>{item.discription}</span>
            </div>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
