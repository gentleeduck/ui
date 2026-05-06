import localFont from 'next/font/local'

export const fontSans = localFont({
  src: [
    {
      path: '../public/fonts/inter/inter-latin-ext-400-normal.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../public/fonts/inter/inter-latin-ext-500-normal.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../public/fonts/inter/inter-latin-ext-700-normal.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../public/fonts/inter/inter-latin-ext-400-italic.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../public/fonts/inter/inter-latin-ext-500-italic.woff2',
      style: 'italic',
      weight: '500',
    },
    {
      path: '../public/fonts/inter/inter-latin-ext-700-italic.woff2',
      style: 'italic',
      weight: '700',
    },
  ],
  variable: '--font-sans-font',
  display: 'swap',
  fallback: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
})
export const fontMono = localFont({
  src: [
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Medium.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Medium.woff2',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Bold.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-Italic.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-MediumItalic.woff2',
      style: 'italic',
      weight: '500',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-MediumItalic.woff2',
      style: 'italic',
      weight: '600',
    },
    {
      path: '../public/fonts/jetbrains-mono-nerd/JetBrainsMonoNerdFontMono-BoldItalic.woff2',
      style: 'italic',
      weight: '700',
    },
  ],
  variable: '--font-mono-font',
  display: 'swap',
  fallback: [
    'JetBrains Mono Nerd Font Mono',
    'JetBrains Mono Nerd Font',
    'JetBrains Mono',
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
})
