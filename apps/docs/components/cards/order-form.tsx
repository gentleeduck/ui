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
    email: 'duckui@duck.com',
    firstName: 'wild',
    lastName: 'duck',
    streetAddress: '123 Main St',
    suite: 'Apt 1',
    city: 'New York',
    state: 'california',
    zip: '10001',
    cardNumber: '1234 5678 9012 3456',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    zipCode: '10001',
    radioTech: '4g-lte',
    dataUsage: '50-250mb',
    promoCode: '299',
    signUpOffers: false,
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
    <div className="mx-auto col-span-3">
      <Card className="py-6">
        <CardHeader className="sr-only">
          <CardTitle className="sr-only">Place Your Order</CardTitle>
        </CardHeader>
        <CardContent className="px-6 space-y-6">
          {/* Email Address */}
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.currentTarget.value)}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="your@email.com"
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
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.currentTarget.value)}
              />
              <Input
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.currentTarget.value)}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2 flex flex-col">
            <Label>Address</Label>
            <Input
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={(e) => handleInputChange('streetAddress', e.currentTarget.value)}
            />
            <Input
              placeholder="Office, Suite, Apt."
              value={formData.suite}
              onChange={(e) => handleInputChange('suite', e.currentTarget.value)}
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="city" className="text-sm">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.currentTarget.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="state" className="text-sm">
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
                <Label htmlFor="zip" className="text-sm">
                  Zip
                </Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange('zip', e.currentTarget.value)}
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
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.currentTarget.value)}
                  className="border-0 bg-transparent p-0 focus-visible:ring-0"
                />
                <div className="flex items-center gap-8">
                  <Input
                    placeholder="MM/YY"
                    value={`${formData.expiryMonth}/${formData.expiryYear}`}
                    onChange={(e) => {
                      const [month, year] = e.currentTarget.value.split('/')
                      handleInputChange('expiryMonth', month || '')
                      handleInputChange('expiryYear', year || '')
                    }}
                    className="border-0 bg-transparent p-0 w-16 focus-visible:ring-0"
                  />
                  <Input
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.currentTarget.value)}
                    className="border-0 bg-transparent p-0 w-12 focus-visible:ring-0"
                  />
                  <Input
                    placeholder="ZIP"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.currentTarget.value)}
                    className="border-0 bg-transparent p-0 w-16 focus-visible:ring-0"
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
              value={formData.radioTech}
              onValueChange={(value) => handleInputChange('radioTech', value)}
              className="flex gap-6 flex-row">
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
              value={formData.dataUsage}
              onValueChange={(value) => handleInputChange('dataUsage', value)}
              className="flex flex-row gap-6">
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
                id="promo"
                value={formData.promoCode}
                onChange={(e) => handleInputChange('promoCode', e.currentTarget.value)}
                className={promoValid ? 'border-green-500' : ''}
              />
              {promoValid && <Check className="absolute right-3 top-3 h-4 w-4" />}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between">
            {/* Sign up checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="offers"
                className="mr-2"
                checked={formData.signUpOffers}
                onCheckedChange={(checked) => handleInputChange('signUpOffers', checked as boolean)}
              />
              <Label htmlFor="offers" className="text-sm">
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
