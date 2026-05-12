import { createDocsVeliteConfig } from './velite'

const cfg = createDocsVeliteConfig({
  // Restrict the root `docs` collection to top-level docs only (changelog,
  // comparisons, dark-theme, etc). Per-package MDX is already covered by
  // the dedicated per-package collections below, so the wide
  // `docs/**/*.mdx` default would duplicate every package doc into
  // `docs.json`.
  docsPattern: 'docs/!(duck-*|www)/**/*.mdx',
  packages: [
    'duck-calendar',
    'duck-cli',
    'duck-gen',
    'duck-hooks',
    'duck-iam',
    'duck-lazy',
    'duck-libs',
    'duck-motion',
    'duck-primitives',
    'duck-query',
    'duck-registry-build',
    'duck-shortcut',
    'duck-state',
    'duck-template',
    'duck-ttest',
    'duck-ttlog',
    'duck-ui',
    'duck-upload',
    'duck-variants',
    'duck-vim',
    'www',
  ],
})

// Override the default output dir so existing `import ... from '.gentleduck'`
// call-sites in apps/duck don't all need rewriting. The default for
// @gentleduck/md is also `.gentleduck`, but we make it explicit here.
export default {
  ...cfg,
  root: 'content',
  // `clean: true` wipes `.gentleduck/` (incl the per-document compile
  // cache under `.cache/dmc/`) at the start of every build. Without it,
  // the engine reuses cached MDX bodies even after the codegen Rust
  // crate has been bumped, which silently masks codegen-level fixes.
  //
  // `html: false` drops the per-record pre-rendered HTML string. The app
  // never reads `doc.html` (pages render `<Mdx code={doc.body} />` and the
  // copy button uses `doc.content`), so it was dead weight roughly the size
  // of `body` again -- omitting it about halves `.gentleduck/`.
  output: { ...cfg.output, data: '.gentleduck', html: false, clean: true },
}
