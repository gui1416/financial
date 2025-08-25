"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuGroup,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Settings, LogOut, ChevronsUpDown, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface NavUserProps {
 isCollapsed?: boolean
}

interface User {
 id: string;
 email?: string;
}

interface Profile {
 full_name?: string;
 avatar_url?: string;
}


export function NavUser({ isCollapsed = false }: NavUserProps) {
 const router = useRouter()
 const { theme, setTheme } = useTheme()
 const [user, setUser] = useState<User | null>(null)
 const [profile, setProfile] = useState<Profile | null>(null)

 useEffect(() => {
  const getUser = async () => {
   const supabase = createClient()
   const {
    data: { user },
   } = await supabase.auth.getUser()

   if (user) {
    setUser(user)

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    setProfile(profile)
   }
  }

  getUser()
 }, [])

 const handleSignOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  router.push("/auth/login")
 }

 if (!user) return null

 const displayName = profile?.full_name || user.email?.split("@")[0] || "Usuário"
 const userEmail = user.email || ""

 if (isCollapsed) {
  return (
   <DropdownMenu>
    <DropdownMenuTrigger asChild>
     <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
      <Avatar className="h-8 w-8">
       <AvatarImage src={profile?.avatar_url || "https://github.com/gui1416.png"} alt={displayName} />
       <AvatarFallback className="bg-primary text-primary-foreground">
        {displayName.charAt(0).toUpperCase()}
       </AvatarFallback>
      </Avatar>
     </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="start" side="top" forceMount>
     <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-1">
       <p className="text-sm font-medium leading-none">{displayName}</p>
       <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
      </div>
     </DropdownMenuLabel>
     <DropdownMenuSeparator />
     <DropdownMenuGroup>
      <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
       <Settings className="mr-2 h-4 w-4" />
       <span>Configurações</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
       {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
       <span>{theme === 'light' ? 'Tema Escuro' : 'Tema Claro'}</span>
      </DropdownMenuItem>
     </DropdownMenuGroup>
     <DropdownMenuSeparator />
     <DropdownMenuItem onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sair da conta</span>
     </DropdownMenuItem>
    </DropdownMenuContent>
   </DropdownMenu>
  )
 }

 return (
  <div className="w-full overflow-hidden">
   <DropdownMenu>
    <DropdownMenuTrigger asChild>
     <Button
      variant="ghost"
      className="relative h-12 w-full justify-start rounded-lg px-3 text-left font-normal hover:bg-accent overflow-hidden"
     >
      <div className="flex items-center gap-3 min-w-0 flex-1">
       <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={profile?.avatar_url || "https://github.com/gui1416.png"} alt={displayName} />
        <AvatarFallback className="bg-primary text-primary-foreground">
         {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
       </Avatar>
       <div className="flex flex-col space-y-1 text-left min-w-0 flex-1">
        <p className="text-sm font-medium leading-none truncate">{displayName}</p>
        <p className="text-xs leading-none text-muted-foreground truncate">{userEmail}</p>
       </div>
      </div>
      <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
     </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="start" side="top" forceMount>
     <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-1">
       <p className="text-sm font-medium leading-none">{displayName}</p>
       <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
      </div>
     </DropdownMenuLabel>
     <DropdownMenuSeparator />
     <DropdownMenuGroup>
      <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
       <Settings className="mr-2 h-4 w-4" />
       <span>Configurações</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
       {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
       <span>{theme === 'light' ? 'Tema Escuro' : 'Tema Claro'}</span>
      </DropdownMenuItem>
     </DropdownMenuGroup>
     <DropdownMenuSeparator />
     <DropdownMenuItem onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sair da conta</span>
     </DropdownMenuItem>
    </DropdownMenuContent>
   </DropdownMenu>
  </div>
 )
}