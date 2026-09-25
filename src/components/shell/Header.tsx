"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shell/Logo";
import { useAuth } from "@/lib/auth/AuthContext";

const navLinks = [
  { label: "Alugar", href: "/alugar" },
  { label: "Comprar", href: "/comprar" },
  { label: "Anunciar", href: "/anunciar" },
  { label: "Ajuda", href: "/ajuda" },
];

const MENU_ID = "menu-mobile";

export function Header() {
  const { user, status, login, logout } = useAuth();
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname;

  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPath(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const accountLinks = [
    ...(status === "authenticated"
      ? [
          { label: "Favoritos", href: "/favoritos" },
          { label: "Minhas visitas", href: "/minhas-visitas" },
        ]
      : []),
    ...(status === "authenticated" && user?.is_staff
      ? [{ label: "Admin", href: "/admin" }]
      : []),
  ];
  const menuLinks = [...navLinks, ...accountLinks];

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
                className="text-text-secondary hover:text-text-primary text-sm font-medium whitespace-nowrap transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <>
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary hidden text-sm font-medium whitespace-nowrap transition-colors md:inline"
                >
                  {link.label}
                </Link>
              ))}
              <span className="text-text-secondary hidden text-sm font-medium whitespace-nowrap lg:inline">
                Olá, {user?.name ?? user?.email}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={logout}
                className="h-11 md:h-7"
              >
                Sair
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={login} className="h-11 md:h-7">
              Entrar
            </Button>
          )}

          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => setOpenPath(menuOpen ? null : pathname)}
            className="size-11 md:hidden"
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id={MENU_ID}
          aria-label="Menu principal"
          className="border-border-default bg-background-default border-t md:hidden"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-2">
            {status === "authenticated" && (
              <p className="text-text-secondary py-2 text-sm font-medium">
                Olá, {user?.name ?? user?.email}
              </p>
            )}
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenPath(null)}
                className="text-text-primary hover:bg-background-muted flex min-h-11 items-center rounded-md px-2 text-base font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
