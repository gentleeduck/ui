'use client'

import { InputGroupAddon, InputGroupInput, InputGroupText, MotionInputGroup } from '@gentleduck/registry-ui/input-group'
import { MotionLabel } from '@gentleduck/registry-ui/label'
import { AtSignIcon, GlobeIcon, LockIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <div className="flex flex-col gap-1.5">
        <MotionLabel htmlFor="motion-ig-email">Email</MotionLabel>
        <MotionInputGroup index={0}>
          <InputGroupAddon>
            <InputGroupText>
              <AtSignIcon />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="motion-ig-email" placeholder="you@example.com" />
        </MotionInputGroup>
      </div>
      <div className="flex flex-col gap-1.5">
        <MotionLabel htmlFor="motion-ig-website">Website</MotionLabel>
        <MotionInputGroup index={1}>
          <InputGroupAddon>
            <InputGroupText>
              <GlobeIcon />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="motion-ig-website" placeholder="https://example.com" />
        </MotionInputGroup>
      </div>
      <div className="flex flex-col gap-1.5">
        <MotionLabel htmlFor="motion-ig-password">Password</MotionLabel>
        <MotionInputGroup index={2}>
          <InputGroupAddon>
            <InputGroupText>
              <LockIcon />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="motion-ig-password" type="password" placeholder="Enter password" />
        </MotionInputGroup>
      </div>
    </div>
  )
}
