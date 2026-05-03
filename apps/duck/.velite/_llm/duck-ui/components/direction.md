## Philosophy

Direction is cross-cutting state. Instead of passing `dir` through every component manually, set it once at the boundary and let components/hooks resolve it predictably.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add direction
```

Install the following dependency:

```bash
npm install @gentleduck/primitives
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx
<DirectionProvider dir={DIRECTION_DICTIONARY.rtl}>{children}</DirectionProvider>
```

## API Reference

### Exports

| Export | Type | Description |
| --- | --- | --- |
| `DIRECTION_DICTIONARY` | `{ ltr: 'ltr'; rtl: 'rtl' }` | Canonical direction values |
| `DirectionProvider` | `React.FC<{ dir: 'ltr' \| 'rtl'; children?: ReactNode }>` | Provides direction to descendants |
| `Provider` | `React.FC<{ dir: 'ltr' \| 'rtl'; children?: ReactNode }>` | Alias for `DirectionProvider` |
| `useDirection` | `(localDir?: 'ltr' \| 'rtl') => 'ltr' \| 'rtl'` | Resolves `localDir` -> context -> `'ltr'` |
| `DirectionContext` | `React.Context<'ltr' \| 'rtl' \| undefined>` | Underlying context object |