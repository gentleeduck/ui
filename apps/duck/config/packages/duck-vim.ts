import type { IDocsConfig } from '@gentleduck/docs'

export const DuckVimConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-vim/introduction',
      title: 'Getting Started',
      items: [
        { href: '/duck-vim/introduction', title: 'Introduction', items: [] },
        { href: '/duck-vim/getting-started', title: 'Getting Started', items: [] },
        { href: '/duck-vim/concepts', title: 'Core Concepts', items: [] },
      ],
    },
    {
      title: 'Guides',
      items: [
        { href: '/duck-vim/guides', title: 'Overview', items: [] },
        { href: '/duck-vim/guides/command-palette', title: 'Command Palette', items: [] },
        { href: '/duck-vim/guides/scoped-bindings', title: 'Scoped Bindings', items: [] },
        { href: '/duck-vim/guides/shortcut-settings', title: 'Shortcut Settings', items: [] },
        { href: '/duck-vim/guides/custom-framework', title: 'Framework Integration', items: [] },
      ],
    },
    {
      title: 'API',
      items: [
        { href: '/duck-vim/api', title: 'Overview', items: [] },
        { href: '/duck-vim/api/command', title: 'Command', items: [] },
        { href: '/duck-vim/api/format', title: 'Format', items: [] },
        { href: '/duck-vim/api/matcher', title: 'Matcher', items: [] },
        { href: '/duck-vim/api/parser', title: 'Parser', items: [] },
        { href: '/duck-vim/api/platform', title: 'Platform', items: [] },
        { href: '/duck-vim/api/react', title: 'React Bindings', items: [] },
        { href: '/duck-vim/api/recorder', title: 'Recorder', items: [] },
        { href: '/duck-vim/api/sequence', title: 'Sequence', items: [] },
      ],
    },
    {
      title: 'Course',
      items: [
        { href: '/duck-vim/course', title: 'Overview', items: [] },
        { href: '/duck-vim/course/01-introduction', title: 'Introduction', items: [] },
        { href: '/duck-vim/course/02-first-shortcut', title: 'First Shortcut', items: [] },
        {
          href: '/duck-vim/course/03-key-bindings',
          title: 'Key Binding Strings',
          items: [],
        },
        { href: '/duck-vim/course/04-react', title: 'React Integration', items: [] },
        { href: '/duck-vim/course/05-sequences', title: 'Multi-Key Sequences', items: [] },
        { href: '/duck-vim/course/06-formatting', title: 'Display Formatting', items: [] },
        { href: '/duck-vim/course/07-recorder', title: 'Recorder & Settings', items: [] },
        { href: '/duck-vim/course/08-advanced', title: 'Advanced Patterns', items: [] },
      ],
    },
  ],
}
