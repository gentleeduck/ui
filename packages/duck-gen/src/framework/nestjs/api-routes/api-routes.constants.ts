export const HTTP_METHOD_DECORATORS = ['Get', 'Post', 'Put', 'Patch', 'Delete', 'Options', 'Head', 'All'] as const
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'ALL'] as const
export const HTTP_METHOD_BY_DECORATOR: Record<(typeof HTTP_METHOD_DECORATORS)[number], (typeof HTTP_METHODS)[number]> =
  {
    All: 'ALL',
    Delete: 'DELETE',
    Get: 'GET',
    Head: 'HEAD',
    Options: 'OPTIONS',
    Patch: 'PATCH',
    Post: 'POST',
    Put: 'PUT',
  }
