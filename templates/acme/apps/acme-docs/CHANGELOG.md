# @gentleduck/ui-docs

## 3.0.21

### Patch Changes

- Updated dependencies [9a899db]
  - @gentleduck/docs@0.0.2

### February - March 2026 Changes (Unreleased)

#### Features

- Overhaul docs content, routing, and generated registry assets
- Add primitives course content (9 lessons covering why-primitives through testing and operations)
- Add comprehensive component API documentation with full prop tables
- Add changelog page and documentation navigation entry
- Add Discord link, features section, sponsor config, and updated page copy
- Add news section with Recharts v3 upgrade changelog
- Migrate to Vercel hosting with LLM endpoint and docs breadcrumb
- Replace command menu substring search with lunr.js full-text search
- Add SVG path indicator with mask-image highlight to table of contents
- Enhance TOC sidebar with edit links, scroll navigation, and formatting
- Add loading and error states for ComponentPreview and ComponentSource
- Redesign OG image with new logo and dark theme with duck decorations

#### RTL / Internationalization

- Add direction docs and refresh docs registry artifacts
- Update MDX content, component previews, and RTL examples
- Add Arabic RTL examples for json-editor, pagination, calendar, and charts
- Convert RTL examples to standalone Arabic text components

#### Accessibility

- Comprehensive accessibility audit across examples, blocks, and docs
- Add aria-hidden to decorative icons across all sidebar, blocks, and components
- Add aria labels and pressed states across interactive examples
- Increase touch target sizes in docs sidebar to meet WCAG guidelines
- Add prefers-reduced-motion support across animation components
- Resolve ARIA accessibility violations in Tabs component
- Add accessible title and description to CommandDialog

#### Performance

- Lazy-load CommandMenu, MobileNav, and CardsDemo components
- Upgrade recharts to v3

#### Component Updates

- Add sidebar blocks 01-16 with full registry infrastructure and examples
- Add button-21 RTL example and update various component examples
- Add preview-panel component and examples
- Update sidebar component with forwardRef pattern
- Refactor command navigation model and virtualize command menu
- Add DirectionProvider with DOM wrapper for nested direction contexts

#### Infrastructure

- Regenerate velite docs cache, sitemaps, and registry JSON throughout
- Switch to Berkeley Mono font and remove legacy Geist fonts
- Rebrand to gentleduck/ui across root and package metadata
- Clean up app layouts, font defaults, and CSS consolidation
- Add page-specific canonical URLs to all pages for SEO
