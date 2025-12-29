export function DocCopy() {
  return <button onClick={() => navigator.clipboard.writeText('text')}>Copy</button>
}
