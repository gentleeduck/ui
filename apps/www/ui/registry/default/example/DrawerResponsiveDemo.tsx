import * as React from 'react'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { AlertDialogCustom, Button, Input, Label } from '@/registry/default/ui/'

interface DataType {
  email: string
  userName: string
}

export default function DrawerDialogDemo() {
  const [data, setData] = React.useState<DataType>({ email: 'duck@duck.com', userName: '@duck-ui' })
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <AlertDialogCustom<typeof data>
      type={isDesktop ? 'dialog' : 'drawer'}
      state={data}
      header={{
        head: 'Goal',
        description: 'Set your daily calorie goal',
      }}
      footer={{
        submit: <Button type="submit">Save changes</Button>,
      }}
      // state={data}
      trigger={{ children: <Button variant="outline">Open</Button> }}
      content={{
        className: cn(isDesktop && 'max-w-[400px]'),
        children: (
          <ProfileForm
            data={data}
            setData={setData}
          />
        ),
      }}
    />
  )
}

function ProfileForm({ data, setData }: { data: DataType; setData: any }) {
  return (
    <form className={cn('grid items-start gap-4 my-4')}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          onChange={e => setData({ ...data, userName: e.target.value })}
          value={data.userName}
        />
      </div>
    </form>
  )
}
