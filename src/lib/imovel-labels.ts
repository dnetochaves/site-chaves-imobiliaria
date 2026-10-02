import type { components } from "@/lib/api/generated/schema";

export type ImovelStatus = components["schemas"]["ImovelStatus"];
export type ListingAction = components["schemas"]["ListingAction"];

export const IMOVEL_STATUS_OPTIONS: { value: ImovelStatus; label: string }[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "em_analise", label: "Em análise" },
  { value: "publicado", label: "Publicado" },
  { value: "pausado", label: "Pausado" },
  { value: "alugado", label: "Alugado" },
  { value: "vendido", label: "Vendido" },
  { value: "removido", label: "Removido" },
];

export function formatImovelStatus(status: ImovelStatus): string {
  return (
    IMOVEL_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

/** Ações que o painel sabe executar; qualquer outro valor de `acoes_permitidas` é ignorado. */
export const ACAO_LABELS: Record<ListingAction, string> = {
  aprovar: "Aprovar",
  pausar: "Pausar",
  rejeitar: "Rejeitar",
  republicar: "Republicar",
};

export const ACOES_ORDEM: ListingAction[] = [
  "aprovar",
  "republicar",
  "pausar",
  "rejeitar",
];

export function isAcaoConhecida(valor: string): valor is ListingAction {
  return valor in ACAO_LABELS;
}
