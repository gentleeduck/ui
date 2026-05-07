'use client'

import { AvatarFallback, AvatarImage, MotionAvatar, MotionAvatarGroup } from '@gentleduck/registry-ui/avatar'

export default function Demo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <MotionAvatar>
        <AvatarImage
          alt="GD"
          src="https://github.com/gentleeduck/gentleduck/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true"
        />
        <AvatarFallback>GD</AvatarFallback>
      </MotionAvatar>
      <MotionAvatar className="rounded-lg">
        <AvatarImage alt="WD" src="https://avatars.githubusercontent.com/u/108896341?v=4" />
        <AvatarFallback className="rounded-lg">WD</AvatarFallback>
      </MotionAvatar>
      <MotionAvatarGroup
        imgs={[
          {
            id: '1',
            src: 'https://github.com/gentleeduck/gentleduck/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true',
            alt: 'GD',
            fallback: 'GD',
          },
          { id: '2', src: 'https://avatars.githubusercontent.com/u/108896341?v=4', alt: 'WD', fallback: 'WD' },
          {
            id: '3',
            src: 'https://raw.githubusercontent.com/wildduck2/duck-starter-kit/15fbc61fb02cd21a873108b380ca12fe31f50099/apps/document-client/public/placeholder2.webp',
            alt: 'GD',
            fallback: 'GD',
          },
          { id: '4', alt: 'JD', fallback: 'JD' },
          { id: '5', alt: 'MK', fallback: 'MK' },
        ]}
        maxVisible={3}
      />
    </div>
  )
}
