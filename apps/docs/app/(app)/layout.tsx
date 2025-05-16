import { SiteHeader } from '~/components/layouts/site-header'
import { SiteFooter } from '~/components/layouts/site-footer'
import { CommandMenu } from '~/components/layouts'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div data-wrapper="" className="flex items-center place-content-center min-h-screen flex-col">
      <CommandMenu />
    </div>
  )
}
