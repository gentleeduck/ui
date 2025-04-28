import * as React from 'react'

import {
  Select,
  SelectContent,
  SelectItemLeftCheck,
  SelectTrigger,
  SelectValue,
} from './ShadcnUI/select'
import {
  TooltipTrigger,
  TooltipContent,
  TooltipTrigger,
} from '@gentleduck/registry-ui-duckui/tooltip'

import { cn } from '@gentleduck/libs/cn'
import { Inbox, Mail } from 'lucide-react'

export interface DuckSwitcherProps {
  isCollapsed: boolean
  accounts: AccountType[]
  className?: string
}

export type AccountType = {
  label: string
  icon: typeof Inbox
  email: string
}

export function DuckSwitcher({
  isCollapsed,
  accounts,
  className,
}: DuckSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    accounts[0].email
  )
  const IconSelected =
    accounts.find((account) => account.email === selectedAccount)?.icon || Mail

  return (
    <TooltipTrigger delayDuration={0}>
      <Select
        defaultValue={selectedAccount}
        onValueChange={setSelectedAccount}
      >
        <TooltipTrigger asChild>
          <SelectTrigger
            className={cn(
              'account__switcher flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 w-[250px] h-10 px-4',
              isCollapsed &&
              'flex h-10 w-10 items-center justify-center p-2 [&>span]:w-auto [&>svg]:hidden',
              className
            )}
            aria-label='Select account'
          >
            <SelectValue
              placeholder='Select an account'
              className='w-auto'
            >
              <IconSelected className='!h-[1.15rem] !w-[1.15rem]' />
              <span
                className={cn(
                  'ml-2 truncate max-w-[180px]',
                  isCollapsed && 'hidden'
                )}
              >
                {
                  accounts.find((account) => account.email === selectedAccount)
                    ?.label
                }
              </span>
            </SelectValue>
          </SelectTrigger>
        </TooltipTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItemLeftCheck
              key={account.email}
              value={account.email}
            >
              <div className='flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground'>
                <account.icon />
                {account.email}
              </div>
            </SelectItemLeftCheck>
          ))}
        </SelectContent>
      </Select>
      <TooltipContent
        side='right'
        className='flex items-center gap-4 z-50'
      >
        {accounts.find((account) => account.email === selectedAccount)?.label}
      </TooltipContent>
    </TooltipTrigger>
  )
}
