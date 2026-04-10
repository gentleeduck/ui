import { ScrollArea } from '@gentleduck/registry-ui/scroll-area'
import { Separator } from '@gentleduck/registry-ui/separator'

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

export default function Demo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border" dir="rtl">
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">الوسوم</h4>
        {tags.map((tag) => (
          <>
            <div className="text-sm" key={tag}>
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
