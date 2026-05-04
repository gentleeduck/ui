}>

Small, framework-agnostic utility functions. Each one lives in its own folder and imports individually or through the barrel.

## Philosophy

UI components use a handful of helpers - `cn` for class merging, formatters, assertion functions. gentleduck/libs collects them in one typed package so you do not pull in lodash for three functions.

---

## Installation

```bash
npm install @gentleduck/libs
```

## Available Utilities

* `cn` - Utility for conditional className merging.
* `filtered-object` - Create a new object by excluding specified keys.
* `group-array` - Split an array into sub-arrays by numeric group sizes.
* `group-data-by-numbers` - Group array elements into sub-arrays by specified chunk sizes.
* `parse-date` - Parse strings or values into valid Date objects.
* `generateArabicSlug` - Convert text to URL slugs preserving Arabic characters.
* `getTodayDate` - Return today's date as a YYYY-MM-DD string.
* `index.ts` - Barrel file that re-exports utilities.

## Usage

```tsx

function MyComponent({ active }: { active: boolean }) {
  return (

      Hello

  )
}
```