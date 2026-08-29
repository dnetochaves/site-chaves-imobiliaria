"use client";

import { useImoveis } from "@/lib/api/hooks/use-imoveis";
import { PropertyCard } from "@/components/property/PropertyCard";
import { toPropertyDisplayData } from "@/components/property/mapImovel";

const MAX_ITEMS = 4;

export function SelecionadosParaHoje() {
  const { status, data, error } = useImoveis({
    verificado: true,
    limit: MAX_ITEMS,
  });

  if (status === "pending") {
    return (
      <div
        role="status"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: MAX_ITEMS }).map((_, i) => (
          <div
            key={i}
            className="bg-background-muted aspect-[4/3] animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-feedback-error text-sm">
        Não foi possível carregar os imóveis agora. Tente novamente em
        instantes. ({String(error)})
      </p>
    );
  }

  if (data.items.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        Nenhum imóvel disponível no momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.items.map((imovel) => (
        <PropertyCard key={imovel.id} {...toPropertyDisplayData(imovel)} />
      ))}
    </div>
  );
}
