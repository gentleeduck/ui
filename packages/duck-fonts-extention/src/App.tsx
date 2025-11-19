import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { ScrollArea } from '@gentleduck/registry-ui-duckui/scroll-area'

export function App() {
  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="size-[25rem] justify-self-center">
        <CardHeader>
          <CardTitle> gentleduck/extentions</CardTitle>
        </CardHeader>

        <ScrollArea className="px-8" orientation="both">
          {Array.from({ length: 20 }).map((item, idx) => {
            return <div className="text-xl"> {idx}</div>
          })}
        </ScrollArea>

        <CardFooter>
          <Button>Press me </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
