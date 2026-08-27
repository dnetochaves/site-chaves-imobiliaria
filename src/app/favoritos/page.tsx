"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useFavoritos } from "@/lib/api/hooks/use-favoritos";
import { FavoritoItem } from "@/app/favoritos/_components/FavoritoItem";

export default function FavoritosPage() {
  const { status, login } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") login();
  }, [status, login]);

  if (status !== "authenticated") {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-text-secondary text-sm">Carregando…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-8">
      <h1 className="text-text-primary text-2xl font-semibold">Favoritos</h1>
      <FavoritosList />
    </div>
  );
}

function FavoritosList() {
  const { status, data, error } = useFavoritos();

  if (status === "pending") {
    return (
      <div role="status" className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-background-muted h-[104px] animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-feedback-error text-sm">
        Não foi possível carregar seus favoritos agora. Tente novamente em
        instantes. ({String(error)})
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        Você ainda não favoritou nenhum imóvel.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((favorito) => (
        <FavoritoItem key={favorito.id} favorito={favorito} />
      ))}
    </div>
  );
}
