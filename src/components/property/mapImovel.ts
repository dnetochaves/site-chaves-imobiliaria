import { formatArea, formatPrice } from "@/lib/format";
import type { components } from "@/lib/api/generated/schema";

type ImovelSummary = components["schemas"]["ImovelSummary"];

export type PropertyDisplayData = {
  id: number;
  title: string;
  neighborhood: string;
  city: string;
  areaLabel: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  priceLabel: string;
  priceValue: number | null;
  operationLabel: "Aluguel" | "Venda";
  furnished: boolean;
  petsAllowed: boolean;
  latitude: number | null;
  longitude: number | null;
};

export function toPropertyDisplayData(imovel: ImovelSummary): PropertyDisplayData {
  const operationLabel = imovel.disponivel_aluguel ? "Aluguel" : "Venda";
  const rawPrice = imovel.disponivel_aluguel
    ? imovel.valor_aluguel
    : imovel.valor_venda;
  const priceValue = rawPrice ? Number(rawPrice) : null;

  const latitude = Number(imovel.unidade.latitude);
  const longitude = Number(imovel.unidade.longitude);

  return {
    id: imovel.id,
    title: imovel.titulo,
    neighborhood: imovel.unidade.bairro,
    city: imovel.unidade.cidade,
    areaLabel: formatArea(imovel.unidade.area_util_m2),
    bedrooms: imovel.unidade.quartos,
    bathrooms: imovel.unidade.banheiros,
    parkingSpots: imovel.unidade.vagas_garagem,
    priceLabel:
      priceValue !== null && !Number.isNaN(priceValue)
        ? formatPrice(priceValue)
        : "Sob consulta",
    priceValue: priceValue !== null && !Number.isNaN(priceValue) ? priceValue : null,
    operationLabel,
    furnished: imovel.mobiliado,
    petsAllowed: imovel.aceita_pets,
    latitude: Number.isNaN(latitude) ? null : latitude,
    longitude: Number.isNaN(longitude) ? null : longitude,
  };
}
