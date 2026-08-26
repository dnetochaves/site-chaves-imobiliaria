"use client";

import { useImoveis } from "@/lib/api/hooks/use-imoveis";
import { formatArea, formatPrice } from "@/lib/format";
import { PropertyCard, type PropertyCardProps } from "@/components/property/PropertyCard";
import type { components } from "@/lib/api/generated/schema";

type ImovelSummary = components["schemas"]["ImovelSummary"];

function toPropertyCardProps(imovel: ImovelSummary): PropertyCardProps {
  const operationLabel = imovel.disponivel_aluguel ? "Aluguel" : "Venda";
  const priceValue = imovel.disponivel_aluguel
    ? imovel.valor_aluguel
    : imovel.valor_venda;

  return {
    title: imovel.titulo,
    neighborhood: imovel.unidade.bairro,
    city: imovel.unidade.cidade,
    areaLabel: formatArea(imovel.unidade.area_util_m2),
    bedrooms: imovel.unidade.quartos,
    bathrooms: imovel.unidade.banheiros,
    parkingSpots: imovel.unidade.vagas_garagem,
    priceLabel: priceValue ? formatPrice(priceValue) : "Sob consulta",
    operationLabel,
    furnished: imovel.mobiliado,
    petsAllowed: imovel.aceita_pets,
  };
}

export type PropertyListingProps = {
  limit?: number;
  bairro?: string;
};

export function PropertyListing({ limit = 4, bairro }: PropertyListingProps) {
  const { status, data, error } = useImoveis({ limit, bairro });

  if (status === "pending") {
    return (
      <div
        role="status"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: limit }).map((_, i) => (
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
        Nenhum imóvel encontrado no momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.items.map((imovel) => (
        <PropertyCard key={imovel.id} {...toPropertyCardProps(imovel)} />
      ))}
    </div>
  );
}
