import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '@duck/registry-ui-duckui/button'

describe('Performance Benchmark', () => {
  test('should measure render time', () => {
    const start = performance.now()
    render(<Button>Button</Button>)
    const end = performance.now()
    console.log(`Render time: ${end - start}ms`)
    expect(end - start).toBeLessThan(50) // Set threshold as needed
  })
})
