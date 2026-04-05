'use client'

import {
  Accordion,
  MotionAccordionContent,
  MotionAccordionItem,
  MotionAccordionTrigger,
} from '@gentleduck/registry-ui/accordion'

export default function Demo() {
  return (
    <Accordion className="w-[350px]" collapsible type="single">
      <MotionAccordionItem value="item-1">
        <MotionAccordionTrigger>Is it accessible?</MotionAccordionTrigger>
        <MotionAccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</MotionAccordionContent>
      </MotionAccordionItem>
      <MotionAccordionItem value="item-2">
        <MotionAccordionTrigger>Is it styled?</MotionAccordionTrigger>
        <MotionAccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </MotionAccordionContent>
      </MotionAccordionItem>
      <MotionAccordionItem value="item-3">
        <MotionAccordionTrigger>Is it animated?</MotionAccordionTrigger>
        <MotionAccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </MotionAccordionContent>
      </MotionAccordionItem>
    </Accordion>
  )
}
