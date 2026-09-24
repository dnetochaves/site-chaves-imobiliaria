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
