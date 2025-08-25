"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
 children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
 const [isMobile, setIsMobile] = useState(false)

 useEffect(() => {
  const checkScreenSize = () => {
   setIsMobile(window.innerWidth < 768)
  }

  checkScreenSize()
  window.addEventListener("resize", checkScreenSize)
  return () => window.removeEventListener("resize", checkScreenSize)
 }, [])

 useEffect(() => {
  const handleSidebarToggle = (event: CustomEvent) => {
   setSidebarCollapsed(event.detail.isCollapsed)
  }

  window.addEventListener("sidebar-toggle", handleSidebarToggle as EventListener)
  return () => window.removeEventListener("sidebar-toggle", handleSidebarToggle as EventListener)
 }, [])

 return (
  <div className="flex min-h-screen bg-background">
   <Sidebar />
   <main
    className={cn(
     "flex-1 overflow-hidden transition-all duration-300 ease-in-out",
     isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64",
    )}
   >
    <div className="h-full">{children}</div>
   </main>
  </div>
 )
}
