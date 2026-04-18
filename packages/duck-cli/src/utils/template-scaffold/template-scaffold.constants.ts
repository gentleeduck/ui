export const TEMPLATE_SCAFFOLD_CONFIG = {
  repo: 'gentelduck/ui',
  branch: 'master',
  tarballUrl: (repo: string, branch: string) => `https://codeload.github.com/${repo}/tar.gz/${branch}`,
  templatesDir: 'templates',
  ignoreSegments: new Set([
    'node_modules',
    '.git',
    'dist',
    '.turbo',
    '.next',
    '.cache',
    '.velite',
    '.vercel',
    'coverage',
  ]),
} as const
