import { atom, createStore } from '~/atom'

const count = atom(0)
const double = atom((get) => get(count) * 2)
const store = createStore()

// ✅ Subscriber 1 — watches count
const unsubscribe1 = store.subscribe(count, () => {
  console.log('[Subscriber 1] count changed:', store.get(count))
})

// ✅ Subscriber 2 — watches count
const unsubscribe2 = store.subscribe(count, () => {
  console.log('[Subscriber 2] count updated to:', store.get(count))
})

// ✅ Subscriber 3 — watches double
const unsubscribe3 = store.subscribe(double, () => {
  console.log('[Subscriber 3] double changed to:', store.get(double))
})

console.log('--- Initial Values ---')
console.log('count:', store.get(count)) // 0
console.log('double:', store.get(double)) // 0

console.log('\n--- Updating count ---')
for (let i = 0; i < 3; i++) {
  store.set(count, (prev) => prev + 1)
  console.log(`[debug] raw count state:`, store._getRaw(count))
  console.log(`[debug] derived double:`, store.get(double))
}

console.log('\n--- Final Values ---')
console.log('count:', store.get(count)) // 3
console.log('double:', store.get(double)) // 6

// ✅ Clean up
unsubscribe1()
unsubscribe2()
unsubscribe3()
