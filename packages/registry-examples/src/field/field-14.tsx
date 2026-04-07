'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  MotionField,
  MotionFieldGroup,
} from '@gentleduck/registry-ui/field'
import { Input } from '@gentleduck/registry-ui/input'

export default function Demo() {
  return (
    <div className="w-full max-w-md">
      <form>
        <MotionFieldGroup>
          <FieldSet>
            <FieldLegend>Contact Info</FieldLegend>
            <FieldDescription>We will use this to reach you</FieldDescription>
            <MotionField index={0}>
              <FieldLabel htmlFor="motion-name">Full name</FieldLabel>
              <Input id="motion-name" placeholder="Jane Doe" />
            </MotionField>
            <MotionField index={1}>
              <FieldLabel htmlFor="motion-email">Email</FieldLabel>
              <Input id="motion-email" type="email" placeholder="jane@example.com" />
            </MotionField>
            <MotionField index={2}>
              <FieldLabel htmlFor="motion-phone">Phone</FieldLabel>
              <Input id="motion-phone" type="tel" placeholder="+1 (555) 000-0000" />
              <FieldDescription>Optional — for urgent inquiries only</FieldDescription>
            </MotionField>
          </FieldSet>
          <MotionField index={3} orientation="horizontal">
            <MotionButton type="submit">Submit</MotionButton>
            <MotionButton type="button" variant="outline">Cancel</MotionButton>
          </MotionField>
        </MotionFieldGroup>
      </form>
    </div>
  )
}
