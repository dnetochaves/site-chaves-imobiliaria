"use client";

import { useSearchParams } from "next/navigation";
import { useImoveis } from "@/lib/api/hooks/use-imoveis";
import { toPropertyDisplayData } from "@/components/property/mapImovel";
import { MapView, type MapMarker } from "@/components/map/MapView";
import { formatPriceShort } from "@/lib/format";
import { parseFilters, filtersToApiParams } from "@/app/busca/filters";

const SAO_PAULO_CENTER: [number, number] = [-46.6333, -23.5505];

export type SearchResultsMapProps = {
  hoveredId: number | null;
};

export function SearchResultsMap({ hoveredId }: SearchResultsMapProps) {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);
  const { status, data } = useImoveis(filtersToApiParams(filters));

  const markers: MapMarker[] =
    status === "success"
      ? data.items
          .map(toPropertyDisplayData)
          .filter((item) => item.latitude !== null && item.longitude !== null)
          .map((item) => ({
            id: item.id,
            center: [item.longitude as number, item.latitude as number],
            label: item.priceValue ? formatPriceShort(item.priceValue) : undefined,
            highlighted: item.id === hoveredId,
          }))
      : [];

  return (
    <MapView
      center={SAO_PAULO_CENTER}
      zoom={12}
      markers={markers}
      fitToMarkers={markers.length > 0}
      className="bg-background-muted h-[520px] w-full rounded-xl"
    />
  );
}
