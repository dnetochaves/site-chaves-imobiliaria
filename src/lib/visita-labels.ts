import type { components } from "@/lib/api/generated/schema";

export type VisitaStatus = components["schemas"]["VisitaStatus"];

export const VISITA_STATUS_OPTIONS: { value: VisitaStatus; label: string }[] = [
  { value: "disponivel", label: "Disponível" },
  { value: "agendada", label: "Agendada" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export function formatVisitaDataHora(dataHora: string): string {
  return new Date(dataHora).toLocaleString("pt-BR");
}

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
