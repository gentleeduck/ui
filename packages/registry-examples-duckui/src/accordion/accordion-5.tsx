import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@gentleduck/registry-ui-duckui/accordion'

export default function AccordionRtlDemo() {
  return (
    <div dir="rtl">
      <Accordion className="w-[350px]" collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>هل هو قابل للوصول؟</AccordionTrigger>
          <AccordionContent>نعم. يلتزم بنمط تصميم WAI-ARIA.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>هل هو منسق؟</AccordionTrigger>
          <AccordionContent>نعم. يأتي بأنماط افتراضية تتوافق مع المظهر الجمالي للمكونات الأخرى.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>هل هو متحرك؟</AccordionTrigger>
          <AccordionContent>نعم. هو متحرك افتراضيا، لكن يمكنك تعطيله إذا أردت.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
