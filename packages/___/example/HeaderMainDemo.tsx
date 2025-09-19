import { useAtom } from 'jotai'
import { ArrowRightFromLine, Calendar, Cloudy, Home, Mail, ServerCog } from 'lucide-react'
import { buttonVarieties } from '@/hooks/use-varieties'
import { cn } from '@/lib'
import { DuckSwitcher, Header, TooltipProvider } from '@/registry/default/ui'
import { Button, ButtonProps } from '@/registry/registry-ui-components'

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
]

const emails = [
  { email: 'wildduck@gentleduck.org', icon: Mail, label: 'mail' },
  { email: 'mona@gmail.com', icon: Cloudy, label: 'cloud' },
  { email: 'hannan@gentleduck.du', icon: ServerCog, label: 'server' },
]

export default function HeaderMainDemo() {
  //NOTE: that's a state in the example
  const [variety, setVariety] = useAtom(buttonVarieties)
  //NOTE: you will use your own variables not this state in the example
  const { open } = variety.default.variety!
  const O = open!
  console.log(open)
  //h-[300px]
  return (
    <div>
      <TooltipProvider>
        <Header<typeof O>
          footer={{
            buttons: [
              <Button
                className={cn('my-1 mx-2 justify-between', !O && 'w-[250px]', O && 'justify-center')}
                icon={{ children: ArrowRightFromLine }}
                is_collapsed={O}
                onClick={() =>
                  setVariety({
                    ...variety,
                    default: {
                      ...variety.default,
                      variety: { ...variety.default.variety, open: !O },
                    },
                  })
                }
                size={O ? 'icon' : 'default'}
                title={'Collapse'}
                variant={'secondary'}
              />,
            ],
          }}
          header={{
            className: 'border-r-border border-r-solid border-r justify-center',
            isCollabsed: O,
            position: 'side',
          }}
          logo={<DuckSwitcher accounts={emails} className={cn('mx-2 mb-2', 0 && 'mx-auto')} isCollapsed={O} />}
          nav={{
            nav: {
              group: [1, 1],
              pathname: '',
              router: {}, // use your router instance
            },
            navigationKeys: data,
          }}
        />
      </TooltipProvider>
    </div>
  )
}
