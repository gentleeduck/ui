'use client'

import { InputGroupAddon, InputGroupInput, InputGroupText, MotionInputGroup } from '@gentleduck/registry-ui/input-group'
import { Label } from '@gentleduck/registry-ui/label'
import { AtSignIcon, GlobeIcon, LockIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="motion-ig-email">Email</Label>
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
        <Label htmlFor="motion-ig-website">Website</Label>
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
        <Label htmlFor="motion-ig-password">Password</Label>
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
