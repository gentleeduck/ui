export function returnMessage<T extends unknown, U extends unknown = null>(
  data: U,
  message: T,
  status: 'success' | 'error',
) {
  return { data, message, status }
}

export type ResponseType<TData, TMessage extends readonly string[] = any> =
  | {
      state: 'error'
      message: TMessage[number]
    }
  | {
      data: TData
      state: 'success'
      message: TMessage[number]
    }
