import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Car, Ruler, Heart } from "lucide-react";
import { MapView } from "@/components/map/MapView";

export type PropertyCardProps = {
  id: number;
  title: string;
  neighborhood: string;
  city: string;
  areaLabel: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  priceLabel: string;
  operationLabel: "Aluguel" | "Venda";
  furnished?: boolean;
  petsAllowed?: boolean;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  nextVisitLabel?: string;
};

export function PropertyCard({
  id,
  title,
  neighborhood,
  city,
  areaLabel,
  bedrooms,
  bathrooms,
  parkingSpots,
  priceLabel,
  operationLabel,
  furnished = false,
  petsAllowed = false,
  imageUrl,
  latitude,
  longitude,
  nextVisitLabel,
}: PropertyCardProps) {
  const hasCoordinates =
    !imageUrl && typeof latitude === "number" && typeof longitude === "number";
  return (
    <Link
      href={`/imoveis/${id}`}
      data-slot="property-card"
      className="border-border-default bg-background-default flex flex-col overflow-hidden rounded-xl border shadow-sm"
    >
      <div className="bg-background-muted relative aspect-[4/3]">
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
        <span className="bg-background-inverse absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium text-white">
          {operationLabel}
        </span>
        {/* Decorativo — sem estado nem interação, ainda não existe endpoint
            de favoritos na API (ver design.md, decisão 2). */}
        <span
          aria-hidden="true"
          className="text-text-primary absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/90"
        >
          <Heart className="size-4" />
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <p className="text-text-secondary text-sm">
          {neighborhood} · {city}
        </p>
        <h3 className="text-text-primary text-lg font-semibold">{title}</h3>

        {nextVisitLabel && (
          <span className="bg-brand-secondary-subtle text-brand-secondary w-fit rounded-full px-2.5 py-0.5 text-xs font-medium">
            {nextVisitLabel}
          </span>
        )}

        <div className="text-text-secondary flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Ruler className="size-4" aria-hidden="true" />
            {areaLabel}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="size-4" aria-hidden="true" />
            {bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-4" aria-hidden="true" />
            {bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Car className="size-4" aria-hidden="true" />
            {parkingSpots}
          </span>
        </div>

        {(furnished || petsAllowed) && (
          <div className="flex flex-wrap gap-2">
            {furnished && (
              <span className="bg-background-muted text-text-secondary rounded-full px-2.5 py-0.5 text-xs">
                Mobiliado
              </span>
            )}
            {petsAllowed && (
              <span className="bg-background-muted text-text-secondary rounded-full px-2.5 py-0.5 text-xs">
                Aceita pets
              </span>
            )}
          </div>
        )}

        <p className="text-text-primary text-lg font-semibold">
          {priceLabel}
          {operationLabel === "Aluguel" && (
            <span className="text-text-secondary text-sm font-normal">
              /mês
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
