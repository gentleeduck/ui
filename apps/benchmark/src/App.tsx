import { lazy } from 'react'
import { KeyProvider } from '../../../packages/duck-vim/src/react/command'
import ShadcnAccordion from './duck/accordion/accordion'
import DuckAccordion from './duck/accordion/duck'
import ShadcnBadge from './duck/badge/badge'
import DuckBadge from './duck/badge/duck'
import ShadcnButton from './duck/button/button'
import DuckButton from './duck/button/duck'
import NativeButton from './duck/button/native'
import ShadcnCheckbox from './duck/checkbox/checkbox'
import DuckCheckbox from './duck/checkbox/duck'
import DuckHoverCard from './duck/hover-card/duck'
import ShadcnHoverCard from './duck/hover-card/hover-card'
import DuckInput from './duck/input/duck'
import ShadcnInput from './duck/input/input'
import DuckLabel from './duck/label/duck'
import ShadcnLabel from './duck/label/label'
import DuckProgress from './duck/progress/duck'
import ShadcnProgress from './duck/progress/progress'
import DuckRadioGroup from './duck/radio-group/duck'
import ShadcnRadioGroup from './duck/radio-group/radio-group'
import DuckScrollArea from './duck/scroll-area/duck'
import DuckScrollAreaExp from './duck/scroll-area/experimental'
import ShadcnScrollArea from './duck/scroll-area/scroll-area'
import DuckSelect from './duck/select/duck'
import ShadcnSelect from './duck/select/select'
import DuckSeparator from './duck/separator/duck'
import DuckSeparatorExp from './duck/separator/experimental'
import ShadcnSeparator from './duck/separator/separator'
import DuckSkeleton from './duck/skeleton/duck'
import ShadcnSkeleton from './duck/skeleton/skeleton'
import DuckSlider from './duck/slider/duck'
import ShadcnSlider from './duck/slider/slider'
import DuckSonner from './duck/sonner/duck'
import ShadcnSonner from './duck/sonner/sonner'
import DuckSwitch from './duck/switch/duck'
import ShadcnSwitch from './duck/switch/switch'
import DuckTabs from './duck/tabs/duck'
import ShadcnTabs from './duck/tabs/tabs'
import DuckTextarea from './duck/textarea/duck'
import NativeTextarea from './duck/textarea/native'
import ShadcnTextarea from './duck/textarea/textarea'
import DuckToggle from './duck/toggle/duck'
import ShadcnToggle from './duck/toggle/toggle'
import DuckToggleGroup from './duck/toggle-group/duck'
import ShadcnToggleGroup from './duck/toggle-group/toggle-group'
import Accordion from './example/accordion'
import Command from './example/command'
import CmdK from './example/command/cmdk'
import CommandShadcn from './example/command/shadcn'
import Dialog from './example/dialog'
import DrawerExample from './example/drawer'
import Dropdown from './example/dropdown'
import DropdownMenuDemo from './example/dropdown'
import HoverCard from './example/hover-card'
import Popover from './example/popover'
import Select from './example/select'
import TooltipDemo from './example/tooltip'
import Tooltip from './example/tooltip'
import Sandbox from './sandbox'

function Ui() {
  return (
    <>
      {/* <div className='flex flex-col gap-4 p-4'>
      <NativeButton />
      <NativeTextarea />
      // <Dialog />
    </div> */}

      <div className="flex flex-col gap-4 p-4">
        <PopoverDemo />
      </div>

      {
        // <div className='flex flex-col gap-4 p-4'>
        //   <DuckButton />
        //   <DuckTextarea />
        //   <DuckTabs />
        //   <DuckToggleGroup />
        //   <DuckToggle />
        //   <DuckBadge />
        //   <DuckLabel />
        //   <DuckCheckbox />
        //   <DuckSwitch />
        // </div>
      }

      {
        // <div className="flex flex-col gap-4 p-4">
        //   <ShadcnButton />
        //   <ShadcnTextarea />
        //   <ShadcnTabs />
        //
        //   <ShadcnToggleGroup />
        //   <ShadcnToggle />
        //   <ShadcnBadge />
        //   <ShadcnLabel />
        //   <ShadcnCheckbox />
        //   <ShadcnSwitch />
        // </div>
      }
    </>
  )
}
function App() {
  // <SidebarProvider>
  //   <AppSidebar />
  //   <main>
  //     <SidebarTrigger />
  //     <div className="mx-10 flex h-screen flex-col items-center justify-center gap-4 my-[0vh]"></div>
  //   </main>
  // </SidebarProvider>

  return (
    <div>
      <TooltipDemo />
    </div>
    // <TooltipDemo />
    //   <div className="mx-10 flex h-screen flex-col items-center justify-center gap-4 my-[0vh]">
    // </div>
    //
    // <DropdownMenuDemo />
    // <SelectDemo />
  )
}

export default App

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@gentleduck/registry-ui-duckui/sidebar'
import { Calendar, ChevronDown, Home, Inbox, Search, Settings } from 'lucide-react'

// Menu items.
const items = [
  {
    icon: Home,
    title: 'Home',
    url: '#',
  },
  {
    icon: Inbox,
    title: 'Inbox',
    url: '#',
  },
  {
    icon: Calendar,
    title: 'Calendar',
    url: '#',
  },
  {
    icon: Search,
    title: 'Search',
    url: '#',
  },
  {
    icon: Settings,
    title: 'Settings',
    url: '#',
  },
]

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui-duckui/collapsible'
import AccordionDemo from './duck/accordion/duck'
import ScrollAreaDemo from './duck/scroll-area/scroll-area'
import PopoverDemo from './example/popover'
import { DuckTabsDemo } from './tabs/duck-ui'
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="w-full">
                Help
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  )
}
