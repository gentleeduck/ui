import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'

export default function AvatarDemo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar
        alt="DU"
        src="https://github.com/gentleeduck/duck-ui/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true"
      />
      <Avatar alt="WD" className="rounded-lg" src="https://avatars.githubusercontent.com/u/108896341?v=4" />
      <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
        <Avatar
          alt="DU"
          src="https://github.com/gentleeduck/duck-ui/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true"
        />
        <Avatar alt="WD" src="https://avatars.githubusercontent.com/u/108896341?v=4" />
        <Avatar
          alt="GD"
          src="https://raw.githubusercontent.com/wildduck2/duck-starter-kit/15fbc61fb02cd21a873108b380ca12fe31f50099/apps/document-client/public/placeholder2.webp"
        />
      </div>
    </div>
  )
}
