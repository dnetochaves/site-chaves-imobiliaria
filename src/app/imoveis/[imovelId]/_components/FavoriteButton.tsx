"use client";

import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToggleFavorito } from "@/lib/api/hooks/use-favoritos";
import type { components } from "@/lib/api/generated/schema";

type UnidadeRead = components["schemas"]["UnidadeRead"];

export function FavoriteButton({ unidade }: { unidade: UnidadeRead }) {
  const { status, login } = useAuth();
  const { isFavorito, toggle, isPending } = useToggleFavorito(unidade);

  function handleClick() {
    if (status !== "authenticated") {
      login();
      return;
    }
    toggle();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isFavorito}
      aria-label={isFavorito ? "Remover dos favoritos" : "Favoritar"}
      className="border-border-default hover:bg-background-subtle flex size-9 items-center justify-center rounded-full border transition-colors disabled:opacity-50"
    >
      <Heart
        className={
          isFavorito
            ? "fill-current text-brand-secondary size-4"
            : "text-text-primary size-4"
        }
      />
    </button>
  );
}
