'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'
import { Textarea } from '@gentleduck/registry-ui/textarea'
import * as React from 'react'

const plans = [
  {
    description: 'Perfect for small businesses.',
    id: 'starter',
    name: 'Starter Plan',
    price: '$10',
  },
  {
    description: 'More features and storage.',
    id: 'pro',
    name: 'Pro Plan',
    price: '$20',
  },
] as const

export function CardsForms() {
  const id = React.useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Upgrade your subscription</CardTitle>
        <CardDescription className="text-balance">
          You are currently on the free plan. Upgrade to the pro plan to get access to all features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor={`${id}-name`}>Name</Label>
              <Input id={`${id}-name`} placeholder="Evil Rabbit" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} placeholder="example@acme.com" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-card-number`}>Card Number</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_80px_60px]">
              <Input className="col-span-2 md:col-span-1" id={`${id}-card-number`} placeholder="1234 1234 1234 1234" />
              <Input aria-label="Expiry date" id={`${id}-card-number-expiry`} placeholder="MM/YY" />
              <Input aria-label="CVC" id={`${id}-card-number-cvc`} placeholder="CVC" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <legend className="font-medium text-sm">Plan</legend>
            <p className="text-muted-foreground text-sm">Select the plan that best fits your needs.</p>
            <RadioGroup className="grid gap-3 md:grid-cols-2" defaultValue="starter">
              {plans.map((plan) => (
                <Label
                  className="flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20"
                  key={plan.id}>
                  <RadioGroupItem className="data-[state=checked]:border-primary" value={plan.id} />
                  <div className="grid gap-1 font-normal">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-balance text-muted-foreground text-xs leading-snug">{plan.description}</div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-notes`}>Notes</Label>
            <Textarea id={`${id}-notes`} placeholder="Enter notes" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-terms`} />
              <Label className="font-normal" htmlFor={`${id}-terms`}>
                I agree to the terms and conditions
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox defaultChecked id={`${id}-newsletter`} />
              <Label className="font-normal" htmlFor={`${id}-newsletter`}>
                Allow us to send you emails
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button size="sm">Upgrade Plan</Button>
      </CardFooter>
    </Card>
  )
}
