import { Calendar, HandshakeIcon, Home, Settings } from 'lucide-react'
import { ButtonProps, NavGroup, TooltipProvider } from '@/registry/default/ui'
import { useAtom } from 'jotai'
import { buttonVarieties } from '@/hooks/use-varieties'

const data: ButtonProps[] = [
  {
    title: 'Home',
    route: '/home',
    children: 'Home',
    icon: { icon: Home },
    label: {
      children: '21',
    },
  },
  {
    title: 'Calendar',
    route: '/calendar',
    children: 'Calendar',
    icon: { icon: Calendar },
    label: {
      children: '20',
    },
  },
  {
    title: 'Deals',
    route: '/deals',
    children: 'Deals',
    icon: { icon: HandshakeIcon },
    label: {
      children: '100',
    },
  },
  {
    title: 'Settings',
    route: '/settings',
    children: 'Settings',
    icon: { icon: Settings },
    label: {
      children: '43',
    },
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
          position="side"
          nav={{
            group: group as number[],
            router: {},
            pathname: '',
            isCollabsed: open,
          }}
          navigationKeys={data}
        />
      </TooltipProvider>
    </>
  )
}
