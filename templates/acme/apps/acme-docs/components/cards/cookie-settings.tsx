'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Label } from '@gentleduck/registry-ui/label'
import { Switch } from '@gentleduck/registry-ui/switch'
import * as React from 'react'

export function CardsCookieSettings() {
  const id = React.useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Manage your cookie settings here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between gap-4">
          <Label className="flex flex-col items-start" htmlFor={`${id}-necessary`}>
            <span>Strictly Necessary</span>
            <span className="font-normal text-muted-foreground leading-snug">
              These cookies are essential in order to use the website and use its features.
            </span>
          </Label>
          <Switch aria-label="Necessary" defaultChecked id={`${id}-necessary`} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label className="flex flex-col items-start" htmlFor={`${id}-functional`}>
            <span>Functional Cookies</span>
            <span className="font-normal text-muted-foreground leading-snug">
              These cookies allow the website to provide personalized functionality.
            </span>
          </Label>
          <Switch aria-label="Functional" id={`${id}-functional`} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  )
}
