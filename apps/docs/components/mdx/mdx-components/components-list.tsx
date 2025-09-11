import Link from 'next/link'
import { docs } from '~/.velite'

export function ComponentsList() {
  const components = docs.filter((doc) => doc.component)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {components.map((component) => (
        <Link
          key={component.title}
          href={component.permalink}
          className="text-lg font-medium underline-offset-4 hover:underline md:text-base">
          {component.title}
        </Link>
      ))}
    </div>
  )
}
