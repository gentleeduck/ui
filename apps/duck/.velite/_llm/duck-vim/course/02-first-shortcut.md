}>
Lesson 2 of 8  -  Create a Registry, register a command, and attach a KeyHandler to start listening for keyboard events.

## The two core classes

duck-vim's shortcut system has two main pieces:

- **Registry** stores the mapping from key binding strings to commands.
- **KeyHandler** listens for keyboard events and looks up matching commands in the registry.

They're separate because you might want to query the registry (for a command palette) without caring about event handling, or you might want multiple handlers attached to different DOM elements sharing the same registry.

---

## Setting up your first shortcut

  
    ### Create a registry

    ```ts
    import { Registry } from '@gentleduck/vim/command'

    const registry = new Registry()
    ```

    }>
    Pass `true` to enable debug logging. Every key press and match attempt prints to the console. Useful during development, turn off in production.
    

    ```ts
    const registry = new Registry(true)
    ```
  
  
    ### Define a command

    A command is an object with a `name` and an `execute` function:

    ```ts
    import type { Command } from '@gentleduck/vim/command'

    const openPalette: Command = {
      name: 'Open Command Palette',
      description: 'Opens the global command search',
      execute: () => {
        console.log('Palette opened!')
      },
    }
    ```

    The `name` is used for debugging and for display in command palettes. The `description` is optional but recommended.
  
  
    ### Register the command

    ```ts
    const handle = registry.register('ctrl+k', openPalette, {
      preventDefault: true,
    })
    ```

    This says: when the user presses <Kbd>Ctrl+K</Kbd>, run `openPalette.execute()` and call `event.preventDefault()` to stop the browser's default behavior (Chrome's address bar focus, for example).

    The returned `handle` lets you manage the binding:

    ```ts
    handle.setEnabled(false) // Temporarily disable
    handle.setEnabled(true)  // Re-enable
    handle.unregister()      // Remove permanently
    ```
  
  
    ### Create a KeyHandler and attach it

    ```ts
    import { KeyHandler } from '@gentleduck/vim/command'

    const handler = new KeyHandler(registry, 600)
    handler.attach(document)
    ```

    Now the handler is listening for `keydown` events on `document`. When the user presses <Kbd>Ctrl+K</Kbd>, the handler builds a key descriptor (`'ctrl+k'`), looks it up in the registry, and calls the command's `execute` function.

    }>
    The second argument (`600`) is the sequence timeout in milliseconds. We'll use this in Lesson 5.
    
  

---

## Complete example

```ts
import { Registry, KeyHandler, type Command } from '@gentleduck/vim/command'

// 1. Create registry
const registry = new Registry(true) // debug mode

// 2. Create handler
const handler = new KeyHandler(registry, 600)

// 3. Register shortcuts
registry.register('ctrl+k', {
  name: 'Command Palette',
  execute: () => console.log('Palette!'),
}, { preventDefault: true })

registry.register('ctrl+s', {
  name: 'Save',
  execute: () => console.log('Saved!'),
}, { preventDefault: true })

registry.register('ctrl+z', {
  name: 'Undo',
  execute: () => console.log('Undo!'),
}, { preventDefault: true })

// 4. Start listening
handler.attach(document)

// Open your browser console and press Ctrl+K, Ctrl+S, or Ctrl+Z
```

---

## Cleaning up

When you're done (e.g., when a component unmounts or a page navigates away):

```ts
handler.detach(document) // Stop listening
registry.clear()         // Remove all bindings
```

Or remove individual bindings:

```ts
const handle = registry.register('ctrl+k', command)
// Later:
handle.unregister()
```

---

## Checking what's registered

```ts
registry.hasCommand('ctrl+k') // true
registry.getCommand('ctrl+k') // { name: 'Command Palette', execute: ... }
registry.getAllCommands()      // Map of all bindings

for (const [binding, cmd] of registry.getAllCommands()) {
  console.log(`${binding} -> ${cmd.name}`)
}
```

---

## Try it

  Create a new file, paste the complete example above.
  Open it in a browser.
  Open the console.
  Press <Kbd>Ctrl+K</Kbd>. You should see "Palette!" in the console.
  Try enabling debug mode and watch the detailed logs as you press keys.

---

## Key takeaways

- `Registry` stores bindings. `KeyHandler` listens for events.
- `register()` returns a handle for lifecycle management.
- Always set `preventDefault: true` for shortcuts that conflict with browser defaults.
- Use debug mode during development.

}>
**Next:** [Lesson 3  -  Understanding Key Binding Strings](/duck-vim/course/03-key-bindings)