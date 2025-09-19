'use client'
import { Card, CardContent } from '@gentleduck/registry-ui-duckui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@gentleduck/registry-ui-duckui/carousel'

export default function CarouselDemo() {
  return (
    <Carousel
      className="w-full max-w-xs"
      opts={{
        align: 'start',
      }}
      orientation="vertical">
      <CarouselContent className="-mt-1 h-[200px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem className="pt-1 md:basis-1/2" key={`item-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="font-semibold text-3xl">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
