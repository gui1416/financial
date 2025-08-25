"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { useState, useEffect, createContext, useContext } from "react"
import { cn } from "@/lib/utils"

// 1. Adicionamos 'isMobile' ao tipo do nosso contexto
interface SidebarContextType {
 isCollapsed: boolean;
 setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
 isMobileMenuOpen: boolean;
 setIsMobileMenuOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
 isMobile: boolean; // Adicionado
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
 const context = useContext(SidebarContext);
 if (!context) {
  throw new Error("useSidebar must be used within a SidebarProvider");
 }
 return context;
}

interface DashboardShellProps {
 children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
 const [isCollapsed, setIsCollapsed] = useState(false);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [isMobile, setIsMobile] = useState(false);

 useEffect(() => {
  const checkScreenSize = () => {
   const mobile = window.innerWidth < 768;
   setIsMobile(mobile);
   if (!mobile) {
    setIsMobileMenuOpen(false);
   }
  }

  checkScreenSize()
  window.addEventListener("resize", checkScreenSize)
  return () => window.removeEventListener("resize", checkScreenSize)
 }, [])

 return (
  // 2. Passamos 'isMobile' para todos os componentes através do Provider
  <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, isMobile }}>
   <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main
     className={cn(
      "flex-1 overflow-hidden transition-all duration-300 ease-in-out",
      isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64",
     )}
    >
     <div className="h-full">{children}</div>
    </main>
   </div>
  </SidebarContext.Provider>
 )
}