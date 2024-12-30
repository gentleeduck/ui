import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/registry/default/ui'
import { Button } from '../button'

export const DropdownMenuRadioGroupContent = ({
  radioGroup,
  content,
}: {
  radioGroup: Partial<React.ComponentPropsWithoutRef<typeof DropdownMenuRadioGroup>>
  content: (React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem> &
    React.ComponentPropsWithoutRef<typeof Button>)[]
}) => {
  return (
    <>
      <DropdownMenuRadioGroup {...radioGroup}>
        {content.map((item, idx) => {
          const { children: itemChildren, value, size = 'sm', variant = 'ghost', ...itemProps } = item ?? {}
          return (
            <DropdownMenuRadioItem
              key={idx}
              className="py-0 px-4"
              value={value}
            >
              <Button
                variant={'nothing'}
                size={size}
                {...itemProps}
              >
                {itemChildren}
              </Button>
            </DropdownMenuRadioItem>
          )
        })}
      </DropdownMenuRadioGroup>
    </>
  )
}

export const DropdownMenuSubWrapper = ({
  itemSub,
  trigger,
  content,
}: {
  itemSub?: React.ComponentPropsWithoutRef<typeof DropdownMenuSub>
  trigger?: React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>
  content?: React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent>
}) => {
  return (
    <DropdownMenuSub {...itemSub}>
      <DropdownMenuSubTrigger {...trigger} />
      <DropdownMenuSubContent {...content} />
    </DropdownMenuSub>
  )
}
