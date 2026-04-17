import ora, { type Options } from 'ora'

export function spinner(
  text: Options['text'],
  options?: {
    silent?: boolean
  },
) {
  return ora({
    color: 'yellow',
    ...(options?.silent !== undefined ? { isSilent: options.silent } : {}),
    ...(text !== undefined ? { text } : {}),
  })
}
