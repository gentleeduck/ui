'use client'

import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/registry/default/ui'
import { Button } from '../button'

export type DuckDropdownMenuRadioGroupProps = {
  radioGroup: Partial<React.ComponentPropsWithoutRef<typeof DropdownMenuRadioGroup>>
  content: (React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem> &
    React.ComponentPropsWithoutRef<typeof Button>)[]
}

export const DuckDropdownMenuRadio = ({ radioGroup, content }: DuckDropdownMenuRadioGroupProps) => {
  const Content: React.FC<{}> = (): React.ReactNode => {
    return content.map((item, idx) => {
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
    })
  }

  if (!radioGroup) return <Content />

  return (
    <DropdownMenuRadioGroup
      {...radioGroup}
      children={<Content />}
    />
  )
}

export type DuckDropdownMenuSubWrapperProps = {
  itemSub?: React.ComponentPropsWithoutRef<typeof DropdownMenuSub>
  trigger?: React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>
  content?: React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent>
}

export const DuckDropdownMenuSubWrapper = ({ itemSub, trigger, content }: DuckDropdownMenuSubWrapperProps) => {
  return (
    <DropdownMenuSub {...itemSub}>
      <DropdownMenuSubTrigger {...trigger} />
      <DropdownMenuSubContent {...content} />
    </DropdownMenuSub>
  )
}

export type DuckDropdownMenuItemProps = {
  title: string
  content: DuckDropdownMenuRadioGroupProps['content']
  onChange?: (value: string) => void
  subgroup?: boolean
}

export const DuckDropdownMenuItem = ({ title, content, onChange, subgroup = false }: DuckDropdownMenuItemProps) => {
  const active = localStorage.getItem(title) || content[0].value

  const Content = () => {
    return (
      <DuckDropdownMenuRadio
        radioGroup={{
          value: active,
          onValueChange: value => {
            onChange?.(value)
            localStorage.setItem(title, value)
          },
        }}
        content={content}
      />
    )
  }

  if (!subgroup) return <Content />

  return (
    <>
      <DropdownMenuItem asChild>
        <DuckDropdownMenuSubWrapper
          trigger={{ children: title }}
          content={{ children: <Content /> }}
        />
      </DropdownMenuItem>
    </>
  )
}
