import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'

export default function AvatarDemo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar src="https://github.com/gentleeduck/ui/blob/master/apps/docs/public/logo.png?raw=true" alt="DU" />
      <Avatar className="rounded-lg" src="https://avatars.githubusercontent.com/u/108896341?v=4" alt="WD" />
      <div className="-space-x-2 flex *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
        <Avatar src="https://github.com/gentleeduck/ui/blob/master/apps/docs/public/logo.png?raw=true" alt="DU" />
        <Avatar src="https://avatars.githubusercontent.com/u/108896341?v=4" alt="WD" />
        <Avatar
          src="https://raw.githubusercontent.com/wildduck2/duck-starter-kit/15fbc61fb02cd21a873108b380ca12fe31f50099/apps/document-client/public/placeholder2.webp"
          alt="GD"
        />
      </div>
    </div>
  )
}
