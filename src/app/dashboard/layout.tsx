"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"

interface SidebarContextType {
 isCollapsed: boolean;
 setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
 isMobileMenuOpen: boolean;
 setIsMobileMenuOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
 isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
 const context = useContext(SidebarContext);
 if (!context) {
  throw new Error("useSidebar must be used within a SidebarProvider");
 }
 return context;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
  <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, isMobile }}>
   <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main
     className={cn(
      "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
      isCollapsed ? "md:ml-16" : "md:ml-64"
     )}
    >
     <div className="p-4 md:p-8">{children}</div>
    </main>
   </div>
  </SidebarContext.Provider>
 )
}