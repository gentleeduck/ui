import type { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'
import { PROJECT_TYPE } from '../preflight-duckui/preflight-duckui.constants'

export const tailwindcssPrompts: PromptObject<string>[] = [
  {
    active: 'yes',
    inactive: 'no',
    initial: false,
    message: `Would you like to install ${highlighter.info('TailwindCSS')}`,
    name: 'tailwind',
    type: 'confirm',
  },
]

export const tailwindcssInstallPrompts: PromptObject<string>[] = [
  {
    choices: PROJECT_TYPE.map((project) => ({
      title: project,
      value: project,
    })),
    initial: 0,
    message: `Select your ${highlighter.info('project type')} to install TailwindCSS correctly`,
    name: 'projectType',
    type: 'select',
  },
  {
    initial: './src/',
    message: `Type where's your ${highlighter.info('CSS')} file? (Enter for default)`,
    name: 'css',
    type: 'text',
  },
]

export const POST_CSS_NEXTJS = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;`

export const TAILWINDCSS_VITE = `import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})`

export const TAILWINDCSS_BOILERPLATE = `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));
`

export const BASE_LAYER_STYLES = `@layer base {
  * {
    @apply border-border font-medium;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
    font-family: var(--font-sans, ui-sans-serif, system-ui, sans-serif);
    scrollbar-width: thin;
    scrollbar-color: oklch(0.551 0.027 264.364) transparent;
  }

  html.dark {
    scrollbar-color: oklch(0.37 0.013 285.805) transparent;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  img {
    user-select: none;
  }

  a:active,
  button:active {
    opacity: 0.8;
  }
}

@utility duck-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@layer utilities {
  .container {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }

  .ellipsis {
    @apply duck-truncate;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-delay: 0ms !important;
    transition-duration: 1ms !important;
  }
}`
