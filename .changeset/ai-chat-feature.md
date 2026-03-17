---
'@gentleduck/docs': minor
'@gentleduck/registry-ui': minor
---

feat: add AI documentation chat and command menu enhancements

@gentleduck/docs:
- Add useAIChat hook for streaming AI chat with rAF-batched updates
- Add AIChatPanel component with markdown rendering, shiki syntax highlighting, and dynamic props
- Add AI toggle mode to CommandMenu with auto-switch on empty search results
- Add react-markdown and shiki as optional peer dependencies

@gentleduck/registry-ui:
- Add hideClose prop to DialogContent to conditionally hide the close button
- Add children prop to CommandInput for rendering extra elements in the input wrapper
- Add contentClassName prop to CommandDialog for dynamic dialog sizing
