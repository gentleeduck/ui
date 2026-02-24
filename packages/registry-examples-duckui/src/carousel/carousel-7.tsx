'use client'
import { Card, CardContent } from '@gentleduck/registry-ui-duckui/card'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@gentleduck/registry-ui-duckui/carousel'

export default function CarouselRtlDemo() {
  return (
    <div dir="rtl">
      <Carousel
        className="w-full max-w-xs"
        opts={{
          direction: 'rtl',
        }}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={`item-${index + 1}`}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="font-semibold text-4xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
