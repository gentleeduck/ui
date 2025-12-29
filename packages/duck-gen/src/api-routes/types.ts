import type { HTTP_METHOD_DECORATORS, HTTP_METHODS } from './constants'

export type HttpMethodDecorator = (typeof HTTP_METHOD_DECORATORS)[number]

export type HttpMethod = (typeof HTTP_METHODS)[number]

export type Route = {
  fullPath: string
  httpMethod: HttpMethod

  bodyType: string
  queryType: string
  paramsType: string
  headersType: string

  // 🦆 produced as a type expression string
  resType: string
}

export type ImportMaps = {
  typeImports: Map<string, Set<string>>
}
