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

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

const dayMonthFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

/**
 * Formata um horário de visita relativo a agora, ex.: "Visita hoje às 18:00",
 * "Visita amanhã às 09:00". Fora dessa janela (não deveria ocorrer pro
 * endpoint que alimenta isso, escopado às próximas 48h), cai num formato
 * com data.
 */
export function formatProximaVisita(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const time = timeFormatter.format(date);

  if (date.toDateString() === now.toDateString()) {
    return `Visita hoje às ${time}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Visita amanhã às ${time}`;
  }

  return `Visita em ${dayMonthFormatter.format(date)} às ${time}`;
}
