'use client'

import { AspectRatio } from '@gentleduck/registry-ui-duckui/aspect-ratio'
import { Avatar, AvatarGroup } from '@gentleduck/registry-ui-duckui/avatar'
import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gentleduck/registry-ui-duckui/card'
import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gentleduck/registry-ui-duckui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui-duckui/dialog'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui-duckui/hover-card'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui-duckui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import {
  Calendar,
  CalendarIcon,
  Command as CCommand,
  Grab,
  LineChart,
  LogOut,
  Pointer,
  RefreshCcw,
  X,
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import { VaulDrawer } from './hi'
import { SONNER_V2 } from './js'
import { DrawerExample } from './ss'
import { Upload2Demo } from './tt'

export function MainExample() {
  // return <DrawerExample />
  // return <Upload2Demo />
  // // return <SONNER_V2 />
  // return <VaulDrawer />
  //
  // const items = [
  //   // {
  //   //   title: 'Navigation',
  //   //   items: [
  //   //     { name: 'Dashboard', icon: <LayoutDashboard />, key: 'ctrl+D' },
  //   //     { name: 'Projects', icon: <Folder />, key: 'ctrl+P' },
  //   //     { name: 'Reports', icon: <BarChart />, key: 'ctrl+R' },
  //   //     { name: 'Teams', icon: <Users />, key: 'ctrl+T' },
  //   //   ],
  //   // },
  //   // {
  //   //   title: 'User Actions',
  //   //   items: [
  //   //     { name: 'Create New Task', icon: <PlusCircle />, key: 'ctrl+N' },
  //   //     { name: 'Assign User', icon: <UserPlus />, key: 'ctrl+A' },
  //   //     { name: 'Delete Item', icon: <Trash2 />, key: 'ctrl+Del' },
  //   //   ],
  //   // },
  //   // {
  //   //   title: 'Settings',
  //   //   items: [
  //   //     { name: 'Profile Settings', icon: <UserCog />, key: 'ctrl+S' },
  //   //     { name: 'Notifications', icon: <Bell />, key: 'ctrl+O' },
  //   //     { name: 'Dark Mode', icon: <Moon />, key: 'ctrl+M' },
  //   //     { name: 'Language', icon: <Globe />, key: 'ctrl+L' },
  //   //   ],
  //   // },
  //   {
  //     title: 'System',
  //     items: [
  //       { name: 'Restart App', icon: <RefreshCcw />, key: 'ctrl+Shift+R' },
  //       { name: 'Logout', icon: <LogOut />, key: 'ctrl+Q' },
  //       { name: 'Exit', icon: <X />, key: 'ctrl+Esc' },
  //     ],
  //   },
  // ]
  //
  // return (
  //   <Dialog>
  //     <DialogTrigger variant={'outline'}>Edit Profile</DialogTrigger>
  //
  //     <DialogContent renderOnce>
  //       <DialogHeader>
  //         <DialogTitle>Edit profile</DialogTitle>
  //         <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
  //       </DialogHeader>
  //       <div className="grid gap-4 py-4">
  //         <div className="grid grid-cols-4 items-center gap-4">
  //           <Label htmlFor="name" className="text-right">
  //             Name
  //           </Label>
  //           <Input id="name" value="wild duck" className="col-span-3" />
  //         </div>
  //         <div className="grid grid-cols-4 items-center gap-4">
  //           <Label htmlFor="username" className="text-right">
  //             Username
  //           </Label>
  //           <Input id="username" value="@wildduck2" className="col-span-3" />
  //         </div>
  //         <div className="grid grid-cols-4 items-center gap-4">
  //           <Label htmlFor="username" className="text-right">
  //             Username
  //           </Label>
  //           <Input id="username" value="@wildduck2" className="col-span-3" />
  //         </div>
  //       </div>
  //
  //       <DialogFooter>
  //         <Button>Save changes</Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // )

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="relative">
        <Tooltip className="" open={false}>
          <TooltipTrigger
            className='group-data-[method="forced"]/tooltip:bg-muted'
            icon={<Calendar />}
            size={'default'}
            variant={'outline'}>
            Mettings
          </TooltipTrigger>

          <TooltipContent>5 meetings remaining for today.</TooltipContent>
        </Tooltip>
      </div>
      <Button icon={<Calendar />} size={'default'} variant={'outline'}>
        Mettings
        <CommandShortcut
          className="bg-muted"
          keys="ctrl+k"
          onKeysPressed={() => {
            toast('Event has been created', {
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
              description: 'Sunday, December 03, 2023 at 9:00 AM',
            })
          }}>
          <CCommand className="!size-3" />
          +K
        </CommandShortcut>
      </Button>
      <Badge size={'default'} variant={'default'}>
        Inbox
      </Badge>
    </div>
  )
}
const avatar_group = [
  {
    alt: 'wildduck',
    src: 'https://sdmntprwestus.oaiusercontent.com/files/00000000-f2d0-5230-ae93-4d6e5d21c643/raw?se=2025-04-02T18%3A50%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=5a891375-aaa2-5f3a-b791-40362a011415&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-02T16%3A08%3A39Z&ske=2025-04-03T16%3A08%3A39Z&sks=b&skv=2024-08-04&sig=Ff%2B6OD2Y8WCvbX%2BHZL/yCf0mi0%2BZ3IZZlrkUvhLK7js%3D',
  },
  {
    alt: 'wildduck',
    src: 'https://sdmntprwestus.oaiusercontent.com/files/00000000-f2d0-5230-ae93-4d6e5d21c643/raw?se=2025-04-02T18%3A50%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=5a891375-aaa2-5f3a-b791-40362a011415&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-02T16%3A08%3A39Z&ske=2025-04-03T16%3A08%3A39Z&sks=b&skv=2024-08-04&sig=Ff%2B6OD2Y8WCvbX%2BHZL/yCf0mi0%2BZ3IZZlrkUvhLK7js%3D',
  },
  {
    alt: 'wildduck',
    src: 'https://sdmntprwestus.oaiusercontent.com/files/00000000-f2d0-5230-ae93-4d6e5d21c643/raw?se=2025-04-02T18%3A50%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=5a891375-aaa2-5f3a-b791-40362a011415&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-02T16%3A08%3A39Z&ske=2025-04-03T16%3A08%3A39Z&sks=b&skv=2024-08-04&sig=Ff%2B6OD2Y8WCvbX%2BHZL/yCf0mi0%2BZ3IZZlrkUvhLK7js%3D',
  },
  {
    alt: 'wildduck',
    src: 'https://sdmntprwestus.oaiusercontent.com/files/00000000-f2d0-5230-ae93-4d6e5d21c643/raw?se=2025-04-02T18%3A50%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=5a891375-aaa2-5f3a-b791-40362a011415&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-02T16%3A08%3A39Z&ske=2025-04-03T16%3A08%3A39Z&sks=b&skv=2024-08-04&sig=Ff%2B6OD2Y8WCvbX%2BHZL/yCf0mi0%2BZ3IZZlrkUvhLK7js%3D',
  },
  {
    alt: 'wildduck',
    src: 'https://sdmntprwestus.oaiusercontent.com/files/00000000-f2d0-5230-ae93-4d6e5d21c643/raw?se=2025-04-02T18%3A50%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=5a891375-aaa2-5f3a-b791-40362a011415&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-02T16%3A08%3A39Z&ske=2025-04-03T16%3A08%3A39Z&sks=b&skv=2024-08-04&sig=Ff%2B6OD2Y8WCvbX%2BHZL/yCf0mi0%2BZ3IZZlrkUvhLK7js%3D',
  },
  {
    alt: 'wildduck',
    src: 'https://sdmntprwestus.oaiusercontent.com/files/00000000-f2d0-5230-ae93-4d6e5d21c643/raw?se=2025-04-02T18%3A50%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=5a891375-aaa2-5f3a-b791-40362a011415&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-02T16%3A08%3A39Z&ske=2025-04-03T16%3A08%3A39Z&sks=b&skv=2024-08-04&sig=Ff%2B6OD2Y8WCvbX%2BHZL/yCf0mi0%2BZ3IZZlrkUvhLK7js%3D',
  },
]
