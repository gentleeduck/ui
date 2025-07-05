// import NativeButton from './duck/button/native'
// import NativeTextarea from './duck/textarea/native'
// import DuckButton from './duck/button/duck'
// import ShadcnButton from './duck/button/button'
// import DuckTextarea from './duck/textarea/duck'
// import ShadcnTextarea from './duck/textarea/textarea'
// import DuckTabs from './duck/tabs/duck'
// import ShadcnTabs from './duck/tabs/tabs'
// import DuckToggleGroup from './duck/toggle-group/duck'
// import ShadcnToggleGroup from './duck/toggle-group/toggle-group'
// import DuckToggle from './duck/toggle/duck'
// import ShadcnToggle from './duck/toggle/toggle'
// import DuckBadge from './duck/badge/duck'
// import ShadcnBadge from './duck/badge/badge'

// import { lazy } from 'react'

import ShadcnCheckbox from './duck/checkbox/checkbox'
// import DuckLabel from './duck/label/duck'
// import ShadcnLabel from './duck/label/label'
import DuckCheckbox from './duck/checkbox/duck'
import DuckRadioGroup from './duck/radio-group/duck'
import ShadcnRadioGroup from './duck/radio-group/radio-group'
import DuckSwitch from './duck/switch/duck'
import ShadcnSwitch from './duck/switch/switch'
// import DuckInput from './duck/input/duck'
// import ShadcnInput from './duck/input/input'
// import DuckScrollAreaExp from './duck/scroll-area/experimental'
// import DuckScrollArea from './duck/scroll-area/duck'
// import ShadcnScrollArea from './duck/scroll-area/scroll-area'
// import DuckHoverCard from './duck/hover-card/duck'
// import ShadcnHoverCard from './duck/hover-card/hover-card'
// import DuckSlider from './duck/slider/duck'
// import ShadcnSlider from './duck/slider/slider'
// import DuckAccordion from './duck/accordion/duck'
// import ShadcnAccordion from './duck/accordion/accordion'
// import DuckProgress from './duck/progress/duck'
// import ShadcnProgress from './duck/progress/progress'
// import DuckSelect from './duck/select/duck'
// import ShadcnSelect from './duck/select/select'
// import DuckSeparator from './duck/separator/duck'
// import DuckSeparatorExp from './duck/separator/experimental'
// import ShadcnSeparator from './duck/separator/separator'

// import Sandbox from './sandbox'

// import DuckSeparator from './duck/separator/duck'
// import DuckSeparatorExp from './duck/separator/experimental'
// import ShadcnSeparator from './duck/separator/separator'

// import { KeyProvider } from '../../../packages/duck-vim/src/react/command'
// import Dialog from './example/dialog'
// import Dropdown from './example/dropdown'
// import HoverCard from './example/hover-card'
import Popover from './example/popover'
// import Select from './example/select'
// import Tooltip from './example/tooltip'
// import Accordion from './example/accordion'

// import Command from './example/command'

// import Command from "./example/command/duck"
// import CmdK from './example/command/cmdk'
// import CommandShadcn from "./example/command/shadcn"
// import DrawerExample from './example/drawer'
// import DuckSkeleton from './duck/skeleton/duck'
// import ShadcnSkeleton from './duck/skeleton/skeleton'

// import DuckSonner from './duck/sonner/duck'
// import ShadcnSonner from './duck/sonner/sonner'
// function Ui() {
//   return (<>
//     {/* <div className='flex flex-col gap-4 p-4'>
//       <NativeButton />
//       <NativeTextarea />
//     </div> */}

//     {/* <div className='flex flex-col gap-4 p-4'>
//       <DuckButton />
//       <DuckTextarea />
//       <DuckTabs />
//       <DuckToggleGroup />
//       <DuckToggle />
//       <DuckBadge />
//       <DuckLabel />
//       <DuckCheckbox />
//       <DuckSwitch />
//     </div>

//     <div className='flex flex-col gap-4 p-4'>
//       <ShadcnButton />
//       <ShadcnTextarea />
//       <ShadcnTabs />

//       <ShadcnToggleGroup />
//       <ShadcnToggle />
//       <ShadcnBadge />
//       <ShadcnLabel />
//       <ShadcnCheckbox />
//       <ShadcnSwitch />
//     </div> */}
//   </>

//   )
// }

function App() {
  return (
    // <KeyProvider timeoutMs={100}>
    <div className="mx-10 flex h-screen flex-col items-center justify-center gap-4 my-[0vh]">
      <Popover />
    </div>
    // </KeyProvider>
  )
}

export default App

// ;('use client')

import * as React from 'react'
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from 'lucide-react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@gentleduck/registry-ui-duckui/navigation-menu'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]

export function NavigationMenuDemo() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/">
                    <div className="mt-4 mb-2 text-lg font-medium">shadcn/ui</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Beautifully designed components built with Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/docs">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>List</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Components</div>
                    <div className="text-muted-foreground">Browse all components in the library.</div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Documentation</div>
                    <div className="text-muted-foreground">Learn how to use the library.</div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Blog</div>
                    <div className="text-muted-foreground">Read our latest blog posts.</div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">Components</a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">Documentation</a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">Blocks</a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    Backlog
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    To Do
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    Done
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
