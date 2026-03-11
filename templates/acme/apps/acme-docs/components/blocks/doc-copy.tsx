export function DocCopy() {
  return (
    <button type="button" onClick={() => navigator.clipboard.writeText('text')}>
      Copy
    </button>
  )
}
