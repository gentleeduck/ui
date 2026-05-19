'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  CardDescription,
  CardTitle,
  MotionCard,
  MotionCardContent,
  MotionCardFooter,
  MotionCardHeader,
} from '@gentleduck/registry-ui/card'
import { MotionInput } from '@gentleduck/registry-ui/input'
import { MotionLabel } from '@gentleduck/registry-ui/label'
import {
  MotionSelect,
  MotionSelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <MotionCard className="w-[350px]">
      <MotionCardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </MotionCardHeader>
      <MotionCardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <MotionLabel htmlFor="name" index={0}>
                Name
              </MotionLabel>
              <MotionInput id="name" placeholder="Name of your project" index={1} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <MotionLabel htmlFor="framework" index={2}>
                Framework
              </MotionLabel>
              <MotionSelect>
                <SelectTrigger id="framework" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <MotionSelectContent>
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </MotionSelectContent>
              </MotionSelect>
            </div>
          </div>
        </form>
      </MotionCardContent>
      <MotionCardFooter className="flex">
        <MotionButton variant="outline">Cancel</MotionButton>
        <MotionButton>Deploy</MotionButton>
      </MotionCardFooter>
    </MotionCard>
  )
}
