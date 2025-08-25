import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
 const cookieStore = await cookies();

 // 1. Criar um cliente Supabase para obter o usuário da sessão atual
 const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
   cookies: {
    getAll() {
     return cookieStore.getAll();
    },
   },
  }
 );

 const {
  data: { session },
 } = await supabase.auth.getSession();

 const user = session?.user;

 if (!user) {
  return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
   status: 401,
   headers: { "Content-Type": "application/json" },
  });
 }

 // 2. Criar um cliente Supabase com privilégios de administrador usando a chave secreta
 //    Esta chave NUNCA deve ser exposta no lado do cliente.
 const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
   auth: {
    autoRefreshToken: false,
    persistSession: false,
   },
  }
 );

 // 3. Executar a exclusão como administrador
 const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

 if (error) {
  console.error("Error deleting user:", error);
  return new NextResponse(JSON.stringify({ error: "Failed to delete user" }), {
   status: 500,
   headers: { "Content-Type": "application/json" },
  });
 }

 // A exclusão de dados em 'transactions' e 'categories' pode ser feita
 // automaticamente se você configurar "ON DELETE CASCADE" nas chaves estrangeiras
 // da sua tabela no Supabase. É a maneira mais robusta. Se não, você precisaria
 // deletá-los aqui antes de deletar o usuário.

 return new NextResponse(JSON.stringify({ message: "User deleted successfully" }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
 });
}