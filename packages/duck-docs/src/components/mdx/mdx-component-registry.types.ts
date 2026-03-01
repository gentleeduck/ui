import type * as React from 'react'

export type MdxComponent = React.ComponentType<any> | ((props: any) => React.ReactNode)

export type MdxComponentMap = Record<string, MdxComponent>
