}>
Lesson 6 of 8  -  Render keyboard shortcuts in your UI with platform-aware labels and symbols.

## The problem

You register `'Mod+Shift+S'` as a binding. But what do you show the user?

- On Mac: 
    // Renders: [Cmd] [Shift] [K]  (on Mac)
    ```
  
  
    ### In a menu or tooltip

    ```tsx
    function MenuItem({ label, binding }: { label: string; binding: string }) {
      return (

      )
    }

    
    
    
    ```
  

---

## Formatting sequences

For multi-key sequences like `g+d`, the format functions work on individual steps. Format each step separately:

```tsx
function SequenceDisplay({ steps }: { steps: string[] }) {
  return (

      ))}

  )
}

// Usage:
// 
// Renders: [G] then [D]
//
// 
// Renders: [Ctrl][K] then [Ctrl][C]
```

---

## Platform-specific display reference

| Modifier | Mac | Windows | Linux |
| --- | --- | --- | --- |
| `meta` | <Kbd>Cmd</Kbd> | <Kbd>Win</Kbd> | <Kbd>Super</Kbd> |
| `ctrl` | <Kbd>Ctrl</Kbd> | <Kbd>Ctrl</Kbd> | <Kbd>Ctrl</Kbd> |
| `alt` | <Kbd>Opt</Kbd> | <Kbd>Alt</Kbd> | <Kbd>Alt</Kbd> |
| `shift` | <Kbd>Shift</Kbd> | <Kbd>Shift</Kbd> | <Kbd>Shift</Kbd> |

---

## Exercises

1. Create a component that shows a shortcut hint at the bottom of a page.
2. Format `'Mod+Shift+Z'` for all three platforms and compare the output.
3. Build a help overlay that lists all registered commands with formatted shortcuts.

}>
**Next:** [Lesson 7  -  Key Recorder and Settings](/docs/packages/duck-vim/course/07-recorder)