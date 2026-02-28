import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar'

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage alt="@gentleduck" src="https://github.com/gentleeduck.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
