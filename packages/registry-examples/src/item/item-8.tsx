import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@gentleduck/registry-ui/item'
import Image from 'next/image'

const templates = [
  {
    description: 'Blog, portfolio, and marketing pages.',
    image: 'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
    name: 'Static Site',
  },
  {
    description: 'Auth, dashboard, and REST API scaffold.',
    image: 'https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop',
    name: 'Full-Stack App',
  },
  {
    description: 'Storybook, tests, and publish pipeline.',
    image: 'https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop',
    name: 'Component Library',
  },
]

export default function Demo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <ItemGroup className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <Item key={template.name} variant="outline">
            <ItemHeader>
              <Image
                alt={template.name}
                className="aspect-square w-full rounded-sm object-cover"
                height={128}
                src={template.image}
                width={128}
              />
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{template.name}</ItemTitle>
              <ItemDescription>{template.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}
