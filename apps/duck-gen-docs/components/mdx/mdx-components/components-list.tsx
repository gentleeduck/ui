import Link from 'next/link'
import { docs } from '~/.velite'

export function ComponentsList() {
  const components = docs.filter((doc) => doc.component)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {components.map((component) => (
        <Link
          className="font-medium text-lg underline-offset-4 hover:underline md:text-base"
          href={component.permalink}
          key={component.title}>
          {component.title}
        </Link>
      ))}
    </div>
  )
}
