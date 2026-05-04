}>

duck-vim's core is pure DOM. The React bindings are just a thin wrapper around `Registry`, `KeyHandler`, and `SequenceManager`. You can build the same wrapper for **any framework**.

## The pattern

Create a Registry and KeyHandler during initialization

Call handler.attach() when the component/app mounts

Call handler.detach() when it unmounts

Register bindings via registry.register() and store the handle for cleanup

---

## Vue 3 (Composition API)

```ts title="composables/useKeyBind.ts"

const registry = new Registry()
const handler = new KeyHandler(registry, 600)
let attached = false

export function useKeyBind(binding: string, execute: () => void, options?: KeyBindOptions) {
  let handle: ReturnType<typeof registry.register> | null = null

  onMounted(() => {
    if (!attached) {
      handler.attach(document)
      attached = true
    }

    handle = registry.register(binding, { name: binding, execute }, options)
  })

  onUnmounted(() => {
    handle?.unregister()
  })
}
```

**Usage in a component:**

```vue

useKeyBind('ctrl+k', () => {
  console.log('Palette opened!')
}, { preventDefault: true })

```

---

## Svelte

```ts title="actions/keybind.ts"

const registry = new Registry()
const handler = new KeyHandler(registry, 600)
handler.attach(document)

export function keybind(node: HTMLElement, params: { binding: string; handler: () => void }) {
  const handle = registry.register(params.binding, {
    name: params.binding,
    execute: params.handler,
  })

  return {
    destroy() {
      handle.unregister()
    },
  }
}
```

**Usage:**

```svelte

  import { keybind } from './actions/keybind'

<div use:keybind={{ binding: 'ctrl+k', handler: () => console.log('palette') }}>
  App content

```

---

## Angular

```ts title="keybind.service.ts"

@Injectable({ providedIn: 'root' })
export class KeyBindService implements OnDestroy {
  private registry = new Registry()
  private handler = new KeyHandler(this.registry, 600)

  constructor() {
    this.handler.attach(document)
  }

  register(binding: string, command: Command, options?: KeyBindOptions): RegistrationHandle {
    return this.registry.register(binding, command, options)
  }

  ngOnDestroy() {
    this.handler.detach(document)
    this.registry.clear()
  }
}
```

**Usage in a component:**

```ts
@Component({ ... })
export class AppComponent implements OnInit, OnDestroy {
  private handle?: RegistrationHandle

  constructor(private keybind: KeyBindService) {}

  ngOnInit() {
    this.handle = this.keybind.register('ctrl+k', {
      name: 'Open Palette',
      execute: () => this.openPalette(),
    }, { preventDefault: true })
  }

  ngOnDestroy() {
    this.handle?.unregister()
  }
}
```

---

## Vanilla (module pattern)

```ts

const registry = new Registry()
const handler = new KeyHandler(registry, 600)

export function init() {
  handler.attach(document)
}

export function registerShortcut(binding: string, name: string, execute: () => void) {
  return registry.register(binding, { name, execute })
}

export function destroy() {
  handler.detach(document)
  registry.clear()
}
```

---

## Key principles for any integration

} className="[&_ol]:my-0">

1. **One registry per scope.** Usually one global registry is enough, but you can create separate ones for isolated areas.
2. **Always clean up.** Unregister bindings when components unmount to avoid memory leaks and ghost handlers.
3. **Use `ignoreInputs: true`** for non-modifier bindings (single characters) to avoid interfering with text input.
4. **Forward the SequenceManager** if you need multi-step sequences beyond what the Registry+KeyHandler handles.