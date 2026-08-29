const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const areaFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

export function formatPrice(value: string | number): string {
  const numeric = typeof value === "string" ? Number(value) : value;
  return priceFormatter.format(numeric);
}

export function formatArea(value: string | number): string {
  const numeric = typeof value === "string" ? Number(value) : value;
  return `${areaFormatter.format(numeric)} m²`;
}

/**
 * Formato curto para marcadores de mapa, ex.: formatPriceShort("3400") → "3,4 mil".
 */
export function formatPriceShort(value: string | number): string {
  const numeric = typeof value === "string" ? Number(value) : value;

  if (numeric >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(1).replace(".", ",")} mi`;
  }
  if (numeric >= 1_000) {
    return `${(numeric / 1_000).toFixed(1).replace(".", ",")} mil`;
  }
  return Math.round(numeric).toString();
}
