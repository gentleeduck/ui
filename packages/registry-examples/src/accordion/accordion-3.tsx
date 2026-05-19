import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@gentleduck/registry-ui/accordion'
import { ChevronDown } from 'lucide-react'

export default function Demo() {
  return (
    <Accordion className="w-[350px]" collapsible type="single">
      <AccordionItem value="item-1">
        <AccordionTrigger icon={<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}>
          Is it accessible?
        </AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger icon={<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}>
          Is it styled?
        </AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger icon={<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}>
          Is it animated?
        </AccordionTrigger>
        <AccordionContent>Yes. It&apos;s animated by default, but you can disable it if you prefer.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
