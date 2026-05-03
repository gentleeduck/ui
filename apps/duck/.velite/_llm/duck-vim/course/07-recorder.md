}>
Lesson 7 of 8  -  Build a settings UI where users can record and customize their keyboard shortcuts.

## What we're building

} className="[&_ol]:my-0">
A settings page where users can:

1. See all current keyboard shortcuts.
2. Click a shortcut to start recording.
3. Press a new key combination to redefine it.
4. See validation warnings and conflict detection.

---

## The KeyRecorder class

`KeyRecorder` captures a full key combination (modifiers + one non-modifier key) and outputs a canonical binding string like `'ctrl+shift+k'`.

### How it works

  Call `start()` to begin listening on a target element.
  The recorder tracks modifier keys as they're pressed/released.
  When a non-modifier key is pressed, it builds the full binding string.
  The `onRecord` callback fires with the string.
  Call `stop()` to clean up.

}>
While recording, the recorder calls `preventDefault()` and `stopPropagation()` on all key events, so the user's key presses don't trigger shortcuts or browser actions.

### Vanilla usage

```ts

const recorder = new KeyRecorder({
  onRecord: (binding) => {
    console.log('Recorded:', binding)
    // e.g. 'ctrl+shift+k'
    recorder.stop()
  },
  onStart: () => console.log('Recording started'),
  onStop: () => console.log('Recording stopped'),
})

// Start recording
recorder.start(document.body)

// The user presses Ctrl+Shift+K
// Output: "Recorded: ctrl+shift+k"
```

---

## React: `useKeyRecorder`

The hook wraps `KeyRecorder` with React state:

```tsx

function RecorderDemo() {
  const { state, start, stop, reset } = useKeyRecorder()

  return (
    
              ) : (
                <>
                  
              )}

        ))}

  )
}
```

---

## Validation details

}>
Always validate before saving user-recorded bindings.

```ts

const result = validateKeyBind(recorded)

if (!result.valid) {
  // Show errors to the user
  showError(result.errors)
  return
}

if (result.warnings.length > 0) {
  // Show warnings but allow saving
  showWarning(result.warnings)
}
```

Common warnings:

- <Kbd>Alt</Kbd>+letter combinations may not work on macOS (they produce special characters).

Common errors:

- Empty binding string.
- Multiple non-modifier keys.
- Duplicate modifiers.

---

## The KeyStateTracker

}>
For more casual key state tracking (games, drawing apps), use `KeyStateTracker` instead of `KeyRecorder`.

```ts

const tracker = new KeyStateTracker()
tracker.attach(document)

// In an animation loop
function gameLoop() {
  if (tracker.isKeyPressed('w')) moveUp()
  if (tracker.isKeyPressed('s')) moveDown()
  if (tracker.isKeyPressed('shift')) sprint()

  const snapshot = tracker.getSnapshot()
  console.log('Keys held:', snapshot.pressed)
  console.log('Has modifier:', snapshot.hasModifier)

  requestAnimationFrame(gameLoop)
}
```

---

## Exercises

1. Build the shortcut settings component above and test it with three shortcuts.
2. Add persistence: save customized bindings to `localStorage` and reload them on mount.
3. Add an "Export" button that outputs the current bindings as JSON.

}>
**Next:** [Lesson 8  -  Advanced Patterns](/docs/packages/duck-vim/course/08-advanced)