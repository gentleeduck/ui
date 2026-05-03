## Browser Extension v1 <Badge>feat</Badge>

Prepared v1 release of **duck-extension** with biome config, app UI, and theme data.

- Full app UI with theme support
- Removed old `duck-fonts-extension` package
- Fixed popover focus issues in primitives

---

## CLI Fixes <Badge variant="outline">fix</Badge>

Fixed component write path resolution in `@gentleduck/cli`:

- Components now install to the correct directory relative to your project root
- Fixed path resolution when `duck-ui.config` alias differs from `tsconfig` paths
- Community PR merged for component path fix (PR #188)

---

## Component Updates <Badge variant="outline">fix</Badge>

- Enhanced scroll-area docs and refactored for more native scroll behavior
- Fixed selected item in the select component not reflecting value correctly

### Theme Toggle

### Scroll Area