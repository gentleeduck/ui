'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@gentleduck/registry-ui-duckui/select'
import { Skeleton } from '@gentleduck/registry-ui-duckui/skeleton'
import * as React from 'react'
import { useColors } from '~/hooks/use-colors'
import { type Color, getColorFormat } from '~/lib/colors'

export function ColorFormatSelector({
  color,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectTrigger>, 'color'> & {
  color: Color
}) {
  const { format, setFormat, isLoading } = useColors()
  const formats = React.useMemo(() => getColorFormat(color), [color])

  if (isLoading) {
    return <ColorFormatSelectorSkeleton />
  }

  return (
    <Select onValueChange={setFormat as never} placement="bottom-end" value={format}>
      <Button asChild size={'sm'} variant="ghost">
        <SelectTrigger className={cn(className)} {...props}>
          <span className="font-medium text-sm">Format: </span>
          <span className="font-mono text-muted-foreground">{format}</span>
        </SelectTrigger>
      </Button>
      <SelectContent>
        {Object.entries(formats).map(([format, value]) => (
          <SelectItem
            className="gap-2 rounded-lg [&>span]:flex [&>span]:items-center [&>span]:gap-2"
            key={format}
            value={format}>
            <span className="font-medium text-sm">{format}</span>
            <span className="font-mono text-muted-foreground text-xs">{value}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ColorFormatSelectorSkeleton({ className, ...props }: React.ComponentProps<typeof Skeleton>) {
  return <Skeleton className={cn('h-8 w-[132px] gap-1.5 rounded-md', className)} {...props} />
}
