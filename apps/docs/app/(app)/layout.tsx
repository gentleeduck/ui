'use client'
import { SiteHeader } from '~/components/layouts/site-header'
import { SiteFooter } from '~/components/layouts/site-footer'
import { CommandMenu } from '~/components/layouts'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const html = document.documentElement
  // html.setAttribute('dir', 'rtl')
  return (
    <div data-wrapper="" className="flex items-center place-content-center flex-col gap-8 min-h-screen">
      <DropdownMenuCheckboxes />
    </div>
    // <SiteHeader />
    // <main className="flex flex-1 flex-col">{children}</main>
    //   <SiteFooter />
  )
}

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
]
export function ComboboxDemo() {
  const [open, setOpen] = React.useState(true)
  const [value, setValue] = React.useState('')
  // console.log(open)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-[200px] px-3">
        {value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'}
        <ChevronsUpDown className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <CCommand>
          <CommandInput placeholder="Search framework..." className="h-8 [&_svg]:size-[18px]" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup heading="Frameworks">
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
                  {framework.label}
                  <Check
                    className={cn('border-foreground/50 ', value === framework.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CCommand>
      </PopoverContent>
    </Popover>
  )
}

import { Check, CircleCheckIcon, CircleHelpIcon, CircleIcon } from 'lucide-react'

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
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>Link</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            button.tsx:51 React does not recognize the `animationIcon` prop on a DOM element. If you intentionally want
            it to appear in the DOM as a custom attribute, spell it as lowercase `animationicon` instead. If you
            accidentally passed it from a parent component, remove it from the DOM element.
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
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

// import {
//   ContextMenu,
//   ContextMenuCheckboxItem,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuLabel,
//   ContextMenuRadioGroup,
//   ContextMenuRadioItem,
//   ContextMenuSeparator,
//   ContextMenuShortcut,
//   ContextMenuSub,
//   ContextMenuSubContent,
//   ContextMenuSubTrigger,
//   ContextMenuTrigger,
// } from '@gentleduck/registry-ui-duckui/context-menu'
//
// export function ContextMenuDemo() {
//   return (
//     <ContextMenu>
//       <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
//         Right click here
//       </ContextMenuTrigger>
//       <ContextMenuContent className="w-52">
//         <ContextMenuItem inset>
//           Back
//           <ContextMenuShortcut>⌘[</ContextMenuShortcut>
//         </ContextMenuItem>
//         <ContextMenuItem inset disabled>
//           Forward
//           <ContextMenuShortcut>⌘]</ContextMenuShortcut>
//         </ContextMenuItem>
//         <ContextMenuItem inset>
//           Reload
//           <ContextMenuShortcut>⌘R</ContextMenuShortcut>
//         </ContextMenuItem>
//         <ContextMenuSub>
//           <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
//           <ContextMenuSubContent className="w-44">
//             <ContextMenuItem>Save Page...</ContextMenuItem>
//             <ContextMenuItem>Create Shortcut...</ContextMenuItem>
//             <ContextMenuItem>Name Window...</ContextMenuItem>
//             <ContextMenuSeparator />
//             <ContextMenuItem>Developer Tools</ContextMenuItem>
//             <ContextMenuSeparator />
//             <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
//           </ContextMenuSubContent>
//         </ContextMenuSub>
//         <ContextMenuSeparator />
//         <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
//         <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
//         <ContextMenuSeparator />
//         <ContextMenuRadioGroup value="pedro">
//           <ContextMenuLabel inset>People</ContextMenuLabel>
//           <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
//           <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
//         </ContextMenuRadioGroup>
//       </ContextMenuContent>
//     </ContextMenu>
//   )
// }

import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui-duckui/hover-card'

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@wildduck</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-start gap-4">
          <Avatar src="https://avatars.githubusercontent.com/u/108896341?v=4" alt="@wildduck"></Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@wildduck</h4>
            <p className="text-sm">The world&apos;s most advanced duck</p>
            <div className="text-muted-foreground text-xs">Joined December 2021</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui-duckui/dialog'

export function DialogDemo() {
  const [open, setOpen] = React.useState(false)
  console.log(open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <PopoverDemo />
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

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

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'

import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger>Open popover</PopoverTrigger>
      <PopoverContent placement="bottom" className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@gentleduck/registry-ui-duckui/accordion'

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible={true} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Product Information</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it
            offers unparalleled performance and reliability.
          </p>
          <p>
            Key features include advanced processing capabilities, and an intuitive user interface designed for both
            beginners and experts.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Shipping Details</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days,
            while express shipping ensures delivery within 1-2 business days.
          </p>
          <p>
            All orders are carefully packaged and fully insured. Track your shipment in real-time through our dedicated
            tracking portal.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Return Policy</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We stand behind our products with a comprehensive 30-day return policy. If you&apos;re not completely
            satisfied, simply return the item in its original condition.
          </p>
          <p>
            Our hassle-free return process includes free return shipping and full refunds processed within 48 hours of
            receiving the returned item.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

import { ChevronsUpDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui-duckui/collapsible'

export function CollapsibleDemo() {
  return (
    <Collapsible className="flex w-[350px] flex-col gap-2">
      <div className="flex items-center justify-between gap-4 w-full px-2">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
        <CollapsibleTrigger>
          <div>
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </div>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

import { Slider } from '@gentleduck/registry-ui-duckui/slider'

type SliderProps = React.ComponentProps<typeof Slider>

export function SliderDemo({ className, ...props }: SliderProps) {
  return <Slider defaultValue={50} max={100} step={1} className={cn('w-[60%]', className)} {...props} />
}

import { Bold, Italic, Underline } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@gentleduck/registry-ui-duckui/toggle-group'

export function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline" type="single" onValueChange={(value) => console.log(value)}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

import { Toggle } from '@gentleduck/registry-ui-duckui/toggle'

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle italic">
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}

import { Progress } from '@gentleduck/registry-ui-duckui/progress'

export function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[60%]" />
}

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gentleduck/registry-ui-duckui/input-otp'

export function InputOTPDemo() {
  return (
    <InputOTP value={'123456'} onValueChange={(value) => console.log(value)}>
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@gentleduck/registry-ui-duckui/breadcrumb'
export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="size-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs/components">Components</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// import {
//   Menubar,
//   MenubarCheckboxItem,
//   MenubarContent,
//   MenubarItem,
//   MenubarMenu,
//   MenubarRadioGroup,
//   MenubarRadioItem,
//   MenubarSeparator,
//   MenubarShortcut,
//   MenubarSub,
//   MenubarSubContent,
//   MenubarSubTrigger,
//   MenubarTrigger,
// } from '@gentleduck/registry-ui-duckui/menubar'

// export function MenubarDemo() {
//   return (
//     <Menubar>
//       <MenubarMenu>
//         <MenubarTrigger>File</MenubarTrigger>
//         <MenubarContent>
//           <MenubarItem>
//             New Tab <MenubarShortcut>⌘T</MenubarShortcut>
//           </MenubarItem>
//           <MenubarItem>
//             New Window <MenubarShortcut>⌘N</MenubarShortcut>
//           </MenubarItem>
//           <MenubarItem disabled>New Incognito Window</MenubarItem>
//           <MenubarSeparator />
//           <MenubarSub>
//             <MenubarSubTrigger>Share</MenubarSubTrigger>
//             <MenubarSubContent>
//               <MenubarItem>Email link</MenubarItem>
//               <MenubarItem>Messages</MenubarItem>
//               <MenubarItem>Notes</MenubarItem>
//             </MenubarSubContent>
//           </MenubarSub>
//           <MenubarSeparator />
//           <MenubarItem>
//             Print... <MenubarShortcut>⌘P</MenubarShortcut>
//           </MenubarItem>
//         </MenubarContent>
//       </MenubarMenu>
//       <MenubarMenu>
//         <MenubarTrigger>Edit</MenubarTrigger>
//         <MenubarContent>
//           <MenubarItem>
//             Undo <MenubarShortcut>⌘Z</MenubarShortcut>
//           </MenubarItem>
//           <MenubarItem>
//             Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
//           </MenubarItem>
//           <MenubarSeparator />
//           <MenubarSub>
//             <MenubarSubTrigger>Find</MenubarSubTrigger>
//             <MenubarSubContent>
//               <MenubarItem>Search the web</MenubarItem>
//               <MenubarSeparator />
//               <MenubarItem>Find...</MenubarItem>
//               <MenubarItem>Find Next</MenubarItem>
//               <MenubarItem>Find Previous</MenubarItem>
//             </MenubarSubContent>
//           </MenubarSub>
//           <MenubarSeparator />
//           <MenubarItem>Cut</MenubarItem>
//           <MenubarItem>Copy</MenubarItem>
//           <MenubarItem>Paste</MenubarItem>
//         </MenubarContent>
//       </MenubarMenu>
//       <MenubarMenu>
//         <MenubarTrigger>View</MenubarTrigger>
//         <MenubarContent>
//           <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
//           <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
//           <MenubarSeparator />
//           <MenubarItem inset>
//             Reload <MenubarShortcut>⌘R</MenubarShortcut>
//           </MenubarItem>
//           <MenubarItem disabled inset>
//             Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
//           </MenubarItem>
//           <MenubarSeparator />
//           <MenubarItem inset>Toggle Fullscreen</MenubarItem>
//           <MenubarSeparator />
//           <MenubarItem inset>Hide Sidebar</MenubarItem>
//         </MenubarContent>
//       </MenubarMenu>
//       <MenubarMenu>
//         <MenubarTrigger>Profiles</MenubarTrigger>
//         <MenubarContent>
//           <MenubarRadioGroup value="benoit">
//             <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
//             <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
//             <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
//           </MenubarRadioGroup>
//           <MenubarSeparator />
//           <MenubarItem inset>Edit...</MenubarItem>
//           <MenubarSeparator />
//           <MenubarItem inset>Add Profile...</MenubarItem>
//         </MenubarContent>
//       </MenubarMenu>
//     </Menubar>
//   )
// }

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui-duckui/select'
import { Calendar, Clock, MicOff, Users, Video, X } from 'lucide-react'

export function SelectDemo() {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[240px] h-15 [&>div>div]:justify-start">
          <SelectValue placeholder="Choose a meeting" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Upcoming Meetings</SelectLabel>

            <SelectItem value="daily-standup">
              <div className="flex items-start gap-2">
                <Video className="mt-1 size-4.5 text-blue-500" />
                <div className="space-y-0.5 flex flex-col items-start">
                  <div className="font-medium">Daily Standup</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    9:00 AM - 9:15 AM
                  </div>
                </div>
              </div>
            </SelectItem>

            <SelectItem value="team-sync">
              <div className="flex items-start gap-2">
                <Users className="mt-1 h-4 w-4 text-green-600" />
                <div className="space-y-0.5 flex flex-col items-start">
                  <div className="font-medium">Team Sync</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Tomorrow at 11:00 AM
                  </div>
                </div>
              </div>
            </SelectItem>

            <SelectItem value="1on1">
              <div className="flex items-start gap-2">
                <MicOff className="mt-1 h-4 w-4 text-gray-500" />
                <div className="space-y-0.5 flex flex-col items-start">
                  <div className="font-medium">1-on-1 with Ahmed</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    2:00 PM - 2:30 PM
                  </div>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>{' '}
    </>
  )
}

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'

import { Command } from 'lucide-react'

type Checked = boolean
export function DropdownMenuCheckboxes() {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)
  const [position, setPosition] = React.useState('top')

  // open={true}
  // onOpenChange={(value) => {
  //   console.log(value)
  // }}
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" placement="top">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem checked={showStatusBar} onClick={() => setShowStatusBar(!showStatusBar)}>
            Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showActivityBar} disabled>
            Activity Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showPanel}>Panel</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition} defaultValue={position}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={true}>Status Bar</DropdownMenuItem>
          <DropdownMenuItem>Activity Bar</DropdownMenuItem>
          <DropdownMenuItem>Panel</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={true}>
            Preferences
            <DropdownMenuShortcut onKeysPressed={() => {}} keys="⌘">
              <Command />P
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut onKeysPressed={() => {}} keys="⌘">
              <Command />P
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
import { Calculator, CreditCard, Settings, Smile, User } from 'lucide-react'

import {
  Command as CCommand,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gentleduck/registry-ui-duckui/command'
import React from 'react'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import Table1Demo from './constants'
import { DuckTable, TableDemo } from '@gentleduck/registry-ui-duckui/table'

export function CommandDemo() {
  return (
    <CCommand>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut onKeysPressed={() => {}} keys="⌘P">
              ⌘P
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut onKeysPressed={() => {}} keys="⌘B">
              ⌘B
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut onKeysPressed={() => {}} keys="⌘S">
              ⌘S
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CCommand>
  )
}

export function SelectScrollable() {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>

        <SelectContent className="w-[280px]">
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
            <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
            <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe & Africa</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
            <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
            <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
            <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
            <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
            <SelectItem value="ist_indonesia">Indonesia Central Standard Time (WITA)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Australia & Pacific</SelectLabel>
            <SelectItem value="awst">Australian Western Standard Time (AWST)</SelectItem>
            <SelectItem value="acst">Australian Central Standard Time (ACST)</SelectItem>
            <SelectItem value="aest">Australian Eastern Standard Time (AEST)</SelectItem>
            <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
            <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>South America</SelectLabel>
            <SelectItem value="art">Argentina Time (ART)</SelectItem>
            <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
            <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
            <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}
