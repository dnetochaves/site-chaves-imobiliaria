"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useToggleFavorito } from "@/lib/api/hooks/use-favoritos";
import { toPropertyDisplayData } from "@/components/property/mapImovel";
import { formatArea } from "@/lib/format";
import type { components } from "@/lib/api/generated/schema";

type FavoritoRead = components["schemas"]["FavoritoRead"];

export function FavoritoItem({ favorito }: { favorito: FavoritoRead }) {
  const { unidade, imovel_atual } = favorito;
  const display = imovel_atual ? toPropertyDisplayData(imovel_atual) : null;
  const { toggle, isPending } = useToggleFavorito(unidade);

  const content = (
    <div className="flex flex-1 items-center gap-4">
      <div className="bg-background-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src="/property-placeholder.svg"
          alt={display?.title ?? `${unidade.rua}, ${unidade.numero}`}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
          {unidade.bairro} · {unidade.cidade}
        </p>

        {display ? (
          <>
            <h3 className="text-text-primary text-sm font-semibold">
              {display.title}
            </h3>
            <p className="text-text-primary text-sm font-semibold">
              {display.priceLabel}
              {display.operationLabel === "Aluguel" && (
                <span className="text-text-secondary text-xs font-normal">
                  {" "}
                  /mês
                </span>
              )}
            </p>
          </>
        ) : (
          <>
            <h3 className="text-text-primary text-sm font-semibold">
              {unidade.rua}, {unidade.numero}
            </h3>
            <p className="text-text-secondary text-xs">
              Sem anúncio ativo no momento
            </p>
          </>
        )}

        <p className="text-text-secondary text-xs">
          {formatArea(unidade.area_util_m2)} · {unidade.quartos} qto
          {unidade.quartos === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="border-border-default bg-background-default flex items-center gap-2 rounded-xl border p-3">
      {display ? (
        <Link href={`/imoveis/${display.id}`} className="flex flex-1">
          {content}
        </Link>
      ) : (
        <div className="flex flex-1">{content}</div>
      )}

      <button
        type="button"
        onClick={() => toggle()}
        disabled={isPending}
        aria-label="Remover dos favoritos"
        className="border-border-default hover:bg-background-subtle flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50"
      >
        <Heart className="fill-current text-brand-secondary size-4" />
      </button>
    </div>
  );
}
