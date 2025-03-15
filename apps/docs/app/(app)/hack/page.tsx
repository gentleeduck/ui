'use client'

import { Button } from '@duck/registry-ui-duckui/button'
import { HH } from './fuck'
import { Inbox } from 'lucide-react'

export default function Page() {
  // return <HH />
  return (
    <div className="flex flex-col items-center gap-2 place-self-center">
      <Button size={'xs'}>Button</Button>
      <Button size={'sm'}>Button</Button>
      <Button size={'default'}>Button</Button>
      <Button size={'lg'}>Button</Button>
      <Button size={'xl'}>Button</Button>
      <Button size={'2xl'}>Button</Button>
      <Button size={'3xl'}>Button</Button>

      <Button size={'xs'} icon={<Inbox />}>
        Button
      </Button>
      <Button size={'sm'} icon={<Inbox />}>
        Button
      </Button>
      <Button size={'default'} icon={<Inbox />}>
        Button
      </Button>
      <Button size={'lg'} icon={<Inbox />}>
        Button
      </Button>
      <Button size={'xl'} icon={<Inbox />}>
        Button
      </Button>
      <Button size={'2xl'} icon={<Inbox />}>
        Button
      </Button>
      <Button size={'3xl'} icon={<Inbox />}>
        Button
      </Button>
    </div>
  )
}
