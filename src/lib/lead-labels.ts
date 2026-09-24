import type { components } from "@/lib/api/generated/schema";

export type LeadStatus = components["schemas"]["LeadStatus"];
export type LeadTipo = components["schemas"]["LeadTipo"];

export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_atendimento", label: "Em atendimento" },
  { value: "concluido", label: "Concluído" },
  { value: "perdido", label: "Perdido" },
];

export const LEAD_TIPO_OPTIONS: { value: LeadTipo; label: string }[] = [
  { value: "simulacao_financiamento", label: "Simulação de financiamento" },
  { value: "contato_imovel", label: "Contato sobre imóvel" },
  { value: "proposta_condominio", label: "Proposta de condomínio" },
  { value: "anunciar_imovel", label: "Anunciar imóvel" },
  { value: "outro", label: "Outro" },
];
