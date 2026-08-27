"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shell/Logo";
import { useAuth } from "@/lib/auth/AuthContext";

const navLinks = [
  { label: "Alugar", href: "/alugar" },
  { label: "Comprar", href: "/comprar" },
  { label: "Anunciar", href: "/anunciar" },
  { label: "Ajuda", href: "/ajuda" },
];

export function Header() {
  const { user, status, login, logout } = useAuth();

  return (
    <header className="border-border-default bg-background-default border-b">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <>
              <Link
                href="/favoritos"
                className="text-text-secondary hover:text-text-primary hidden text-sm font-medium transition-colors md:inline"
              >
                Favoritos
              </Link>
              <span className="text-text-secondary hidden text-sm font-medium md:inline">
                Olá, {user?.name ?? user?.email}
              </span>
              <Button size="sm" variant="outline" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={login}>
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
