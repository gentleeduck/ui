import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gentleduck/registry-ui-duckui/card'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'

export default function TabsRtlDemo() {
  return (
    <div dir="rtl">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs className="w-[400px]" defaultValue="account">
          <TabsList>
            <TabsTrigger className="w-full" value="account">
              {'\u0627\u0644\u062D\u0633\u0627\u0628'}
            </TabsTrigger>
            <TabsTrigger className="w-full" value="password">
              {'\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>{'\u0627\u0644\u062D\u0633\u0627\u0628'}</CardTitle>
                <CardDescription>
                  {
                    '\u0642\u0645 \u0628\u0625\u062C\u0631\u0627\u0621 \u062A\u063A\u064A\u064A\u0631\u0627\u062A \u0639\u0644\u0649 \u062D\u0633\u0627\u0628\u0643 \u0647\u0646\u0627. \u0627\u0646\u0642\u0631 \u062D\u0641\u0638 \u0639\u0646\u062F \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-name">{'\u0627\u0644\u0627\u0633\u0645'}</Label>
                  <Input defaultValue="\u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F" id="tabs-demo-name" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">
                    {'\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645'}
                  </Label>
                  <Input defaultValue="@ahmad" id="tabs-demo-username" />
                </div>
              </CardContent>
              <CardFooter className="justify-start">
                <Button>{'\u062D\u0641\u0638 \u0627\u0644\u062A\u063A\u064A\u064A\u0631\u0627\u062A'}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>{'\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631'}</CardTitle>
                <CardDescription>
                  {
                    '\u063A\u064A\u0651\u0631 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631\u0643 \u0647\u0646\u0627. \u0628\u0639\u062F \u0627\u0644\u062D\u0641\u0638\u060C \u0633\u064A\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u062E\u0631\u0648\u062C\u0643.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">
                    {
                      '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629'
                    }
                  </Label>
                  <Input id="tabs-demo-current" type="password" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">
                    {
                      '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629'
                    }
                  </Label>
                  <Input id="tabs-demo-new" type="password" />
                </div>
              </CardContent>
              <CardFooter className="justify-start">
                <Button>{'\u062D\u0641\u0638 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631'}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
