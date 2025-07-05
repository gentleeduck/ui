import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { Combobox, ComboboxItem, ComboboxItemType, ComboxGroup } from '../combobox'
import { Input } from '../input'

export function DuckTableHeader({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-2 justify-between', className)} {...props} duck-table-header="" />
}

export function DuckTableSearch({
  placeholder = 'Search Rows...',
  ...props
}: React.ComponentPropsWithoutRef<typeof Input>) {
  return <Input className="max-w-[200px]" placeholder={placeholder} {...props} duck-table-search="" />
}

export function DuckTableFilter<T extends readonly ComboboxItemType[] | ComboboxItemType[]>({
  value: defaultValue,
  items,
}: {
  items: T
  value?: T[number]['label']
}) {
  const [value, setValue] = React.useState<T[number]['label'] | undefined>(defaultValue)
  return (
    <Combobox<T>
      popoverTrigger={{
        className: 'w-[200px]',
      }}
      duck-table-filter=""
      items={items}
      value={value as (typeof items)[number]['label']}
      onValueChange={(value) => console.log(value)}>
      {(items) => {
        return (
          <ComboxGroup heading="Frameworks">
            {items.map((item) => (
              <ComboboxItem<typeof item>
                key={item.value}
                item={item}
                onSelect={(value) => {
                  setValue(value)
                }}>
                {item.label}
              </ComboboxItem>
            ))}
          </ComboxGroup>
        )
      }}
    </Combobox>
  )
}
