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
      className="w-full max-w-sm"
      opts={{
        align: 'start',
      }}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={`item-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
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
