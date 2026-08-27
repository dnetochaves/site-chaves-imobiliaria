"use client";

import { useEffect, useRef } from "react";
import { Map as MaplibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * Provedor de tiles: OpenFreeMap (gratuito, sem chave de API). Ver
 * design.md do change add-search-page, decisão 8. Trocar aqui se o volume
 * de tráfego justificar migrar para outro provedor no futuro.
 */
const DEFAULT_MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export type MapMarker = {
  id: string | number;
  center: [number, number];
  /** Rótulo exibido no marcador (ex.: preço formatado, "3,4 mil"). Sem label, usa o marcador padrão do MapLibre. */
  label?: string;
  /** Estado visual de destaque (ex.: hover no item de lista correspondente). */
  highlighted?: boolean;
};

export type MapViewProps = {
  center: [number, number];
  zoom: number;
  markers?: MapMarker[];
  className?: string;
  mapStyle?: string;
  /** Ajusta automaticamente os limites do mapa para caber todos os marcadores. */
  fitToMarkers?: boolean;
};

function createMarkerElement(marker: MapMarker): HTMLElement {
  const el = document.createElement("div");
  el.className = [
    "flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-md whitespace-nowrap cursor-pointer transition-colors",
    marker.highlighted
      ? "bg-brand-primary text-white"
      : "bg-background-default text-text-primary",
  ].join(" ");
  el.textContent = marker.label ?? "";
  return el;
}

export function MapView({
  center,
  zoom,
  markers = [],
  className,
  mapStyle = DEFAULT_MAP_STYLE,
  fitToMarkers = false,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MaplibreMap({
      container: containerRef.current,
      style: mapStyle,
      center,
      zoom,
    });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapRef.current?.setCenter(center);
  }, [center]);

  useEffect(() => {
    mapRef.current?.setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = markers.map((marker) =>
      marker.label
        ? new Marker({ element: createMarkerElement(marker) })
            .setLngLat(marker.center)
            .addTo(map)
        : new Marker().setLngLat(marker.center).addTo(map),
    );

    if (fitToMarkers && markers.length > 0) {
      if (markers.length === 1) {
        map.setCenter(markers[0].center);
      } else {
        const lngs = markers.map((m) => m.center[0]);
        const lats = markers.map((m) => m.center[1]);
        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 48, maxZoom: 15, duration: 0 },
        );
      }
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [markers, fitToMarkers]);

  return (
    <div
      ref={containerRef}
      data-slot="map-view"
      className={className ?? "h-96 w-full rounded-lg"}
    />
  );
}
