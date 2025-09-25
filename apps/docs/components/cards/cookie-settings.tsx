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
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Switch } from '@gentleduck/registry-ui-duckui/switch'

export function CardsCookieSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Manage your cookie settings here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between gap-4">
          <Label className="flex flex-col items-start" htmlFor="necessary">
            <span>Strictly Necessary</span>
            <span className="text-muted-foreground leading-snug font-normal">
              These cookies are essential in order to use the website and use its features.
            </span>
          </Label>
          <Switch aria-label="Necessary" defaultChecked id="necessary" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label className="flex flex-col items-start" htmlFor="functional">
            <span>Functional Cookies</span>
            <span className="text-muted-foreground leading-snug font-normal">
              These cookies allow the website to provide personalized functionality.
            </span>
          </Label>
          <Switch aria-label="Functional" id="functional" />
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
