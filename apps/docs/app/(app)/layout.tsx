import { SiteHeader } from '~/components/layouts/site-header'
import { SiteFooter } from '~/components/layouts/site-footer'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col">
      {
        // <SiteHeader />
        // <main className="flex flex-1 flex-col">{children}</main>
        // <SiteFooter />
      }
      <DropdownMenuCheckboxes />
    </div>
  )
}

import { Folder, Forward, MoreHorizontal, Trash2, type LucideIcon } from 'lucide-react'

import { DropdownMenu } from '@gentleduck/registry-ui-duckui/dropdown-menu'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import React from 'react'

type Checked = boolean
export function DropdownMenuCheckboxes() {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)

  return (
    <DropdownMenu.DropdownMenu>
      <DropdownMenu.DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent className="w-56">asdfasdfasdf</DropdownMenu.DropdownMenuContent>
    </DropdownMenu.DropdownMenu>
  )
}
