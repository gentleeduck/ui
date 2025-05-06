import { ArrowRightFromLine, Calendar, Cloudy, Home, Mail, ServerCog } from 'lucide-react'
import { DuckSwitcher, Header, TooltipProvider } from '@/registry/default/ui'
import { useAtom } from 'jotai'
import { buttonVarieties } from '@/hooks/use-varieties'
import { cn } from '@/lib'
import { Button, ButtonProps } from '@/registry/registry-ui-components'

const data: ButtonProps[] = [
  {
    title: 'Home',
    route: '/home',
    children: 'Home',
    icon: { children: Home },
    label: {
      children: '21',
    },
  },
  {
    title: 'Calendar',
    route: '/calendar',
    children: 'Calendar',
    icon: { children: Calendar },
    label: {
      children: '20',
    },
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
          header={{
            isCollabsed: O,
            position: 'side',
            className: 'border-r-border border-r-solid border-r justify-center',
          }}
          logo={<DuckSwitcher isCollapsed={O} accounts={emails} className={cn('mx-2 mb-2', 0 && 'mx-auto')} />}
          nav={{
            navigationKeys: data,
            nav: {
              group: [1, 1],
              router: {}, // use your router instance
              pathname: '',
            },
          }}
          footer={{
            buttons: [
              <Button
                is_collapsed={O}
                icon={{ children: ArrowRightFromLine }}
                className={cn('my-1 mx-2 justify-between', !O && 'w-[250px]', O && 'justify-center')}
                title={'Collapse'}
                variant={'secondary'}
                size={O ? 'icon' : 'default'}
                onClick={() =>
                  setVariety({
                    ...variety,
                    default: {
                      ...variety.default,
                      variety: { ...variety.default.variety, open: !O },
                    },
                  })
                }
              />,
            ],
          }}
        />
      </TooltipProvider>
    </div>
  )
}
