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
