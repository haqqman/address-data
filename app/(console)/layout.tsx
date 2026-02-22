import type { ReactNode } from 'react'
import { ConsoleProvider } from '@/app/(console)/provider'

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return <ConsoleProvider>{children}</ConsoleProvider>
}
