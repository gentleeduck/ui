import { defineSidebar } from './types'

export const duckVimSidebar = defineSidebar([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-vim/introduction' },
      { title: 'Getting Started', href: '/duck-vim/getting-started' },
      { title: 'Core Concepts', href: '/duck-vim/concepts' },
    ],
  },
  {
    title: 'API',
    items: [
      { title: 'API Reference', href: '/duck-vim/api' },
      { title: 'Command', href: '/duck-vim/api/command' },
      { title: 'Format', href: '/duck-vim/api/format' },
      { title: 'Matcher', href: '/duck-vim/api/matcher' },
      { title: 'Parser', href: '/duck-vim/api/parser' },
      { title: 'Platform', href: '/duck-vim/api/platform' },
      { title: 'React Bindings', href: '/duck-vim/api/react' },
      { title: 'Recorder', href: '/duck-vim/api/recorder' },
      { title: 'Sequence', href: '/duck-vim/api/sequence' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'duck-vim Guides', href: '/duck-vim/guides' },
      { title: 'Building a Command Palette', href: '/duck-vim/guides/command-palette' },
      { title: 'Integrating with Other Frameworks', href: '/duck-vim/guides/custom-framework' },
      { title: 'Scoped Key Bindings', href: '/duck-vim/guides/scoped-bindings' },
      { title: 'Shortcut Customization UI', href: '/duck-vim/guides/shortcut-settings' },
    ],
  },
  {
    title: 'Course',
    items: [
      { title: 'duck-vim Course', href: '/duck-vim/course' },
      { title: 'Lesson 1: Introduction', href: '/duck-vim/course/01-introduction' },
      { title: 'Lesson 2: Your First Shortcut', href: '/duck-vim/course/02-first-shortcut' },
      { title: 'Lesson 3: Understanding Key Binding Strings', href: '/duck-vim/course/03-key-bindings' },
      { title: 'Lesson 4: React Integration', href: '/duck-vim/course/04-react' },
      { title: 'Lesson 5: Multi-Key Sequences', href: '/duck-vim/course/05-sequences' },
      { title: 'Lesson 6: Display Formatting', href: '/duck-vim/course/06-formatting' },
      { title: 'Lesson 7: Key Recorder and Settings', href: '/duck-vim/course/07-recorder' },
      { title: 'Lesson 8: Advanced Patterns', href: '/duck-vim/course/08-advanced' },
    ],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-vim/changelog' }],
  },
])
