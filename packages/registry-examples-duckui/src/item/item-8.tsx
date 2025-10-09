import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@gentleduck/registry-ui-duckui/item'
import Image from 'next/image'

const models = [
  {
    credit: 'Valeria Reverdo on Unsplash',
    description: 'Everyday tasks and UI generation.',
    image: 'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
    name: 'v0-1.5-sm',
  },
  {
    credit: 'Michael Oeser on Unsplash',
    description: 'Advanced thinking or reasoning.',
    image: 'https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop',
    name: 'v0-1.5-lg',
  },
  {
    credit: 'Cherry Laithang on Unsplash',
    description: 'Open Source model for everyone.',
    image: 'https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop',
    name: 'v0-2.0-mini',
  },
]

export default function ItemHeaderDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <ItemGroup className="grid grid-cols-3 gap-4">
        {models.map((model) => (
          <Item key={model.name} variant="outline">
            <ItemHeader>
              <Image
                alt={model.name}
                className="aspect-square w-full rounded-sm object-cover"
                height={128}
                src={model.image}
                width={128}
              />
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{model.name}</ItemTitle>
              <ItemDescription>{model.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}
