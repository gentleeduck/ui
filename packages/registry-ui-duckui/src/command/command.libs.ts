export function styleItem(item: HTMLLIElement) {
  item.classList.add('bg-secondary')
  item.scrollIntoView({ block: 'center', behavior: 'smooth' })
  item.setAttribute('duck-item-selected', '')
}
