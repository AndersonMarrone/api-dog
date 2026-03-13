"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const isPublicPet = pathname.startsWith("/pet/");

  if (isPublicPet) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-base">🐾</span>
          PetID
        </Link>
        <nav className="flex items-center gap-2">
          {loading ? (
            <span className="text-sm text-slate-400">Carregando...</span>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Meus Pets
              </Link>
              <Button variant="ghost" type="button" onClick={() => signOut()}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Cadastrar</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
