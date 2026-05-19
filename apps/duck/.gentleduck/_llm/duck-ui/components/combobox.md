```tsx title="components/combobox-1.tsx"
// import from your project: import Demo from '@/components/combobox-1'
'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

const frameworks = [
  {
    label: 'Next.js',
    value: 'next.js',
  },
  {
    label: 'SvelteKit',
    value: 'sveltekit',
  },
  {
    label: 'Nuxt.js',
    value: 'nuxt.js',
  },
  {
    label: 'Remix',
    value: 'remix',
  },
  {
    label: 'Astro',
    value: 'astro',
  },
]

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="w-[230px] justify-between" role="combobox" variant="outline">
          {value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[230px] min-w-auto p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                  value={framework.value}>
                  {framework.label}
                  <Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Philosophy

Comboboxes solve the "too many options" problem  -  they combine a text input with a filterable dropdown. We make the component fully generic (`Combobox

## Installation

The Combobox is built using a composition of the `` and the `` components.

See installation instructions for the [Popover](/duck-ui/components/popover#installation) and the [Command](/duck-ui/components/command#installation) components.

## Usage

```tsx showLineNumbers
// components/example-combobox.tsx
"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function ExampleCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

Note: The `Combobox` wrapper component (`@/components/ui/combobox`) uses item `value`s for `value`, `defaultValue`, and `onValueChange`. Use `label` for display only.

## Examples

### Combobox

```tsx title="components/combobox-2.tsx"
// import from your project: import Demo from '@/components/combobox-2'
'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

const frameworks = [
  {
    label: 'Next.js',
    value: 'next.js',
  },
  {
    label: 'SvelteKit',
    value: 'sveltekit',
  },
  {
    label: 'Nuxt.js',
    value: 'nuxt.js',
  },
  {
    label: 'Remix',
    value: 'remix',
  },
  {
    label: 'Astro',
    value: 'astro',
  },
]
export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="w-[230px] justify-between" role="combobox" variant="outline">
          {value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[230px] min-w-auto p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                  value={framework.value}>
                  {framework.label}
                  <Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

### Popover

```tsx title="components/combobox-3.tsx"
// import from your project: import Demo from '@/components/combobox-3'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import * as React from 'react'

type Status = {
  value: string
  label: string
}
const statuses: Status[] = [
  {
    label: 'Backlog',
    value: 'backlog',
  },
  {
    label: 'Todo',
    value: 'todo',
  },
  {
    label: 'In Progress',
    value: 'in progress',
  },
  {
    label: 'Done',
    value: 'done',
  },
  {
    label: 'Canceled',
    value: 'canceled',
  },
]
export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)
  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Status</p>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="w-[150px] justify-start" variant="outline">
            {selectedStatus ? selectedStatus.label : '+ Set status'}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="w-[210px] min-w-auto p-0">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    onSelect={(value) => {
                      setSelectedStatus(statuses.find((priority) => priority.value === value) || null)
                      setOpen(false)
                    }}
                    value={status.value}>
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
```

### Dropdown menu

```tsx title="components/combobox-4.tsx"
// import from your project: import Demo from '@/components/combobox-4'
'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import * as React from 'react'

const labels = ['feature', 'bug', 'enhancement', 'documentation', 'design', 'question', 'maintenance']
export default function Demo() {
  const [label, setLabel] = React.useState('feature')
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
      <p className="font-medium text-sm leading-none">
        <span className="mr-2 rounded-lg bg-primary px-2 py-1 text-primary-foreground text-xs">{label}</span>
        <span className="text-muted-foreground">Create a new project</span>
      </p>
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Assign to...</DropdownMenuItem>
            <DropdownMenuItem>Set due date...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Apply label</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput autoFocus={true} className="h-9" placeholder="Filter label..." />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {labels.map((label) => (
                        <CommandItem
                          key={label}
                          onSelect={(value) => {
                            setLabel(value)
                            setOpen(false)
                          }}
                          value={label}>
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
```

### Responsive

You can create a responsive combobox by using the `` on desktop and the `` components on mobile.

```tsx title="components/combobox-5.tsx"
// import from your project: import Demo from '@/components/combobox-5'
'use client'

import { useMediaQuery } from '@gentleduck/hooks/use-media-query'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@gentleduck/registry-ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import * as React from 'react'

type Status = {
  value: string
  label: string
}

const statuses: Status[] = [
  {
    label: 'Backlog',
    value: 'backlog',
  },
  {
    label: 'Todo',
    value: 'todo',
  },
  {
    label: 'In Progress',
    value: 'in progress',
  },
  {
    label: 'Done',
    value: 'done',
  },
  {
    label: 'Canceled',
    value: 'canceled',
  },
]

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)

  if (isDesktop) {
    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="w-[200px] justify-start" variant="outline">
            {selectedStatus ? selectedStatus.label : '+ Set status'}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-[200px] min-w-auto p-0">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button className="w-[200px] justify-start" variant="outline">
          {selectedStatus ? selectedStatus.label : '+ Set status'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: Status | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              onSelect={(value) => {
                setSelectedStatus(statuses.find((priority) => priority.value === value) || null)
                setOpen(false)
              }}
              value={status.value}>
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

### Form

```tsx title="components/combobox-6.tsx"
// import from your project: import Demo from '@/components/combobox-6'
'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@gentleduck/registry-ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const FormSchema = z.object({
  language: z.string({
    error: 'Please select a language.',
  }),
})

export default function Demo() {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="language"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-combobox-language">Language</FieldLabel>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                  <Button
                    className={cn('w-[400px] justify-between', !field.value && 'text-muted-foreground')}
                    id="form-rhf-combobox-language"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={fieldState.invalid}
                    variant="outline">
                    {field.value
                      ? languages.find((language) => language.value === field.value)?.label
                      : 'Select language'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] min-w-auto p-0 [&>div]:max-w-full">
                  <Command>
                    <CommandInput className="h-9" placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            key={language.value}
                            onSelect={() => {
                              field.onChange(language.value)
                              setOpen(false)
                            }}
                            value={language.label}>
                            {language.label}
                            <Check
                              className={cn('ms-auto', language.value === field.value ? 'opacity-100' : 'opacity-0')}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FieldDescription>This is the language that will be used in the dashboard.</FieldDescription>
              {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Component Composition

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

```tsx title="components/combobox-7.tsx"
// import from your project: import Demo from '@/components/combobox-7'
'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

const options = [
  { label: 'صفحة هبوط', value: 'landing' },
  { label: 'لوحة تحكم', value: 'dashboard' },
  { label: 'متجر إلكتروني', value: 'ecommerce' },
  { label: 'مدونة', value: 'blog' },
  { label: 'معرض أعمال', value: 'portfolio' },
  { label: 'نظام حجوزات', value: 'booking' },
]

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const selectedLabel = value ? options.find((x) => x.value === value)?.label : undefined

  return (
    <Popover dir="rtl" onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="w-57.5 justify-between text-start" role="combobox" variant="outline">
          {selectedLabel ?? 'اختر نوع المشروع...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent dir="rtl" className="w-57.5 min-w-auto p-0">
        <Command dir="rtl">
          <CommandInput className="h-9 text-start" placeholder="ابحث عن نوع المشروع..." />

          <CommandList>
            <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>

            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  className="text-start"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
                  {item.label}

                  {/* logical margin so it works for RTL/LTR */}
                  <Check className={cn('ms-auto', value === item.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Motion

} title="Alpha: Motion Compositions" tone="warning">
  Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionCombobox` and `MotionComboboxItem` for motion-powered popover and checkbox animations. The trigger uses `MotionButton`, the dropdown uses `MotionPopoverContent`, and each item's checkbox bounces on toggle.

```tsx title="components/combobox-8.tsx"
// import from your project: import Demo from '@/components/combobox-8'
'use client'

import { cn } from '@gentleduck/libs/cn'
import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { MotionPopover, MotionPopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

const frameworks = [
  { label: 'Next.js', value: 'next.js' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt.js', value: 'nuxt.js' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
]

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <MotionPopover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <MotionButton aria-expanded={open} className="w-57.5 justify-between" role="combobox" variant="outline">
          {value ? frameworks.find((f) => f.value === value)?.label : 'Select framework...'}
          <ChevronsUpDown className="opacity-50" />
        </MotionButton>
      </PopoverTrigger>
      <MotionPopoverContent className="w-57.5 min-w-auto p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework, _i) => (
                <CommandItem
                  key={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                  value={framework.value}>
                  {framework.label}
                  <Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </MotionPopoverContent>
    </MotionPopover>
  )
}
```

}>
  Requires the `motion` package. Use `MotionCombobox` instead of `Combobox` and `MotionComboboxItem` instead of `ComboboxItem`. All other sub-components stay the same.

## API Reference

### Combobox\<TData, TType>

A generic combobox component built on top of `Popover` and `Command`. Supports both single and multiple selection via the `TType` generic parameter (defaults to `'single'`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TData` | - | (required) Readonly array of `{ label: string; value: string }` objects to display as options. |
| `children` | `(item: TData) => React.ReactNode` | - | (required) Render function that receives the `items` array and returns the list content (e.g. `ComboboxItem` elements). |
| `value` | `TData[number]['value']` (single) or `TData[number]['value'][]` (multiple) | - | Controlled selected value. Shape depends on `TType`. |
| `defaultValue` | `TData[number]['value']` (single) or `TData[number]['value'][]` (multiple) | - | Uncontrolled default value. Shape depends on `TType`. |
| `onValueChange` | `(value) => void` | - | Callback fired when the value changes. Receives a single string (single mode) or string array (multiple mode). |
| `withSearch` | `boolean` | `true` | Whether to show the search input inside the command list. |
| `showSelected` | `boolean` | `true` | Whether to display the currently selected value(s) in the trigger button. In multiple mode, values beyond 2 are collapsed into a "+N Selected" badge. |
| `commandTriggerPlaceholder` | `string` | `'Select item...'` | Placeholder text shown in the trigger button when no value is selected. |
| `commandEmpty` | `string` | `'Nothing found.'` | Text shown inside the command list when no results match the search query. |
| `popover` | `React.ComponentPropsWithoutRef<typeof Popover>` | - | Props spread onto the root `Popover` component. |
| `popoverTrigger` | `React.ComponentPropsWithoutRef<typeof Button>` | - | Props spread onto the trigger `Button`. The `variant` defaults to `'dashed'` when not provided. |
| `popoverContent` | `React.ComponentPropsWithoutRef<typeof PopoverContent>` | - | Props spread onto `PopoverContent`. `className` is merged with the default `'w-(--gentleduck-popover-trigger-width) p-0'`. |
| `command` | `React.ComponentPropsWithoutRef<typeof Command>` | - | Props spread onto the inner `Command` component. |
| `commandInput` | `React.ComponentPropsWithoutRef<typeof CommandInput>` | - | Props spread onto `CommandInput` when `withSearch` is `true`. |

### ComboboxItem\<T>

A single selectable item inside the combobox list. Renders a `CommandItem` with a `Checkbox` indicator.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `T extends { label: string; value: string }` | - | (required) The item object. Its `label` is displayed as text and `value` is used for selection. |
| `onSelect` | `(value: T['value']) => void` | - | Callback fired when this item is selected. Receives the item's `value`. |
| `checked` | `boolean` | - | Whether the checkbox indicator shows as checked. |
| `...props` | `Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, 'onSelect'>` | - | Additional props inherited from `CommandItem` (excluding `onSelect`). |

### ComboboxGroup

A convenience wrapper around `CommandGroup` for grouping combobox items.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | (required) `ComboboxItem` elements or other content to render inside the group. |
| `...props` | `React.ComponentPropsWithoutRef<typeof CommandGroup>` | - | Additional props inherited from `CommandGroup`. |

### MotionCombobox

Uses `MotionButton` for the trigger and `MotionPopoverContent` for the dropdown with spring enter/exit animations. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `ComboboxProps` | - | All props from `Combobox` are supported |

### MotionComboboxItem

Uses `MotionCheckbox` with bounce animation on toggle. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | - | Stagger delay index for entrance animation |
| `...props` | `ComboboxItemProps` | - | All props from `ComboboxItem` are supported |