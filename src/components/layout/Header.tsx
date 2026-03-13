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
    <header className="sticky top-0 z-50 border-b border-primary-200/60 bg-white/90 backdrop-blur dark:border-primary-800 dark:bg-primary-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-primary-800 dark:text-primary-100"
        >
          <span className="text-2xl" aria-hidden>🐾</span>
          PetID
        </Link>
        <nav className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-primary-500">Carregando...</span>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-primary-700 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
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
