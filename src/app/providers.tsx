'use client'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/queryClient'
import {  QueryClientProvider } from '@tanstack/react-query'
import {  ReactNode } from 'react'


export function Providers({ children }: { children: ReactNode }) {
  //const [queryClient] = useState(() => new QueryClient({
  //  defaultOptions: {
  //    queries: {
  //      staleTime: 1000 * 60 * 5, // 5 minutes
  //      retry: 1,
  //    },
  //  },
  //}))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}