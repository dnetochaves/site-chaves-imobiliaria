"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status, login } = useAuth();

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
      {children}
    </div>
  );
}
