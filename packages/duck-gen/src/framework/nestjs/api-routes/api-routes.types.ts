import type { ts } from 'ts-morph'
import type { HTTP_METHOD_DECORATORS, HTTP_METHODS } from './api-routes.constants'

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

export type CompilerTypeWithId = ts.Type & { id?: number }

export type TypeSymbolImportInfo = {
  name: string
  filePath: string
}

export type ImportMaps = {
  typeImports: Map<string, Set<string>>
}
