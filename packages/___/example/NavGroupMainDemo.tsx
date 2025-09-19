import { useAtom } from 'jotai'
import { Calendar, HandshakeIcon, Home, Settings } from 'lucide-react'
import { buttonVarieties } from '@/hooks/use-varieties'
import { ButtonProps, NavGroup, TooltipProvider } from '@/registry/default/ui'

const data: ButtonProps[] = [
  {
    children: 'Home',
    icon: { children: Home },
    label: {
      children: '21',
    },
    route: '/home',
    title: 'Home',
  },
  {
    children: 'Calendar',
    icon: { children: Calendar },
    label: {
      children: '20',
    },
    route: '/calendar',
    title: 'Calendar',
  },
  {
    children: 'Deals',
    icon: { children: HandshakeIcon },
    label: {
      children: '100',
    },
    route: '/deals',
    title: 'Deals',
  },
  {
    children: 'Settings',
    icon: { children: Settings },
    label: {
      children: '43',
    },
    route: '/settings',
    title: 'Settings',
  },
]

export default function NavGroupMainDemo() {
  //NOTE: that's a state in the example
  const [variety] = useAtom(buttonVarieties)
  //NOTE: you will use your own variables not this state in the example
  const { open, group } = variety.default.variety!

  return (
    <>
      <TooltipProvider>
        <NavGroup<true>
          nav={{
            group: group as number[],
            isCollabsed: open,
            pathname: '',
            router: {},
          }}
          navigationKeys={data}
          position="side"
        />
      </TooltipProvider>
    </>
  )
}
