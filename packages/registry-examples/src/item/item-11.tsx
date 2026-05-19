import { Button } from '@gentleduck/registry-ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@gentleduck/registry-ui/item'
import { ChevronLeftIcon, ClipboardListIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div dir="rtl">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>ملاحظات الاجتماع الاسبوعي</ItemTitle>
            <ItemDescription>راجع بنود العمل من الاجتماع الاخير قبل يوم الجمعة.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="outline">
              عرض
            </Button>
          </ItemActions>
        </Item>
        <Item asChild size="sm" variant="outline">
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder href in demo component */}
          <a href="#">
            <ItemMedia>
              <ClipboardListIcon className="size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>3 مهام مسندة اليك في هذا السبرنت.</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronLeftIcon className="size-4" />
            </ItemActions>
          </a>
        </Item>
      </div>
    </div>
  )
}
