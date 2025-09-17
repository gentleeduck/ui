import { Button } from '@gentleduck/registry-ui-duckui/button'
import Link from 'next/link'
import { BlockDisplay } from '~/components/blocks'

export const dynamic = 'force-static'
export const revalidate = false

const FEATURED_BLOCKS = ['signup-1']

export default async function BlocksPage() {
  return (
    <div className="flex flex-col gap-12 md:gap-24">
      {FEATURED_BLOCKS.map((name) => (
        <BlockDisplay name={name} key={name} />
      ))}
      <div className="container-wrapper">
        <div className="container flex justify-center py-6">
          <Button asChild variant="outline">
            <Link href="/blocks/sidebar">Browse more blocks</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
