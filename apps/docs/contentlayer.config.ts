import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import 'contentlayer2/core'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}))

const source = makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
})

export default source
