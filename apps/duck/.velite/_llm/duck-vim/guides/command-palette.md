}>

A command palette lists all available shortcuts in a searchable view. duck-vim's `Registry` stores commands with names and descriptions, which is the data a palette needs.

---

## Building the palette

Access the registry

In React, use `KeyContext` to access the registry:

```tsx

function CommandPalette() {
  const ctx = useContext(KeyContext)
  if (!ctx) return null

  const commands = ctx.registry.getAllCommands()
  // Map

          {items.map((item) => (

              <button
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  item.execute()
                  setOpen(false)
                }}
              >
                <span>{item.name}</span>

                  {item.displayBinding}

          ))}
          {items.length === 0 && (
            <li className="px-4 py-3 text-gray-500 text-sm">No matching commands</li>
          )}

  )
}
```

Register commands with descriptions

To make the palette useful, include descriptions when registering:

```tsx
useKeyCommands({
  'g+d': {
    name: 'Go to Dashboard',
    description: 'Navigate to the main dashboard',
    execute: () => navigate('/dashboard'),
  },
  'g+s': {
    name: 'Go to Settings',
    description: 'Open the settings page',
    execute: () => navigate('/settings'),
  },
  'ctrl+s': {
    name: 'Save',
    description: 'Save the current document',
    execute: () => save(),
  },
})
```

---

## Vanilla equivalent

}>

Without React, query the registry directly:

```ts
const commands = registry.getAllCommands()

for (const [binding, cmd] of commands) {
  const li = document.createElement('li')
  li.textContent = `${cmd.name} (${formatForDisplay(binding)})`
  li.addEventListener('click', () => cmd.execute())
  paletteList.appendChild(li)
}
```