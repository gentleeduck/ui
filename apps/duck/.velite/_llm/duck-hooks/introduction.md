}>

Reusable React hooks for the **@gentleduck** ecosystem.

## Philosophy

Each hook solves one problem: media queries, copy-to-clipboard, intersection observer, timing. They are typed, tested, and importable individually so you pull in only what you use.

---

## Installation

```bash
npm install @gentleduck/hooks
```

## Available Hooks

- `use-composed-refs` - Merge multiple refs into one. Also exports `composeRefs`.
- `use-computed-timeout-transition` - Read an element's CSS transition duration and fire a callback when it ends.
- `use-copy-to-clipboard` - Copy text with a configurable reset timeout.
- `use-debounce` - Debounce a callback. Also exports `debounce`.
- `use-is-mobile` - True when the viewport is below 768px.
- `use-media-query` - Subscribe to a CSS media query and get a boolean.
- `use-on-open-change` - Manage open/close state with scroll locking and CSS transition timing.
- `use-stable-id` - Generate a stable, incrementing ID with an optional prefix.

## Usage

Import each hook from its own entry:

```tsx

function MyComponent() {
  const [value, setValue] = useState('');
  const debouncedSearch = useDebounce((query: string) => {
    console.log('Searching for:', query);
  }, 500);

  return ;
}
```