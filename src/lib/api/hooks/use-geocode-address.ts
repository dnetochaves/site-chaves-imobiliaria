import { useMutation } from "@tanstack/react-query";

export type GeocodeResult = {
  latitude: string;
  longitude: string;
  displayName: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

/**
 * Geocodifica um endereço via Nominatim (OpenStreetMap) — gratuito, sem
 * chave de API. Ver design.md do change add-list-property, decisão 1: só
 * deve ser chamado por uma ação explícita do usuário (nunca a cada tecla
 * digitada), respeitando a política de uso do serviço.
 */
export function useGeocodeAddress() {
  return useMutation({
    mutationFn: async (address: string): Promise<GeocodeResult | null> => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Falha ao buscar o endereço");
      const results: NominatimResult[] = await res.json();
      if (results.length === 0) return null;
      const [result] = results;
      return {
        latitude: result.lat,
        longitude: result.lon,
        displayName: result.display_name,
      };
    },
  });
}
