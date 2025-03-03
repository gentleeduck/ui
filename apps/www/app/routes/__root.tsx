import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Spinner } from './-components/spinner'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { AppRouter } from '../../trpc-server.handler'
import type { QueryClient } from '@tanstack/react-query'

import { Button } from '@duck/registry-ui-duckui/button'

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
})

import {cn} from '@duck/libs/cn'
function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })

  return (
    <div className={cn()}>
      <Button>button</Button>
    </div>
  )
}
