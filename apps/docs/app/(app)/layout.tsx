import { SiteHeader } from '~/components/layouts/site-header'
import { SiteFooter } from '~/components/layouts/site-footer'
import { CommandMenu } from '~/components/layouts'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (

    <div data-wrapper="" className="flex items-center place-content-center min-h-screen flex-col gap-8">
      <CommandMenu />
      <Tabs1Demo />
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gentleduck/registry-ui-duckui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'

export function Tabs1Demo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]" listValues={['account', 'password']}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
