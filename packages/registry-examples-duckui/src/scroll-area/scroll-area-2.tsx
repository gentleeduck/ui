import { ScrollArea } from '@gentleduck/registry-ui-duckui/scroll-area'
import Image from 'next/image'

export interface Artwork {
  artist: string
  art: string
}

export const works: Artwork[] = [
  {
    art: 'https://images.pexels.com/photos/27309761/pexels-photo-27309761.jpeg',
    artist: 'Lina Escobar',
  },
  {
    art: 'https://images.pexels.com/photos/14757972/pexels-photo-14757972.jpeg',
    artist: 'Marco Duvall',
  },
  {
    art: 'https://images.pexels.com/photos/5046721/pexels-photo-5046721.jpeg',
    artist: 'Sahana Ramesh',
  },
]

export default function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {works.map((artwork) => (
          <figure className="shrink-0" key={artwork.artist}>
            <div className="overflow-hiddend">
              <Image
                alt={`Photo by ${artwork.artist}`}
                className="max-h-[300px] select-none rounded-md object-cover"
                draggable={false}
                height={300}
                src={artwork.art}
                width={230}
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
