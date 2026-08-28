"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ListPropertyForm } from "@/app/anunciar/_components/ListPropertyForm";

export default function AnunciarPage() {
  const { status, login } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") login();
  }, [status, login]);

  if (status !== "authenticated") {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-text-secondary text-sm">Carregando…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-text-primary text-2xl font-semibold">
          Anunciar imóvel
        </h1>
        <p className="text-text-secondary text-sm">
          Preencha os dados do seu imóvel pra colocá-lo na plataforma.
        </p>
      </div>
      <ListPropertyForm />
    </div>
  );
}
