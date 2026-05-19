import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs className="w-full" defaultValue="account" dir="rtl">
        <TabsList>
          <TabsTrigger className="w-full" value="account">
            {'الحساب'}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="password">
            {'كلمة المرور'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{'الحساب'}</CardTitle>
              <CardDescription>{'قم بإجراء تغييرات على حسابك هنا. انقر حفظ عند الانتهاء.'}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">{'الاسم'}</Label>
                <Input defaultValue="أحمد محمد" id="tabs-demo-name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">{'اسم المستخدم'}</Label>
                <Input defaultValue="@ahmad" id="tabs-demo-username" />
              </div>
            </CardContent>
            <CardFooter className="justify-start">
              <Button>{'حفظ التغييرات'}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{'كلمة المرور'}</CardTitle>
              <CardDescription>{'غيّر كلمة مرورك هنا. بعد الحفظ، سيتم تسجيل خروجك.'}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">{'كلمة المرور الحالية'}</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">{'كلمة المرور الجديدة'}</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter className="justify-start">
              <Button>{'حفظ كلمة المرور'}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
