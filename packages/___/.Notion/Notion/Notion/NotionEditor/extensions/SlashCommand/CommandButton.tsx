import { icons } from 'lucide-react'
import { forwardRef } from 'react'
import { Icon } from '@/components/ui/Notion/ui'
import { cn } from '@/utils'

export type CommandButtonProps = {
  active?: boolean
  description: string
  icon: keyof typeof icons
  onClick: () => void
  title: string
}

export const CommandButton = forwardRef<HTMLButtonElement, CommandButtonProps>(
  ({ active, icon, onClick, title }, ref) => {
    const wrapperClass = cn(
      'flex text-neutral-500 items-center text-xs font-semibold justify-start p-1.5 gap-2 rounded-sm',
      !active && 'bg-transparent hover:bg-neutral-50 hover:text-black',
      active && 'bg-neutral-100 text-black hover:bg-neutral-100',
    )

    return (
      <button className={wrapperClass} onClick={onClick} ref={ref}>
        <Icon className="w-3 h-3" name={icon} />
        <div className="flex flex-col items-start justify-start">
          <div className="text-sm font-medium">{title}</div>
        </div>
      </button>
    )
  },
)

CommandButton.displayName = 'CommandButton'
