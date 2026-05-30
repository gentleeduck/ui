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
      { title: 'Client', href: '/duck-upload/core/client' },
      { title: 'Contracts', href: '/duck-upload/core/contracts' },
      { title: 'Engine', href: '/duck-upload/core/engine' },
      { title: 'Errors', href: '/duck-upload/core/errors' },
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
      { title: 'Course overview', href: '/duck-upload/course' },
      { title: 'Chapter 1: Your first upload', href: '/duck-upload/course/chapter-1' },
      { title: 'Chapter 2: Strategies & backends', href: '/duck-upload/course/chapter-2' },
      { title: 'Chapter 3: React integration', href: '/duck-upload/course/chapter-3' },
      { title: 'Chapter 4: Multipart uploads', href: '/duck-upload/course/chapter-4' },
      { title: 'Chapter 5: Pause, resume & retry', href: '/duck-upload/course/chapter-5' },
      { title: 'Chapter 6: Persistence & offline', href: '/duck-upload/course/chapter-6' },
      { title: 'Chapter 7: Validation & plugins', href: '/duck-upload/course/chapter-7' },
      { title: 'Chapter 8: Production patterns', href: '/duck-upload/course/chapter-8' },
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
