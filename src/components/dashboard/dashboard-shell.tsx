import type React from "react"
import { Sidebar } from "./sidebar"

interface DashboardShellProps {
 children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
 return (
  <div className="flex min-h-screen bg-background">
   <Sidebar />
   <main className="flex-1 overflow-hidden">{children}</main>
  </div>
 )
}
