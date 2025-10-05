'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ButtonGroup } from '@gentleduck/registry-ui-duckui/button-group'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@gentleduck/registry-ui-duckui/select'
import { ArrowRightIcon } from 'lucide-react'
import * as React from 'react'

const CURRENCIES = [
  {
    label: 'US Dollar',
    value: '$',
  },
  {
    label: 'Euro',
    value: '€',
  },
  {
    label: 'British Pound',
    value: '£',
  },
]

export function ButtonGroupSelect() {
  const [currency, setCurrency] = React.useState('$')

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Select onValueChange={setCurrency} value={currency}>
          <SelectTrigger className="font-mono">{currency}</SelectTrigger>
          <SelectContent className="min-w-24">
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.value} <span className="text-muted-foreground">{currency.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input pattern="[0-9]*" placeholder="10.00" />
      </ButtonGroup>
      <ButtonGroup>
        <Button aria-label="Send" size="icon" variant="outline">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
