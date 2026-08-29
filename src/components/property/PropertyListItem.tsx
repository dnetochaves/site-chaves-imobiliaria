import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { PropertyDisplayData } from "@/components/property/mapImovel";
import { MapView } from "@/components/map/MapView";

export type PropertyListItemProps = PropertyDisplayData & {
  imageUrl?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function PropertyListItem({
  id,
  title,
  neighborhood,
  areaLabel,
  bedrooms,
  parkingSpots,
  priceLabel,
  operationLabel,
  furnished,
  petsAllowed,
  imageUrl,
  latitude,
  longitude,
  onMouseEnter,
  onMouseLeave,
}: PropertyListItemProps) {
  const hasCoordinates =
    !imageUrl && typeof latitude === "number" && typeof longitude === "number";

  return (
    <Link
      href={`/imoveis/${id}`}
      data-slot="property-list-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="border-border-default bg-background-default flex gap-4 rounded-xl border p-3"
    >
      <div className="bg-background-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
        {hasCoordinates ? (
          <MapView
            center={[longitude, latitude]}
            zoom={15}
            markers={[{ id, center: [longitude, latitude] }]}
            interactive={false}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <Image
            src={imageUrl ?? "/property-placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
            {neighborhood}
          </p>
          <Heart
            aria-hidden="true"
            className="text-text-primary size-4 shrink-0"
          />
        </div>

        <h3 className="text-text-primary text-sm font-semibold">{title}</h3>

        <div className="flex flex-wrap gap-1.5">
          <span className="bg-background-muted text-text-secondary rounded-full px-2 py-0.5 text-xs">
            {areaLabel}
          </span>
          <span className="bg-background-muted text-text-secondary rounded-full px-2 py-0.5 text-xs">
            {bedrooms} qto{bedrooms === 1 ? "" : "s"}
          </span>
          {parkingSpots > 0 && (
            <span className="bg-background-muted text-text-secondary rounded-full px-2 py-0.5 text-xs">
              {parkingSpots} vaga{parkingSpots === 1 ? "" : "s"}
            </span>
          )}
          {furnished && (
            <span className="bg-brand-primary-subtle text-brand-primary rounded-full px-2 py-0.5 text-xs">
              mobiliado
            </span>
          )}
          {petsAllowed && (
            <span className="bg-brand-primary-subtle text-brand-primary rounded-full px-2 py-0.5 text-xs">
              aceita pets
            </span>
          )}
        </div>

        <p className="text-text-primary text-sm font-semibold">
          {priceLabel}
          <span className="text-text-secondary text-xs font-normal">
            {" "}
            {operationLabel === "Aluguel" ? "/mês, total" : ""}
          </span>
        </p>
      </div>
    </Link>
  );
}
