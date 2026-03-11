'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import * as React from 'react'

const plans = [
  {
    description: 'Perfect for small businesses.',
    id: 'starter',
    name: 'Starter Plan',
    price: '$10',
  },
  {
    description: 'Advanced features with more storage.',
    id: 'pro',
    name: 'Pro Plan',
    price: '$20',
  },
] as const

export function CardsPaymentMethod() {
  const id = React.useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Add a new payment method to your account.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor={`${id}-name`}>Name</Label>
          <Input id={`${id}-name`} placeholder="First Last" />
        </div>
        <div className="flex flex-col gap-3">
          <legend className="font-medium text-sm">Plan</legend>
          <p className="text-muted-foreground text-sm">Select the plan that best fits your needs.</p>
          <RadioGroup className="grid gap-3" defaultValue="starter">
            {plans.map((plan) => (
              <Label
                className="flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary/5"
                key={plan.id}>
                <RadioGroupItem className="data-[state=checked]:border-primary" value={plan.id} />
                <div className="grid gap-1 font-normal">
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-balance pr-2 text-muted-foreground text-xs leading-snug">{plan.description}</div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor={`${id}-number`}>Card number</Label>
          <Input id={`${id}-number`} placeholder="" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor={`${id}-month`}>Expires</Label>
            <Select>
              <SelectTrigger aria-label="Month" className="w-full" id={`${id}-month`}>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor={`${id}-year`}>Year</Label>
            <Select>
              <SelectTrigger aria-label="Year" className="w-full" id={`${id}-year`}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i
                  return (
                    <SelectItem key={year} value={`${year}`}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor={`${id}-cvc`}>CVC</Label>
            <Input id={`${id}-cvc`} placeholder="CVC" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Continue</Button>
      </CardFooter>
    </Card>
  )
}
