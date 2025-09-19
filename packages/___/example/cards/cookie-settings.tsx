'use client'

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Label, Switch } from '@/registry/default/ui/'

export function CardsCookieSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Manage your cookie settings here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1" htmlFor="necessary">
            <span>Strictly Necessary</span>
            <span className="text-xs font-normal leading-snug text-muted-foreground">
              These cookies are essential in order to use the website and use its features.
            </span>
          </Label>
          <Switch aria-label="Necessary" defaultChecked id="necessary" />
        </div>
        <div className="flex items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1" htmlFor="functional">
            <span>Functional Cookies</span>
            <span className="text-xs font-normal leading-snug text-muted-foreground">
              These cookies allow the website to provide personalized functionality.
            </span>
          </Label>
          <Switch aria-label="Functional" id="functional" />
        </div>
        <div className="flex items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1" htmlFor="performance">
            <span>Performance Cookies</span>
            <span className="text-xs font-normal leading-snug text-muted-foreground">
              These cookies help to improve the performance of the website.
            </span>
          </Label>
          <Switch aria-label="Performance" id="performance" />
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
