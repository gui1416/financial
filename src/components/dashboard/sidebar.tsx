"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  CreditCard,
  Tags,
  BarChart3,
  Settings,
  Wallet,
  Target,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { NavUser } from "@/components/nav-user"

const mainNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transações",
    href: "/dashboard/transactions",
    icon: CreditCard,
    badge: "Novo",
  },
  {
    name: "Categorias",
    href: "/dashboard/categories",
    icon: Tags,
  },
]

const analyticsNavigation = [
  {
    name: "Metas",
    href: "/dashboard/goals",
    icon: Target,
  },
  {
    name: "Relatórios",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
]

const supportNavigation = [
  {
    name: "Ajuda",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
  {
    name: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    const event = new CustomEvent("sidebar-toggle", {
      detail: { isCollapsed },
    })
    window.dispatchEvent(event)
  }, [isCollapsed])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        isCollapsed ? "justify-center" : "justify-between",
      )}
      onClick={() => isMobile && setIsMobileMenuOpen(false)}
    >
      <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
        <item.icon
          className={cn(
            "h-4 w-4 transition-colors",
            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground",
          )}
        />
        {!isCollapsed && <span>{item.name}</span>}
      </div>
      {!isCollapsed && (
        <div className="flex items-center gap-2">
          {item.badge && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
          {isActive && <ChevronRight className="h-3 w-3 text-primary-foreground" />}
        </div>
      )}
    </Link>
  )

  const SectionHeader = ({ title }: { title: string }) => {
    if (isCollapsed) return <Separator className="my-2" />
    return (
      <div className="px-3 py-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h4>
      </div>
    )
  }

  const MobileToggle = () => (
    <Button
      variant="ghost"
      size="sm"
      className="md:hidden fixed top-4 left-4 z-50 h-9 w-9 p-0"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </Button>
  )

  const DesktopToggle = () => (
    <Button
      variant="ghost"
      size="sm"
      className="hidden md:flex absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background p-0 shadow-md z-10"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <ChevronRight className={cn("h-3 w-3 transition-transform", isCollapsed ? "rotate-0" : "rotate-180")} />
    </Button>
  )

  const sidebarContent = (
    <>
      <div className={cn("flex h-16 items-center border-b", isCollapsed ? "px-3 justify-center" : "px-6")}>
        {isCollapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">FinanceApp</span>
              <span className="text-xs text-muted-foreground">Gestão Financeira</span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-3 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          <SectionHeader title="Principal" />
          {mainNavigation.map((item) => (
            <NavItem key={item.name} item={item} isActive={pathname === item.href} />
          ))}
        </div>

        <SectionHeader title="Análises" />
        <div className="space-y-0.5">
          {analyticsNavigation.map((item) => (
            <NavItem key={item.name} item={item} isActive={pathname === item.href} />
          ))}
        </div>

        <SectionHeader title="Suporte" />
        <div className="space-y-0.5">
          {supportNavigation.map((item) => (
            <NavItem key={item.name} item={item} isActive={pathname === item.href} />
          ))}
        </div>
      </nav>

      <div className="border-t p-3">
        <NavUser isCollapsed={isCollapsed} />
      </div>
    </>
  )

  return (
    <>
      <MobileToggle />
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out",
          "hidden md:flex",
          isCollapsed ? "w-16" : "w-64",
          isMobile && isMobileMenuOpen && "flex w-64 z-50",
          className,
        )}
      >
        <DesktopToggle />
        {sidebarContent}
      </div>
    </>
  )
}
