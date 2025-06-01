export interface RadioGroupContextType {
  value: string
  onValueChange: (value: string) => void
  wrapperRef: React.RefObject<HTMLUListElement | null>
  itemsRef: React.RefObject<HTMLLIElement[]>
  selectedItemRef: React.RefObject<HTMLLIElement | null>
}
