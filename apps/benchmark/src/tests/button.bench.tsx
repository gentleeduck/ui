import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Button as HButton } from '@heroui/react'
import { bench, describe } from 'vitest'
import { render } from 'vitest-browser-react'
import { Button as SButton } from '@/components/ui/button'

describe('rendering performance', () => {
  bench('duck button', () => {
    render(<Button border="default" size="default" variant="default" />)
  })
  bench('shadcn button', () => {
    render(<SButton />)
  })
  bench('hero button', () => {
    render(<HButton />)
  })
})
