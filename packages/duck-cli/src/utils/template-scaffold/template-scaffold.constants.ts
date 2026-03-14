export const TEMPLATE_SCAFFOLD_CONFIG = {
  repo: 'gentelduck/ui',
  branch: 'master',
  tarball_url: (repo: string, branch: string) => `https://codeload.github.com/${repo}/tar.gz/${branch}`,
  templates_dir: 'templates',
  ignore_segments: new Set([
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
