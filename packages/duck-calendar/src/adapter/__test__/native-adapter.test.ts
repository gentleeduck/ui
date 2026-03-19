import { runAdapterTests } from '../adapter-test-suite'
import { NativeAdapter } from '../native-adapter'

runAdapterTests(
  'NativeAdapter',
  () => new NativeAdapter(),
  (y, m, d, h, min, s) => new Date(y, m, d, h ?? 0, min ?? 0, s ?? 0),
)
