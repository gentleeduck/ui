'use client'

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpBatchStreamLink,
  wsLink,
} from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
// import SuperJSON from 'superjson'
import ws from 'ws'

import { type AppRouter } from '../../upload-api/src/main'
import { createQueryClient } from './query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

// Create a WebSocket client
const wsClient = createWSClient({
  url: 'ws://localhost:4051',
  connectionParams: async () => {
    return {
      token: 'supersecret',
    }
  },
})

export const trpc = createTRPCClient<AppRouter>({
  links: [
    // Use `splitLink` to route subscription operations to `wsLink` and others to `httpBatchLink`
    splitLink({
      condition: op => op.type === 'subscription',
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: `http://localhost:4050/trpc`,
        async headers() {
          return {
            // authorization: getAuthCookie(),
          }
        },
      }),
    }),
    loggerLink({
      enabled: op => process.env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
    }),
    // unstable_httpBatchStreamLink({
    //   // transformer: SuperJSON,
    //   url: `http://localhost:4050/trpc`,
    //   headers: () => {
    //     const headers = new Headers()
    //     headers.set('x-trpc-source', 'nextjs-react')
    //     return headers
    //   },
    // }),
  ],
})

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 4050}`
}
