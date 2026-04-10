'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@gentleduck/registry-ui/select'
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
    <ButtonGroup>
      <ButtonGroup>
        <Select onValueChange={setFrom} value={from}>
          <SelectTrigger className="w-[70px] font-mono">{from}</SelectTrigger>
          <SelectContent className="min-w-24">
            {CURRENCIES.map((c) => (
              <SelectItem key={`from-${c.value}`} value={c.value}>
                {c.value} <span className="text-muted-foreground">{c.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setTo} value={to}>
          <SelectTrigger className="w-[70px] font-mono">{to}</SelectTrigger>
          <SelectContent className="min-w-24">
            {CURRENCIES.map((c) => (
              <SelectItem key={`to-${c.value}`} value={c.value}>
                {c.value} <span className="text-muted-foreground">{c.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setAmount} value={amount}>
          <SelectTrigger className="w-[70px] font-mono">{amount}</SelectTrigger>
          <SelectContent className="min-w-24">
            {CURRENCIES.map((c) => (
              <SelectItem key={`amount-${c.value}`} value={c.value}>
                {c.value} <span className="text-muted-foreground">{c.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ButtonGroup>
      <ButtonGroup>
        <Button aria-label="Send" size="icon" variant="outline">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
