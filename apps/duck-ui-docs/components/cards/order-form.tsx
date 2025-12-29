'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui-duckui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import { AlertTriangle, Check, Lock } from 'lucide-react'
import { useState } from 'react'

export function OrderForm() {
  const [formData, setFormData] = useState({
    cardNumber: '1234 5678 9012 3456',
    city: 'New York',
    cvv: '123',
    dataUsage: '50-250mb',
    email: 'duckui@duck.com',
    expiryMonth: '12',
    expiryYear: '2025',
    firstName: 'wild',
    lastName: 'duck',
    promoCode: '299',
    radioTech: '4g-lte',
    signUpOffers: false,
    state: 'california',
    streetAddress: '123 Main St',
    suite: 'Apt 1',
    zip: '10001',
    zipCode: '10001',
  })

  const [errors, setErrors] = useState({
    email: false,
  })

  const [promoValid, setPromoValid] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Email validation
    if (field === 'email') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)
      setErrors((prev) => ({ ...prev, email: !isValid && value !== '' }))
    }

    // Promo code validation
    if (field === 'promoCode') {
      setPromoValid(value === 'SIMS4YOU')
    }
  }

  return (
    <div className="col-span-4 w-full">
      <Card className="py-6">
        <CardHeader className="sr-only">
          <CardTitle className="sr-only">Place Your Order</CardTitle>
        </CardHeader>
        <CardContent className="px-6 space-y-6">
          {/* Email Address */}
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="email2">Email address</Label>
            <div className="relative">
              <Input
                className={errors.email ? 'border-red-500' : ''}
                id="email2"
                onChange={(e) => handleInputChange('email', e.currentTarget.value)}
                placeholder="your@email.com"
                type="email"
                value={formData.email}
              />
              {errors.email && <AlertTriangle className="absolute right-3 top-3 h-4 w-4 text-red-500" />}
            </div>
            {errors.email && <p className="text-sm text-red-500 flex items-center gap-1">INVALID EMAIL ADDRESS</p>}
          </div>

          {/* Full Name */}
          <div className="space-y-2 flex flex-col">
            <Label>Full name</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                onChange={(e) => handleInputChange('firstName', e.currentTarget.value)}
                placeholder="First name"
                value={formData.firstName}
              />
              <Input
                onChange={(e) => handleInputChange('lastName', e.currentTarget.value)}
                placeholder="Last name"
                value={formData.lastName}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2 flex flex-col">
            <Label>Address</Label>
            <Input
              onChange={(e) => handleInputChange('streetAddress', e.currentTarget.value)}
              placeholder="Street Address"
              value={formData.streetAddress}
            />
            <Input
              onChange={(e) => handleInputChange('suite', e.currentTarget.value)}
              placeholder="Office, Suite, Apt."
              value={formData.suite}
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm" htmlFor="city">
                  City
                </Label>
                <Input
                  id="city"
                  onChange={(e) => handleInputChange('city', e.currentTarget.value)}
                  value={formData.city}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm" htmlFor="state">
                  State
                </Label>
                <Select onValueChange={(value) => handleInputChange('state', value)} value={formData.state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="illinois">Illinois</SelectItem>
                    <SelectItem value="california">California</SelectItem>
                    <SelectItem value="texas">Texas</SelectItem>
                    <SelectItem value="newyork">New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm" htmlFor="zip">
                  Zip
                </Label>
                <Input
                  id="zip"
                  onChange={(e) => handleInputChange('zip', e.currentTarget.value)}
                  value={formData.zip}
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2 flex flex-col">
            <Label>Payment details</Label>
            <div className="relative">
              <div className="flex items-center gap-2 px-3 border rounded-md">
                <Lock className="size-8" />
                <Input
                  className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  onChange={(e) => handleInputChange('cardNumber', e.currentTarget.value)}
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                />
                <div className="flex items-center gap-8">
                  <Input
                    className="border-0 bg-transparent p-0 w-16 focus-visible:ring-0"
                    onChange={(e) => {
                      const [month, year] = e.currentTarget.value.split('/')
                      handleInputChange('expiryMonth', month || '')
                      handleInputChange('expiryYear', year || '')
                    }}
                    placeholder="MM/YY"
                    value={`${formData.expiryMonth}/${formData.expiryYear}`}
                  />
                  <Input
                    className="border-0 bg-transparent p-0 w-12 focus-visible:ring-0"
                    onChange={(e) => handleInputChange('cvv', e.currentTarget.value)}
                    placeholder="CVV"
                    value={formData.cvv}
                  />
                  <Input
                    className="border-0 bg-transparent p-0 w-16 focus-visible:ring-0"
                    onChange={(e) => handleInputChange('zipCode', e.currentTarget.value)}
                    placeholder="ZIP"
                    value={formData.zipCode}
                  />
                </div>
              </div>
              <p className="text-xs mt-1">ENCRYPTED AND SECURED</p>
            </div>
          </div>

          {/* Radio Technologies */}
          <div className="space-y-2 flex flex-col">
            <Label>What radio technologies are you using?</Label>
            <RadioGroup
              className="flex gap-6 flex-row"
              onValueChange={(value) => handleInputChange('radioTech', value)}
              value={formData.radioTech}>
              <RadioGroupItem value="2g">2G</RadioGroupItem>
              <RadioGroupItem value="3g">3G</RadioGroupItem>
              <RadioGroupItem value="4g-lte">4G LTE</RadioGroupItem>
              <RadioGroupItem value="cat-m">CAT M</RadioGroupItem>
            </RadioGroup>
          </div>

          {/* Data Usage */}
          <div className="space-y-2 flex flex-col">
            <Label>How much data do you expect to use each month?</Label>
            <RadioGroup
              className="flex flex-row gap-6"
              onValueChange={(value) => handleInputChange('dataUsage', value)}
              value={formData.dataUsage}>
              <RadioGroupItem value="0-50mb">0-50 MB</RadioGroupItem>
              <RadioGroupItem value="50-250mb">50 MB-250 MB</RadioGroupItem>
              <RadioGroupItem value="250mb-1gb">250 MB-1 GB</RadioGroupItem>
              <RadioGroupItem value="1gb+">1 GB+</RadioGroupItem>
            </RadioGroup>
          </div>

          {/* Promo Code */}
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="promo">Promo code</Label>
            <div className="relative">
              <Input
                className={promoValid ? 'border-green-500' : ''}
                id="promo"
                onChange={(e) => handleInputChange('promoCode', e.currentTarget.value)}
                value={formData.promoCode}
              />
              {promoValid && <Check className="absolute right-3 top-3 h-4 w-4" />}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between">
            {/* Sign up checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.signUpOffers}
                className="mr-2"
                id="offers"
                onCheckedChange={(checked) => handleInputChange('signUpOffers', checked as boolean)}
              />
              <Label className="text-sm" htmlFor="offers">
                Sign me up for annoying offers
              </Label>
            </div>
            {/* Submit Button */}
            <Button className="w-fit">Place order</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
