import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { SidebarInput } from '@gentleduck/registry-ui/sidebar'

export function SidebarOptInForm() {
  return (
    <Card className="shadow-none">
      <form>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm">Newsletter</CardTitle>
          <CardDescription>Get the latest updates.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2.5 p-4">
          <SidebarInput placeholder="Email" type="email" />
          <Button className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none" size="sm">
            Subscribe
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
