import { Check, Plus, Send } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardFooter, CardHeader, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,Input, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/'
import { Button } from '@/registry/registry-ui-components'

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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage alt="Image" src="/avatars/01.png" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-sm text-muted-foreground">m@example.com</p>
            </div>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="ml-auto rounded-full" onClick={() => setOpen(true)} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>New message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                className={cn(
                  'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                  message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted',
                )}
                key={index}>
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            className="flex w-full items-center space-x-2"
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
              className="flex-1"
              id="message"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              value={input}
            />
            <Button disabled={inputLength === 0} size="icon" type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="gap-0 p-0 outline-hidden">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>Invite a user to this thread. This will create a new group message.</DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t">
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="p-2">
                {users.map((user) => (
                  <CommandItem
                    className="flex items-center px-2"
                    key={user.email}
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user))
                      }

                      return setSelectedUsers([...users].filter((u) => [...selectedUsers, user].includes(u)))
                    }}>
                    <Avatar>
                      <AvatarImage alt="Image" src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    {selectedUsers.includes(user) ? <Check className="ml-auto flex h-5 w-5 text-primary" /> : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar className="inline-block border-2 border-background" key={user.email}>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select users to add to this thread.</p>
            )}
            <Button
              disabled={selectedUsers.length < 2}
              onClick={() => {
                setOpen(false)
              }}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
