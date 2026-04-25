import type { IDocsConfig } from '@gentleduck/docs'

export const DuckUploadConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-upload/introduction',
      title: 'Getting Started',
      items: [
        { href: '/duck-upload/introduction', title: 'Introduction', items: [] },
        { href: '/duck-upload/installation', title: 'Installation', items: [] },
        { href: '/duck-upload/guides', title: 'Quick Start', items: [] },
        { href: '/duck-upload/design', title: 'Design Decisions', items: [] },
      ],
    },
    {
      title: 'Core API',
      items: [
        { href: '/duck-upload/core', title: 'Overview', items: [] },
        { href: '/duck-upload/core/client', title: 'Client', items: [] },
        { href: '/duck-upload/core/contracts', title: 'Contracts', items: [] },
        { href: '/duck-upload/core/engine', title: 'Engine', items: [] },
        { href: '/duck-upload/core/persistence', title: 'Persistence', items: [] },
        { href: '/duck-upload/core/utils', title: 'Utilities', items: [] },
      ],
    },
    {
      title: 'React',
      items: [
        { href: '/duck-upload/react', title: 'Overview', items: [] },
        { href: '/duck-upload/react/upload-provider', title: 'UploadProvider', items: [] },
        { href: '/duck-upload/react/use-uploader', title: 'useUploader', items: [] },
      ],
    },
    {
      title: 'Upload Strategies',
      items: [
        { href: '/duck-upload/strategies', title: 'Overview', items: [] },
        { href: '/duck-upload/strategies/multipart', title: 'Multipart Strategy', items: [] },
        { href: '/duck-upload/strategies/post', title: 'POST Strategy', items: [] },
        { href: '/duck-upload/strategies/registry', title: 'Strategy Registry', items: [] },
      ],
    },
    {
      title: 'Course',
      // collapsible: true,
      items: [
        { href: '/duck-upload/course', title: 'Overview', items: [] },
        { href: '/duck-upload/course/chapter-1', title: 'Chapter 1: Your First Upload', items: [] },
        { href: '/duck-upload/course/chapter-2', title: 'Chapter 2: Strategies and Backends', items: [] },
        { href: '/duck-upload/course/chapter-3', title: 'Chapter 3: React Integration', items: [] },
        { href: '/duck-upload/course/chapter-4', title: 'Chapter 4: Multipart Uploads', items: [] },
        { href: '/duck-upload/course/chapter-5', title: 'Chapter 5: Pause, Resume, and Retry', items: [] },
        { href: '/duck-upload/course/chapter-6', title: 'Chapter 6: Persistence and Offline', items: [] },
        { href: '/duck-upload/course/chapter-7', title: 'Chapter 7: Validation and Plugins', items: [] },
        { href: '/duck-upload/course/chapter-8', title: 'Chapter 8: Production Patterns', items: [] },
      ],
    },
  ],
}
