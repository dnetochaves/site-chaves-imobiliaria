"use client";

import { useVisitasDisponiveisEmBreve } from "@/lib/api/hooks/use-visitas-disponiveis-em-breve";
import { PropertyCard } from "@/components/property/PropertyCard";
import { toPropertyDisplayData } from "@/components/property/mapImovel";
import { formatProximaVisita } from "@/lib/format";

const MAX_ITEMS = 4;

export function SelecionadosParaHoje() {
  const { status, data, error } = useVisitasDisponiveisEmBreve();

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

  if (data.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        Nenhum imóvel com visita disponível no momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.slice(0, MAX_ITEMS).map(({ imovel, proxima_visita_em }) => (
        <PropertyCard
          key={imovel.id}
          {...toPropertyDisplayData(imovel)}
          nextVisitLabel={formatProximaVisita(proxima_visita_em)}
        />
      ))}
    </div>
  );
}
