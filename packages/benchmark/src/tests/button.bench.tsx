import { render } from 'vitest-browser-react'
import { describe, bench } from 'vitest'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Button as SButton } from '@/components/ui/button'
import { Button as HButton } from '@heroui/react'

describe('rendering performance', () => {
  bench('duck button', () => {
    render(<Button variant="default" border="default" size="default" />)
  })
  bench('shadcn button', () => {
    render(<SButton />)
  })
  bench('hero button', () => {
    render(<HButton />)
  })
})
