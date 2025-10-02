export const error_messages: { [key: number]: string } = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  500: 'Internal server error',
}

export async function get_registry_base_colors() {
  return [
    {
      label: 'Neutral',
      name: 'neutral',
    },
    {
      label: 'Gray',
      name: 'gray',
    },
    {
      label: 'Zinc',
      name: 'zinc',
    },
    {
      label: 'Stone',
      name: 'stone',
    },
    {
      label: 'Slate',
      name: 'slate',
    },
  ]
}
