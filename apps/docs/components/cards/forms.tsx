'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gentleduck/registry-ui-duckui/card'
import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui-duckui/radio-group'
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upgrade your subscription</CardTitle>
        <CardDescription className="text-balance">
          You are currently on the free plan. Upgrade to the pro plan to get access to all features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Evil Rabbit" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="example@acme.com" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-number">Card Number</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_80px_60px]">
              <Input className="col-span-2 md:col-span-1" id="card-number" placeholder="1234 1234 1234 1234" />
              <Input id="card-number-expiry" placeholder="MM/YY" />
              <Input id="card-number-cvc" placeholder="CVC" />
            </div>
          </div>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium">Plan</legend>
            <p className="text-muted-foreground text-sm">Select the plan that best fits your needs.</p>
            <RadioGroup className="grid gap-3 md:grid-cols-2" defaultValue="starter">
              {plans.map((plan) => (
                <Label
                  className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20 flex items-start gap-3 rounded-lg border p-3"
                  key={plan.id}>
                  <RadioGroupItem className="data-[state=checked]:border-primary" id={plan.name} value={plan.id} />
                  <div className="grid gap-1 font-normal">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-muted-foreground text-xs leading-snug text-balance">{plan.description}</div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Enter notes" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <Label className="font-normal" htmlFor="terms">
                I agree to the terms and conditions
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox defaultChecked id="newsletter" />
              <Label className="font-normal" htmlFor="newsletter">
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
