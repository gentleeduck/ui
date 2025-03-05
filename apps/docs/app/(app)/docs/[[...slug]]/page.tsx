import { format, parseISO } from 'date-fns'
import { docs } from '../../../../.velite'

// export const generateStaticParams = async () =>
//   docs.map((post) => ({ slug: post.slug }))

// export const generateMetadata = ({ params }: { params: { slug: string } }) => {
//   const post = docs.find((post) => post.permalink === params.slug)
//   return { title: post?.title }
// }

const PostLayout = ({ params }: { params: { slug: string } }) => {
  console.log(params.slug)
  const post = docs.find((post) => params.slug.includes(post.slug))
  console.log(post)
  // const Content = getMDXComponent(post.body.code)

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time dateTime={post?.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post?.date), 'LLLL d, yyyy')}
        </time>
        <h1>{post?.title}</h1>
        <p className="mt-4 text-sm text-gray-700">{post?.excerpt}</p>
      </div>
    </article>
  )
  // <Content />
}

export default PostLayout
