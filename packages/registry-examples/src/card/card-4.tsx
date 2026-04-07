'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  MotionCard,
  MotionCardContent,
  MotionCardFooter,
  MotionCardHeader,
  CardDescription,
  CardTitle,
} from '@gentleduck/registry-ui/card'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <MotionCard className="w-[350px]">
      <MotionCardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </MotionCardHeader>
      <MotionCardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>
        </div>
      </MotionCardContent>
      <MotionCardFooter className="flex">
        <MotionButton variant="outline">Cancel</MotionButton>
        <MotionButton>Deploy</MotionButton>
      </MotionCardFooter>
    </MotionCard>
  )
}
