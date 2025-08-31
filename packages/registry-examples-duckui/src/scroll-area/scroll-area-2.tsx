import { ScrollArea } from '@gentleduck/registry-ui-duckui/scroll-area'
import Image from 'next/image'
import * as React from 'react'

export interface Artwork {
  artist: string
  art: string
}

export const works: Artwork[] = [
  {
    artist: 'Lina Escobar',
    art: 'https://images.pexels.com/photos/27309761/pexels-photo-27309761.jpeg',
  },
  {
    artist: 'Marco Duvall',
    art: 'https://images.pexels.com/photos/14757972/pexels-photo-14757972.jpeg',
  },
  {
    artist: 'Sahana Ramesh',
    art: 'https://images.pexels.com/photos/5046721/pexels-photo-5046721.jpeg',
  },
]

export default function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border" orientation="horizontal">
      <div className="flex w-max space-x-4 p-4">
        {works.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <div className="overflow-hiddend">
              <Image
                src={artwork.art}
                alt={`Photo by ${artwork.artist}`}
                draggable={false}
                className="max-h-[300px] select-none rounded-md object-cover"
                width={230}
                height={300}
              />
            </div>
            <figcaption className="pt-2 text-muted-foreground text-xs">
              Photo by <span className="font-semibold text-foreground">{artwork.artist}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </ScrollArea>
  )
}
