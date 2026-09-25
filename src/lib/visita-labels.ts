import type { components } from "@/lib/api/generated/schema";

export type VisitaStatus = components["schemas"]["VisitaStatus"];

export const VISITA_STATUS_OPTIONS: { value: VisitaStatus; label: string }[] = [
  { value: "disponivel", label: "Disponível" },
  { value: "agendada", label: "Agendada" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

const FUSO_SALVADOR = "America/Bahia";

const diaFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO_SALVADOR,
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
});
const horaFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO_SALVADOR,
  hour: "2-digit",
  minute: "2-digit",
});
const dataHoraFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO_SALVADOR,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const diaChaveFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: FUSO_SALVADOR,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDiaSalvador(dataHora: string): string {
  return diaFormatter.format(new Date(dataHora));
}

export function formatHoraSalvador(dataHora: string): string {
  return horaFormatter.format(new Date(dataHora));
}

export function formatDataHoraSalvador(dataHora: string): string {
  return dataHoraFormatter.format(new Date(dataHora));
}

export function diaChaveSalvador(dataHora: string): string {
  return diaChaveFormatter.format(new Date(dataHora));
}

const partesSalvadorFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: FUSO_SALVADOR,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function relogioSalvadorComoUtc(instante: number): number {
  const partes: Record<string, number> = {};
  for (const parte of partesSalvadorFormatter.formatToParts(new Date(instante))) {
    if (parte.type !== "literal") partes[parte.type] = Number(parte.value);
  }
  return Date.UTC(
    partes.year,
    partes.month - 1,
    partes.day,
    partes.hour,
    partes.minute,
    partes.second,
  );
}

/**
 * Interpreta "YYYY-MM-DDTHH:mm[:ss]" como horário de Salvador (independente do
 * fuso do navegador) e devolve o instante em ISO 8601. `null` se o valor for
 * inválido ou não existir em Salvador.
 */
export function salvadorLocalParaIso(valor: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(valor);
  if (!m) return null;

  const [ano, mes, dia, hora, minuto, segundo] = [
    Number(m[1]),
    Number(m[2]),
    Number(m[3]),
    Number(m[4]),
    Number(m[5]),
    Number(m[6] ?? 0),
  ];
  const palpite = Date.UTC(ano, mes - 1, dia, hora, minuto, segundo);
  const normalizado = new Date(palpite);
  if (
    Number.isNaN(palpite) ||
    normalizado.getUTCFullYear() !== ano ||
    normalizado.getUTCMonth() !== mes - 1 ||
    normalizado.getUTCDate() !== dia ||
    normalizado.getUTCHours() !== hora ||
    normalizado.getUTCMinutes() !== minuto ||
    normalizado.getUTCSeconds() !== segundo
  ) {
    return null;
  }

  const primeiro = palpite - (relogioSalvadorComoUtc(palpite) - palpite);
  const instante = palpite - (relogioSalvadorComoUtc(primeiro) - primeiro);

  if (relogioSalvadorComoUtc(instante) !== palpite) return null;
  return new Date(instante).toISOString();
}

export function inicioDoDiaSalvador(data: string): string | null {
  return salvadorLocalParaIso(`${data}T00:00:00`);
}

export function fimDoDiaSalvador(data: string): string | null {
  return salvadorLocalParaIso(`${data}T23:59:59`);
}
