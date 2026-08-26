"use client";

import { useEffect, useRef } from "react";
import { Map as MaplibreMap, Marker } from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * Wrapper base do MapLibre GL. Sem provedor de tiles/estilo definido ainda
 * — usa um estilo vazio (sem sources/layers) só para o mapa renderizar.
 * A escolha do provedor de tiles fica para o change que implementar a
 * tela de Busca (ver design.md - Non-Goals e src/components/map/README.md).
 */
const EMPTY_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [],
};

export type MapMarker = {
  id: string | number;
  center: [number, number];
};

export type MapViewProps = {
  center: [number, number];
  zoom: number;
  markers?: MapMarker[];
  className?: string;
};

export function MapView({ center, zoom, markers = [], className }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MaplibreMap({
      container: containerRef.current,
      style: EMPTY_STYLE,
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
      new Marker().setLngLat(marker.center).addTo(map),
    );

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [markers]);

  return (
    <div
      ref={containerRef}
      data-slot="map-view"
      className={className ?? "h-96 w-full rounded-lg"}
    />
  );
}
