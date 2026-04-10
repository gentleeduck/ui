'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import { ButtonGroup, MotionButtonGroup } from '@gentleduck/registry-ui/button-group'
import { MotionSelect, MotionSelectContent, SelectItem, SelectTrigger } from '@gentleduck/registry-ui/select'
import { ArrowRightIcon } from 'lucide-react'
import * as React from 'react'

const CURRENCIES = [
  { label: 'US Dollar', value: '$' },
  { label: 'Euro', value: '€' },
  { label: 'British Pound', value: '£' },
]

export default function Demo() {
  const [from, setFrom] = React.useState('$')
  const [to, setTo] = React.useState('€')
  const [amount, setAmount] = React.useState('£')

  return (
    <MotionButtonGroup>
      <ButtonGroup>
        <MotionSelect onValueChange={setFrom} value={from}>
          <SelectTrigger className="w-[70px] font-mono">{from}</SelectTrigger>
          <MotionSelectContent className="min-w-24">
            {CURRENCIES.map((c) => (
              <SelectItem key={`from-${c.value}`} value={c.value}>
                {c.value} <span className="text-muted-foreground">{c.label}</span>
              </SelectItem>
            ))}
          </MotionSelectContent>
        </MotionSelect>

        <MotionSelect onValueChange={setTo} value={to}>
          <SelectTrigger className="w-[70px] font-mono">{to}</SelectTrigger>
          <MotionSelectContent className="min-w-24">
            {CURRENCIES.map((c) => (
              <SelectItem key={`to-${c.value}`} value={c.value}>
                {c.value} <span className="text-muted-foreground">{c.label}</span>
              </SelectItem>
            ))}
          </MotionSelectContent>
        </MotionSelect>

        <MotionSelect onValueChange={setAmount} value={amount}>
          <SelectTrigger className="w-[70px] font-mono">{amount}</SelectTrigger>
          <MotionSelectContent className="min-w-24">
            {CURRENCIES.map((c) => (
              <SelectItem key={`amount-${c.value}`} value={c.value}>
                {c.value} <span className="text-muted-foreground">{c.label}</span>
              </SelectItem>
            ))}
          </MotionSelectContent>
        </MotionSelect>
      </ButtonGroup>

      <MotionButton aria-label="Send" size="icon" variant="outline">
        <ArrowRightIcon />
      </MotionButton>
    </MotionButtonGroup>
  )
}
