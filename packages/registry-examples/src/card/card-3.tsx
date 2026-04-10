import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <Card className="w-[350px]" dir="rtl">
        <CardHeader>
          <CardTitle>إنشاء مشروع</CardTitle>
          <CardDescription>انشر مشروعك الجديد بنقرة واحدة.</CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" placeholder="اسم مشروعك" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">نوع المشروع</Label>

                <Select dir="rtl">
                  <SelectTrigger id="framework" className="w-full">
                    <SelectValue placeholder="اختر نوع المشروع" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="landing">صفحة هبوط</SelectItem>
                    <SelectItem value="dashboard">لوحة تحكم</SelectItem>
                    <SelectItem value="ecommerce">متجر إلكتروني</SelectItem>
                    <SelectItem value="portfolio">معرض أعمال</SelectItem>
                    <SelectItem value="blog">مدونة</SelectItem>
                    <SelectItem value="mobile-app">تطبيق موبايل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex">
          <Button variant="outline">إلغاء</Button>
          <Button>نشر</Button>
        </CardFooter>
      </Card>
    </DirectionProvider>
  )
}
