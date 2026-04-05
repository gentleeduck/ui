'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { MotionTabs, MotionTabsContent, MotionTabsList, MotionTabsTrigger } from '@gentleduck/registry-ui/tabs'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <MotionTabs className="w-[400px]" defaultValue="account">
        <MotionTabsList>
          <MotionTabsTrigger className="w-full" value="account">
            Account
          </MotionTabsTrigger>
          <MotionTabsTrigger className="w-full" value="password">
            Password
          </MotionTabsTrigger>
        </MotionTabsList>
        <MotionTabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-motion-name">Name</Label>
                <Input defaultValue="Pedro Duarte" id="tabs-motion-name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-motion-username">Username</Label>
                <Input defaultValue="@peduarte" id="tabs-motion-username" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </MotionTabsContent>
        <MotionTabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-motion-current">Current password</Label>
                <Input id="tabs-motion-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-motion-new">New password</Label>
                <Input id="tabs-motion-new" type="password" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </MotionTabsContent>
      </MotionTabs>
    </div>
  )
}
