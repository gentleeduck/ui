# `@gentleduck/state`

## 🦆 **Duck-Style State Management?**
Since you want to create a **state management library compatible with all frameworks**, you might want to:

1. Take **Zustand’s API simplicity**.
2. Take **Jotai’s atomic model but optimize re-renders**.
3. Have **Redux-style debugging tools**.
4. Support **async fetching natively** like React Query.


---

Here's a boilerplate to start building **GentleDuck/State**, combining the best features of Zustand, Jotai, Redux, and React Query.  

---

### 🚀 **GentleDuck/State Boilerplate**
This will include:
1. **Atom-based state management (Jotai-like)**
2. **Selectors for derived state (Optimized re-renders)**
3. **Async state handling (React Query-like)**
4. **DevTools support (Redux-like debugging)**

---

### 📁 **Project Structure**
```
gentleduck-state/
├── src/
│   ├── index.ts         # Main entry point
│   ├── createStore.ts   # Core state management logic
│   ├── atom.ts          # Atom system
│   ├── selector.ts      # Derived state logic
│   ├── async.ts         # Async state management
│   ├── devtools.ts      # Debugging tools
├── tests/
│   ├── state.test.ts
├── package.json
├── tsconfig.json
├── README.md
```

---

### 🔥 **1. Create Store (Inspired by Zustand)**
```ts
// src/createStore.ts
type Listener = () => void;

export class Store<T> {
  private state: T;
  private listeners = new Set<Listener>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: Partial<T>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export function createStore<T>(initialState: T) {
  return new Store<T>(initialState);
}
```

---

### ⚛ **2. Atom System (Inspired by Jotai)**
```ts
// src/atom.ts
export type Atom<T> = {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
};

export function atom<T>(initialValue: T): Atom<T> {
  let value = initialValue;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (newValue: T) => {
      value = newValue;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
```

---

### 🎯 **3. Selectors (Optimized Derived State)**
```ts
// src/selector.ts
import { Atom } from "./atom";

export function selector<T>(getter: () => T, dependencies: Atom<any>[]): Atom<T> {
  let value = getter();
  const listeners = new Set<() => void>();

  dependencies.forEach((dep) => dep.subscribe(() => {
    value = getter();
    listeners.forEach((listener) => listener());
  }));

  return {
    get: () => value,
    set: () => {}, // Read-only
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
```

---

### 🌍 **4. Async State Handling (Inspired by React Query)**
```ts
// src/async.ts
export function asyncAtom<T>(fetcher: () => Promise<T>) {
  const state = atom<{ loading: boolean; data: T | null; error: any }>({
    loading: true,
    data: null,
    error: null,
  });

  fetcher()
    .then((data) => state.set({ loading: false, data, error: null }))
    .catch((error) => state.set({ loading: false, data: null, error }));

  return state;
}
```

---

### 🛠 **5. DevTools Support (Redux-Like Debugging)**
```ts
// src/devtools.ts
export function attachDevTools<T>(store: Store<T>) {
  store.subscribe(() => {
    console.log("State Updated:", store.getState());
  });
}
```

---

### 🏗 **Usage Example**
```ts
import { createStore } from "./createStore";
import { atom } from "./atom";
import { selector } from "./selector";
import { asyncAtom } from "./async";
import { attachDevTools } from "./devtools";

// Global State
const counter = atom(0);
const doubleCounter = selector(() => counter.get() * 2, [counter]);
const user = asyncAtom(() => fetch("https://api.example.com/user").then((res) => res.json()));

// Store
const store = createStore({ theme: "light" });
attachDevTools(store);

// Usage
counter.subscribe(() => console.log("Counter changed:", counter.get()));
doubleCounter.subscribe(() => console.log("Double Counter:", doubleCounter.get()));
```

---

### 🎯 **Next Steps**
- Add **batch updates** to avoid re-renders.
- Optimize **async caching** (like React Query).
- Create **React hooks** for easy integration:  
  - `useAtom(atom)`
  - `useSelector(selector)`
  - `useAsyncAtom(asyncAtom)`

Would you like me to create a **React Hook wrapper** for GentleDuck/State? 🚀
