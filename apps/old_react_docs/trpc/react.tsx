'use client'

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'

import { type AppRouter } from '../../upload-api/src/main'
import { createQueryClient } from './query-client'
import SuperJSON from 'superjson'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      /**
       * If you want to use SSR, you need to use the server's full URL
       * @see https://trpc.io/docs/v11/ssr
       **/
      url: `http://localhost:4050/trpc`,
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          // authorization: getAuthCookie(),
        }
      },
    }),
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
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

  // const data = useQuery({ queryKey: ['todos'], queryFn: async () => {} })

  // const datad: UseQueryResult<
  //   {
  //     data: string
  //   },
  //   Error
  // >
  // console.log('data', datad.data.)

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 4050}`
}
