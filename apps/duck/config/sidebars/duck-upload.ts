import { defineSidebar } from './types'

export const duckUploadSidebar = defineSidebar([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-upload/introduction' },
      { title: 'Installation', href: '/duck-upload/installation' },
    ],
  },
  {
    title: 'Concepts',
    items: [{ title: 'Design Decisions', href: '/duck-upload/design' }],
  },
  {
    title: 'Core',
    items: [
      { title: 'Core Overview', href: '/duck-upload/core' },
      { title: 'client', href: '/duck-upload/core/client' },
      { title: 'Contracts', href: '/duck-upload/core/contracts' },
      { title: 'Engine', href: '/duck-upload/core/engine' },
      { title: 'Persistence', href: '/duck-upload/core/persistence' },
      { title: 'Utilities', href: '/duck-upload/core/utils' },
    ],
  },
  {
    title: 'Guides',
    items: [{ title: 'Guides', href: '/duck-upload/guides' }],
  },
  {
    title: 'Course',
    items: [
      { title: 'course overview', href: '/duck-upload/course' },
      { title: 'chapter 1: your first upload', href: '/duck-upload/course/chapter-1' },
      { title: 'chapter 2: strategies & backends', href: '/duck-upload/course/chapter-2' },
      { title: 'chapter 3: react integration', href: '/duck-upload/course/chapter-3' },
      { title: 'chapter 4: multipart uploads', href: '/duck-upload/course/chapter-4' },
      { title: 'chapter 5: pause, resume & retry', href: '/duck-upload/course/chapter-5' },
      { title: 'chapter 6: persistence & offline', href: '/duck-upload/course/chapter-6' },
      { title: 'chapter 7: validation & plugins', href: '/duck-upload/course/chapter-7' },
      { title: 'chapter 8: production patterns', href: '/duck-upload/course/chapter-8' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { title: 'React Overview', href: '/duck-upload/react' },
      { title: 'UploadProvider', href: '/duck-upload/react/upload-provider' },
      { title: 'useUploader', href: '/duck-upload/react/use-uploader' },
    ],
  },
  {
    title: 'Adapters',
    items: [
      { title: 'Strategies Overview', href: '/duck-upload/strategies' },
      { title: 'Multipart Strategy', href: '/duck-upload/strategies/multipart' },
      { title: 'POST Strategy', href: '/duck-upload/strategies/post' },
      { title: 'Strategy Registry', href: '/duck-upload/strategies/registry' },
    ],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-upload/changelog' }],
  },
])
