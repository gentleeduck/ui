'use client'

import { cn } from '@gentleduck/libs/cn'
import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@gentleduck/registry-ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@gentleduck/registry-ui/dialog'
import { Input } from '@gentleduck/registry-ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { ArrowUpIcon, CheckIcon, PlusIcon } from 'lucide-react'
import * as React from 'react'

const chatPartner = 'Sofia Davis'

const users = [
  {
    avatar: '/avatars/01.png',
    email: 'm@example.com',
    name: 'Olivia Martin',
  },
  {
    avatar: '/avatars/03.png',
    email: 'isabella.nguyen@email.com',
    name: 'Isabella Nguyen',
  },
  {
    avatar: '/avatars/05.png',
    email: 'emma@example.com',
    name: 'Emma Wilson',
  },
  {
    avatar: '/avatars/02.png',
    email: 'lee@example.com',
    name: 'Jackson Lee',
  },
  {
    avatar: '/avatars/04.png',
    email: 'will@email.com',
    name: 'William Kim',
  },
] as const

type User = (typeof users)[number]

export function CardsChat() {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([])

  const [messages, setMessages] = React.useState([
    {
      content: 'Hi, how can I help you today?',
      role: 'agent',
    },
    {
      content: "Hey, I'm having trouble with my account.",
      role: 'user',
    },
    {
      content: 'What seems to be the problem?',
      role: 'agent',
    },
    {
      content: "I can't log in.",
      role: 'user',
    },
  ])
  const [input, setInput] = React.useState('')
  const inputLength = input.trim().length

  return (
    <div className="h-fi">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center gap-4">
            <Avatar className="border">
              <AvatarImage alt={chatPartner} src="/avatars/01.png" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <p className="font-medium text-sm leading-none">{chatPartner}</p>
              <p className="text-muted-foreground text-xs">m@example.com</p>
            </div>
          </div>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                className="ml-auto size-8 rounded-full"
                onClick={() => setOpen(true)}
                size="icon"
                variant="secondary">
                <PlusIcon aria-hidden="true" />
                <span className="sr-only">New message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>New message</TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {(() => {
              const messageCounts = new Map<string, number>()

              return messages.map((message) => {
                const signature = `${message.role}:${message.content}`
                const occurrence = (messageCounts.get(signature) ?? 0) + 1
                messageCounts.set(signature, occurrence)

                return (
                  <div
                    className={cn(
                      'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                      message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted',
                    )}
                    key={`${signature}:${occurrence}`}>
                    {message.content}
                  </div>
                )
              })
            })()}
          </div>
        </CardContent>
        <CardFooter>
          <form
            className="relative w-full"
            onSubmit={(event) => {
              event.preventDefault()
              if (inputLength === 0) return
              setMessages([
                ...messages,
                {
                  content: input,
                  role: 'user',
                },
              ])
              setInput('')
            }}>
            <Input
              autoComplete="off"
              className="flex-1 pr-10"
              id={`${id}-message`}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Type your message..."
              value={input}
            />
            <Button
              className="!size-6 absolute top-1/2 right-2 -translate-y-1/2 rounded-full"
              disabled={inputLength === 0}
              size="icon"
              type="submit">
              <ArrowUpIcon aria-hidden="true" className="!size-3.5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pt-5 pb-4">
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>Invite a user to this thread. This will create a new group message.</DialogDescription>
          </DialogHeader>
          <Command className="max-w-full overflow-hidden rounded-t-none border-t bg-transparent">
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    className="data-[active=true]:opacity-50"
                    data-active={selectedUsers.includes(user)}
                    key={user.email}
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user))
                      }

                      return setSelectedUsers([...users].filter((u) => [...selectedUsers, user].includes(u)))
                    }}>
                    <Avatar className="border">
                      <AvatarImage alt={user.name} src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="font-medium text-sm leading-none">{user.name}</p>
                      <p className="text-muted-foreground text-sm">{user.email}</p>
                    </div>
                    {selectedUsers.includes(user) ? (
                      <CheckIcon aria-hidden="true" className="ml-auto flex size-4 text-primary" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar className="inline-block border" key={user.email}>
                    <AvatarImage alt={user.name[0]} src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Select users to add to this thread.</p>
            )}
            <Button
              disabled={selectedUsers.length < 2}
              onClick={() => {
                setOpen(false)
              }}
              size="sm">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
