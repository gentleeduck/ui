import Upload1Demo from '@/registry/registry-examples-components/upload/upload-1'
import { trpc } from '@/trpc/react'
// import IndexPage from '@/test/test'

export default async function index() {
  return (
    <div className="container xl:border-x  max-w-screen-2xl border-b h-screen pt-8">
      <Upload1Demo />
    </div>
  )
}
