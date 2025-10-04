import React from 'react'

export function ToggleGroupInit(
  type?: 'single' | 'multiple',
  onValueChange?: (value: string) => void,
  value?: string | string[],
  defaultValue?: string | string[],
) {
  const wrapperRef = React.useRef<HTMLUListElement>(null)
  const itemsRef = React.useRef<HTMLDivElement[]>([])
  const selectedItemRef = React.useRef<HTMLDivElement[]>([])

  React.useEffect(() => {
    const items = Array.from(
      wrapperRef.current?.querySelectorAll('[duck-toggle-group-item]') as never as HTMLDivElement[],
    )
    itemsRef.current = items

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLInputElement
      item.addEventListener('click', () => {
        if (type === 'single') {
          for (let i = 0; i < items.length; i++) {
            const item = items[i] as HTMLInputElement
            item.setAttribute('aria-checked', 'false')
            item.setAttribute('aria-selected', 'false')
            item.checked = false
          }
        }

        onValueChange?.(item.value)
        selectedItemRef.current = type === 'single' ? [item] : [...selectedItemRef.current, item]
        item.setAttribute('aria-checked', 'true')
        item.setAttribute('aria-selected', 'true')
        item.checked = true
      })
    }
  }, [type])
  React.useEffect(() => {
    const initial = value ?? defaultValue
    if (!initial) return

    const values = Array.isArray(initial) ? initial : [initial]

    itemsRef.current.forEach((item) => {
      const input = item as HTMLInputElement
      if (values.includes(input.value)) {
        input.setAttribute('aria-checked', 'true')
        input.setAttribute('aria-selected', 'true')
        input.checked = true
        if (!selectedItemRef.current.includes(input)) {
          selectedItemRef.current.push(input)
        }
      } else if (type === 'single') {
        input.setAttribute('aria-checked', 'false')
        input.setAttribute('aria-selected', 'false')
        input.checked = false
      }
    })
  }, [])

  return { itemsRef, selectedItemRef, wrapperRef }
}
