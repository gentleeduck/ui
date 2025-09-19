import React from 'react'

export function ToggleGroupInit(type?: 'single' | 'multiple', onValueChange?: (value: string) => void) {
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
  return { itemsRef, selectedItemRef, wrapperRef }
}
