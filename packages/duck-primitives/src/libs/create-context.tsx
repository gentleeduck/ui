import * as React from 'react'

/* -------------------------------------------------------------------------------------------------
 * createContext
 *
 * Creates a Provider and a useContext hook pair. If no default value is given,
 * the context is required -- using it outside the Provider throws an error.
 * The Provider automatically memoizes the value based on prop values.
 * -----------------------------------------------------------------------------------------------*/

function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType,
) {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext)

  const Provider: React.FC<ContextValueType & { children: React.ReactNode }> = (props) => {
    const { children, ...context } = props
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(() => context, Object.values(context)) as ContextValueType
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  Provider.displayName = rootComponentName + 'Provider'

  function useContext(consumerName: string) {
    const context = React.useContext(Context)
    if (context) return context
    if (defaultContext !== undefined) return defaultContext
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)
  }

  return [Provider, useContext] as const
}

/* -------------------------------------------------------------------------------------------------
 * createContextScope
 *
 * Creates a scoped context system that supports multiple independent instances
 * of the same component tree. Each scope gets its own set of React contexts,
 * enabling composition without cross-talk (e.g., nested Popovers).
 *
 * Also supports dependency injection: a component scope can depend on a parent
 * scope (e.g., Popover depends on Popper scope for positioning).
 * -----------------------------------------------------------------------------------------------*/

type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined
type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope }
interface CreateScope {
  scopeName: string
  (): ScopeHook
}

function createContextScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  let defaultContexts: unknown[] = []

  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType,
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(defaultContext)
    const index = defaultContexts.length
    defaultContexts = [...defaultContexts, defaultContext]

    const Provider: React.FC<ContextValueType & { scope: Scope<ContextValueType>; children: React.ReactNode }> = (
      props,
    ) => {
      const { scope, children, ...context } = props
      const Context = scope?.[scopeName]?.[index] || BaseContext
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const value = React.useMemo(() => context, Object.values(context)) as ContextValueType
      return <Context.Provider value={value}>{children}</Context.Provider>
    }

    Provider.displayName = rootComponentName + 'Provider'

    function useContext(consumerName: string, scope: Scope<ContextValueType | undefined>) {
      const Context = scope?.[scopeName]?.[index] || BaseContext
      const context = React.useContext(Context)
      if (context) return context
      if (defaultContext !== undefined) return defaultContext
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)
    }

    return [Provider, useContext] as const
  }

  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React.createContext(defaultContext)
    })
    return function useScope(scope: Scope) {
      const contexts = scope?.[scopeName] || scopeContexts
      return React.useMemo(() => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }), [scope, contexts])
    }
  }

  createScope.scopeName = scopeName
  return [createContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const
}

/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 *
 * Merges multiple CreateScope functions into one. The resulting scope hook
 * combines all scope maps, enabling a component to depend on multiple parents.
 * -----------------------------------------------------------------------------------------------*/

function composeContextScopes(...scopes: [CreateScope, ...CreateScope[]]): CreateScope {
  const baseScope = scopes[0]
  if (scopes.length === 1) return baseScope

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }))

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const scopeProps = useScope(overrideScopes)
        const currentScope = scopeProps[`__scope${scopeName}`]
        return { ...nextScopes, ...currentScope }
      }, {})

      return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes])
    }
  }

  createScope.scopeName = baseScope.scopeName
  return createScope
}

export { createContext, createContextScope }
export type { CreateScope, Scope }
