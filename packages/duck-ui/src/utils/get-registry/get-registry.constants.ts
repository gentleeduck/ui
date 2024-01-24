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
      name: 'neutral',
      label: 'Neutral',
    },
    {
      name: 'gray',
      label: 'Gray',
    },
    {
      name: 'zinc',
      label: 'Zinc',
    },
    {
      name: 'stone',
      label: 'Stone',
    },
    {
      name: 'slate',
      label: 'Slate',
    },
  ]
}
