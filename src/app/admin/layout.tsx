"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { label: "Imóveis", href: "/admin", exact: ["/admin"], under: ["/admin/imoveis"] },
  { label: "Leads", href: "/admin/leads", exact: [], under: ["/admin/leads"] },
  { label: "Visitas", href: "/admin/visitas", exact: [], under: ["/admin/visitas"] },
];

function isSectionActive(
  pathname: string,
  section: (typeof SECTIONS)[number],
): boolean {
  return (
    section.exact.includes(pathname) ||
    section.under.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status, login } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") login();
  }, [status, login]);

  if (status === "authenticated" && !user?.is_staff) notFound();

  if (status !== "authenticated") {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-text-secondary text-sm">Carregando…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
          Equipe Chaves
        </p>
        <h1 className="text-text-primary text-2xl font-semibold">
          Painel administrativo
        </h1>
      </div>
      <nav aria-label="Seções do painel" className="border-border-default flex gap-4 border-b">
        {SECTIONS.map((section) => {
          const { label, href } = section;
          const active = isSectionActive(pathname, section);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px border-b-2 px-1 pb-2 text-sm font-medium transition-colors",
                active
                  ? "border-brand-primary text-text-primary"
                  : "text-text-secondary hover:text-text-primary border-transparent",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
