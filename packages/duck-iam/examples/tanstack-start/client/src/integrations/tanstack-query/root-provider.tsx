import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let _queryClient: QueryClient | null = null

function getQueryClient(): QueryClient {
  if (!_queryClient) {
    _queryClient = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 1_000 * 30, refetchOnWindowFocus: false },
      },
    })
  }
  return _queryClient
}

export function getContext() {
  return { queryClient: getQueryClient() }
}

export default function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
}
