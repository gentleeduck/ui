import { BlockDisplay } from '~/components/blocks'
import { getAllBlockIds } from '~/lib/blocks'

export const revalidate = false
export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const registryCategories = [
    {
      name: 'Sidebar',
      slug: 'sidebar',
      hidden: false,
    },
    {
      name: 'Dashboard',
      slug: 'dashboard',
      hidden: true,
    },
    {
      name: 'Authentication',
      slug: 'authentication',
      hidden: false,
    },
    {
      name: 'Login',
      slug: 'login',
      hidden: false,
    },
    {
      name: 'Calendar',
      slug: 'calendar',
      hidden: false,
    },
  ]
  return registryCategories.map((category) => ({
    categories: [category.slug],
  }))
}

export default async function BlocksPage({ params }: { params: Promise<{ categories?: string[] }> }) {
  const { categories = [] } = await params
  const blocks = await getAllBlockIds(['registry:block'], categories)

  return (
    <div className="flex flex-col gap-12 md:gap-24">
      {blocks.map((name) => (
        <BlockDisplay name={name} key={name} />
      ))}
    </div>
  )
}
