import * as React from 'react'
import { usePrevious } from '../hooks/use-previous'
import { Primitive } from '../primitive-elements'

const BubbleInput = (props: React.ComponentPropsWithoutRef<'input'>) => {
  const { value, ...inputProps } = props
  const ref = React.useRef<HTMLInputElement>(null)
  const prevValue = usePrevious(value)

  React.useEffect(() => {
    const input = ref.current
    if (!input) return
    const inputProto = window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'value') as PropertyDescriptor
    const setValue = descriptor.set
    if (prevValue !== value && setValue) {
      const event = new Event('input', { bubbles: true })
      setValue.call(input, value)
      input.dispatchEvent(event)
    }
  }, [prevValue, value])

  return <Primitive.input style={{ display: 'none' }} {...inputProps} ref={ref} defaultValue={value} />
}

export { BubbleInput }
