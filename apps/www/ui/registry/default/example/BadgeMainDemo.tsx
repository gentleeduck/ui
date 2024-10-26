import { buttonVarieties } from '@/hooks/use-varieties'
import { Badge, TooltipProvider } from '@/registry/default/ui'
import { useAtom } from 'jotai'
import { CircleAlert } from 'lucide-react'

export default function BadgeMainDemo() {
  //NOTE: that's a state in the example
  const [variety] = useAtom(buttonVarieties)
  //NOTE: you will use your own variables not this state in the example
  const { variant, size, title } = variety.default.variety!

  return (
    <TooltipProvider>
      <Badge
        variant={variant as Exclude<typeof variant, 'default' | 'link' | 'ghost' | 'nothing'>}
        size={size}
        label={{
          children: title,
        }}
      >
        {size == 'icon' ? <CircleAlert /> : title}
      </Badge>
    </TooltipProvider>
  )
}
